"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginPlayer } from "../utils/userStore";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = loginPlayer(email, password);
    if (user) {
      window.dispatchEvent(new Event("cw_auth_change"));
      router.push("/profile");
    } else {
      setError("Email athoba password bhul diyechen!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex items-center justify-center p-4 pb-24 font-sans">
      <div className="bg-[#111520] border border-[#23293A] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-wide text-white font-serif">
            Welcome Back
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Enter your credentials to access the club
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
          {/* Email Input */}
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 text-base">✉️</span>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-4 py-3.5 rounded-xl text-white outline-none font-medium placeholder-gray-500"
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 text-base">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0D14] border border-[#23293A] focus:border-[#D4AF37] pl-11 pr-11 py-3.5 rounded-xl text-white outline-none font-medium placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-[#D4AF37] text-sm focus:outline-none"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="remember" className="text-gray-300 text-xs font-semibold cursor-pointer select-none">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black py-3.5 rounded-xl uppercase tracking-widest hover:brightness-110 shadow-lg cursor-pointer transition-all mt-2"
          >
            SIGN IN
          </button>
        </form>

        <div className="text-center pt-3 border-t border-[#23293A] text-xs font-medium text-gray-400 flex justify-center items-center gap-1.5">
          <span>Don't have a membership?</span>
          <Link
            href="/register"
            className="font-black text-[#D4AF37] hover:underline uppercase tracking-wide"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}