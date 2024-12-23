import fs from 'node:fs';
import path from 'node:path';
import internalLinksData from '../content/_data/internal_links.json';

export interface InternalLink {
  primary: string;
  related: string[];
}

export interface UrlMetadata {
  title: string;
  type: 'posts' | 'articles' | 'topics';
}

export interface LinkSuggestion {
  keyword: string;
  url: string;
  isRelated: boolean;
}

export class InternalLinker {
  private links: Record<string, InternalLink>;
  private urls: Record<string, UrlMetadata>;
  private currentUrl: string;
  private usedLinks: Set<string> = new Set();
  private maxLinksPerKeyword: number;
  private maxLinksPerParagraph: number;

  constructor(
    currentUrl: string = '',
    options: { 
      maxLinksPerKeyword?: number, 
      maxLinksPerParagraph?: number 
    } = {}
  ) {
    console.log('🔧 InternalLinker Initialization');
    console.log('Current Page URL:', currentUrl);
    
    // Validate and convert URLs to correct type
    const validatedUrls: Record<string, UrlMetadata> = {};
    for (const [url, metadata] of Object.entries(internalLinksData.urls)) {
      // Determine type based on URL prefix
      const type = url.startsWith('/posts') ? 'posts' :
                   url.startsWith('/articles') ? 'articles' :
                   url.startsWith('/topics') ? 'topics' :
                   'posts'; // default fallback

      validatedUrls[url] = {
        title: metadata.title,
        type: type
      };
    }

    console.log('📋 Available Keywords:', Object.keys(internalLinksData.keywords));
    console.log('🌐 Available URLs:', Object.keys(validatedUrls));

    this.links = internalLinksData.keywords;
    this.urls = validatedUrls;
    this.currentUrl = currentUrl;
    this.maxLinksPerKeyword = options.maxLinksPerKeyword || 1;
    this.maxLinksPerParagraph = options.maxLinksPerParagraph || 2;
  }

  /**
   * Find potential internal links for a given text
   * @param text The text to find links for
   * @returns Array of link suggestions
   */
  private findLinkSuggestions(text: string): LinkSuggestion[] {
    console.log('🔍 Finding link suggestions');
    console.log('Current Page URL:', this.currentUrl);
    console.log('Text to process:', text.substring(0, 200) + '...');

    const suggestions: LinkSuggestion[] = [];
    
    for (const [keyword, links] of Object.entries(this.links)) {
      // More flexible keyword matching
      const regex = new RegExp(keyword, 'gi');
      if (regex.test(text)) {
        console.log(`✅ Keyword found: "${keyword}"`);
        
        // Add primary link
        suggestions.push({
          keyword,
          url: links.primary,
          isRelated: false
        });
        
        // Add related links
        for (const related of links.related) {
          suggestions.push({
            keyword,
            url: related,
            isRelated: true
          });
        }
      }
    }
    
    console.log(`📊 Total suggestions found: ${suggestions.length}`);
    return suggestions;
  }

  /**
   * Check if we should skip adding this link
   */
  private shouldSkipLink(url: string): boolean {
    console.log('🚫 Checking link:', url);
    console.log('Current Page URL:', this.currentUrl);

    // More robust self-link detection
    const isSelfLink = 
      this.currentUrl === url || 
      (this.currentUrl && this.currentUrl.endsWith(url)) || 
      (url && url.endsWith(this.currentUrl)) ||
      (this.currentUrl && url.includes(this.currentUrl.replace(/^https?:\/\/[^/]+/, ''))) ||
      (url && this.currentUrl.includes(url.replace(/^https?:\/\/[^/]+/, '')));

    if (isSelfLink) {
      console.log('❌ Self-link detected, skipping');
      return true;
    }

    // Limit links per URL
    const urlCount = Array.from(this.usedLinks).filter(u => u === url).length;
    const shouldSkip = urlCount >= this.maxLinksPerKeyword;
    
    console.log(`🔗 URL usage count: ${urlCount}`);
    console.log(`🚧 Should skip link: ${shouldSkip}`);

    return shouldSkip;
  }

