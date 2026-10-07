import ArticleClient from "./ArticleClient";

export async function generateStaticParams() {
  return [{ id: "preview" }];
}

export default function SingleNewsPage() {
  return <ArticleClient />;
}