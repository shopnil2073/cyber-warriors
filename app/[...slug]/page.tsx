import React, { Suspense } from "react";
import SingleNewsClient from "./SingleNewsClient";

// Static Export Config
export async function generateStaticParams() {
  return [
    { slug: ["preview"] }
  ];
}

export default function SingleNewsPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-12 font-mono text-xs">Loading Article...</div>}>
      <SingleNewsClient />
    </Suspense>
  );
}