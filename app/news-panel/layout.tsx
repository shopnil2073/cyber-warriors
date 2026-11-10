import type { Metadata } from "next";

// Admin panel Google e index hobe na
export const metadata: Metadata = {
  title: "News Panel | Cyber Warriors",
  robots: { index: false, follow: false },
};

export default function NewsPanelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
