"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getActiveUser, UserProfile } from "../utils/userStore";

export default function BottomNav() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getActiveUser());
    };

    syncUser();

    // Listen to local session updates
    window.addEventListener("storage", syncUser);
    window.addEventListener("cw_auth_change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("cw_auth_change", syncUser);
    };
  }, [pathname]);

  const navItems = [
    {
      label: "HOME",
      path: "/",
      icon: (
        <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "EVENT",
      path: "/tournament",
      icon: (
        <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
          <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
      ),
    },
    {
      label: "RANKING",
      path: "/ranking",
      icon: (
        <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      label: "NEWS",
      path: "/news",
      icon: (
        <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9" />
          <path d="M7 8h6" />
          <path d="M7 12h6" />
          <path d="M7 16h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E121B]/95 backdrop-blur-md border-t border-[#23293A] py-2 px-2 shadow-2xl w-full">
      <div className="w-full flex items-center justify-between max-w-6xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
                isActive
                  ? "text-[#D4AF37] scale-105 font-black drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-center">{item.icon}</div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold">{item.label}</span>
            </Link>
          );
        })}

        {/* Dynamic Profile / Sign In Tab */}
        <Link
          href={currentUser ? "/profile" : "/sign-in"}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            pathname === "/profile" || pathname === "/sign-in"
              ? "text-[#D4AF37] scale-105 font-black drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {currentUser ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md">
              <Image src={currentUser.avatar} alt="Profile" fill className="object-cover" />
            </div>
          ) : (
            <svg
              className="w-5 h-5 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
          <span className="text-[9px] uppercase tracking-wider font-extrabold">
            {currentUser ? "PROFILE" : "SIGN IN"}
          </span>
        </Link>
      </div>
    </div>
  );
}