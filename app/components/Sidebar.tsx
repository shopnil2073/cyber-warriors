"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getActiveUser } from "../../utils/userStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Sidebar({ isOpen, onClose, isDark, toggleTheme }: SidebarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [hasCommandCenterAccess, setHasCommandCenterAccess] = useState<boolean>(false);

  const SUPER_ADMIN_EMAIL = "shopnilhossainhim@gmail.com";
  const ALLOWED_ADMIN_EMAILS = [
    "razibulislamhridoy@gmail.com",
    "samiaakter2073@gmail.com",
    "hmmamun2010@gmail.com",
    "tanjimuddin1437@gmail.com",
    "mdharunanwer@gmail.com",
    "akasharsenal14@gmail.com",
    "samiulakter2075@gmail.com",
  ];

  const checkUserAccess = useCallback(() => {
    const activeUser = getActiveUser();

    if (activeUser && activeUser.email) {
      if (activeUser.name) {
        const nameParts = activeUser.name.trim().split(" ");
        setUserName(nameParts[nameParts.length - 1]);
      } else {
        setUserName(null);
      }

      const userEmail = activeUser.email.toLowerCase().trim();

      if (userEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setHasCommandCenterAccess(true);
        return;
      }

      const isAllowedAdmin = ALLOWED_ADMIN_EMAILS.map((e) =>
        e.toLowerCase().trim()
      ).includes(userEmail);

      setHasCommandCenterAccess(isAllowedAdmin);
    } else {
      setUserName(null);
      setHasCommandCenterAccess(false);
    }
  }, []);

  useEffect(() => {
    checkUserAccess();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cw_active_user") {
        checkUserAccess();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isOpen, checkUserAccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E14] text-white overflow-y-auto w-full h-full animate-fadeIn">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col min-h-screen justify-between">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-[#23293A] mb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37]">
                <Image src="/logo.jpg" alt="CW Logo" fill className="object-cover" />
              </div>
              <h2 className="font-extrabold text-lg md:text-xl tracking-widest text-[#D4AF37] uppercase">
                CYBER WARRIORS
              </h2>
            </div>
            
            <button 
              onClick={onClose} 
              className="text-[#D4AF37] hover:text-white text-3xl font-bold p-2 transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#121624] p-4 rounded-xl border border-[#23293A] mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xl">👑</span>
              <span className="font-extrabold text-sm md:text-base tracking-wider text-[#D4AF37] uppercase">
                {userName ? `WELCOME, ${userName}` : "WELCOME TO CW"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-[#0B0E14] border border-[#23293A] hover:border-[#D4AF37] transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? "🌙" : "☀️"}
            </button>
          </div>

          <div className="bg-[#121624] rounded-2xl p-4 md:p-5 border border-[#23293A] mb-6 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
              MY CALENDAR
            </span>
            <Link 
              href="/my-matches" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                  🎮
                </div>
                <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">
                  My Matches
                </span>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>
          </div>

          <div className="bg-[#121624] rounded-2xl p-4 md:p-5 border border-[#23293A] mb-6 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
              COMPETE & PLAY
            </span>
            
            <Link 
              href="/tournament" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base">
                  🥷
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Solo</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                </div>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>

            <Link 
              href="/tournament" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base">
                  👨‍👩‍👦
                </div>
                <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Team-Up</span>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>

            <Link 
              href="/tournament" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base">
                  🎮
                </div>
                <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Friendly</span>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>
          </div>

          <div className="bg-[#121624] rounded-2xl p-4 md:p-5 border border-[#23293A] space-y-3 mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
              EXPLORE
            </span>
            
            <Link 
              href="/news" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                  ⚡
                </div>
                <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">News & Updates</span>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>

            <Link 
              href="/ranking" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                  🎖️
                </div>
                <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Leaderboards</span>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>

            <Link 
              href="/players" 
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                  👥
                </div>
                <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Teams</span>
              </div>
              <span className="text-gray-500 group-hover:text-white text-lg">›</span>
            </Link>
          </div>

          {hasCommandCenterAccess && (
            <div className="bg-[#121624] rounded-2xl p-4 md:p-5 border border-[#D4AF37]/40 space-y-3 mb-8 shadow-lg animate-fadeIn">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2 mb-2">
                <span>⚡</span> COMMAND CENTER
              </span>
              
              <Link 
                href="/admin" 
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                    📟
                  </div>
                  <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Admin Console</span>
                </div>
                <span className="text-gray-500 group-hover:text-white text-lg">›</span>
              </Link>

              <Link 
                href="/matchday" 
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                    📋
                  </div>
                  <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">Matchday Management</span>
                </div>
                <span className="text-gray-500 group-hover:text-white text-lg">›</span>
              </Link>

              <Link 
                href="/news-panel" 
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A2035] transition-all group border border-transparent hover:border-[#D4AF37]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center text-base text-[#D4AF37]">
                    ✍️
                  </div>
                  <span className="font-extrabold text-sm md:text-base text-white group-hover:text-[#D4AF37]">News Panel</span>
                </div>
                <span className="text-gray-500 group-hover:text-white text-lg">›</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}