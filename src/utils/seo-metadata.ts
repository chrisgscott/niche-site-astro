import { z } from 'zod';

// SEO Metadata Generation Utility
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    image?: string;
  };
  jsonLd?: any;
}

export class SEOMetadataGenerator {
  private debug: boolean;

  constructor(debug: boolean = false) {
    this.debug = debug;
    this.log('SEO Metadata Generator initialized');
  }

  // Logging utility with debug flag
  private log(message: string, data?: any) {
    if (this.debug) {
      console.log(`🌐 SEO Metadata: ${message}`, data ? data : '');
    }
  }

  /**
   * Generate SEO metadata for a given content piece
   * @param content Content data from Astro collections
   * @returns Comprehensive SEO metadata
   */
  generateMetadata(content: any): SEOMetadata {
    this.log('Generating metadata for content', {
      title: content.data.title,
      type: content.data.type
    });

    // Validate content schema
    try {
      this.validateContent(content);
    } catch (error) {
      this.log('Content validation error', error);
      throw error;
    }

    // Base metadata generation
    const metadata: SEOMetadata = {
      title: this.generateTitle(content),
      description: this.generateDescription(content),
      keywords: content.data.keywords || [],
      canonicalURL: this.generateCanonicalURL(content),
      ogTitle: this.generateOpenGraphTitle(content),
      ogDescription: this.generateOpenGraphDescription(content),
      ogImage: this.generateOpenGraphImage(content),
      twitterCard: this.generateTwitterCardMetadata(content),
      jsonLd: this.generateJsonLdSchema(content)
    };

    this.log('Generated metadata', metadata);
    return metadata;
  }

  // Validate content against expected schema
  private validateContent(content: any) {
    const contentSchema = z.object({
      data: z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(['topic', 'post', 'article']),
        keywords: z.array(z.string()).optional(),
        image: z.object({
          src: z.string().url()
        }).optional()
      })
    });

    const result = contentSchema.safeParse(content);
    if (!result.success) {
      this.log('Content validation failed', result.error);
      throw new Error('Invalid content for SEO metadata generation');
    }
  }

  // Generate page title
  private generateTitle(content: any): string {
    const baseTitle = content.data.title;
    const titleSuffix = ' | Photography Insights';
    return baseTitle + titleSuffix;
  }

  // Generate description
  private generateDescription(content: any): string {
    return content.data.description || 
      `Explore insights about ${content.data.title} in our comprehensive photography guide.`;
  }

  // Generate canonical URL
  private generateCanonicalURL(content: any): string {
    const baseURL = 'https://yoursite.com'; // Replace with actual base URL
    const path = content.data.type === 'topic' ? 
      `/topics/${content.data.topic}` :
      content.data.type === 'post' ? 
      `/posts/${content.slug}` :
      `/articles/${content.slug}`;
    
    return `${baseURL}${path}`;
  }

  // Open Graph title generation
  private generateOpenGraphTitle(content: any): string {
    return this.generateTitle(content);
  }

  // Open Graph description generation
  private generateOpenGraphDescription(content: any): string {
    return this.generateDescription(content);
  }

  // Open Graph image generation
  private generateOpenGraphImage(content: any): string {
    return content.data.image?.src || 
      'https://yoursite.com/default-og-image.jpg'; // Replace with actual default
  }

  // Twitter card metadata generation
  private generateTwitterCardMetadata(content: any) {
    return {
      card: 'summary_large_image',
      title: this.generateTitle(content),
      description: this.generateDescription(content),
      image: this.generateOpenGraphImage(content)
    };
  }

  // JSON-LD schema generation
  private generateJsonLdSchema(content: any) {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': content.data.type === 'topic' ? 'WebPage' : 'Article',
      'headline': content.data.title,
      'description': content.data.description,
      'keywords': content.data.keywords?.join(', '),
      'image': content.data.image?.src
    };

    this.log('Generated JSON-LD schema', baseSchema);
    return baseSchema;
  }
}

// Singleton instance for easy import
export const seoMetadataGenerator = new SEOMetadataGenerator(
  process.env.NODE_ENV !== 'production'
);
