import Image from "next/image";
import { getArticles } from "../../utils/contentful"; // Adjust the import path as needed

export default async function Home() {
  const articles = await getArticles(); // Fetch all articles
  const previewArticles = articles.slice(0, 4); // Show only the first 4 articles as a preview

  return (
    <div className="mt-8">
      <div className="mt-8">
        <h1 className="text-3xl p-4 font-bold mb-4">Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewArticles.length > 0 ? (
            previewArticles.map((article) => (
              <div
                key={article.id}
                className="border border-gray-300 rounded-lg p-4 flex text-left"
              >
                {article.featuredImage && article.featuredImage.fields?.file?.url && (
                  <img
                    src={article.featuredImage.fields.file.url}
                    alt={article.title}
                    className="w-35 h-35 object-cover rounded-md mr-4"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{article.title}</h3>
                  <p className="text-gray-600">By {article.author || "Anonymous"}</p>
                  <p className="mt-2 line-clamp-3">{article.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No articles available.</p>
          )}
        </div>
        <a
          href="/library"
          className="mt-4  ml-400 inline-block text-blue-500 hover:underline" // Fixed ml-400 to ml-4
        >
          Read more...
        </a>
      </div>
    </div>
  );
}