"use client";

import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0D14] border-t border-[#1E2330] py-10 px-4 mt-auto transition-colors duration-300 text-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-5">
        
        {/* Logo & Club Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-black shadow-md">
            <Image src="/logo.jpg" alt="Cyber Warriors Logo" fill className="object-cover" />
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-widest text-[#D4AF37] uppercase font-serif">
            CYBER WARRIORS
          </h2>
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-gray-400 uppercase">
            Fight for glory...
          </p>
        </div>

        {/* Social Action Buttons (Always Dark TRC-BD Style) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          
          {/* Facebook Page Button */}
          <a
            href="https://www.facebook.com/profile.php?id=100077383658932"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#0F131C] border border-[#23293A] hover:border-[#D4AF37] text-white font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 group"
          >
            <svg
              className="w-4 h-4 fill-white group-hover:fill-[#D4AF37] transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>PAGE</span>
          </a>

          {/* Facebook Group Button */}
          <a
            href="https://www.facebook.com/groups/501632021061456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#0F131C] border border-[#23293A] hover:border-[#D4AF37] text-white font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 group"
          >
            <svg
              className="w-4 h-4 fill-white group-hover:fill-[#D4AF37] transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span>GROUP</span>
          </a>

          {/* Discord Button */}
          <a
            href="https://discord.gg/aAxBwSBKm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#0F131C] border border-[#23293A] hover:border-[#D4AF37] text-white font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 group"
          >
            <svg
              className="w-4 h-4 fill-white group-hover:fill-[#D4AF37] transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>DISCORD</span>
          </a>

        </div>

        {/* Copyright Line */}
        <div className="text-[10px] text-gray-500 font-medium pt-4 border-t border-[#1E2330] w-full max-w-xs">
          © {new Date().getFullYear()} CYBER WARRIORS. ALL RIGHTS RESERVED.
        </div>

      </div>
    </footer>
  );
}