import { getArticleBySlug, getArticles } from '../../../utils/contentful';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';


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

    return (
      <div className="container mx-auto p-6 max-w-3xl">
        {article.featuredImage?.fields?.file?.url && (
          <div className="mb-2 ">
            <Image
              src={`https:${article.featuredImage.fields.file.url}`}
              alt={article.title}
              width={835}
              height={35}
              className=" h-30 rounded-lg object-cover"
              priority
            />
          </div>
        )}
        
        <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
        
        <div className="flex items-center gap-4 mb-6 text-gray-600">
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
        
        <div className="prose max-w-none">
  {documentToReactComponents(article.content)}
</div>

      </div>
    );
  } catch (error) {
    console.error(`Error loading article with slug "${decodedSlug}":`, error);
    return notFound();
  }
}