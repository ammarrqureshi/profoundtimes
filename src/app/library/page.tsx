import { getArticles } from '../../utils/contentful';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from '../../components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface LibraryPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Library({ searchParams }: LibraryPageProps) {
  const searchQuery = Array.isArray(searchParams.query)
    ? searchParams.query[0] || ''
    : searchParams.query || '';
  const articles = await getArticles(searchQuery);

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-bold mb-4">Library</h1>

      <form action="/library" method="get" className="flex mb-2">
        <Input
          type="text"
          placeholder="Search..."
          name="query"
          className="mr-2 flex-grow"
          defaultValue={searchQuery}
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/library/${article.slug}`}
              className="block no-underline text-inherit"
            >
              <Card className="border border-gray-300 rounded-md p-3 hover:bg-gray-50 transition flex flex-row gap-3 items-start">
                {article.featuredImage?.fields?.file?.url && (
                  <div className="w-[80px] h-[80px] flex-shrink-0">
                    <Image
                      src={`https:${article.featuredImage.fields.file.url}`}
                      alt={article.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardHeader className="p-1 pl-0">
                    <CardContent className="p-0">
                      <CardTitle className="text-sm font-semibold">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-[11px]">
                        {article.author}
                      </CardDescription>
                      {article.publishDate && (
                        <p className="text-gray-500 text-[10px]">
                          Published on{' '}
                          {new Date(article.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      <p className="mt-1 line-clamp-3 text-[11px] text-gray-700">
                        {article.contentPreview}
                      </p>
                    </CardContent>
                  </CardHeader>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
}
