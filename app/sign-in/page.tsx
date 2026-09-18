"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginUser } from "../utils/userStore";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("দয়া করে ইমেইল ও পাসওয়ার্ড দিন!");
      return;
    }

    // Attempt login using registered userStore data
    const result = loginUser(email, password);

    if (result.success) {
      alert("Sign in successful!");
      window.location.href = "/";
    } else {
      setErrorMsg(result.message || "Invalid Email or Password!");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-4 pb-24">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black mx-auto">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <h1 className="text-xl font-black text-[#D4AF37] uppercase tracking-wider">WELCOME BACK</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">ENTER YOUR CREDENTIALS TO ACCESS THE CLUB</p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1 uppercase">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              placeholder="yourmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1 uppercase">PASSWORD</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-xl hover:bg-[#b5942d] transition-all uppercase tracking-wider shadow-lg cursor-pointer"
          >
            SIGN IN
          </button>
        </form>

        {/* Updated Register Link */}
        <div className="text-center text-xs text-[var(--text-muted)]">
          Don't have a membership?{" "}
          <Link href="/register" className="text-[#D4AF37] font-bold hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}