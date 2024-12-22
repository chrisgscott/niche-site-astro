import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import matter from "gray-matter";
import { globby } from "globby";
import { fileURLToPath } from "url";

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image schema with aspect ratio validation
const imageSchema = z.object({
  src: z.string().url(),
  width: z.number().min(1),
  height: z.number().min(1),
  alt: z.string(),
}).refine((data) => {
  const aspectRatio = data.width / data.height;
  return aspectRatio >= 1.3 && aspectRatio <= 2.0; // Enforce landscape (16:9 is ~1.77)
}, {
  message: "Image must be landscape orientation with aspect ratio between 1.3:1 and 2:1",
});

// Profile image schema without aspect ratio validation
const profileImageSchema = z.object({
  src: z.string().url(),
  width: z.number().min(1),
  height: z.number().min(1),
  alt: z.string(),
});

// Base schema for content types (not used for config)
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  image: imageSchema,
  keywords: z.array(z.string()),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type ContentType = "topics" | "posts" | "articles" | "config";
type SchemaChange = {
  field: string;
  action: "add" | "remove" | "modify";
  defaultValue?: any;
  required?: boolean;
};

class SchemaManager {
  private contentDir: string;
  private schemas: Record<ContentType, z.ZodType<any>>;

  constructor() {
    this.contentDir = path.join(path.dirname(__dirname), "src/content");
    
    // Define schemas inline since we can't import from Astro config
    this.schemas = {
      topics: baseSchema.extend({
        type: z.literal("topic"),
        links: z.object({
          posts: z.array(z.string()).default([]),
          articles: z.array(z.string()).default([]),
        }),
        sections: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
          })
        ),
      }),
      posts: baseSchema.extend({
        type: z.literal("post"),
        topic: z.string(),
        author: z.string().default("AI Content Team"),
        authorImage: profileImageSchema.default({
          src: "/images/ai-author.png",
          width: 100,
          height: 100,
          alt: "AI Content Team Profile Picture"
        }),
        category: z.string(),
        links: z.object({
          related: z.array(z.string()).default([]),
        }),
      }),
      articles: baseSchema.extend({
        type: z.literal("article"),
        topic: z.string(),
        category: z.string(),
        links: z.object({
          related: z.array(z.string()).default([]),
        }).optional(),
        schema: z.string().optional(),
        faq: z.array(
          z.object({
            question: z.string(),
            answer: z.string()
          })
        ).optional(),
        variations: z.record(z.string(), z.array(z.string())).optional()
      }),
      config: z.discriminatedUnion("type", [
        z.object({
          type: z.literal("site"),
          title: z.string(),
          description: z.string(),
          logo: z.string().optional(),
          favicon: z.string().optional(),
          social: z.object({
            twitter: z.string().optional(),
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            youtube: z.string().optional(),
            linkedin: z.string().optional(),
          }).optional(),
          navigation: z.array(z.object({
            title: z.string(),
            href: z.string(),
          })).optional(),
          footer: z.object({
            copyright: z.string(),
            links: z.array(z.object({
              title: z.string(),
              href: z.string(),
            })),
            social: z.array(z.object({
              platform: z.string(),
              href: z.string(),
            })),
          }),
          cta: z.object({
            title: z.string(),
            description: z.string(),
            buttonText: z.string(),
            buttonLink: z.string(),
          }),
        }),
        z.object({
          type: z.literal("homepage"),
          title: z.string(),
          description: z.string(),
          hero: z.object({
            title: z.string(),
            badge: z.string(),
            heading: z.object({
              prefix: z.string(),
              highlight: z.string(),
              suffix: z.string(),
            }),
            subheading: z.string(),
            description: z.string(),
            cta: z.object({
              text: z.string(),
              href: z.string(),
            }),
          }),
          sections: z.array(z.object({
            title: z.string(),
            description: z.string(),
            items: z.array(z.string()),
          })).optional(),
        }),
      ]),
    };
  }

  // Validate all content against schemas
  async validateContent() {
    const results = {
      valid: [] as string[],
      invalid: [] as { file: string; errors: string[] }[],
    };

    for (const type of Object.keys(this.schemas) as ContentType[]) {
      const contentPath = type === "config" ? "config" : type;
      const files = await globby(`${this.contentDir}/${contentPath}/**/*.{md,mdx}`);

      for (const file of files) {
        try {
          const content = await fs.readFile(file, "utf-8");
          const { data: frontmatter } = matter(content);
          
          if (type === "config") {
            await this.schemas[type].parseAsync(frontmatter);
          } else {
            await this.schemas[type].parseAsync({
              ...frontmatter,
              type: type.slice(0, -1), // Remove 's' from type
            });
          }
          
          results.valid.push(file);
        } catch (error) {
          if (error instanceof z.ZodError) {
            results.invalid.push({
              file,
              errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
            });
          } else {
            results.invalid.push({
              file,
              errors: [String(error)],
            });
          }
        }
      }
    }

    return results;
  }

  // Apply schema changes to content files
  async migrateContent(type: ContentType, changes: SchemaChange[]) {
    const contentPath = type === "config" ? "config" : type;
    const files = await globby(`${this.contentDir}/${contentPath}/**/*.{md,mdx}`);
    const results = {
      updated: [] as string[],
      failed: [] as { file: string; error: string }[],
    };

    for (const file of files) {
      try {
        const content = await fs.readFile(file, "utf-8");
        const { data: frontmatter, content: markdown } = matter(content);
        let modified = false;

        for (const change of changes) {
          switch (change.action) {
            case "add":
              if (!frontmatter[change.field]) {
                frontmatter[change.field] = change.defaultValue;
                modified = true;
              }
              break;
            case "remove":
              if (change.field in frontmatter) {
                delete frontmatter[change.field];
                modified = true;
              }
              break;
            case "modify":
              if (change.field in frontmatter) {
                frontmatter[change.field] = change.defaultValue;
                modified = true;
              }
              break;
          }
        }

        if (modified) {
          const newContent = matter.stringify(markdown, frontmatter);
          await fs.writeFile(file, newContent);
          results.updated.push(file);
        }
      } catch (error) {
        results.failed.push({
          file,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }

  // Generate report of current schema usage
  async analyzeSchemaUsage() {
    const usage = {} as Record<ContentType, Record<string, number>>;

    for (const type of Object.keys(this.schemas) as ContentType[]) {
      usage[type] = {};
      const contentPath = type === "config" ? "config" : type;
      const files = await globby(`${this.contentDir}/${contentPath}/**/*.{md,mdx}`);

      for (const file of files) {
        const content = await fs.readFile(file, "utf-8");
        const { data: frontmatter } = matter(content);

        for (const field of Object.keys(frontmatter)) {
          usage[type][field] = (usage[type][field] || 0) + 1;
        }
      }
    }

    return usage;
  }

  // Format validation results for display
  formatValidationResults(results: Awaited<ReturnType<typeof this.validateContent>>) {
    let output = "";

    output += "\nValid Files:\n";
    output += results.valid.map((file) => `✅ ${file}`).join("\n");

    if (results.invalid.length > 0) {
      output += "\n\nInvalid Files:\n";
      output += results.invalid
        .map(
          ({ file, errors }) =>
            `❌ ${file}\n   ${errors.map((e) => `- ${e}`).join("\n   ")}`
        )
        .join("\n\n");
    }

    return output;
  }

  // Format schema usage results for display
  formatSchemaUsage(usage: Awaited<ReturnType<typeof this.analyzeSchemaUsage>>) {
    let output = "\nSchema Usage Analysis:\n";

    for (const [type, fields] of Object.entries(usage)) {
      output += `\n${type}:\n`;
      for (const [field, count] of Object.entries(fields)) {
        output += `  ${field}: ${count} files\n`;
      }
    }

    return output;
  }
}

// CLI interface
const main = async () => {
  const manager = new SchemaManager();
  const command = process.argv[2];

  switch (command) {
    case "validate":
      const validation = await manager.validateContent();
      console.log(manager.formatValidationResults(validation));
      break;

    case "analyze":
      const usage = await manager.analyzeSchemaUsage();
      console.log(manager.formatSchemaUsage(usage));
      break;

    case "migrate":
      const type = process.argv[3] as ContentType;
      const field = process.argv[4];
      const action = process.argv[5] as SchemaChange["action"];
      const defaultValue = process.argv[6];

      if (!type || !field || !action) {
        console.error(
          "Usage: npm run schema:migrate [type] [field] [add|remove|modify] [defaultValue?]"
        );
        process.exit(1);
      }

      const changes: SchemaChange[] = [
        {
          field,
          action,
          defaultValue: defaultValue ? JSON.parse(defaultValue) : undefined,
        },
      ];

      const migration = await manager.migrateContent(type, changes);
      console.log("\nMigration Results:");
      console.log(`Updated ${migration.updated.length} files:`);
      migration.updated.forEach((file) => console.log(`✅ ${file}`));

      if (migration.failed.length > 0) {
        console.log(`\nFailed to update ${migration.failed.length} files:`);
        migration.failed.forEach(({ file, error }) =>
          console.log(`❌ ${file}: ${error}`)
        );
      }
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error("Available commands: validate, analyze, migrate");
      process.exit(1);
  }
};

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
