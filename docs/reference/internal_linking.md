# Internal Linking System Reference

This document contains reference implementations from our previous project that we'll adapt for Astro when implementing the internal linking system.

## Key Components to Port

### 1. Internal Links Data Structure
```typescript
// Will need to be adapted for Astro's content collections
interface InternalLink {
  source: string;
  target: string;
  anchor_text: string;
  context: string;
}

interface InternalLinkMap {
  [key: string]: InternalLink[];
}
```

### 2. Link Management
- Store links in `src/content/_data/internal_links.json`
- Update during content generation
- Validate during build process

### 3. Integration Points
- Content collection schemas
- CrewAI content generation
- Build-time link validation
- Runtime link rendering

### 4. Astro Adaptations Needed
- [ ] Convert to TypeScript-first approach
- [ ] Use Astro's content collections API
- [ ] Integrate with Astro's build process
- [ ] Add proper type safety

## Original Implementation Notes
Place previous implementation code and notes here when ready to port.


## Existing internal_linking.ts file contents

import { readFileSync } from 'fs';
import path from 'path';

interface InternalLinks {
  keywords: {
    [key: string]: {
      primary: string;
      related: string[];
    };
  };
  urls: {
    [key: string]: {
      title: string;
      type: 'topic' | 'post' | 'article';
      keywords: string[];
      outbound: string[];
    };
  };
}

interface LinkSuggestion {
  keyword: string;
  url: string;
  isRelated: boolean;
}

export class InternalLinker {
  private links: InternalLinks;
  private currentUrl: string;
  private usedLinks: Set<string> = new Set();
  private maxLinksPerKeyword: number;
  private maxLinksPerParagraph: number;

  constructor(
    currentUrl: string,
    maxLinksPerKeyword = 1,
    maxLinksPerParagraph = 2
  ) {
    console.log('InternalLinker constructor called with:', { currentUrl, maxLinksPerKeyword, maxLinksPerParagraph });
    this.currentUrl = currentUrl;
    this.maxLinksPerKeyword = maxLinksPerKeyword;
    this.maxLinksPerParagraph = maxLinksPerParagraph;
    
    // Load internal links data
    const linksPath = path.join(process.cwd(), 'src/content/internal_links.json');
    console.log('Loading internal links from:', linksPath);
    try {
      this.links = JSON.parse(readFileSync(linksPath, 'utf-8'));
      console.log('Loaded internal links:', {
        keywordCount: Object.keys(this.links.keywords).length,
        urlCount: Object.keys(this.links.urls).length
      });
    } catch (error) {
      console.error('Error loading internal links:', error);
      this.links = { keywords: {}, urls: {} };
    }
  }

  /**
   * Add internal links to a paragraph of text
   */
  public addLinks(text: string): string {
    console.log('InternalLinker.addLinks called with text:', text.substring(0, 100) + '...');
    let result = text;
    let linksAdded = 0;
    
    // Find all possible links for this paragraph
    const suggestions = this.findLinkSuggestions(text);
    console.log('Link suggestions found:', suggestions);
    
    // Sort by keyword length (longer first) to prevent nested links
    suggestions.sort((a, b) => b.keyword.length - a.keyword.length);
    
    // Process each suggestion
    for (const suggestion of suggestions) {
      // Skip if we've reached the max links for this paragraph
      if (linksAdded >= this.maxLinksPerParagraph) {
        console.log('Max links per paragraph reached:', this.maxLinksPerParagraph);
        break;
      }
      
      // Skip if we've already used this URL too many times
      if (this.shouldSkipLink(suggestion.url)) {
        console.log('Skipping link due to max usage:', suggestion.url);
        continue;
      }
      
      // Skip if it's the current page
      if (suggestion.url === this.currentUrl) {
        console.log('Skipping link to current page:', suggestion.url);
        continue;
      }
      
      // Use the matched keyword text as the link text, not the title
      const linkText = `<a href="${suggestion.url}" class="internal-link">${suggestion.keyword}</a>`;
      
      // Replace the keyword with the link, but only once per keyword
      const regex = new RegExp(`\\b${suggestion.keyword}\\b`, 'i');
      if (regex.test(result)) {
        console.log('Adding link:', { keyword: suggestion.keyword, url: suggestion.url });
        result = result.replace(regex, linkText);
        this.usedLinks.add(suggestion.url);
        linksAdded++;
      }
    }
    
    console.log('Final text after adding links:', result.substring(0, 100) + '...');
    return result;
  }

