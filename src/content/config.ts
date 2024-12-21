import { defineCollection, z } from "astro:content";
import { format } from "date-fns";

// Base schema for all content types
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().transform((str) => format(new Date(str), "MMMM d, yyyy")),
  image: z.string().optional(),
  keywords: z.array(z.string()),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// Topics (Hub pages)
const topics = defineCollection({
  schema: ({ image }) =>
    baseSchema.extend({
      type: z.literal('topic'),
      links: z.object({
        posts: z.array(z.string()).default([]),
        articles: z.array(z.string()).default([]),
      }),
      topicImage: z.string().optional(),
      sections: z.array(z.object({
        title: z.string(),
        content: z.string(),
      })).optional(),
    }),
});

// Posts (Spoke pages)
const posts = defineCollection({
  schema: ({ image }) =>
    baseSchema.extend({
      type: z.literal('post'),
      topic: z.string(),
      author: z.string().default('AI Content Team'),
      authorImage: z.string().default('/images/ai-author.png'),
      category: z.string(),
      postImage: z.string().optional(),
      links: z.object({
        related: z.array(z.string()).default([]),
      }).optional(),
    }),
});

// Articles (Programmatic pages)
const articles = defineCollection({
  schema: ({ image }) =>
    baseSchema.extend({
      type: z.literal('article'),
      topic: z.string().optional(),
      variations: z.record(z.array(z.string())).optional(),
      articleImage: z.string().optional(),
      schema: z.enum(['Article', 'HowTo', 'FAQPage']).default('Article'),
      faq: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })).optional(),
    }),
});

// Site Configuration
const config = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    logo: z.string().optional(),
    navigation: z.array(z.object({
      title: z.string(),
      href: z.string(),
    })),
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
    }).optional(),
  }),
});

export const collections = {
  topics,
  posts,
  articles,
  config,
};
