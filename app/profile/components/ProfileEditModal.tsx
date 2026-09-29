"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { UserProfile } from "../../utils/userStore";

interface ProfileEditModalProps {
  editForm: UserProfile;
  setEditForm: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileEditModal({
  editForm,
  setEditForm,
  onSave,
  onClose,
  onImageUpload,
}: ProfileEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[#D4AF37] rounded-3xl p-6 max-w-2xl w-full space-y-5 my-8 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
          <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider">
            ⚙️ PROFILE SETTINGS
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-main)] hover:text-[#D4AF37] font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 text-xs font-bold">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-black shadow-md">
              <Image
                src={editForm.avatar || "/logo.jpg"}
                alt="Avatar Preview"
                fill
                className="object-cover"
              />
            </div>
            <label className="text-[10px] bg-[#D4AF37] text-black font-black px-3 py-1.5 rounded-lg cursor-pointer hover:brightness-110 shadow-sm">
              CHOOSE NEW IMAGE
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">NAME</label>
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">KONAMI UID</label>
              <input
                type="text"
                value={editForm.konamiId || ""}
                onChange={(e) => setEditForm({ ...editForm, konamiId: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">DEVICE NAME (HARDWARE)</label>
              <input
                type="text"
                value={editForm.hardware || ""}
                onChange={(e) => setEditForm({ ...editForm, hardware: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">WHATSAPP NUMBER</label>
              <input
                type="text"
                value={editForm.whatsapp || ""}
                onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">DISCORD USERNAME / LINK</label>
              <input
                type="text"
                placeholder="Optional"
                value={editForm.discord || ""}
                onChange={(e) => setEditForm({ ...editForm, discord: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">FACEBOOK LINK</label>
              <input
                type="text"
                value={editForm.facebook || ""}
                onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">DISTRICT / LOCATION</label>
              <input
                type="text"
                placeholder="City / District"
                value={editForm.location === "Not Set" ? "" : editForm.location || ""}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">BLOOD GROUP</label>
              <select
                value={editForm.bloodGroup || ""}
                onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37] cursor-pointer"
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
              <label className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">DATE OF BIRTH (DOB)</label>
              <input
                type="date"
                value={editForm.dob || ""}
                onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded-xl text-[var(--text-main)] outline-none focus:border-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-black py-3 rounded-xl uppercase cursor-pointer hover:brightness-110 tracking-widest text-xs mt-2 shadow-lg"
          >
            SAVE CONFIGURATION
          </button>
        </form>
      </div>
    </div>
  );
}