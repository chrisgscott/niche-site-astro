import type { ImageMetadata } from 'astro';

// Helper to ensure Unsplash URLs have optimal parameters
export function getUnsplashImage(url: string, width: number, height: number, alt: string): string {
  // Remove any existing format parameter
  const baseUrl = url.split('&fm=')[0];
  // Add quality and format parameters for optimal delivery
  return `${baseUrl}&q=80&auto=format`;
}
