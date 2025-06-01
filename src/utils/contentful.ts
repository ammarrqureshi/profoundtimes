import { createClient, type Asset, type Entry } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  author: string;
  publishDate: string | null;
  featuredImage: Asset | null;
  topics: string[];
  contentPreview: string | null;
}

interface Category {
  featuredImage: Asset | null;
  id: string;
  title: string;
  topics: string[];
}

if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('Missing Contentful environment variables: NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN must be defined');
}

export const contentfulClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export async function getArticles(searchTerm?: string): Promise<Article[]> {
  try {
    let topicId: string | undefined;

    if (searchTerm) {
      const topicRes = await contentfulClient.getEntries({
        content_type: 'topic',
        'fields.name': searchTerm,
        limit: 1,
      });

      if (topicRes.items.length > 0) {
        topicId = topicRes.items[0].sys.id;
      }
    }

    const queryOptions: any = {
      content_type: 'article',
      include: 3,
    };

    if (topicId) {
      queryOptions['fields.topics.sys.id[in]'] = topicId;
    } else if (searchTerm) {
      queryOptions.query = searchTerm;
    }

    const response = await contentfulClient.getEntries(queryOptions);

    return response.items.map((item: Entry<any>) => {
      const fields = item.fields as {
        title?: string;
        slug?: string;
        content?: any;
        author?: string;
        publishDate?: string;
        featuredImage?: Asset;
        topics?: any[];
      };

      const topics: string[] = fields.topics
        ? fields.topics
            .map((t) => {
              const name = t?.fields?.name;
              return typeof name === 'string' ? name : '';
            })
            .filter((t) => t.trim() !== '')
        : [];

      return {
        id: item.sys.id,
        title: fields.title || 'Untitled',
        slug: fields.slug || '',
        content: fields.content || null,
        contentPreview: fields.content
          ? documentToPlainTextString(fields.content).slice(0, 300)
          : 'No content available',
        author: fields.author || 'Anonymous',
        publishDate: fields.publishDate || null,
        featuredImage: fields.featuredImage || null,
        topics,
      };
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'category',
      include: 3,
      limit: 1000,
    });

    console.log('Categories response:', JSON.stringify(response.items, null, 2));

    const categories = response.items.map((item: Entry<any>) => {
      const fields = item.fields as {
        title?: string;
        topics?: any[];
        featuredImage?: Asset;
      };

      const topics: string[] = fields.topics
        ? fields.topics
            .map((t) => {
              const name = t?.fields?.name;
              return typeof name === 'string' ? name : '';
            })
            .filter((t) => t.trim() !== '')
        : [];

      return {
        id: item.sys.id,
        title: fields.title || 'Untitled',
        topics,
        featuredImage: fields.featuredImage || null,
      };
    });

    console.log('Extracted categories:', JSON.stringify(categories, null, 2));

    return categories;
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
      include: 3,
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
      topic?: any[] | string;
      topics?: any[];
    };

    const topicFromTopic = fields.topic
      ? Array.isArray(fields.topic)
        ? fields.topic.map((t) =>
            typeof t === 'string' ? t : (typeof t?.fields?.name === 'string' ? t.fields.name : '')
          )
        : typeof fields.topic === 'string'
        ? [fields.topic]
        : []
      : [];

    const topicFromTopics = fields.topics
      ? fields.topics
          .map((t) => {
            const name = t?.fields?.name;
            return typeof name === 'string' ? name : '';
          })
          .filter((t) => t.trim() !== '')
      : [];

    const topics: string[] = Array.from(new Set([...topicFromTopic, ...topicFromTopics]));

    return {
      id: item.sys.id,
      title: fields.title || 'Untitled',
      slug: fields.slug || '',
      content: fields.content || null,
      contentPreview: fields.content
        ? documentToPlainTextString(fields.content).slice(0, 300)
        : 'No content available',
      author: fields.author || 'Anonymous',
      publishDate: fields.publishDate || null,
      featuredImage: fields.featuredImage || null,
      topics,
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}
