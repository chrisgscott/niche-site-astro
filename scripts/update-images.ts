import * as fs from "fs/promises";
import * as path from "path";
import matter from "gray-matter";
import { globby } from "globby";
import { fileURLToPath } from "url";

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateImageFields() {
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

    // Update image field if it exists as a string
    if (typeof data.image === "string") {
      const imageUrl = data.image;
      data.image = {
        src: imageUrl,
        alt: `${data.title} - Featured Image`,
        width: 2000,
        height: 1333,
      };
    }

    // Update authorImage field if it exists as a string
    if (typeof data.authorImage === "string") {
      const imageUrl = data.authorImage;
      data.authorImage = {
        src: imageUrl,
        alt: `${data.author} - Profile Picture`,
        width: 100,
        height: 100,
      };
    }

    // Add default image if missing
    if (!data.image) {
      data.image = {
        src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1920&h=1080&fit=crop",
        alt: `${data.title} - Featured Image`,
        width: 1920,
        height: 1080,
      };
    }

    // Write the updated content back to the file
    const updatedContent = matter.stringify(markdownContent, data);
    await fs.writeFile(filePath, updatedContent);
    console.log(`✅ Updated ${file}`);
  }
}

updateImageFields().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
