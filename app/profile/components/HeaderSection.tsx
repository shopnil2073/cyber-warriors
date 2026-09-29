"use client";

import React from "react";
import Image from "next/image";
import { UserProfile } from "../../utils/userStore";

interface HeaderSectionProps {
  currentUser: UserProfile;
  isOwnProfile: boolean;
  cleanWhatsapp: string;
  onBack: () => void;
  onEditClick: () => void;
  onLogoutClick: () => void;
}

export default function HeaderSection({
  currentUser,
  isOwnProfile,
  cleanWhatsapp,
  onBack,
  onEditClick,
  onLogoutClick,
}: HeaderSectionProps) {
  return (
    <div className="relative w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] pt-8 pb-8 px-4 transition-colors">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-4 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          ← BACK
        </button>

        {isOwnProfile && (
          <div className="flex gap-2">
            <button
              onClick={onEditClick}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-md"
            >
              ✏️ EDIT
            </button>
            <button
              onClick={onLogoutClick}
              className="text-[10px] sm:text-xs font-black text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-md"
            >
              SIGN OUT ➔
            </button>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="relative mb-3">
          <button
            type="button"
            onClick={() => {
              const src = currentUser.avatar || "/logo.jpg";
              if (!src) return;

              if (src.startsWith("data:") || src.startsWith("blob:")) {
                const imageWindow = window.open("");
                if (imageWindow) {
                  imageWindow.document.write(
                    `<body style="margin:0; background:#0e0e0e; display:flex; align-items:center; justify-content:center; min-height:100vh;"><img src="${src}" style="max-width:100%; max-height:100vh; margin:auto; border-radius:12px;" /></body>`
                  );
                }
              } else {
                const fullUrl = src.startsWith("http")
                  ? src
                  : `${window.location.origin}${src.startsWith("/") ? "" : "/"}${src}`;
                window.open(fullUrl, "_blank", "noopener,noreferrer");
              }
            }}
            title="View Profile Picture"
            className="block w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-[#D4AF37] overflow-hidden bg-black shadow-2xl relative group cursor-pointer hover:scale-105 transition-transform"
          >
            <Image
              src={currentUser.avatar || "/logo.jpg"}
              alt={currentUser.name || "User Avatar"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              🔍 Open
            </div>
          </button>
        </div>

        <h1 className="text-xl md:text-3xl font-black uppercase tracking-wider text-[var(--text-main)] mt-3 font-serif">
          {currentUser.name}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-4">
          {currentUser.facebook ? (
            <a
              href={currentUser.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook Profile"
              className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#1877F2] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group"
            >
              <svg className="w-4 h-4 fill-[var(--text-muted)] group-hover:fill-[#1877F2] transition-colors" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-color)]/50 opacity-40 cursor-not-allowed flex items-center justify-center shadow-inner">
              <svg className="w-4 h-4 fill-[var(--text-muted)]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
          )}

          {cleanWhatsapp ? (
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`WhatsApp: ${currentUser.whatsapp}`}
              className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#25D366] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group"
            >
              <svg className="w-4 h-4 fill-[var(--text-muted)] group-hover:fill-[#25D366] transition-colors" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-color)]/50 opacity-40 cursor-not-allowed flex items-center justify-center shadow-inner">
              <svg className="w-4 h-4 fill-[var(--text-muted)]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
          )}

          {currentUser.discord ? (
            <a
              href={
                currentUser.discord.startsWith("http")
                  ? currentUser.discord
                  : `https://discord.com/users/${currentUser.discord}`
              }
              target="_blank"
              rel="noopener noreferrer"
              title={`Discord: ${currentUser.discord}`}
              className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#5865F2] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group"
            >
              <svg className="w-4 h-4 fill-[var(--text-muted)] group-hover:fill-[#5865F2] transition-colors" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-color)]/50 opacity-40 cursor-not-allowed flex items-center justify-center shadow-inner grayscale">
              <svg className="w-4 h-4 fill-[var(--text-muted)]" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}