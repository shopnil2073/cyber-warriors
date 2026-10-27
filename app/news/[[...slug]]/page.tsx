import React from "react";
import SingleNewsClient from "./SingleNewsClient";
import NewsPageClient from "../NewsPageClient"; // <-- '../' এর জায়গায় './' হবে

// Next.js Static Export error এড়াতে Catch-all fallback params
export async function generateStaticParams() {
  return [{ slug: [] }];
}

export default async function NewsCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug;

  // যদি URL শুধু /news হয়, তবে All News Grid দেখাবে
  if (!slugArray || slugArray.length === 0) {
    return <NewsPageClient />;
  }

  // যদি URL /news/something হয়, তবে Single Article View দেখাবে
  return <SingleNewsClient />;
}