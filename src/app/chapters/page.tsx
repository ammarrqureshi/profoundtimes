import { getArticles, getCategories } from '@/utils/contentful';
import Link from 'next/link';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ChaptersPage({ searchParams }: PageProps) {
  const selectedCategory = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category;

  const categories = await getCategories();
  const articles = selectedCategory ? await getArticles(selectedCategory) : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>

      {/* Category Filter */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/chapters?category=${encodeURIComponent(category)}`}
                className={`px-3 py-1 rounded-full border ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </div>

      {/* Articles Section - Only shown when a category is selected */}
      {selectedCategory && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Articles in: {selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/library/${article.slug}`}
                  className="block border p-4 rounded hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-1">{article.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {article.contentPreview}
                  </p>
                </Link>
              ))
            ) : (
              <p>No articles found for this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}