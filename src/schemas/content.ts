import { z } from "zod";
import { MIN_ASPECT_RATIO, MAX_ASPECT_RATIO } from "../utils/images";

// Image Schema
const imageSchema = z.object({
  src: z.string().url(),
  width: z.number().min(1),
  height: z.number().min(1),
  alt: z.string(),
}).refine((data) => {
  const aspectRatio = data.width / data.height;
  return aspectRatio >= MIN_ASPECT_RATIO && aspectRatio <= MAX_ASPECT_RATIO;
}, {
  message: `Image must be landscape orientation with aspect ratio between ${MIN_ASPECT_RATIO}:1 and ${MAX_ASPECT_RATIO}:1`,
});

// FAQ schema
const faqSchema = z.array(z.object({
  question: z.string(),
  answer: z.string()
})).optional();

// Base Schema (without featured flag)
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  image: imageSchema,
  keywords: z.array(z.string()),
  draft: z.boolean().default(false),
});

// Topic Schema (includes featured flag)
const topicSchema = baseSchema.extend({
  type: z.literal('topic'),
  topic: z.string(),  // Topic identifier for categorization
  title_short: z.string(),
  featured: z.boolean().default(false),
});

// Post Schema
const postSchema = baseSchema.extend({
  type: z.literal('post'),
  parent_topic: z.object({
    title: z.string(),
    slug: z.string()
  }),
  faq: faqSchema,
});

// Article Schema
const articleSchema = baseSchema.extend({
  type: z.literal('article'),
  parent_topic: z.object({
    title: z.string(),
    slug: z.string()
  }),
  title_template: z.string().optional(),
  article_variables: z.record(z.string(), z.string()).optional(),
  schema: z.string().optional(),
  faq: faqSchema,
  variations: z.record(z.string(), z.array(z.string())).optional()
});

// Config Schema
const configSchema = z.discriminatedUnion('type', [
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
      links: z.array(z.object({
        title: z.string(),
        items: z.array(z.object({
          name: z.string(),
          href: z.string(),
        })),
      })),
      social: z.array(z.object({
        name: z.string(),
        href: z.string(),
        icon: z.string(),
      })),
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
  // Component Config Schema
  z.object({
    type: z.literal('component'),
    component: z.enum(['cta', 'newsletter', 'testimonials']),
    ctas: z.object({
      post_content: z.object({
        title: z.string(),
        description: z.string(),
        buttonText: z.string(),
        buttonHref: z.string(),
      }),
      newsletter: z.object({
        title: z.string(),
        description: z.string(),
        buttonText: z.string(),
        buttonHref: z.string(),
      }),
      consultation: z.object({
        title: z.string(),
        description: z.string(),
        buttonText: z.string(),
        buttonHref: z.string(),
      }),
    }).optional(),
  }),
]);

export {
  imageSchema,
  faqSchema,
  baseSchema,
  topicSchema,
  postSchema,
  articleSchema,
  configSchema,
};
