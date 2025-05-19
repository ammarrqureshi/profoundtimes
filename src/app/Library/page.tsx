import { getArticles } from '../../../utils/contentful';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import  SearchParams  from 'next';

export default async function Library({ searchParams }) {
  const searchQuery = searchParams.query || '';
  const articles = await getArticles(searchQuery);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Library</h1>

      <form action="/library" method="get" className="flex mb-6">
        <Input
          type="text"
          placeholder="Search..."
          name="query"
          className="mr-2 flex-grow"
          defaultValue={searchQuery}
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article.id}
              className="border border-gray-300 rounded-lg p-4"
            >
              {article.featuredImage && article.featuredImage.fields?.file?.url && (
                <img
                  src={article.featuredImage.fields.file.url}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600">By {article.author}</p>
              {article.publishDate && (
                <p className="text-gray-500 text-sm">
                  Published on{' '}
                  {new Date(article.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              <p className="mt-2 line-clamp-3">{article.content}</p>
              <a
                href={`/articles/${article.slug}`}
                className="text-blue-500 mt-2 block"
              >
                Read more
              </a>
            </div>
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </div>

      <div className="mt-6">
        <Input
          type="email"
          placeholder="Enter Email"
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
}