  /**
   * Find all possible link suggestions in a text
   */
  private findLinkSuggestions(text: string): LinkSuggestion[] {
    console.log('Finding link suggestions for text:', text.substring(0, 100) + '...');
    const suggestions: LinkSuggestion[] = [];
    
    for (const [keyword, links] of Object.entries(this.links.keywords)) {
      // Case-insensitive search for the keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
        console.log('Found keyword match:', keyword);
        // Add primary link
        suggestions.push({
          keyword,
          url: links.primary,
          isRelated: false
        });
        
        // Add related links
        for (const related of links.related) {
          suggestions.push({
            keyword,
            url: related,
            isRelated: true
          });
        }
      }
    }
    
    console.log('Total suggestions found:', suggestions.length);
    return suggestions;
  }

  /**
   * Check if we should skip adding this link based on usage
   */
  private shouldSkipLink(url: string): boolean {
    const urlCount = Array.from(this.usedLinks).filter(u => u === url).length;
    return urlCount >= this.maxLinksPerKeyword;
  }

  /**
   * Get related content suggestions for the current page
   */
  public getRelatedContent(): Array<{url: string; title: string; type: string}> {
    const currentPage = this.links.urls[this.currentUrl];
    if (!currentPage) return [];
    
    return currentPage.outbound
      .map(url => ({
        url,
        title: this.links.urls[url].title,
        type: this.links.urls[url].type
      }))
      .slice(0, 3); // Limit to 3 related items
  }

  processText(text: string): string {
    // TODO: Implement proper internal linking logic
    return text;
  }
}

