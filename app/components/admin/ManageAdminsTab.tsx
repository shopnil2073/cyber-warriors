"use client";

import React, { useState } from "react";

interface ManageAdminsTabProps {
  hardcodedAdmins: string[];
  adminEmailsList: string[];
  onAdminsUpdated: (list: string[]) => void;
}

export default function ManageAdminsTab({
  hardcodedAdmins,
  adminEmailsList,
  onAdminsUpdated,
}: ManageAdminsTabProps) {
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const handleAddAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedEmail = newAdminEmail.toLowerCase().trim();
    if (!formattedEmail) return;

    if (adminEmailsList.includes(formattedEmail) || hardcodedAdmins.includes(formattedEmail)) {
      alert("This email already has Admin Access!");
      return;
    }

    const updatedList = [...adminEmailsList, formattedEmail];
    localStorage.setItem("cw_admin_emails", JSON.stringify(updatedList));
    onAdminsUpdated(updatedList);
    setNewAdminEmail("");
    alert(`Command Center access granted to: ${formattedEmail}`);
  };

  const handleRemoveAdminEmail = (emailToRemove: string) => {
    const updatedList = adminEmailsList.filter((e) => e !== emailToRemove);
    localStorage.setItem("cw_admin_emails", JSON.stringify(updatedList));
    onAdminsUpdated(updatedList);
    alert(`Access revoked for: ${emailToRemove}`);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[#D4AF37]/50 rounded-xl p-6 shadow-md space-y-6">
      <div>
        <h2 className="text-sm font-bold text-[#D4AF37] uppercase flex items-center gap-2">
          <span>🛡️</span> GRANT COMMAND CENTER ACCESS
        </h2>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">
          Enter an email address to allow them to see and access the Command Center menu & Admin Hub.
        </p>
      </div>

      <form onSubmit={handleAddAdminEmail} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Enter user email (e.g. user@gmail.com)"
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
          className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-lg text-white focus:border-[#D4AF37] outline-none"
        />
        <button
          type="submit"
          className="bg-[#D4AF37] text-black font-extrabold text-xs px-5 py-2.5 rounded-lg hover:brightness-110 transition-all cursor-pointer uppercase"
        >
          GRANT ACCESS
        </button>
      </form>

      <div className="border-t border-[var(--border-color)] pt-4 space-y-3">
        <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
          PERMANENT AUTHORIZED ADMINS ({hardcodedAdmins.length})
        </h3>
        <div className="space-y-2">
          {hardcodedAdmins.map((email) => (
            <div
              key={email}
              className="flex justify-between items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded-lg opacity-80"
            >
              <span className="text-xs font-mono text-[#D4AF37] font-bold">{email}</span>
              <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10 font-bold uppercase">
                HARDCODED ADMIN
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider pt-3">
          DYNAMIC AUTHORIZED ADMINS ({adminEmailsList.length})
        </h3>
        {adminEmailsList.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] italic">No additional dynamic admins granted yet.</p>
        ) : (
          <div className="space-y-2">
            {adminEmailsList.map((email) => (
              <div
                key={email}
                className="flex justify-between items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded-lg"
              >
                <span className="text-xs font-mono text-[#D4AF37] font-bold">{email}</span>
                <button
                  onClick={() => handleRemoveAdminEmail(email)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-2.5 py-1 rounded bg-red-500/10 cursor-pointer uppercase"
                >
                  REVOKE ACCESS
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}