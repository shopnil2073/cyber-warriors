import React from "react";
import ArticleClient from "./ArticleClient";

// Static Export (output: 'export') er build error thik korar jonno
export async function generateStaticParams() {
  return [
    { id: "default" },
  ];
}

export default function SingleNewsPage() {
  return <ArticleClient />;
}