  /**
   * Preserve the original capitalization of a word
   * @param original Original word
   * @param replacement Replacement word
   * @returns Replacement word with same capitalization as original
   */
  private preserveCapitalization(original: string, replacement: string): string {
    if (!original || !replacement) return replacement;

    // Fully uppercase
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    }

    // First letter capitalized
    if (original[0] === original[0].toUpperCase() && 
        original.slice(1) === original.slice(1).toLowerCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
    }

    // Lowercase
    if (original === original.toLowerCase()) {
      return replacement.toLowerCase();
    }

    // Mixed case, return as-is
    return replacement;
  }

  /**
   * Generate internal links for a piece of content
   * @param text The content text
   * @param currentUrl The URL of the current page to prevent self-linking
   * @returns Text with internal links inserted
   */
  generateInternalLinks(text: string, currentUrl: string = ''): string {
    console.log('🔗 Generating Internal Links');
    console.log('Current Page URL:', currentUrl);
    console.log('Text to process:', text.substring(0, 200) + '...');

    // Reset used links for this text
    this.usedLinks.clear();
    this.currentUrl = currentUrl;
    let linkedText = text;
    let linksAdded = 0;

    // Ignore text that already contains markdown links
    if (/\[.*\]\(.*\)/.test(text)) {
      console.log('⏩ Skipping: Text already contains markdown links');
      return text;
    }

    // Find potential links
    const suggestions = this.findLinkSuggestions(text);
    
    // Sort and filter suggestions
    const sortedSuggestions = suggestions
      .filter(suggestion => {
        const shouldKeep = !this.shouldSkipLink(suggestion.url);
        console.log(`🧐 Suggestion: ${suggestion.keyword} (${suggestion.url}) - ${shouldKeep ? 'KEEP' : 'SKIP'}`);
        return shouldKeep;
      })
      .sort((a, b) => b.keyword.length - a.keyword.length);

    console.log(`📊 Filtered suggestions: ${sortedSuggestions.length}`);

    // Track used keywords to prevent multiple replacements
    const usedKeywords = new Set<string>();

    for (const suggestion of sortedSuggestions) {
      // Stop if max links per paragraph reached
      if (linksAdded >= this.maxLinksPerParagraph) {
        console.log('🛑 Max links per paragraph reached');
        break;
      }

      // Skip if keyword already used
      if (usedKeywords.has(suggestion.keyword.toLowerCase())) {
        console.log(`🚫 Keyword already used: ${suggestion.keyword}`);
        continue;
      }

      // Create markdown link with preserved capitalization
      const regex = new RegExp(`\\b(${suggestion.keyword})\\b(?![\\]\\(])`, 'i');
      const newText = linkedText.replace(regex, (match, keyword) => {
        const preservedKeyword = this.preserveCapitalization(keyword, suggestion.keyword);
        const linkMarkdown = `[${preservedKeyword}](${suggestion.url})`;
        
        console.log(`✅ Inserted link: [${preservedKeyword}](${suggestion.url})`);
        return linkMarkdown;
      });
      
      // Update text if link was inserted
      if (newText !== linkedText) {
        linkedText = newText;
        this.usedLinks.add(suggestion.url);
        usedKeywords.add(suggestion.keyword.toLowerCase());
        linksAdded++;
      }
    }

    console.log('✨ Final linked text:', linkedText.substring(0, 200) + '...');
    console.log(`🔢 Total links added: ${linksAdded}`);

    return linkedText;
  }

  /**
   * Get related content suggestions for the current page
   */
  getRelatedContent(): Array<{url: string; title: string; type: string}> {
    // If no current URL is set, return empty array
    if (!this.currentUrl) return [];

    // Find related links based on keywords
    const relatedUrls: string[] = [];
    
    // Check all keywords for links related to current URL
    for (const [, linkData] of Object.entries(this.links)) {
      if (linkData.primary === this.currentUrl) {
        // Add related links from this keyword set
        relatedUrls.push(...linkData.related);
      }
    }

    // Convert to content suggestions
    return relatedUrls
      .map(url => ({
        url,
        title: this.urls[url]?.title || 'Untitled',
        type: this.urls[url]?.type || 'unknown'
      }))
      .slice(0, 3); // Limit to 3 related items
  }
}

// Export a singleton instance for easy use
export const internalLinker = new InternalLinker();
