import Image from "next/image";
import { getArticles } from "../../utils/contentful"; 
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

  return (
    <div className="container mx-auto p-2">
    <div className="mt-8">
      <h1 className="text-3xl p-2 font-bold mb-4">Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previewArticles.length > 0 ? (
          previewArticles.map((article) => (
            <Card key={article.id} className="flex flex-row gap-3 p-4">
              {article.featuredImage &&
                article.featuredImage.fields?.file?.url && (
                  <Image
                    src={`https:${article.featuredImage.fields.file.url}`}
                    alt={article.title}
                    width={120}
                    height={120}
                    className="object-cover ml-1  flex-shrink-0"
                  />
                )}
              <div className="flex-1">
                <CardHeader className="p-2 pl-0">
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>
                     {article.author || "Anonymous"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-600 line-clamp-3">{article.content}</p>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <p>No articles available.</p>
        )}
      </div>
      <a
        href="/library"
        className="mt-4 ml-350 inline-block text-blue-500 hover:underline" 
      >
        Read more...
      </a>
    </div>
    </div>
  );
}