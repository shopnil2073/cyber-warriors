"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getActiveUser,
  updateActiveUserProfile,
  logoutPlayer,
  UserProfile,
  EMPTY_USER,
} from "../utils/userStore";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "INFO" | "ACHIEVEMENTS" | "OVERVIEW" | "SOLO" | "FRANCHISE" | "MILESTONES" | "TIMELINE"
  >("INFO");

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(EMPTY_USER);

  useEffect(() => {
    setMounted(true);
    const active = getActiveUser();
    if (active) {
      setCurrentUser(active);
      setEditForm(active);
    } else {
      // User logged-in na thakle directly sign-in page-e pathiya dibe
      router.push("/sign-in");
    }
  }, [router]);

  // Avatar Image Upload inside Profile Settings Modal
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditForm((prev) => ({ ...prev, avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Profile Edit Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateActiveUserProfile(editForm);
    setCurrentUser(editForm);
    window.dispatchEvent(new Event("cw_auth_change"));
    setIsEditing(false);
  };

  // Handle Logout
  const handleLogout = () => {
    logoutPlayer();
    window.dispatchEvent(new Event("cw_auth_change"));
    setCurrentUser(null);
    router.push("/");
  };

  if (!mounted || !currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white transition-colors duration-300 pb-24 font-sans relative">
      
      {/* Cover Header */}
      <div className="relative w-full bg-gradient-to-b from-[#161B26] via-[#0D111A] to-[#0A0D14] border-b border-[#23293A] pt-8 pb-6 px-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center mb-4 relative z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 px-3.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all"
          >
            ✏️ EDIT
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-black text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 px-3.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all"
          >
            SIGN OUT ➔
          </button>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="relative mb-3">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-[#D4AF37] overflow-hidden bg-black shadow-xl relative">
              <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
            </div>
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              {currentUser.rank}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black uppercase text-white tracking-wider mt-2 font-serif">
            {currentUser.name}
          </h1>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-3">
            {currentUser.facebook && (
              <a href={currentUser.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#161B26] border border-[#23293A] hover:border-[#D4AF37] flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-all">
                🌐
              </a>
            )}
            {currentUser.whatsapp && (
              <a href={`https://wa.me/${currentUser.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#161B26] border border-[#23293A] hover:border-[#D4AF37] flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-all">
                💬
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#23293A] bg-[#0E121B] sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center gap-2 md:gap-6 overflow-x-auto px-4 py-3 no-scrollbar text-xs font-black tracking-wider uppercase">
          {["INFO", "ACHIEVEMENTS", "OVERVIEW", "SOLO", "FRANCHISE", "MILESTONES", "TIMELINE"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`shrink-0 px-3 py-1.5 rounded-lg cursor-pointer ${
                activeTab === tab ? "bg-[#D4AF37] text-black font-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        {activeTab === "INFO" && (
          <div className="space-y-6">
            <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">🪪 AFFILIATIONS</h3>
              <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block">STATUS</span>
                <h4 className="text-sm font-black uppercase">{currentUser.status}</h4>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">🎮 GAME SPECS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block">KONAMI UID</span>
                  <h4 className="text-xs font-black">{currentUser.konamiId}</h4>
                </div>
                <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block">HARDWARE</span>
                  <h4 className="text-xs font-black">{currentUser.hardware}</h4>
                </div>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">👤 PROFILE DATA</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block">LOCATION</span>
                  <h4 className="text-xs font-black">{currentUser.location}</h4>
                </div>
                <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block">BLOOD GROUP</span>
                  <h4 className="text-xs font-black">{currentUser.bloodGroup}</h4>
                </div>
                <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block">DATE OF BIRTH</span>
                  <h4 className="text-xs font-black">{currentUser.dob}</h4>
                </div>
                <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold block">EMAIL ADDRESS</span>
                  <h4 className="text-xs font-black truncate">{currentUser.email}</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS PLACEHOLDER */}
        {activeTab !== "INFO" && (
          <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-12 text-center space-y-2">
            <span className="text-3xl block">⚙️</span>
            <h3 className="text-base font-black text-[#D4AF37] uppercase tracking-wider">
              {activeTab} SECTION
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              Ei section-ti pore edit kora hobe.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111520] border-2 border-[#D4AF37] rounded-3xl p-6 max-w-xl w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#23293A] pb-3">
              <h2 className="text-sm font-black text-[#D4AF37]">⚙️ PROFILE SETTINGS</h2>
              <button onClick={() => setIsEditing(false)} className="text-white font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-bold">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#D4AF37]">
                  <Image src={editForm.avatar} alt="Avatar" fill className="object-cover" />
                </div>
                <label className="text-[10px] bg-[#D4AF37] text-black font-black px-3 py-1 rounded-lg cursor-pointer">
                  CHANGE PHOTO
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">NAME</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#23293A] p-2.5 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">KONAMI UID</label>
                  <input
                    type="text"
                    value={editForm.konamiId}
                    onChange={(e) => setEditForm({ ...editForm, konamiId: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#23293A] p-2.5 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">DEVICE</label>
                  <input
                    type="text"
                    value={editForm.hardware}
                    onChange={(e) => setEditForm({ ...editForm, hardware: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#23293A] p-2.5 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#23293A] p-2.5 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-black py-2.5 rounded-xl uppercase cursor-pointer hover:brightness-110"
              >
                SAVE CONFIGURATION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}