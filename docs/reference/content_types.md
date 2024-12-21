# Content Type Reference

This document contains reference implementations for content types and schemas that we'll adapt for Astro's content collections.

## Key Components

### 1. Content Collection Types
```typescript
// Will be adapted for Astro's collection schema
interface BaseContent {
  title: string;
  description: string;
  keywords: string[];
  date: string;
  lastmod?: string;
  draft?: boolean;
}

interface Topic extends BaseContent {
  type: 'topic';
  links: {
    posts?: string[];
    articles?: string[];
  };
}

interface Post extends BaseContent {
  type: 'post';
  topic: string;
  links?: {
    related?: string[];
  };
}

interface Article extends BaseContent {
  type: 'article';
  topic?: string;
  variations?: string[];
}
```

### 2. Frontmatter Examples

#### Topic Page
```yaml
---
title: "Complete Guide to Home Coffee Brewing"
description: "Master the art of brewing coffee at home..."
keywords: ["coffee brewing", "home barista", "coffee guide"]
date: "2024-01-01"
lastmod: "2024-01-15"
type: "topic"
links:
  posts: 
    - "/posts/french-press"
    - "/posts/pour-over"
  articles:
    - "/articles/best-coffee-maker-french-press"
---
```

#### Post Page
```yaml
---
title: "How to Use a French Press"
description: "Step-by-step guide to brewing..."
keywords: ["french press coffee", "coffee brewing guide"]
date: "2024-01-02"
type: "post"
topic: "/topics/home-coffee-brewing"
links:
  related:
    - "/posts/coffee-grind-size"
---
```

#### Article Page
```yaml
---
title: "Best {brand} Coffee Maker for {purpose}"
description: "Comprehensive guide to {brand} coffee makers..."
keywords: ["coffee maker", "{brand}", "{purpose}"]
date: "2024-01-03"
type: "article"
topic: "/topics/home-coffee-brewing"
variations:
  brand: ["Breville", "Cuisinart", "DeLonghi"]
  purpose: ["Home", "Office", "Travel"]
---
```

## Astro Adaptations Needed
- [ ] Convert to Astro content collections
- [ ] Add proper Zod schemas
- [ ] Set up content config
- [ ] Add TypeScript types
