import { createClient } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { Asset, Entry } from 'contentful'; 


interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  publishDate: string | null;
  featuredImage: Asset | null;
  topic: string[]; // Assuming topic is an array of strings
}

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getArticles(topic?: string): Promise<Article[]> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'article',
      'fields.topic': topic || undefined, // Filter by topic if provided
      order: '-fields.publishDate',
    });

    return response.items.map((item: Entry<any>) => {
      const fields = item.fields as {
        title?: string;
        slug?: string;
        content?: any;
        author?: string;
        publishDate?: string;
        featuredImage?: Asset;
        topic?: string[];
      };

      return {
        id: item.sys.id,
        title: fields.title || 'Untitled',
        slug: fields.slug || '',
        content: fields.content ? documentToPlainTextString(fields.content) : 'No content available',
        author: fields.author || 'Anonymous',
        publishDate: fields.publishDate || null,
        featuredImage: fields.featuredImage || null,
        topic: fields.topic || [],
      };
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'article',
      'fields.slug': slug,
    });

    const item = response.items[0] as Entry<any> | undefined;
    if (!item) return null;

    const fields = item.fields as {
      title?: string;
      slug?: string;
      content?: any; 
      author?: string;
      publishDate?: string;
      featuredImage?: Asset;
    };

    return {
      id: item.sys.id,
      title: fields.title || 'Untitled',
      slug: fields.slug || '',
      content: fields.content
        ? documentToPlainTextString(fields.content)
        : 'No content available',
      author: fields.author || 'Anonymous',
      publishDate: fields.publishDate || null,
      featuredImage: fields.featuredImage || null,
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}