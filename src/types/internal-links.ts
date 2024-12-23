export interface InternalLinkConfig {
  keywords: {
    [keyword: string]: {
      primary: string;
      related: string[];
    }
  };
  urls: {
    [url: string]: {
      title: string;
      type: 'topic' | 'post' | 'article';
    }
  };
}
