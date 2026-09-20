import React from "react";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import "./globals.css";

export const metadata = {
  title: "Cyber Warriors Esport Portal",
  description: "Official Esport Platform for Cyber Warriors",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen relative pb-20 antialiased bg-[#0B0E14] text-white">
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