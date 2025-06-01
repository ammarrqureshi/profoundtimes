import Image from "next/image";

import Link from "next/link";
import { getArticles, getCategories } from "../utils/contentful"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; 

export default async function Home() {
  const articles = await getArticles(); 
  const previewArticles = articles.slice(0, 4); 
  const categories = await getCategories(); 
  const previewCategories = categories.slice(0, 4); 

  return (
    <div className="mx-auto p-1">
      <div className="mt-8">
        <h1 className="text-2xl p-0 font-bold mb-2">Library</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {previewArticles.length > 0 ? (
            previewArticles.map((article) => (
              <Card key={article.id} className="flex flex-row gap-3 p-2">
                {article.featuredImage &&
                  article.featuredImage.fields?.file?.url && (
                    <Image
                      src={`https:${article.featuredImage.fields.file.url}`}
                      alt={article.title}
                      width={120}
                      height={120}
                      className="h-35 object-cover ml-1 flex-shrink-0"
                    />
                  )}
                <div className="flex-1">
                  <CardHeader className="p-1 pl-0">
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription>
                      {article.author || "Anonymous"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-600 text-xs line-clamp-4">{article.contentPreview}</p>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <p>No articles available.</p>
          )}
        </div>
        <Link
          href="/library"
          className="mt-4 ml-350 inline-block text-blue-500 hover:underline" 
        >
          Read more...
        </Link>
      </div>

     <div className="mt-8">
  <h1 className="text-2xl font-bold mb-1">Topics</h1>
  <div className="grid grid-cols-4 gap-6 w-full">
    {previewCategories.length > 0 ? (
      previewCategories.map((category) => (
        <Card key={category.id} className="flex flex-col items-center gap-2 p-1 border border-gray-300 rounded-none w-full">
          <div className="flex-shrink-0 w-full">
            {category.featuredImage?.fields?.file?.url ? (
              <Image
                src={`https:${category.featuredImage.fields.file.url}`}
                alt={category.title}
                width={180}
                height={100}
                className="object-cover rounded-none w-full"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gray-200 rounded-none flex items-center justify-center mx-auto">
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <CardHeader className="p-0">
              <CardTitle className="text-[18px]">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-500 text-[14px]">
                {category.topics.length} Topic{category.topics.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </div>
        </Card>
      ))
    ) : (
      <p>No categories available.</p>
    )}
  </div>
  <Link
    href="/chapters"
    className="mt-4 ml-350 inline-block text-blue-500 hover:underline"
  >
    Read more...
  </Link>
</div>
</div>
  );
}
