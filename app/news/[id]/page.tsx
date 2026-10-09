import React from "react";
import ArticleClient from "./ArticleClient";

// Required for Next.js output: 'export'
export async function generateStaticParams() {
  return [
    { id: "preview" }
  ];
}

export default function SingleNewsPage() {
  return <ArticleClient />;
}