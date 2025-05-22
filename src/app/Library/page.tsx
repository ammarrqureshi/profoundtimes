import { getArticles } from '../../../utils/contentful';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import Link from 'next/link'; // Import Link

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
      <h1 className="text-3xl font-bold mb-4">Library</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition"> 
                {article.featuredImage && article.featuredImage.fields?.file?.url && (
                  <CardHeader className="p-0">
                    <img
                      src={article.featuredImage.fields.file.url}
                      alt={article.title}
                      className="w-full h-28 object-cover rounded-md mb-1"
                    />
                  </CardHeader>
                )}
                <CardContent className="p-2">
                  <CardTitle className="text-lg font-semibold">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    By {article.author}
                  </CardDescription>
                  {article.publishDate && (
                    <p className="text-gray-500 text-xs">
                      Published on{' '}
                      {new Date(article.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm">{article.content}</p>
                </CardContent>
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