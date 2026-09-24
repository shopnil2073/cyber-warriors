"use client";

import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerNewPlayer, UserProfile } from "../utils/userStore";

export default function RegisterPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState("/logo.jpg");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [konamiId, setKonamiId] = useState("");
  const [hardware, setHardware] = useState("");
  const [location, setLocation] = useState("");
  const [facebook, setFacebook] = useState("");
  const [countryCode, setCountryCode] = useState("BD (+880)");
  const [whatsapp, setWhatsapp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Account Setup er sobgulo required field puron korun!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Secure Password and Confirm Password match korchhe na!");
      return;
    }

    setLoading(true);

    const newUser: UserProfile = {
      id: `CW-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      password,
      rank: "#NEW",
      avatar,
      konamiId: konamiId || "Not Set",
      hardware: hardware || "Not Set",
      location: location || "Not Set",
      bloodGroup: "Not Set",
      dob: "Not Set",
      status: "Free Agent",
      facebook: facebook || "",
      whatsapp: whatsapp ? `${countryCode} ${whatsapp}` : "",
    };

    try {
      const success = await registerNewPlayer(newUser);
      setLoading(false);

      if (success) {
        alert("Registration successful! Sign In to access your portal.");
        router.push("/sign-in");
      } else {
        setError("Ei email address diye itomodhye account khola hoyechhe ba server issue!");
      }
    } catch (err) {
      setLoading(false);
      setError("Server Network Failure! Check database credentials and connection.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col items-center justify-center p-4 pb-24 font-sans">
      
      {/* Title Header */}
      <div className="text-center my-6 space-y-1">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-[#D4AF37] font-serif">
          CYBER WARRIORS
        </h1>
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
          ESTABLISH YOUR LEGACY
        </p>
      </div>

      <div className="max-w-2xl w-full space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* 1. ACCOUNT SETUP */}
          <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#23293A] pb-3 text-[#D4AF37] font-black text-xs uppercase tracking-wider">
              👤 ACCOUNT SETUP
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">👤</span>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">✉️</span>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Secure Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-10 py-3 rounded-xl text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-[#D4AF37]"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. PLAYER PROFILE */}
          <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#23293A] pb-3 text-[#D4AF37] font-black text-xs uppercase tracking-wider">
              🎮 PLAYER PROFILE
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">🆔</span>
                  <input
                    type="text"
                    placeholder="Konami UID"
                    value={konamiId}
                    onChange={(e) => setKonamiId(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">📱</span>
                  <input
                    type="text"
                    placeholder="Gaming Device"
                    value={hardware}
                    onChange={(e) => setHardware(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">📍</span>
                <input
                  type="text"
                  placeholder="City / District"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                />
              </div>

              {/* Avatar Upload */}
              <div className="bg-[#0A0D14] border border-[#23293A] p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37] shrink-0 bg-black">
                    <Image src={avatar} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200 block">
                      Upload Profile Avatar (Required)
                    </span>
                    <span className="text-[10px] text-gray-500">JPG or PNG image file</span>
                  </div>
                </div>

                <label className="bg-[#D4AF37] text-black font-black text-xs px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all shrink-0">
                  CHOOSE FILE
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* 3. COMMUNICATIONS */}
          <div className="bg-[#111520] border border-[#23293A] rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#23293A] pb-3 text-[#D4AF37] font-black text-xs uppercase tracking-wider">
              📡 COMMUNICATIONS
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">🌐</span>
                <input
                  type="url"
                  placeholder="Facebook Profile URL"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                />
              </div>

              {/* Country Code & WhatsApp Box */}
              <div className="flex items-center gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 md:w-36 bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] px-3 py-3 rounded-xl text-white outline-none font-bold cursor-pointer shrink-0 text-xs"
                >
                  <option value="BD (+880)">BD (+880)</option>
                  <option value="IN (+91)">IN (+91)</option>
                  <option value="PK (+92)">PK (+92)</option>
                  <option value="US/CA (+1)">US/CA (+1)</option>
                  <option value="UK (+44)">UK (+44)</option>
                </select>

                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-4 text-gray-400">💬</span>
                  <input
                    type="tel"
                    placeholder="WhatsApp (Optional)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3 rounded-xl text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Submit Button with Loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm shadow-xl hover:brightness-110 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? "SAVING TO DATABASE..." : "CONFIRM REGISTRATION ⚡"}
          </button>
        </form>

        <div className="text-center text-xs font-medium text-gray-400 flex justify-center items-center gap-1.5 pt-2">
          <span>Already have a membership?</span>
          <Link href="/sign-in" className="font-black text-[#D4AF37] hover:underline uppercase">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}