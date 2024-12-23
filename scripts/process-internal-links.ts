import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize empty links structure
const initialLinksStructure = {
  keywords: {},
  urls: {}
};

function processContentFiles(contentDir: string, contentType: 'posts' | 'articles' | 'topics') {
  const links: any = initialLinksStructure;
  
  // Read all markdown files in the directory
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    // Skip drafts
    if (data.draft) return;

    const contentUrl = `/${contentType}/${path.basename(file, '.md')}`;
    
    // Add URL metadata
    links.urls[contentUrl] = {
      title: data.title,
      type: contentType
    };

    // Process keywords
    const keywords = data.keywords || [];
    keywords.forEach((keyword: string) => {
      const normalizedKeyword = keyword.toLowerCase().trim();
      
      if (!links.keywords[normalizedKeyword]) {
        links.keywords[normalizedKeyword] = {
          primary: contentUrl,
          related: []
        };
      } else {
        // Avoid duplicate related links
        if (links.keywords[normalizedKeyword].primary !== contentUrl &&
            !links.keywords[normalizedKeyword].related.includes(contentUrl)) {
          links.keywords[normalizedKeyword].related.push(contentUrl);
        }
      }
    });
  });

  return links;
}

function processInternalLinks() {
  // Paths to content directories
  const contentRoot = path.resolve(__dirname, '../src/content');
  const postsDir = path.join(contentRoot, 'posts');
  const articlesDir = path.join(contentRoot, 'articles');
  const topicsDir = path.join(contentRoot, 'topics');

  // Initialize links structure
  const links = initialLinksStructure;

  // Process each content type
  const postLinks = processContentFiles(postsDir, 'posts');
  const articleLinks = processContentFiles(articlesDir, 'articles');
  const topicLinks = processContentFiles(topicsDir, 'topics');

  // Merge links
  links.keywords = { 
    ...postLinks.keywords, 
    ...articleLinks.keywords, 
    ...topicLinks.keywords 
  };
  links.urls = { 
    ...postLinks.urls, 
    ...articleLinks.urls, 
    ...topicLinks.urls 
  };

  // Ensure the links file directory exists
  const linksDir = path.join(contentRoot, '_data');
  if (!fs.existsSync(linksDir)) {
    fs.mkdirSync(linksDir, { recursive: true });
  }

  // Write processed links to file
  const linksFilePath = path.join(linksDir, 'internal_links.json');
  fs.writeFileSync(
    linksFilePath, 
    JSON.stringify(links, null, 2)
  );

  console.log('Internal links processed successfully!');
}

// Run the processing
processInternalLinks();
