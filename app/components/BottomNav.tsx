"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cw_logged_in_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.avatar) {
          setUserAvatar(parsed.avatar);
        } else {
          setUserAvatar("/logo.jpg");
        }
      } catch (e) {
        setUserAvatar("/logo.jpg");
      }
    } else {
      setUserAvatar(null);
    }
  }, [pathname]);

  const isLoggedIn = !!userAvatar;

  const navItems = [
    { label: "HOME", href: "/", type: "icon", icon: "🏠" },
    { label: "TOURNAMENT", href: "/tournament", type: "icon", icon: "🏆" },
    { label: "RANKING", href: "/ranking", type: "icon", icon: "📊" },
    { label: "NEWS", href: "/news", type: "icon", icon: "📰" },
    {
      label: isLoggedIn ? "PROFILE" : "SIGN IN",
      href: isLoggedIn ? "/profile" : "/sign-in",
      type: isLoggedIn ? "avatar" : "icon",
      icon: "👤",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14] border-t border-[#23293A] py-2 px-4 shadow-2xl">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive ? "text-[#D4AF37] scale-105" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.type === "avatar" && userAvatar ? (
                <div
                  className={`relative w-5 h-5 rounded-full overflow-hidden border ${
                    isActive ? "border-[#D4AF37]" : "border-gray-500"
                  }`}
                >
                  <Image
                    src={userAvatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-base">{item.icon}</span>
              )}

              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}