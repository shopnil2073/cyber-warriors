import React from "react";
import ArticleClient from "./ArticleClient";

// Server-side Static Export support
export async function generateStaticParams() {
  return [{ id: "preview" }];
}

export default function ArticleDetailsPage() {
  return <ArticleClient />;
}