"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if current active theme is dark
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = !mounted || currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Determine Logo Image Path
  const logoSrc = isDark ? "/logo.jpg" : "/logo-light.jpg";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0B0E14] border-b border-gray-200 dark:border-[#23293A] px-4 md:px-8 py-2.5 flex justify-between items-center transition-colors duration-300">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37]/40 bg-black shrink-0">
            <Image
              key={logoSrc}
              src={logoSrc}
              alt="Cyber Warriors Logo"
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-extrabold text-base md:text-lg tracking-wider text-black dark:text-white">
            CYBER <span className="text-[#D4AF37]">WARRIORS</span>
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          {/* Header Theme Switcher Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              type="button"
              className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-[#141824] border border-gray-400 dark:border-[#23293A] p-0.5 flex items-center justify-between cursor-pointer"
              title="Toggle Dark / Light Mode"
            >
              <span className="text-[10px] z-10 pl-1">🌙</span>
              <span className="text-[10px] z-10 pr-1">☀️</span>
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#D4AF37] transition-all duration-300 ${
                  isDark ? "left-0.5" : "left-6"
                }`}
              />
            </button>
          )}

          {/* Royal Menu Drawer Trigger Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#D4AF37] hover:text-black dark:hover:text-white bg-gray-100 dark:bg-[#141824] border border-gray-300 dark:border-[#23293A] rounded-lg focus:outline-none transition-all flex items-center gap-1.5 cursor-pointer"
            aria-label="Open Royal Club Navigation"
          >
            <div className="space-y-1 w-4">
              <span className="block h-0.5 bg-current rounded"></span>
              <span className="block h-0.5 bg-current rounded"></span>
              <span className="block h-0.5 bg-current rounded"></span>
            </div>
          </button>
        </div>
      </header>

      {/* Royal Club Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </>
  );
}