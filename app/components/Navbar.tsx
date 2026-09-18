"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("cw_theme") || "dark";
    const darkState = savedTheme === "dark";
    setIsDark(darkState);
    applyTheme(darkState);
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem("cw_theme", nextDark ? "dark" : "light");
    applyTheme(nextDark);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B0E14] border-b border-[#23293A] px-4 md:px-8 py-2.5 flex justify-between items-center transition-colors duration-300">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37]/40 bg-black shrink-0">
            <Image
              src="/logo.jpg"
              alt="Cyber Warriors Logo"
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-extrabold text-base md:text-lg tracking-wider text-white">
            CYBER <span className="text-[#D4AF37]">WARRIORS</span>
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          {/* Header Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full bg-[#141824] border border-[#23293A] p-0.5 flex items-center justify-between cursor-pointer"
            title="Toggle Dark / Light Mode"
          >
            <span className="text-[10px] z-10 pl-1">🌙</span>
            <span className="text-[10px] z-10 pr-1">☀️</span>
            <div
              className={`absolute w-4 h-4 rounded-full bg-[#D4AF37] transition-transform duration-300 ${
                isDark ? "translate-x-0" : "translate-x-6"
              }`}
            />
          </button>

          {/* Royal Menu Drawer Trigger Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#D4AF37] hover:text-white bg-[#141824] border border-[#23293A] rounded-lg focus:outline-none transition-all flex items-center gap-1.5"
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