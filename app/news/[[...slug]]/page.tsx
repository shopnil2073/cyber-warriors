import React from "react";
import SingleNewsClient from "./SingleNewsClient";
import NewsPageClient from "./NewsPageClient";

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

  if (!slugArray || slugArray.length === 0) {
    return <NewsPageClient />;
  }

  return <SingleNewsClient />;
}