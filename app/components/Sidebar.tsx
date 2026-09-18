"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Sidebar({ isOpen, onClose, isDark, toggleTheme }: SidebarProps) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("cw_user_name"); 
    if (storedUser) {
      const nameParts = storedUser.trim().split(" ");
      const lastName = nameParts[nameParts.length - 1];
      setUserName(lastName);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Sidebar Drawer */}
      <div className="relative w-full max-w-sm bg-[#0B0E14] text-white h-full p-6 border-l border-[#23293A] flex flex-col justify-between z-10 overflow-y-auto shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-[#23293A] mb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]">
                <Image src="/logo.jpg" alt="CW Logo" fill className="object-cover" />
              </div>
              <h2 className="font-extrabold text-base tracking-widest text-[#D4AF37] uppercase">
                CYBER WARRIORS
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-[#D4AF37] hover:text-white text-xl font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* User Welcome & Theme Switcher */}
          <div className="flex items-center justify-between bg-[#121624] p-3.5 rounded-xl border border-[#23293A] mb-6">
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <span className="font-extrabold text-xs tracking-wider text-[#D4AF37] uppercase">
                {userName ? `WELCOME, ${userName}` : "WELCOME TO CW"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#0B0E14] border border-[#23293A] hover:border-[#D4AF37] transition-all"
              title="Toggle Theme"
            >
              {isDark ? "🌙" : "☀️"}
            </button>
          </div>

          {/* MY CALENDAR Section */}
          <div className="bg-[#121624] rounded-2xl p-4 border border-[#23293A] mb-6 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
              MY CALENDAR
            </span>
            <Link
              href="/my-matches"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm text-[#D4AF37]">
                  🎮
                </div>
                <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">
                  My Matches
                </span>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>
          </div>

          {/* COMPETE & PLAY Section */}
          <div className="bg-[#121624] rounded-2xl p-4 border border-[#23293A] mb-6 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
              COMPETE & PLAY
            </span>
            <Link
              href="/tournament"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm">
                  🥷
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">Solo</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>

            <Link
              href="/tournament"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm">
                  👨‍👩‍👦
                </div>
                <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">Team-Up</span>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>

            <Link
              href="/tournament"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm">
                  🎮
                </div>
                <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">Friendly</span>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>
          </div>

          {/* EXPLORE Section */}
          <div className="bg-[#121624] rounded-2xl p-4 border border-[#23293A] space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
              EXPLORE
            </span>
            <Link
              href="/news"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm text-[#D4AF37]">
                  ⚡
                </div>
                <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">News & Updates</span>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>

            <Link
              href="/ranking"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm text-[#D4AF37]">
                  🎖️
                </div>
                <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">Leaderboards</span>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>

            <Link
              href="/players"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A2035] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-sm text-[#D4AF37]">
                  👥
                </div>
                <span className="font-extrabold text-sm text-white group-hover:text-[#D4AF37]">Teams</span>
              </div>
              <span className="text-gray-500 group-hover:text-white">›</span>
            </Link>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-6 border-t border-[#23293A] mt-6">
          <Link
            href="/sign-in"
            onClick={onClose}
            className="w-full block text-center py-2.5 rounded-xl font-black text-xs uppercase tracking-widest bg-[#D4AF37] text-black hover:brightness-110 transition-all"
          >
            {userName ? "LOGOUT" : "SIGN IN TO ACCOUNT"}
          </Link>
        </div>
      </div>
    </div>
  );
}