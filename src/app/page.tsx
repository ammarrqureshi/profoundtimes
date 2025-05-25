import Image from "next/image";
import { getArticles } from "../utils/contentful"; 
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
    <div className=" mx-auto p-1">
    <div className="mt-8">
      <h1 className="text-2xl p-0 font-bold mb-2">Library</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">



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
                    className="h-35 object-cover ml-1  flex-shrink-0"
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