"use client";

import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      // Async login query to Database
      const user = await loginPlayer(email.trim(), password.trim());

      if (user) {
        window.dispatchEvent(new Event("cw_auth_change"));
        router.push("/profile");
      } else {
        setError("Invalid email or password! Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 flex items-center justify-center p-4 pb-24 font-sans selection:bg-[#D4AF37] selection:text-black">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-wide text-[var(--text-main)] font-serif">
            Welcome Back
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Enter your credentials to access the club
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-black p-3.5 rounded-xl text-center shadow-md animate-bounce">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
          
          {/* Email Input */}
          <div className="relative flex items-center">
            <span className="absolute left-4 text-[var(--text-muted)] text-base">✉️</span>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[#D4AF37] pl-11 pr-4 py-3.5 rounded-xl text-[var(--text-main)] outline-none font-medium placeholder-[var(--text-muted)] transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <span className="absolute left-4 text-[var(--text-muted)] text-base">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[#D4AF37] pl-11 pr-11 py-3.5 rounded-xl text-[var(--text-main)] outline-none font-medium placeholder-[var(--text-muted)] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-[var(--text-muted)] hover:text-[#D4AF37] text-sm focus:outline-none cursor-pointer"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="remember" className="text-[var(--text-muted)] text-xs font-semibold cursor-pointer select-none">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black py-3.5 rounded-xl uppercase tracking-widest hover:brightness-110 shadow-lg cursor-pointer transition-all mt-2 disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-3 border-t border-[var(--border-color)] text-xs font-medium text-[var(--text-muted)] flex justify-center items-center gap-1.5">
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