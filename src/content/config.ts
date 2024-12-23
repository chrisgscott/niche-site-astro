import { defineCollection } from "astro:content";
import { topicSchema, postSchema, articleSchema, configSchema } from "../schemas/content";

/**
 * Topics Collection (Hub Pages)
 * - Central knowledge hubs
 * - Content is written in MDX
 * - Links to related posts and articles are generated automatically
 */
const topics = defineCollection({
  schema: () => topicSchema,
});

/**
 * Posts Collection (Spoke Pages)
 * - In-depth articles supporting hub topics
 * - Links back to parent topic
 * - Additional metadata for author attribution
 */
const posts = defineCollection({
  schema: () => postSchema,
});

/**
 * Articles Collection (Programmatic Pages)
 * - AI-generated content for keyword variations
 * - Linked to topics for context
 * - Optional schema and variations for SEO
 */
const articles = defineCollection({
  schema: () => articleSchema,
});

/**
 * Site Configuration
 * - Global settings and content
 * - Navigation structure
 * - Footer content
 * - CTA configurations
 */
const config = defineCollection({
  type: 'data',
  schema: () => configSchema,
});

export const collections = {
  topics,
  posts,
  articles,
  config,
};
