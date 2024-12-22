import { defineCollection, z } from "astro:content";
import { format } from "date-fns";

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

// Base schema for all content types
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().transform((str) => format(new Date(str), "MMMM d, yyyy")),
  image: imageSchema,
  keywords: z.array(z.string()),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// FAQ schema
const faqSchema = z.array(z.object({
  question: z.string(),
  answer: z.string()
})).optional();

// Topics (Hub pages)
const topics = defineCollection({
  schema: ({ image }) =>
    baseSchema.extend({
      type: z.literal('topic'),
      title_short: z.string(),  // Now required
      links: z.object({
        posts: z.array(z.string()).default([]),
        articles: z.array(z.string()).default([]),
      }),
      sections: z.array(z.object({
        title: z.string(),
        content: z.string(),
      })),
    }),
});

// Posts (Spoke pages)
const posts = defineCollection({
  schema: ({ image }) =>
    baseSchema.extend({
      type: z.literal('post'),
      topic: z.string(),
      author: z.string().default('AI Content Team'),
      authorImage: profileImageSchema.default({
        src: '/images/ai-author.png',
        width: 100,
        height: 100,
        alt: 'AI Content Team Profile Picture'
      }),
      category: z.string(),
      links: z.object({
        related: z.array(z.string()).default([]),
      }),
      parent_topic: z.object({
        title: z.string(),
        slug: z.string()
      }).optional(),
      faq: faqSchema,
    }),
});

// Articles (Programmatic pages)
const articles = defineCollection({
  schema: ({ image }) =>
    baseSchema.extend({
      type: z.literal('article'),
      topic: z.string(),
      category: z.string(),
      links: z.object({
        related: z.array(z.string()).default([]),
      }).optional(),
      schema: z.string().optional(),
      faq: faqSchema,
      variations: z.record(z.string(), z.array(z.string())).optional()
    }),
});

// Site Configuration
const config = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('type', [
    // Site Config Schema
    z.object({
      type: z.literal('site'),
      title: z.string(),
      description: z.string(),
      logo: z.string(),
      header: z.object({
        navigation: z.array(z.object({
          name: z.string(),
          href: z.string(),
        })),
      }),
      footer: z.object({
        copyright: z.string(),
      }),
    }),
    // Homepage Config Schema
    z.object({
      type: z.literal('homepage'),
      title: z.string(),
      description: z.string(),
      hero: z.object({
        title: z.string(),
        badge: z.string().optional(),
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
      content_library: z.object({
        heading: z.string(),
        description: z.string(),
      }),
    }),
    // CTA Config Schema
    z.object({
      type: z.literal('cta'),
      ctas: z.record(z.string(), z.object({
        title: z.string(),
        description: z.string(),
        buttonText: z.string(),
        buttonHref: z.string(),
      })),
    }),
  ]),
});

export const collections = {
  topics,
  posts,
  articles,
  config,
};
