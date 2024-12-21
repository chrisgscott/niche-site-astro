# SEO Utilities Reference

This document contains reference implementations from our previous project that we'll adapt for Astro's SEO capabilities.

## Key Components to Port

### 1. Schema.org Generation
```typescript
// Will need to be adapted for Astro's built-in SEO
interface SchemaConfig {
  type: 'Article' | 'HowTo' | 'FAQPage';
  data: Record<string, any>;
}

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  schema: SchemaConfig;
}
```

### 2. SEO Validation
- Metadata completeness
- Schema.org validation
- Internal link checking
- Image optimization verification

### 3. Integration Points
- Astro's built-in SEO
- Content collection frontmatter
- Build-time validation
- CrewAI optimization

### 4. Astro Adaptations Needed
- [ ] Use Astro's SEO integration
- [ ] Adapt for content collections
- [ ] TypeScript schema definitions
- [ ] Build-time optimization

## Original Implementation Notes
Place previous implementation code and notes here when ready to port.
