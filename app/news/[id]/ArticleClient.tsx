import React from "react";
import ArticleClient from "./ArticleClient";

// Static Export (output: 'export') ke liye ye function zaroori hai
export async function generateStaticParams() {
  return [
    { id: "default-news" },
    { id: "siam-is-the-best-player-in-cw" },
  ];
}

export default function SingleNewsPage() {
  return <ArticleClient />;
}