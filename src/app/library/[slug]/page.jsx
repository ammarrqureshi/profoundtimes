import { getArticleBySlug, getArticles } from '../../../utils/contentful';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const article = await getArticleBySlug(decodedSlug);

    if (!article) {
      return notFound();
    }

    const options = {
      renderNode: {
        [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
        [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
        [BLOCKS.BLOCKQUOTE]: (node, children) => <blockquote>{children}</blockquote>,
        [BLOCKS.TABLE]: (node, children) => <table>{children}</table>,
        [BLOCKS.TABLE_ROW]: (node, children) => <tr>{children}</tr>,
        [BLOCKS.TABLE_CELL]: (node, children) => <td>{children}</td>,
        [BLOCKS.TABLE_HEADER_CELL]: (node, children) => <th>{children}</th>,
      },
    };

    return (
      <div className="max-w-1xl mx-auto p-4 text-sm mr-80 ml-80">
        <h1 className="text-2xl font-bold mb-2">{article.title}</h1>

        <div className="flex items-center gap-4 mb-4 text-gray-600 text-xs">
          <p>{article.author || 'Anonymous'}</p>
          {article.publishDate && (
            <p>
              Published on{' '}
              {new Date(article.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {article.featuredImage?.fields?.file?.url && (
          <div className="mb-4">
            <Image
              src={`https:${article.featuredImage.fields.file.url}`}
              alt={article.title}
              width={535}
              height={250}
              className="rounded-lg object-cover w-full"
              priority
            />
          </div>
        )}

        <div className="prose prose-sm max-w-none">
          {documentToReactComponents(article.content, options)}
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error loading article with slug "${decodedSlug}":`, error);
    return notFound();
  }
}
