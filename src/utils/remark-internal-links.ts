import { visit } from 'unist-util-visit';
import { internalLinker } from './internal-linking';
import { URL } from 'url';

/**
 * Remark plugin to automatically insert internal links
 * @param options Configuration options for internal linking
 * @param options.currentUrl URL of the current page to prevent self-linking
 */
export function remarkInternalLinks(options: { currentUrl?: string } = {}) {
  return function transformer(tree: any, file: any) {
    // Extensive logging of available information
    console.log('🕵️ Investigating Current Page Context');
    console.log('Provided Options:', JSON.stringify(options, null, 2));
    console.log('Astro Frontmatter:', JSON.stringify(file.data?.astro?.frontmatter, null, 2));
    console.log('File Path:', file.path);

    // Determine the current page's URL
    let currentUrl = options.currentUrl;

    // Try multiple methods to extract the current page URL
    if (!currentUrl) {
      // Method 1: From Astro frontmatter
      if (file.data?.astro?.frontmatter?.slug) {
        currentUrl = `/${file.data.astro.frontmatter.type}s/${file.data.astro.frontmatter.slug}`;
        console.log('📍 URL from Astro Frontmatter:', currentUrl);
      }
      
      // Method 2: From file path
      if (!currentUrl && file.path) {
        // Extract slug from file path
        const pathMatch = file.path.match(/\/([^/]+)\.md$/);
        if (pathMatch) {
          currentUrl = `/${file.path.includes('/posts/') ? 'posts' : 
                          file.path.includes('/articles/') ? 'articles' : 
                          'topics'}/${pathMatch[1]}`;
          console.log('📍 URL from File Path:', currentUrl);
        }
      }
    }

    console.log('🔗 Remark Internal Links Transformer');
    console.log('Final Current Page URL:', currentUrl || 'UNDEFINED');

    visit(tree, 'paragraph', (node) => {
      // Convert node to string
      let text = node.children
        .map((child: any) => {
          if (child.type === 'text') return child.value;
          if (child.type === 'link') return child.children[0].value;
          return '';
        })
        .join('');

      // Generate internal links
      const linkedText = internalLinker.generateInternalLinks(text, currentUrl || '');

      // If text changed, update node
      if (linkedText !== text) {
        // Parse the new text into children
        node.children = parseLinkedText(linkedText);
      }
    });
  };
}

/**
 * Parse linked text into MDAST children
 * @param text Text with potential markdown links
 * @returns Array of MDAST nodes
 */
function parseLinkedText(text: string): any[] {
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const children: any[] = [];
  let lastIndex = 0;

  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before link
    if (match.index > lastIndex) {
      children.push({
        type: 'text',
        value: text.slice(lastIndex, match.index)
      });
    }

    // Add link
    children.push({
      type: 'link',
      url: match[2],
      children: [{
        type: 'text',
        value: match[1]
      }]
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    children.push({
      type: 'text',
      value: text.slice(lastIndex)
    });
  }

  return children;
}
