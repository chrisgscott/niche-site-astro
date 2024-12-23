import { getCollection } from 'astro:content';
import { internalLinker } from '../src/utils/internal-linking';
import fs from 'fs';
import path from 'path';

async function updateInternalLinks() {
  // Update links for posts
  const posts = await getCollection('posts');
  posts.forEach(post => {
    const keywords = post.data.keywords || [];
    internalLinker.updateInternalLinksForContent(
      'post', 
      post.slug, 
      post.data.title, 
      keywords
    );
  });

  // Update links for articles
  const articles = await getCollection('articles');
  articles.forEach(article => {
    const keywords = article.data.keywords || [];
    internalLinker.updateInternalLinksForContent(
      'article', 
      article.slug, 
      article.data.title, 
      keywords
    );
  });

  // Update links for topics
  const topics = await getCollection('topics');
  topics.forEach(topic => {
    const keywords = topic.data.keywords || [];
    internalLinker.updateInternalLinksForContent(
      'topic', 
      topic.slug, 
      topic.data.title, 
      keywords
    );
  });

  console.log('Internal links updated successfully!');
}

// Run the update
updateInternalLinks().catch(console.error);