// Example usage in a React component:
/*
import { InternalLinker } from '@/utils/internal-linking';
import ReactMarkdown from 'react-markdown';

export default function ContentRenderer({ content, currentUrl }) {
  // Initialize linker
  const linker = new InternalLinker(currentUrl);
  
  // Custom renderer for paragraphs
  const renderers = {
    p: ({ children }) => {
      const text = children.toString();
      const linkedText = linker.addLinks(text);
      return <p dangerouslySetInnerHTML={{ __html: linkedText }} />;
    }
  };
  
  return (
    <div>
      <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
      
      {/* Related content section *\/}
      <div className="mt-8">
        <h2>Related Content</h2>
        <ul>
          {linker.getRelatedContent().map(({ url, title, type }) => (
            <li key={url}>
              <a href={url}>{title}</a> ({type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/

## Example internal_links.json

{
  "keywords": {
    "photography business": {
      "primary": "/topic/photography-business-basics",
      "related": [
        "/article/best-cameras-for-beginners",
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing",
        "/post/studio-lighting-guide",
        "/topic/photography-equipment-essentials",
        "/topic/photography-pricing-guide"
      ]
    },
    "photography license": {
      "primary": "/topic/photography-business-basics",
      "related": []
    },
    "photography pricing": {
      "primary": "/topic/photography-business-basics",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing",
        "/topic/photography-pricing-guide"
      ]
    },
    "photography contracts": {
      "primary": "/topic/photography-business-basics",
      "related": []
    },
    "business basics": {
      "primary": "/topic/photography-business-basics",
      "related": []
    },
    "photography studio": {
      "primary": "/topic/photography-business-basics",
      "related": []
    },
    "photography equipment": {
      "primary": "/topic/photography-business-basics",
      "related": [
        "/article/best-cameras-for-beginners",
        "/article/photography-pricing-calculator",
        "/post/studio-lighting-guide",
        "/topic/photography-equipment-essentials"
      ]
    },
    "business planning": {
      "primary": "/topic/photography-business-basics",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "camera gear": {
      "primary": "/topic/photography-equipment-essentials",
      "related": [
        "/article/best-cameras-for-beginners",
        "/article/photography-pricing-calculator"
      ]
    },
    "lighting equipment": {
      "primary": "/topic/photography-equipment-essentials",
      "related": [
        "/post/studio-lighting-guide"
      ]
    },
    "photography studio setup": {
      "primary": "/topic/photography-equipment-essentials",
      "related": []
    },
    "photography packages": {
      "primary": "/topic/photography-pricing-guide",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "session fees": {
      "primary": "/topic/photography-pricing-guide",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "photography rates": {
      "primary": "/topic/photography-pricing-guide",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "photography business license": {
      "primary": "/post/photography-business-license",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "photographer licensing": {
      "primary": "/post/photography-business-license",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "business permits": {
      "primary": "/post/photography-business-license",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "photography legal requirements": {
      "primary": "/post/photography-business-license",
      "related": [
        "/article/photography-pricing-calculator",
        "/post/photography-package-pricing"
      ]
    },
    "pricing strategy": {
      "primary": "/post/photography-package-pricing",
      "related": [
        "/article/photography-pricing-calculator"
      ]
    },
    "client packages": {
      "primary": "/post/photography-package-pricing",
      "related": [
        "/article/photography-pricing-calculator"
      ]
    },
    "studio setup": {
      "primary": "/post/studio-lighting-guide",
      "related": []
    },
    "studio lighting": {
      "primary": "/post/studio-lighting-guide",
      "related": []
    },
    "newborn photography books": {
      "primary": "/article/best-books-for-newborn-photographers",
      "related": []
    },
    "baby photography books": {
      "primary": "/article/best-books-for-newborn-photographers",
      "related": []
    },
    "newborn photography education": {
      "primary": "/article/best-books-for-newborn-photographers",
      "related": []
    },
    "newborn photography guides": {
      "primary": "/article/best-books-for-newborn-photographers",
      "related": []
    },
    "beginner cameras": {
      "primary": "/article/best-cameras-for-beginners",
      "related": [
        "/article/photography-pricing-calculator"
      ]
    },
    "camera buying guide": {
      "primary": "/article/best-cameras-for-beginners",
      "related": [
        "/article/photography-pricing-calculator"
      ]
    },
    "pricing calculator": {
      "primary": "/article/photography-pricing-calculator",
      "related": []
    }
  },
  "urls": {
    "/topic/photography-business-basics": {
      "title": "Photography Business Basics",
      "type": "topic",
      "keywords": [
        "photography business",
        "photography license",
        "photography pricing",
        "photography contracts",
        "business basics",
        "photography studio",
        "photography equipment",
        "business planning"
      ]
    },
    "/topic/photography-equipment-essentials": {
      "title": "Essential Photography Equipment Guide",
      "type": "topic",
      "keywords": [
        "photography equipment",
        "camera gear",
        "photography business",
        "lighting equipment",
        "photography studio setup"
      ]
    },
    "/topic/photography-pricing-guide": {
      "title": "Photography Pricing Guide: How to Price Your Services",
      "type": "topic",
      "keywords": [
        "photography pricing",
        "photography packages",
        "photography business",
        "session fees",
        "photography rates"
      ]
    },
    "/post/photography-business-license": {
      "title": "Photography Business License Guide: Requirements & Steps",
      "type": "post",
      "keywords": [
        "photography business license",
        "photographer licensing",
        "business permits",
        "photography legal requirements"
      ]
    },
    "/post/photography-package-pricing": {
      "title": "How to Create Photography Packages That Sell",
      "type": "post",
      "keywords": [
        "photography packages",
        "photography pricing",
        "session fees",
        "photography business",
        "pricing strategy",
        "photography rates",
        "business planning",
        "client packages"
      ]
    },
    "/post/studio-lighting-guide": {
      "title": "Studio Lighting Setup: Essential Guide for Photographers",
      "type": "post",
      "keywords": [
        "lighting equipment",
        "studio setup",
        "photography equipment",
        "studio lighting",
        "photography business"
      ]
    },
    "/article/best-books-for-newborn-photographers": {
      "title": "Best Books for Newborn Photographers in 2024",
      "type": "article",
      "keywords": [
        "newborn photography books",
        "baby photography books",
        "newborn photography education",
        "newborn photography guides"
      ]
    },
    "/article/best-cameras-for-beginners": {
      "title": "Best Cameras for Beginning Photographers in 2024",
      "type": "article",
      "keywords": [
        "camera gear",
        "photography equipment",
        "beginner cameras",
        "photography business",
        "camera buying guide"
      ]
    },
    "/article/photography-pricing-calculator": {
      "title": "Photography Pricing Calculator: Determine Your Rates",
      "type": "article",
      "keywords": [
        "photography pricing",
        "pricing calculator",
        "photography rates",
        "photography packages",
        "session fees",
        "business planning",
        "photography business",
        "pricing strategy"
      ]
    }
  }
}

## Existing generate_internal_links.ts file

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { globby } from 'globby'

interface InternalLink {
  primary: string
  related: string[]
}

interface InternalLinks {
  keywords: {
    [key: string]: InternalLink
  }
  urls: {
    [key: string]: {
      title: string
      type: 'topic' | 'post' | 'article'
      keywords: string[]
    }
  }
}

async function generateInternalLinks() {
  try {
    // Initialize the structure
    const internalLinks: InternalLinks = {
      keywords: {},
      urls: {}
    }

    // Get all content files
    const contentDir = path.join(process.cwd(), 'src/content')
    const files = await globby([
      'topics/**/*.md',
      'posts/**/*.md',
      'articles/**/*.md'
    ], {
      cwd: contentDir,
      ignore: ['config/**', 'home.md'] // Explicitly ignore config and home
    })

    // Process each file
    for (const file of files) {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf8')
      const { data: frontMatter } = matter(content)
      
      // Determine content type and URL
      const type = file.split('/')[0].slice(0, -1) // Remove 's' from folders name
      const url = `/${type}/${frontMatter.slug}`
      
      // Add to urls mapping
      internalLinks.urls[url] = {
        title: frontMatter.title,
        type: type as 'topic' | 'post' | 'article',
        keywords: frontMatter.keywords || []
      }

      // Process keywords
      const keywords = frontMatter.keywords || []
      keywords.forEach((keyword: string) => {
        if (!internalLinks.keywords[keyword]) {
          internalLinks.keywords[keyword] = {
            primary: url,
            related: []
          }
        } else if (!internalLinks.keywords[keyword].related.includes(url) && 
                   internalLinks.keywords[keyword].primary !== url) {
          internalLinks.keywords[keyword].related.push(url)
        }
      })

      // Process links from frontmatter if they exist
      const links = frontMatter.links || {}
      Object.entries(links).forEach(([linkType, urls]: [string, any]) => {
        if (Array.isArray(urls)) {
          urls.forEach((linkedUrl: string) => {
            // Add this URL as a related link to all keywords of the linked content
            const linkedKeywords = internalLinks.urls[linkedUrl]?.keywords || []
            linkedKeywords.forEach(keyword => {
              if (!internalLinks.keywords[keyword]) {
                internalLinks.keywords[keyword] = {
                  primary: linkedUrl,
                  related: [url]
                }
              } else if (!internalLinks.keywords[keyword].related.includes(url) &&
                        internalLinks.keywords[keyword].primary !== url) {
                internalLinks.keywords[keyword].related.push(url)
              }
            })
          })
        }
      })
    }

    // Sort related links for consistency
    Object.values(internalLinks.keywords).forEach(link => {
      link.related.sort()
    })

    // Write to file
    const outputPath = path.join(contentDir, 'internal_links.json')
    fs.writeFileSync(
      outputPath,
      JSON.stringify(internalLinks, null, 2)
    )

    console.log('Internal links generated successfully!')
  } catch (error) {
    console.error('Error generating internal links:', error)
  }
}

generateInternalLinks()
