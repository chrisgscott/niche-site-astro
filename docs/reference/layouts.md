# Layout Components Reference

This document contains reference implementations for our layout components that we'll adapt for Astro.

## Base Layouts

### 1. Base Layout Structure
```astro
---
// BaseLayout.astro
interface Props {
  title: string;
  description: string;
  keywords: string[];
  type: 'topic' | 'post' | 'article';
}

const { title, description, keywords, type } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords.join(', ')} />
    <!-- Add other meta tags -->
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 2. Topic Layout
```astro
---
// TopicLayout.astro
interface Props {
  content: CollectionEntry<'topics'>;
  relatedPosts: CollectionEntry<'posts'>[];
  relatedArticles: CollectionEntry<'articles'>[];
}

const { content, relatedPosts, relatedArticles } = Astro.props;
---

<BaseLayout {...content.data}>
  <article class="topic-content">
    <header>
      <h1>{content.data.title}</h1>
      <div class="metadata">
        <!-- Add metadata -->
      </div>
    </header>
    
    <div class="content">
      <slot />
    </div>
    
    <RelatedContent 
      posts={relatedPosts}
      articles={relatedArticles}
    />
  </article>
</BaseLayout>
```

### 3. Post Layout
```astro
---
// PostLayout.astro
interface Props {
  content: CollectionEntry<'posts'>;
  topic: CollectionEntry<'topics'>;
  relatedPosts: CollectionEntry<'posts'>[];
}

const { content, topic, relatedPosts } = Astro.props;
---

<BaseLayout {...content.data}>
  <article class="post-content">
    <BreadcrumbNav topic={topic} />
    
    <header>
      <h1>{content.data.title}</h1>
      <div class="metadata">
        <!-- Add metadata -->
      </div>
    </header>
    
    <div class="content">
      <slot />
    </div>
    
    <RelatedPosts posts={relatedPosts} />
  </article>
</BaseLayout>
```

## UI Components

### 1. Navigation Components
```astro
---
// Header.astro
const { currentPath } = Astro.props;
---

<header class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <svg><!-- Menu icon --></svg>
      </label>
      <ul class="menu menu-sm dropdown-content">
        <!-- Mobile menu items -->
      </ul>
    </div>
    <a href="/" class="btn btn-ghost normal-case text-xl">Site Name</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <!-- Desktop menu items -->
    </ul>
  </div>
  <div class="navbar-end">
    <!-- Add search, etc -->
  </div>
</header>
```

### 2. Content Components
```astro
---
// RelatedContent.astro
interface Props {
  posts?: CollectionEntry<'posts'>[];
  articles?: CollectionEntry<'articles'>[];
}

const { posts = [], articles = [] } = Astro.props;
---

<aside class="related-content">
  {posts.length > 0 && (
    <section>
      <h2>Related Posts</h2>
      <ul>
        {posts.map(post => (
          <li>
            <a href={post.slug}>{post.data.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )}
  
  {articles.length > 0 && (
    <section>
      <h2>Related Articles</h2>
      <ul>
        {articles.map(article => (
          <li>
            <a href={article.slug}>{article.data.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )}
</aside>
```

## DaisyUI Components

### 1. Card Components
```astro
---
// ContentCard.astro
interface Props {
  title: string;
  description: string;
  url: string;
  type: 'topic' | 'post' | 'article';
}

const { title, description, url, type } = Astro.props;
---

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      {title}
      <div class="badge badge-secondary">{type}</div>
    </h2>
    <p>{description}</p>
    <div class="card-actions justify-end">
      <a href={url} class="btn btn-primary">Read More</a>
    </div>
  </div>
</div>
```

### 2. Grid Layouts
```astro
---
// ContentGrid.astro
interface Props {
  items: Array<{
    title: string;
    description: string;
    url: string;
    type: 'topic' | 'post' | 'article';
  }>;
}

const { items } = Astro.props;
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <ContentCard {...item} />
  ))}
</div>
```

## Astro Integration Notes
- Convert React components to Astro
- Use client directives sparingly
- Implement proper TypeScript types
- Add proper schema.org markup
- Optimize for Core Web Vitals
