"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14] border-t border-[#23293A] py-2.5 px-2">
        <div className="w-full flex justify-between items-center h-9" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-t border-[#23293A] py-2 px-2">
      <div className="w-full flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                "flex-1 flex flex-col items-center justify-center py-1 transition-all " +
                (isActive ? "text-[#D4AF37] scale-105" : "text-gray-400 hover:text-white")
              }
            >
              {item.type === "avatar" && userAvatar ? (
                <div
                  className={
                    "relative w-5 h-5 rounded-full overflow-hidden border " +
                    (isActive ? "border-[#D4AF37]" : "border-gray-500")
                  }
                >
                  <Image
                    src={userAvatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-lg leading-none">{item.icon}</span>
              )}

              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider mt-1 text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}