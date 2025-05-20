'use client'; // Mark as client component for state management

import { useState } from 'react';
import { getArticles } from '../../../utils/contentful';

export default async function Chapters() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const articles = await getArticles(selectedTopic); 

  const topics = ['History', 'Culture', 'Technology', 'Rationality', 'AI']; 

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Chapters</h1>
      <div className="mb-6">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
            className={`mr-4 px-4 py-2 rounded-md ${
              selectedTopic === topic ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
      {selectedTopic && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="border border-gray-300 rounded-lg p-4 flex flex-row-reverse text-left"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{article.title}</h3>
                  <p className="text-gray-600">By {article.author || 'Anonymous'}</p>
                  <p className="mt-2 line-clamp-3">{article.content}</p>
                </div>
                {article.featuredImage && article.featuredImage.fields?.file?.url && (
                  <img
                    src={article.featuredImage.fields.file.url}
                    alt={article.title}
                    className="w-48 h-48 object-cover rounded-md ml-4"
                  />
                )}
              </div>
            ))
          ) : (
            <p>No articles found for {selectedTopic}</p>
          )}
        </div>
      )}
      {!selectedTopic && <p className="text-gray-500">Select a topic to view articles</p>}
    </div>
  );
}