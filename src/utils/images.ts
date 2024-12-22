interface ImageData {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const DEFAULT_ASPECT_RATIO = 16 / 9; // 1.77:1
export const MIN_ASPECT_RATIO = 1.3;
export const MAX_ASPECT_RATIO = 2.0;

export const DEFAULT_IMAGES: Record<string, ImageData> = {
  post: {
    src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1920&h=1080&fit=crop",
    width: 1920,
    height: 1080,
    alt: "Modern office workspace with laptop and digital marketing tools",
  },
  hero: {
    src: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2400&h=1350&fit=crop",
    width: 2400,
    height: 1350,
    alt: "Digital marketing strategy visualization with connected concepts",
  },
  profile: {
    src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400&h=400&fit=crop",
    width: 400,
    height: 400,
    alt: "Default profile avatar",
  },
};

export function getUnsplashUrl(originalUrl: string, width: number, height: number): string {
  const url = new URL(originalUrl);
  if (url.hostname === 'images.unsplash.com') {
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  return originalUrl;
}

export function validateImageAspectRatio(width: number, height: number): boolean {
  const aspectRatio = width / height;
  return aspectRatio >= MIN_ASPECT_RATIO && aspectRatio <= MAX_ASPECT_RATIO;
}

export function getOptimalImageDimensions(
  containerWidth: number,
  containerHeight: number,
  targetAspectRatio = DEFAULT_ASPECT_RATIO
): { width: number; height: number } {
  const containerAspectRatio = containerWidth / containerHeight;

  if (containerAspectRatio > targetAspectRatio) {
    // Container is wider than target ratio
    const width = Math.round(containerHeight * targetAspectRatio);
    return { width, height: containerHeight };
  } else {
    // Container is taller than target ratio
    const height = Math.round(containerWidth / targetAspectRatio);
    return { width: containerWidth, height };
  }
}

export function generateImageAlt(title: string, type: string = 'content'): string {
  return `${title} - ${type} image`;
}
