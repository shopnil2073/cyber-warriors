import React from "react";
import { fetchNewsFromCloud } from "../../../utils/tournamentStore";
import SingleNewsClient from "./SingleNewsClient";

// Vercel Static Export Safe generateStaticParams
export async function generateStaticParams() {
  try {
    const allNews = await fetchNewsFromCloud();
    if (Array.isArray(allNews) && allNews.length > 0) {
      return allNews.map((article) => ({
        slug: [String(article.slug || article.id)],
      }));
    }
  } catch (error) {
    console.error("Error generating static params for build:", error);
  }

  // Fallback slug for Vercel build stability
  return [
    { slug: ["welcome"] },
    { slug: ["announcement"] }
  ];
}

export default function SingleNewsPage() {
  return <SingleNewsClient />;
}