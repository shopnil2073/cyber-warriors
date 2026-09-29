"use client";

import React from "react";
import { UserProfile } from "../../utils/userStore";

interface InfoTabProps {
  currentUser: UserProfile;
  isOwnProfile?: boolean;
}

export default function InfoTab({ currentUser, isOwnProfile = false }: InfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
          <span>🎮</span> GAME SPECS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
            <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
              KONAMI UID
            </span>
            <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
              {currentUser.konamiId || "Not Provided"}
            </h4>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
            <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
              DEVICE
            </span>
            <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
              {currentUser.hardware || "Not Provided"}
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
          <span>👤</span> PROFILE DATA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
            <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
              LOCATION
            </span>
            <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
              {currentUser.location || "Not Set"}
            </h4>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
            <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase flex items-center gap-1">
              <span>🩸</span> BLOOD GROUP
            </span>
            <h4
              className={`text-xs md:text-sm mt-1 ${
                currentUser.bloodGroup && currentUser.bloodGroup !== "Not Set"
                  ? "text-red-500 font-black"
                  : "text-[var(--text-main)] font-black"
              }`}
            >
              {currentUser.bloodGroup || "Not Set"}
            </h4>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
            <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase flex items-center gap-1">
              <span>📅</span> DATE OF BIRTH
            </span>
            <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
              {currentUser.dob || "Not Set"}
            </h4>
          </div>

          {isOwnProfile && (
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
              <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase flex items-center gap-1">
                <span>✉️</span> EMAIL ADDRESS
              </span>
              <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1 truncate">
                {currentUser.email || "Not Set"}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}