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
    { label: "HOME", path: "/", icon: "🏠" },
    { label: "EVENT", path: "/tournament", icon: "🏆" },
    { label: "RANKING", path: "/ranking", icon: "📊" },
    { label: "NEWS", path: "/news", icon: "ℹ️" },
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
                isActive ? "text-[#D4AF37] scale-105 font-black" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold">{item.label}</span>
            </Link>
          );
        })}

        {/* Dynamic Profile / Sign In Tab */}
        <Link
          href={currentUser ? "/profile" : "/sign-in"}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            pathname === "/profile" || pathname === "/sign-in"
              ? "text-[#D4AF37] scale-105 font-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {currentUser ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md">
              <Image src={currentUser.avatar} alt="Profile" fill className="object-cover" />
            </div>
          ) : (
            <svg
              className="w-5 h-5 fill-current text-gray-300"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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