import { getArticles, getCategories } from '@/utils/contentful';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ChaptersPage({ searchParams }: PageProps) {
  const selectedTopic = Array.isArray(searchParams.topic)
    ? searchParams.topic[0]
    : searchParams.topic;

  const categories = await getCategories();
  const articles = selectedTopic ? await getArticles(selectedTopic) : [];

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-bold mb-4">Chapters</h1>

      <div className="mb-6">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <Card key={category.id} className="flex flex-row gap-3 p-4">
                <div className="flex-1">
                  <CardHeader className="p-1 pl-0">
                    <CardTitle className="text-[18px]">{category.title}</CardTitle>
                    <CardDescription>Explore topics in {category.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    {category.topics.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-3 w-full justify-between bg-white text-black border-gray-300 hover:bg-gray-100 text-sm font-normal"
                          >
                            Select Topic
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-[calc((100vw-2rem)/2-0.75rem)] bg-white !bg-opacity-100 shadow-lg rounded-md border border-gray-200 bg-[rgba(255,255,255,1)]">
                          {category.topics.map((topic) => (
                            <DropdownMenuItem
                              key={topic}
                              asChild
                              className="px-4 py-2 text-sm  no-underline hover:underline rounded-none focus:bg-gray-100"
                            >
                              <Link
                                href={`/chapters?topic=${encodeURIComponent(topic)}`}
                                className="w-full"
                              >
                                {topic}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <p className="text-gray-500 text-xs mt-2">No topics in this category.</p>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </div>

      {selectedTopic && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Articles in: {selectedTopic}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/library/${article.slug}`}
                  className="block no-underline text-inherit"
                >
                  <Card className="flex flex-row gap-3 p-4">
                    {article.featuredImage?.fields?.file?.url && (
                      <div className="flex-shrink-0">
                        <Image
                          src={`https:${article.featuredImage.fields.file.url}`}
                          alt={article.title}
                          width={120}
                          height={120}
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader className="p-1 pl-0">
                        <CardTitle className="text-xl">{article.title}</CardTitle>
                        <CardDescription>{article.author || 'Anonymous'}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
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
                        <p className="text-gray-600 text-xs line-clamp-4">
                          {article.contentPreview}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <p>No articles found for this topic.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}