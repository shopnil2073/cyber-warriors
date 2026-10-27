import React from "react";
import { fetchNewsFromCloud } from "../../../utils/tournamentStore";
import SingleNewsClient from "./SingleNewsClient";

// Next.js static export error সমাধান করতে ক্লাউডের সব slug জেনারেট করা হচ্ছে
export async function generateStaticParams() {
  try {
    const allNews = await fetchNewsFromCloud();
    if (Array.isArray(allNews) && allNews.length > 0) {
      return allNews.map((article) => ({
        slug: [String(article.slug || article.id)],
      }));
    }
  } catch (error) {
    console.error("Error generating static params:", error);
  }

  // Fallback for build time
  return [{ slug: ["welcome"] }];
}

export default function SingleNewsPage() {
  return <SingleNewsClient />;
}