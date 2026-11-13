"use type client";
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CardCreatorTab from "../components/admin/CardCreatorTab";
import { supabase } from "../lib/supabase";

const ALLOWED_ADMIN_EMAILS = [
  "shopnilhossainhim@gmail.com",
  "razibulislamhridoy@gmail.com",
  "samiaakter2073@gmail.com",
  "hmmamun2010@gmail.com",
  "tanjimuddin1437@gmail.com",
  "mdharunanwer@gmail.com",
  "akasharsenal14@gmail.com",
  "samiulakter2075@gmail.com",
];

export default function AdminConsole() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "admins">("card");

  // Permission Control State
  const [adminList, setAdminList] = useState<string[]>(ALLOWED_ADMIN_EMAILS);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    const cachedUser = localStorage.getItem("cw_active_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (parsed && parsed.email) {
          const clean = parsed.email.toLowerCase().trim();
          if (ALLOWED_ADMIN_EMAILS.includes(clean)) {
            setIsAdmin(true);
            setChecking(false);
          }
        }
      } catch (e) {}
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAccess(session?.user?.email);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAccess(session?.user?.email);
    });

    const savedAdmins = localStorage.getItem("cw_admin_list");
    if (savedAdmins) {
      try {
        setAdminList(JSON.parse(savedAdmins));
      } catch (e) {}
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAccess = (email?: string) => {
    if (!email) {
      const activeUserStr = localStorage.getItem("cw_active_user");
      if (activeUserStr) {
        try {
          const userObj = JSON.parse(activeUserStr);
          if (userObj?.email) {
            email = userObj.email;
          }
        } catch (e) {}
      }
    }

    if (!email) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const isAllowed = ALLOWED_ADMIN_EMAILS.includes(cleanEmail);
    
    setIsAdmin(isAllowed);
    setChecking(false);
  };

  // নতুন অ্যাডমিন যুক্ত করা
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    const cleanNew = newAdminEmail.toLowerCase().trim();
    if (adminList.includes(cleanNew)) {
      alert("এই ইমেইলটি ইতিমধ্যেই অ্যাডমিন হিসেবে যুক্ত আছে!");
      return;
    }
    const updated = [...adminList, cleanNew];
    setAdminList(updated);
    localStorage.setItem("cw_admin_list", JSON.stringify(updated));
    setNewAdminEmail("");
    alert("নতুন অ্যাডমিন সফলভাবে যোগ করা হয়েছে!");
  };

  // অ্যাডমিন রিমুভ করা
  const handleRemoveAdmin = (emailToRemove: string) => {
    const updated = adminList.filter((e) => e !== emailToRemove);
    setAdminList(updated);
    localStorage.setItem("cw_admin_list", JSON.stringify(updated));
    alert("অ্যাডমিন এক্সেস রিমুভ করা হয়েছে!");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="animate-pulse text-sm font-mono text-amber-400">Verifying Admin Console Access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="text-xs text-zinc-400">
            You do not have permission to access the Admin Console. Please sign in with an authorized admin account.
          </p>
          <Link href="/" className="inline-block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-3 rounded-xl uppercase transition-all">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-lg font-black text-[#D4AF37] uppercase">📟 ADMIN COMMAND CENTER</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Card Creator & Permission Control</p>
          </div>
          <button
            onClick={async () => {
              localStorage.removeItem("cw_active_user");
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            LOGOUT
          </button>
        </div>

        {/* TOP TABS (শুধুমাত্র Card Creator এবং Permission Control) */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "card", label: "🎨 CARD CREATOR" },
            { id: "admins", label: "🔑 PERMISSION CONTROL" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-black px-5 py-2.5 rounded-xl uppercase transition-all ${
                activeTab === tab.id
                  ? "bg-[#D4AF37] text-black shadow-lg"
                  : "bg-[var(--bg-card)] text-gray-400 border border-[var(--border-color)] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "card" && <CardCreatorTab />}

        {activeTab === "admins" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg space-y-6 max-w-xl mx-auto">
            <div>
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
                🔑 ADMIN ACCESS MANAGEMENT
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-2">
                নতুন অ্যাডমিন ইমেইল যুক্ত করুন অথবা বিদ্যমান এক্সেস রিমুভ করুন।
              </p>
            </div>

            {/* নতুন অ্যাডমিন যোগ করার ফর্ম */}
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter new admin email..."
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-xl hover:bg-[#b5942d] transition-all uppercase tracking-wider cursor-pointer"
              >
                + ADD NEW ADMIN
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">অনুমোদিত অ্যাডমিনদের তালিকা:</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {adminList.map((email) => (
                  <div
                    key={email}
                    className="flex justify-between items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded-xl text-xs"
                  >
                    <span className="font-semibold text-white">{email}</span>
                    <button
                      onClick={() => handleRemoveAdmin(email)}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}