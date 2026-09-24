import React from "react";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import "./globals.css";

export const metadata = {
  title: "Cyber Warriors",
  description: "Official Club Platform for Cyber Warriors",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen relative pb-20 antialiased bg-white dark:bg-[#0B0E14] text-black dark:text-white transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="w-full">{children}</main>
          {/* Dynamic Bottom Navigation component with Profile/Sign-in auto-toggle */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}