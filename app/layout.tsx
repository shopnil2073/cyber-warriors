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
      <body className="min-h-screen relative pb-20 antialiased transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="w-full">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}