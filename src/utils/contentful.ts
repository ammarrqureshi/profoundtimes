import { createClient } from 'contentful';
import { Asset, Entry } from 'contentful'; 
  import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  publishDate: string | null;
  featuredImage: Asset | null;
  topic: string[]; 
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
  contentRaw: fields.content || null, // for full rendering
  contentPreview: fields.content
    ? documentToPlainTextString(fields.content).slice(0, 300)
    : 'No content available',
  author: fields.author || 'Anonymous',
  publishDate: fields.publishDate || null,
  featuredImage: fields.featuredImage || null,
};


    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'article',
      select: 'fields.topic',
    });

    const allTopics = response.items.flatMap((item: Entry<any>) => {
      const topic = item.fields.topic;

      // CASE 1: topic is an array of strings
      if (Array.isArray(topic)) return topic;

      // CASE 2: topic is a single string
      if (typeof topic === 'string') return [topic];

      // CASE 3: topic is undefined or something else
      return [];
    });

    return Array.from(new Set(allTopics));
  } catch (error) {
    console.error('Error fetching categories:', error);
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
  content: fields.content || null, // raw rich text for full rendering
  author: fields.author || 'Anonymous',
  publishDate: fields.publishDate || null,
  featuredImage: fields.featuredImage || null,
};

  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
} 