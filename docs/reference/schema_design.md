# Content Schema Design

This document outlines the key decisions and requirements for our content schema design.

## Image Handling
- **Primary Source**: Unsplash API
  - All content images (except logo) will be sourced from Unsplash
  - Image schema validates dimensions and aspect ratio
  - Local path references are allowed in schema to support both Unsplash URLs and local files (for logo)

## Internal Linking
- **Approach**: Automated Generation
  - No manual link management in frontmatter
  - Links are generated at build time
  - See `internal_linking.md` for implementation details

## Content Relationships
### Topics (Hub Pages)
- Acts as a central knowledge hub
- Required fields:
  - `topic`: String identifier for the topic area (used for categorization)
  - All base fields (title, description, etc.)

### Posts (Spoke Pages)
- In-depth articles supporting hub topics
- Required fields:
  - `parent_topic`: Object containing:
    - `title`: Topic page title
    - `slug`: Topic page slug
  - All base fields

### Articles (Programmatic Pages)
- AI-generated content for keyword variations
- Required fields:
  - `parent_topic`: Object containing:
    - `title`: Topic page title
    - `slug`: Topic page slug
  - All base fields
  - Optional schema and FAQ fields

## Schema Evolution Notes
- Schema designs are flexible and may evolve
- Documentation in `/docs/reference` serves as a guide, not strict rules
- Changes should be documented here with rationale

## Validation
- Run `npm run schema:validate` to check content against schema
- Schema enforces:
  1. Required relationships between content types
  2. Image dimensions and aspect ratios
  3. Required metadata for SEO
  4. Content structure consistency
