# Niche Site Generator - Project Requirements

## Overview
A boilerplate for generating SEO-optimized niche sites using Astro, with a focus on content-agnostic design and AI-driven content generation. The project leverages CrewAI for automated content workflows while maintaining a strict separation between content and presentation.

## Content Architecture

### Hub Pages (Topics)
- **Purpose**: Establish topical authority and organize related content
- **Implementation**:
  - Comprehensive overview of main topics
  - Strategic internal linking to spokes and articles
  - Schema.org Article markup
  - Optimized for primary keywords
- **Example Structure**:
  ```markdown
  ---
  title: "Complete Guide to Home Coffee Brewing"
  description: "Master the art of brewing coffee at home..."
  keywords: ["coffee brewing", "home barista", "coffee guide"]
  links:
    posts: ["/posts/french-press", "/posts/pour-over"]
    articles: ["/articles/best-coffee-maker-french-press"]
  schema:
    type: "Article"
  ---
  ```

### Spoke Pages (Posts)
- **Purpose**: Deep-dive content supporting hub topics
- **Implementation**:
  - Detailed, focused content
  - Step-by-step instructions
  - HowTo schema markup
  - FAQ sections
- **Example Structure**:
  ```markdown
  ---
  title: "How to Use a French Press"
  description: "Step-by-step guide to brewing..."
  keywords: ["french press coffee", "coffee brewing guide"]
  links:
    topic: "/topics/home-coffee-brewing"
    related: ["/posts/coffee-grind-size"]
  schema:
    type: "HowTo"
    steps: [...]
  faq: [...]
  ---
  ```

### Programmatic Pages (AI-Generated)
- **Purpose**: Scale content for keyword variations
- **Implementation**:
  - AI-optimized structure and content
  - Dynamic keyword targeting
  - Automated internal linking
  - No rigid templates
- **Content Generation**:
  ```yaml
  Input:
    - Target keywords and search intent
    - Required internal linking targets
    - Content goals and constraints
  
  Output:
    - Optimized content structure
    - SEO metadata
    - Strategic internal links
    - Rich snippets
  ```

### Site Configuration Content
All site-wide content stored in Markdown:
- Navigation menus
- Footer sections
- CTA components
- Marketing copy
- Social links
- Homepage sections

## Development Architecture

### Frontend Principles
1. **Content Agnostic Design**
   - Components render based on Markdown content
   - No hardcoded strings
   - Flexible layouts adapting to content structure

2. **Component Architecture**
   - Atomic design principles
   - DaisyUI components
   - Minimal client-side JavaScript
   - TypeScript for type safety

3. **Styling**
   - TailwindCSS utility-first approach
   - Consistent design tokens
   - Responsive patterns
   - DaisyUI theming

### Content Management
1. **File Structure**
   ```
   src/content/
   ├── topics/     # Hub pages
   ├── posts/      # Spoke pages
   ├── articles/   # Programmatic pages
   └── config/     # Site configuration
   ```

2. **Content Validation**
   - TypeScript schemas for frontmatter
   - Required metadata checking
   - Internal link verification
   - Schema.org validation

## CrewAI Integration

### Workflows
1. **Content Generation**
   - Topic research
   - Content structure optimization
   - SEO metadata generation
   - Internal linking strategy

2. **Content Enhancement**
   - FAQ generation
   - Schema markup
   - Meta description optimization
   - Keyword density analysis

3. **Quality Control**
   - Content validation
   - SEO requirements check
   - Schema verification
   - Internal link validation

### Edge Function Architecture
1. **Implementation**
   ```
   /api/crews/
   ├── content-generator
   ├── internal-linker
   └── seo-optimizer
   ```

2. **Security**
   - API authentication
   - Rate limiting
   - Usage monitoring
   - Error handling

## Deployment

### Vercel Configuration
1. **Build Process**
   - Static site generation
   - Edge function deployment
   - Environment variable management

2. **Automation**
   - Content validation
   - Automated deployments
   - Preview environments
   - Rollback capabilities

### Performance Requirements
1. **Optimization**
   - Image optimization
   - Minimal JavaScript
   - Efficient caching
   - High lighthouse scores

2. **Monitoring**
   - Performance metrics
   - Edge function usage
   - Error tracking
   - Usage analytics

## SEO Implementation

### Technical SEO
1. **Metadata**
   - Dynamic title tags
   - Meta descriptions
   - Open Graph tags
   - Twitter cards

2. **Structure**
   - Schema.org markup
   - XML sitemap
   - RSS feeds
   - Canonical URLs

### Content SEO
1. **On-Page**
   - Keyword optimization
   - Internal linking
   - Content structure
   - Rich snippets

2. **Architecture**
   - Topic clusters
   - Hub and spoke model
   - URL structure
   - Breadcrumbs
