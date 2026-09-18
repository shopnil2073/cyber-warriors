"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayerProfile } from "../utils/userStore";

type TabType = "INFO" | "ACHIEVEMENTS" | "OVERVIEW" | "SOLO" | "FRANCHISE" | "MILESTONES" | "TIMELINE";

export default function ProfilePage() {
  const [user, setUser] = useState<PlayerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("INFO");
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    avatar: "",
    gameId: "",
    device: "",
    cobegId: "",
    whatsapp: "",
    discord: "",
    fbUrl: "",
    city: "",
    bloodGroup: "",
    dob: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("cw_logged_in_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setEditForm({
          avatar: parsed.avatar || "/logo.jpg",
          gameId: parsed.gameId || "",
          device: parsed.device || "",
          cobegId: parsed.cobegId || "",
          whatsapp: parsed.phone || "",
          discord: parsed.discord || "",
          fbUrl: parsed.fbUrl || "",
          city: parsed.city || "",
          bloodGroup: parsed.bloodGroup || "",
          dob: parsed.dob || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setEditForm((prev) => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("cw_logged_in_user");
    localStorage.removeItem("cw_user_name");
    window.location.href = "/sign-in";
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: PlayerProfile = {
      ...user,
      avatar: editForm.avatar,
      gameId: editForm.gameId,
      device: editForm.device,
      cobegId: editForm.cobegId,
      phone: editForm.whatsapp,
      discord: editForm.discord,
      fbUrl: editForm.fbUrl,
      city: editForm.city,
      bloodGroup: editForm.bloodGroup,
      dob: editForm.dob,
    };

    setUser(updatedUser);
    localStorage.setItem("cw_logged_in_user", JSON.stringify(updatedUser));
    setIsEditing(false);
    alert("Configuration Saved!");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center justify-center p-4">
        <p className="text-sm font-bold text-gray-400 mb-4">Please Sign In to view your profile</p>
        <Link href="/sign-in" className="px-6 py-2.5 bg-[#D4AF37] text-black font-black text-xs uppercase rounded-xl">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white pb-28 font-sans">
      {/* Top Banner Controls */}
      <div className="relative h-44 bg-gradient-to-r from-amber-950/40 via-black to-amber-950/40 border-b border-[#23293A] p-4 flex justify-between items-start">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3.5 py-1.5 bg-black/60 border border-[#D4AF37]/50 rounded-xl text-[10px] font-black text-[#D4AF37] uppercase flex items-center gap-1.5 hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
        >
          📝 {isEditing ? "CANCEL" : "EDIT"}
        </button>

        <button
          onClick={handleSignOut}
          className="px-3.5 py-1.5 bg-red-500/20 border border-red-500/40 rounded-xl text-[10px] font-black text-red-400 uppercase flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
        >
          SIGN OUT ➔
        </button>
      </div>

      {/* Profile Header */}
      {!isEditing && (
        <div className="max-w-4xl mx-auto px-4 -mt-16 text-center space-y-3 relative z-10">
          <div className="relative w-24 h-24 mx-auto rounded-2xl border-2 border-[#D4AF37] overflow-hidden bg-black shadow-2xl">
            <Image src={user.avatar || "/logo.jpg"} alt={user.name} fill className="object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] font-black text-[#D4AF37] py-0.5">
              #109
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            {user.name}
          </h1>

          <div className="flex justify-center items-center gap-3">
            {user.fbUrl ? (
              <a href={user.fbUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-[#121624] border border-[#23293A] flex items-center justify-center text-xs text-[#D4AF37]">
                f
              </a>
            ) : (
              <span className="w-8 h-8 rounded-xl bg-[#121624] border border-[#23293A] flex items-center justify-center text-xs text-gray-600">f</span>
            )}
            {user.phone ? (
              <a href={`https://wa.me/${user.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-[#121624] border border-[#23293A] flex items-center justify-center text-xs text-[#D4AF37]">
                💬
              </a>
            ) : (
              <span className="w-8 h-8 rounded-xl bg-[#121624] border border-[#23293A] flex items-center justify-center text-xs text-gray-600">💬</span>
            )}
            <span className="w-8 h-8 rounded-xl bg-[#121624] border border-[#23293A] flex items-center justify-center text-xs text-[#D4AF37]">🎧</span>
            <span className="w-8 h-8 rounded-xl bg-[#121624] border border-[#23293A] flex items-center justify-center text-xs text-[#D4AF37]">👤</span>
          </div>
        </div>
      )}

      {/* Main Form/Tabs Area */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        {isEditing ? (
          /* VIDEO EXACT EDITING FORM */
          <div className="space-y-6">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>

            <div className="bg-[#121624] border border-[#23293A] rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[#23293A] pb-3 text-[#D4AF37]">
                <span>⚙️</span>
                <h2 className="text-xs font-black uppercase tracking-widest">PROFILE SETTINGS</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs font-bold">
                {/* IDENTITY AVATAR */}
                <div className="space-y-3">
                  <label className="text-gray-400 block text-[10px] uppercase tracking-wider">IDENTITY (AVATAR)</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl border border-[#D4AF37] overflow-hidden bg-black shrink-0">
                      <Image src={editForm.avatar || "/logo.jpg"} alt="Avatar" fill className="object-cover" />
                    </div>
                    <label className="px-4 py-2 bg-[#1A2035] border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl text-xs font-black uppercase cursor-pointer hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2">
                      🖼️ Choose New Image
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>

                {/* KONAMI UID */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">🪪 KONAMI UID</label>
                  <input
                    type="text"
                    value={editForm.gameId}
                    onChange={(e) => setEditForm({ ...editForm, gameId: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* DEVICE NAME */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">📱 DEVICE NAME</label>
                  <input
                    type="text"
                    value={editForm.device}
                    onChange={(e) => setEditForm({ ...editForm, device: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* COBEG ID */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">🎮 COBEG ID</label>
                  <input
                    type="text"
                    value={editForm.cobegId}
                    onChange={(e) => setEditForm({ ...editForm, cobegId: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* WHATSAPP NUMBER */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">💬 WHATSAPP NUMBER</label>
                  <input
                    type="text"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* DISCORD USERNAME */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">🎧 DISCORD USERNAME</label>
                  <input
                    type="text"
                    placeholder="username#1234"
                    value={editForm.discord}
                    onChange={(e) => setEditForm({ ...editForm, discord: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* FACEBOOK LINK */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">🌐 FACEBOOK LINK</label>
                  <input
                    type="url"
                    value={editForm.fbUrl}
                    onChange={(e) => setEditForm({ ...editForm, fbUrl: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* DISTRICT */}
                <div>
                  <label className="text-gray-400 block mb-1 uppercase text-[10px]">📍 DISTRICT</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* BLOOD GROUP & DOB DROPDOWNS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1 uppercase text-[10px]">🩸 BLOOD GROUP</label>
                    <select
                      value={editForm.bloodGroup}
                      onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                      className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1 uppercase text-[10px]">📅 DOB</label>
                    <input
                      type="date"
                      value={editForm.dob}
                      onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                      className="w-full bg-[#0B0E14] border border-[#23293A] rounded-xl p-3 text-white focus:border-[#D4AF37] outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg cursor-pointer mt-4 flex items-center justify-center gap-2"
                >
                  ✔ SAVE CONFIGURATION
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* DISPLAY TABS */
          <>
            <div className="flex gap-2 overflow-x-auto border-b border-[#23293A] pb-3 no-scrollbar">
              {(["INFO", "ACHIEVEMENTS", "OVERVIEW", "SOLO", "FRANCHISE", "MILESTONES", "TIMELINE"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all shrink-0 cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="mt-6 space-y-6">
              {activeTab === "INFO" && (
                <div className="space-y-4">
                  <div className="bg-[#121624] border border-[#23293A] rounded-2xl p-4">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block mb-3">
                      🛡️ AFFILIATIONS
                    </span>
                    <div className="flex items-center gap-3 bg-[#0B0E14] p-3 rounded-xl border border-[#23293A]">
                      <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm">👤</div>
                      <div>
                        <div className="text-xs font-extrabold text-white">Free Agent</div>
                        <div className="text-[10px] text-gray-500 font-semibold">No active contract</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">
                      🎮 GAME SPECS
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-[#121624] border border-[#23293A] p-4 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">🪪</span>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">KONAMI UID</span>
                          <span className="text-xs font-black text-[#D4AF37]">{user.gameId || "Not Set"}</span>
                        </div>
                      </div>
                      <div className="bg-[#121624] border border-[#23293A] p-4 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">📱</span>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">HARDWARE</span>
                          <span className="text-xs font-black text-white">{user.device || "Mobile"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">
                      👤 PROFILE DATA
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-[#121624] border border-[#23293A] p-4 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">📍</span>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">LOCATION</span>
                          <span className="text-xs font-black text-white">{user.city || "dhaka"}</span>
                        </div>
                      </div>

                      <div className="bg-[#121624] border border-[#23293A] p-4 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">🩸</span>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">BLOOD GROUP</span>
                          <span className="text-xs font-black text-red-400">{user.bloodGroup || "Not Set"}</span>
                        </div>
                      </div>

                      <div className="bg-[#121624] border border-[#23293A] p-4 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">DATE OF BIRTH</span>
                          <span className="text-xs font-black text-white">{user.dob || "Not Set"}</span>
                        </div>
                      </div>

                      <div className="bg-[#121624] border border-[#23293A] p-4 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">✉️</span>
                        <div className="truncate">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">EMAIL ADDRESS</span>
                          <span className="text-xs font-black text-white truncate block">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ACHIEVEMENTS" && (
                <div className="bg-[#121624] border border-[#23293A] rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-sm font-black text-white uppercase">NO ACHIEVEMENTS YET</h3>
                  <p className="text-xs text-gray-500 mt-1">This player is still forging their legacy.</p>
                </div>
              )}

              {activeTab === "OVERVIEW" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#121624] p-4 rounded-xl border border-[#23293A] text-center">
                    <span className="text-[10px] text-gray-400 uppercase block">OVR RATING</span>
                    <span className="text-xl font-black text-[#D4AF37]">{user.rtg || 1000}</span>
                  </div>
                  <div className="bg-[#121624] p-4 rounded-xl border border-[#23293A] text-center">
                    <span className="text-[10px] text-gray-400 uppercase block">MATCHES</span>
                    <span className="text-xl font-black text-white">{user.app || 0}</span>
                  </div>
                  <div className="bg-[#121624] p-4 rounded-xl border border-[#23293A] text-center">
                    <span className="text-[10px] text-gray-400 uppercase block">WINS</span>
                    <span className="text-xl font-black text-green-400">{user.w || 0}</span>
                  </div>
                  <div className="bg-[#121624] p-4 rounded-xl border border-[#23293A] text-center">
                    <span className="text-[10px] text-gray-400 uppercase block">GOALS</span>
                    <span className="text-xl font-black text-[#D4AF37]">{user.gf || 0}</span>
                  </div>
                </div>
              )}

              {(activeTab === "SOLO" || activeTab === "FRANCHISE" || activeTab === "MILESTONES" || activeTab === "TIMELINE") && (
                <div className="bg-[#121624] border border-[#23293A] rounded-2xl p-8 text-center text-xs text-gray-400 font-bold">
                  ⚡ {activeTab} Records and Analytics will automatically populate after matches.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}