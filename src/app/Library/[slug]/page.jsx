import { getArticles, getArticleBySlug } from '../../../utils/contentful';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-4">
        By {article.author || 'Anonymous'}
      </p>
      <div className="prose">{article.content}</div>
    </div>
  );
}