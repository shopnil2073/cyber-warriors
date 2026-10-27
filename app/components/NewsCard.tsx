import React from 'react';
import Link from 'next/link';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  image?: string;
  createdAt: string;
  status: 'Published' | 'Draft';
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <div className="bg-[#121927] border border-[#1f293d] rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col h-full group shadow-lg">
      {/* Featured Image */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 font-semibold">
            CYBER WARRIORS
          </div>
        )}
        <span className="absolute top-3 left-3 bg-amber-500 text-black font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-mono">
            <span>{article.author}</span>
            <span>{article.createdAt}</span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {article.content}
          </p>
        </div>

        {/* Read More Link (Opens in New Tab) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
          <a
            href={`/news/${article.slug || article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
          >
            Read <span className="text-lg leading-none">›</span>
          </a>
        </div>
      </div>
    </div>
  );
}