import * as fs from "fs/promises";
import * as path from "path";
import matter from "gray-matter";
import { globby } from "globby";
import { fileURLToPath } from "url";

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateImageUrls() {
  const contentDir = path.join(path.dirname(__dirname), "src/content");
  
  // Find all content files
  const files = await globby([
    "topics/**/*.{md,mdx}",
    "posts/**/*.{md,mdx}",
    "articles/**/*.{md,mdx}",
  ], {
    cwd: contentDir,
  });

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: markdownContent } = matter(content);
    let modified = false;

    // Update image URLs in frontmatter
    function updateImageUrl(obj: any) {
      if (!obj) return;
      
      if (typeof obj === 'object') {
        for (const key in obj) {
          if (key === 'src' && typeof obj[key] === 'string' && obj[key].includes('unsplash.com')) {
            // Remove any existing format parameter
            const baseUrl = obj[key].split('&fm=')[0];
            // Add jpg format (most widely supported)
            obj[key] = `${baseUrl}&fm=jpg`;
            modified = true;
          } else if (typeof obj[key] === 'object') {
            updateImageUrl(obj[key]);
          }
        }
      }
    }

    updateImageUrl(data);

    if (modified) {
      // Write the updated content back to the file
      const updatedContent = matter.stringify(markdownContent, data);
      await fs.writeFile(filePath, updatedContent);
      console.log(`✅ Updated ${file}`);
    } else {
      console.log(`⏭️  Skipped ${file} (no changes needed)`);
    }
  }
}

updateImageUrls().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
