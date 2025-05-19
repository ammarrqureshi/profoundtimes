import { createClient } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

// Define the Article interface
interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  publishDate: string | null;
  featuredImage: {
    fields: {
      file: {
        url: string;
      };
    };
  } | null;
}

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getArticles(query = ''): Promise<Article[]> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'article',
      query: query || undefined,
      order: '-fields.publishDate',
    });

    return response.items.map((item) => {
      const fields = item.fields;
      return {
        id: item.sys.id,
        title: fields.title || 'Untitled',
        slug: fields.slug || '',
        content: fields.content?.nodeType
          ? documentToPlainTextString(fields.content)
          : fields.content || 'No content available',
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

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'article',
      'fields.slug': slug,
    });

    const item = response.items[0];
    if (!item) return null;

    const fields = item.fields;
    return {
      id: item.sys.id,
      title: fields.title || 'Untitled',
      slug: fields.slug || '',
      content: fields.content || 'No content available',
      author: fields.author || 'Anonymous',
      publishDate: fields.publishDate || null,
      featuredImage: fields.featuredImage || null,
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}