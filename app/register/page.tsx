"use client";

import React, { useState } from "react";
import Link from "next/link";
import { registerUser } from "../utils/userStore";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    konamiId: "",
    gamingDevice: "",
    city: "",
    fbUrl: "",
    countryCode: "BD (+880)",
    whatsapp: "",
  });

  const [avatarName, setAvatarName] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string>("/logo.jpg");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarBase64(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerUser({
      name: formData.fullName,
      email: formData.email,
      phone: `${formData.countryCode} ${formData.whatsapp}`,
      gameId: formData.konamiId || "CW_Player",
      avatar: avatarBase64,
      password: formData.password,
      device: formData.gamingDevice,
      city: formData.city,
      fbUrl: formData.fbUrl,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white py-12 px-4 pb-24 flex flex-col items-center justify-center font-sans">
      
      {/* Header Branding */}
      <div className="text-center space-y-1 mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-[#D4AF37]">
          CYBER WARRIORS
        </h1>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          ESTABLISH YOUR LEGACY
        </p>
      </div>

      <div className="w-full max-w-xl bg-[#14181d] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-black uppercase text-[#D4AF37]">
              REGISTRATION SUCCESSFUL!
            </h2>
            <p className="text-xs text-gray-400">
              Your account setup is complete. Welcome to the club, <span className="text-[#D4AF37] font-bold">{formData.fullName}</span>!
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/sign-in"
                className="px-6 py-2.5 bg-[#D4AF37] text-black font-black text-xs uppercase rounded-xl hover:bg-[#b5942d] transition-colors inline-block text-center"
              >
                Sign In Now
              </Link>
              <Link
                href="/"
                className="px-6 py-2.5 bg-[#1c2229] border border-gray-700 text-white font-black text-xs uppercase rounded-xl hover:border-[#D4AF37] transition-colors inline-block text-center"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. ACCOUNT SETUP */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <span className="text-[#D4AF37]">👤</span>
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  ACCOUNT SETUP
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    required
                    placeholder="Secure Password"
                    value={formData.password}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. PLAYER PROFILE */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <span className="text-[#D4AF37]">🎮</span>
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  PLAYER PROFILE
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Konami UID"
                    value={formData.konamiId}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, konamiId: e.target.value })}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Gaming Device"
                    value={formData.gamingDevice}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, gamingDevice: e.target.value })}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="City / District"
                    value={formData.city}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                {/* File Upload Input */}
                <label className="flex items-center gap-3 bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-gray-400 cursor-pointer hover:border-[#D4AF37] transition-colors">
                  <span className="text-[#D4AF37]">📁</span>
                  <span className="truncate">
                    {avatarName ? avatarName : "Upload Profile Avatar (Optional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* 3. COMMUNICATIONS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <span className="text-[#D4AF37]">📱</span>
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  COMMUNICATIONS
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="url"
                    placeholder="Facebook Profile URL"
                    value={formData.fbUrl}
                    className="w-full bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, fbUrl: e.target.value })}
                  />
                </div>

                {/* Country Code Dropdown + WhatsApp Input */}
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="bg-[#1c2229] border border-gray-700/60 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="BD (+880)">BD (+880)</option>
                    <option value="IN (+91)">IN (+91)</option>
                    <option value="PK (+92)">PK (+92)</option>
                    <option value="CN (+86)">CN (+86)</option>
                    <option value="US/CA (+1)">US/CA (+1)</option>
                    <option value="UK (+44)">UK (+44)</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="WhatsApp (Optional)"
                    value={formData.whatsapp}
                    className="flex-1 bg-[#1c2229] border border-gray-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#b5942d] transition-all shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              CONFIRM REGISTRATION ⚡
            </button>

            {/* Bottom Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-gray-400">Already have a membership? </span>
              <Link href="/sign-in" className="text-xs font-bold text-[#D4AF37] hover:underline">
                Sign in here
              </Link>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}