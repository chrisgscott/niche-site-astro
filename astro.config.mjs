import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkInternalLinks } from './src/utils/remark-internal-links';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx()],
  image: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    },
    remarkPlugins: [remarkInternalLinks]
  }
});