"use client";

import React, { useState, useEffect, ChangeEvent, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getActiveUser,
  updateActiveUserProfile,
  logoutPlayer,
  getAllUsers,
  UserProfile,
  EMPTY_USER,
} from "../utils/userStore";

function ProfileContent({ overrideUser }: { overrideUser?: UserProfile | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<
    "INFO" | "ACHIEVEMENTS" | "OVERVIEW" | "SOLO" | "FRANCHISE" | "MILESTONES" | "TIMELINE"
  >("INFO");

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(EMPTY_USER);
  const [filterMode, setFilterMode] = useState<"Overall" | "Solo" | "Franchise">("Overall");

  // Dynamic Global Rank State
  const [calculatedRank, setCalculatedRank] = useState<string>("#1");
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  // Milestones Specific Sub-Tab State
  const [milestoneSubTab, setMilestoneSubTab] = useState<"BADGES" | "PROGRESSION">("BADGES");
  const [milestoneFilter, setMilestoneFilter] = useState<"ALL" | "ATTACK" | "DEFENSE" | "SPECIAL">("ALL");

  useEffect(() => {
    setMounted(true);
    const loadProfileData = async () => {
      const active = getActiveUser();
      const allPlayers = await getAllUsers();
      let displayUser: UserProfile | null = null;

      if (overrideUser) {
        displayUser = overrideUser;
      } else if (queryId) {
        const found = allPlayers.find((u: any) => String(u.id) === String(queryId));
        if (found) displayUser = found;
      } else if (active) {
        displayUser = active;
      }

      if (displayUser) {
        setCurrentUser(displayUser);
        setEditForm(displayUser);
        fetchAndCalculateRank(displayUser, allPlayers);
        
        // Determine if this is the logged-in user's own profile to show Edit/Signout
        setIsOwnProfile(active ? active.id === displayUser.id || active.email === displayUser.email : false);
      } else {
        router.push("/sign-in");
      }
    };

    loadProfileData();
  }, [router, queryId, overrideUser]);

  // Fetch all players and calculate user's Global Rank based on OVR Rating
  const fetchAndCalculateRank = (user: UserProfile, allPlayers: UserProfile[]) => {
    try {
      if (!allPlayers || allPlayers.length === 0) {
        setCalculatedRank("#1");
        return;
      }

      // Sort players by rating descending
      const sortedPlayers = [...allPlayers].sort((a: any, b: any) => {
        const ratingA = Number(a.ovrRating || a.rating || 0);
        const ratingB = Number(b.ovrRating || b.rating || 0);
        return ratingB - ratingA;
      });

      // Find current user position in sorted list
      const userIndex = sortedPlayers.findIndex(
        (p) => p.email === user.email || p.id === user.id
      );

      if (userIndex !== -1) {
        setCalculatedRank(`#${userIndex + 1}`);
      } else {
        setCalculatedRank(`#${sortedPlayers.length + 1}`);
      }
    } catch (e) {
      console.error("Rank calculation error:", e);
      setCalculatedRank("#1");
    }
  };

  // Avatar Image Upload
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
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateActiveUserProfile(editForm);
    setCurrentUser(editForm);
    window.dispatchEvent(new Event("cw_auth_change"));
    setIsEditing(false);
  };

  // Handle Logout
  const handleLogout = () => {
    logoutPlayer();
    window.dispatchEvent(new Event("cw_auth_change"));
    setCurrentUser(null);
    router.push("/sign-in");
  };

  if (!mounted || !currentUser) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
      <div className="text-[#D4AF37] font-black tracking-widest animate-pulse">LOADING PROFILE...</div>
    </div>
  );

  // Format WhatsApp number
  const getCleanWhatsappNumber = (phoneStr?: string) => {
    if (!phoneStr) return "";
    return phoneStr.replace(/\D/g, "");
  };

  const cleanWhatsapp = getCleanWhatsappNumber(currentUser.whatsapp);

  // Mocked Data for Achievements
  const achievements = {
    championSolo: 0,
    runnerUpSolo: 0,
    thirdPlaceSolo: 0,
    seasonTop10: 0,
    monthTop5: 0,
    weekTop3: 0,
    totalWins: (currentUser as any).soloWins || 0,
  };

  const milestoneGoals = [50, 100, 150, 200, 250, 300, 350];

  // Overview Tournament Stats Data
  const overviewStats = {
    ovrRating: (currentUser as any).ovrRating || (currentUser as any).rating || 0,
    globalRank: calculatedRank,
    matches: (currentUser as any).matches || 0,
    wins: (currentUser as any).wins || (currentUser as any).soloWins || 0,
    draws: (currentUser as any).draws || 0,
    losses: (currentUser as any).losses || 0,
    winRate: (currentUser as any).winRate || 0,
    scored: (currentUser as any).scored || (currentUser as any).totalGoals || 0,
    conceded: (currentUser as any).conceded || 0,
    goalDiff: ((currentUser as any).scored || 0) - ((currentUser as any).conceded || 0),
    cleanSheets: (currentUser as any).cleanSheets || 0,
    motmAwards: (currentUser as any).motm || 0,
    hatTricks: (currentUser as any).hatTricks || 0,
    doubleHatTricks: (currentUser as any).doubleHt || 0,
    winStreak: (currentUser as any).currentStreak || 0,
  };

  // Solo Tournament Stats
  const soloStats = {
    gamesWon: (currentUser as any).soloGamesWon || (currentUser as any).soloWins || 0,
    seriesPlayed: (currentUser as any).soloSeriesPlayed || (currentUser as any).matches || 0,
    wins: (currentUser as any).soloWins || (currentUser as any).wins || 0,
    draws: (currentUser as any).soloDraws || (currentUser as any).draws || 0,
    losses: (currentUser as any).soloLosses || (currentUser as any).losses || 0,
    winRate: (currentUser as any).soloWinRate || (currentUser as any).winRate || 0,
    scored: (currentUser as any).soloScored || (currentUser as any).scored || 0,
    conceded: (currentUser as any).soloConceded || (currentUser as any).conceded || 0,
    goalDiff: (currentUser as any).soloGoalDiff || (((currentUser as any).scored || 0) - ((currentUser as any).conceded || 0)) || 0,
    indvGamesWon: (currentUser as any).indvGamesWon || 0,
    indvGamesLost: (currentUser as any).indvGamesLost || 0,
    cleanSheets: (currentUser as any).soloCleanSheets || (currentUser as any).cleanSheets || 0,
    hatTricks: (currentUser as any).soloHatTricks || (currentUser as any).hatTricks || 0,
    doubleHt: (currentUser as any).soloDoubleHt || (currentUser as any).doubleHt || 0,
    currentStreak: (currentUser as any).soloCurrentStreak || (currentUser as any).currentStreak || 0,
    avgGoalsPerMatch: (currentUser as any).soloAvgGoals || (overviewStats.matches > 0 ? (overviewStats.scored / overviewStats.matches).toFixed(2) : "0.00"),
    clutchWinRate: (currentUser as any).soloClutchWinRate || "0%",
    mvpPoints: (currentUser as any).soloMvpPoints || 0,
    favoriteFormation: (currentUser as any).soloFavFormation || "4-3-3",
    comebackWins: (currentUser as any).soloComebacks || 0,
    penaltyWinRate: (currentUser as any).soloPenWinRate || "0%",
  };

  // Advanced Franchise Stats
  const franchiseStats = {
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    winRate: 0,
    scored: 0,
    conceded: 0,
    goalDiff: 0,
    cleanSheets: 0,
    motmAwards: 0,
    hatTricks: 0,
    doubleHt: 0,
    contractRole: "Cap / Core Member",
    clubSynergy: 88,
    bestDuoPartner: "N/A",
    duoWinRate: "0%",
    homeWinRate: "0%",
    awayWinRate: "0%",
    pressureWinRate: "0%",
    squadImpactRating: 7.8,
    cleanSheetsPer90: "0.00",
  };

  // Advanced Milestones Progressions Data
  const progressionList = [
    { title: "APPEARANCES", current: overviewStats.matches, next: 50, category: "SPECIAL", icon: "👟" },
    { title: "WINS", current: overviewStats.wins, next: 50, category: "ATTACK", icon: "🏆" },
    { title: "GOALS", current: overviewStats.scored, next: 50, category: "ATTACK", icon: "⚽" },
    { title: "DRAWS", current: overviewStats.draws, next: 50, category: "SPECIAL", icon: "🤝" },
    { title: "MOTM", current: overviewStats.motmAwards, next: 10, category: "SPECIAL", icon: "⭐" },
    { title: "HAT-TRICKS", current: overviewStats.hatTricks, next: 10, category: "ATTACK", icon: "🎩" },
    { title: "DOUBLE HT", current: overviewStats.doubleHatTricks, next: 10, category: "ATTACK", icon: "🔥" },
    { title: "CLEAN SHEETS", current: overviewStats.cleanSheets, next: 25, category: "DEFENSE", icon: "🛡️" },
    { title: "SHUTOUT STREAK", current: 0, next: 5, category: "DEFENSE", icon: "🧱" },
  ];

  // Badges Data
  const badgeList = [
    { name: "Centurion", icon: "🛡️", desc: "Play 100 Official Matches", category: "SPECIAL", unlocked: overviewStats.matches >= 100 },
    { name: "Sharpshooter", icon: "🎯", desc: "Score 50 Tournament Goals", category: "ATTACK", unlocked: overviewStats.scored >= 50 },
    { name: "Mastermind", icon: "🧠", desc: "Achieve 10 MOTM Awards", category: "SPECIAL", unlocked: overviewStats.motmAwards >= 10 },
    { name: "Wall of Steel", icon: "🧱", desc: "Maintain 15 Clean Sheets", category: "DEFENSE", unlocked: overviewStats.cleanSheets >= 15 },
    { name: "Hat-trick Hero", icon: "🎩", desc: "Score 5 Hat-Tricks", category: "ATTACK", unlocked: overviewStats.hatTricks >= 5 },
    { name: "Unstoppable", icon: "⚡", desc: "Reach 5 Win Streak", category: "SPECIAL", unlocked: overviewStats.winStreak >= 5 },
  ];

  // Career Records Data for Timeline
  const careerRecords = {
    mostGoalsMatch: (currentUser as any).mostGoalsInMatch || 0,
    careerStarted: (currentUser as any).createdAt || currentUser.dob || "N/A",
  };

  // Dynamic Timeline Feed Posts
  const journeyPosts = (currentUser as any).timelinePosts || [];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-28 font-sans relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Top Banner & Header Card */}
      <div className="relative w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] pt-8 pb-8 px-4 transition-colors">
        <div className="max-w-5xl mx-auto flex justify-between items-center mb-4 relative z-10">
          {/* Back Button (Useful if came from Ranking/Home) */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            ← BACK
          </button>

          {/* Only show Edit/Signout if it's the logged-in user's own profile */}
          {isOwnProfile && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditForm(currentUser);
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-md"
              >
                ✏️ EDIT
              </button>
              <button
                onClick={handleLogout}
                className="text-[10px] sm:text-xs font-black text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-md"
              >
                SIGN OUT ➔
              </button>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Avatar & Status */}
          <div className="relative mb-3">
            <button
              type="button"
              onClick={() => {
                const src = currentUser.avatar || "/logo.jpg";
                if (!src) return;

                if (src.startsWith("data:") || src.startsWith("blob:")) {
                  const imageWindow = window.open("");
                  if (imageWindow) {
                    imageWindow.document.write(
                      `<body style="margin:0; background:#0e0e0e; display:flex; align-items:center; justify-content:center; min-height:100vh;"><img src="${src}" style="max-width:100%; max-height:100vh; margin:auto; border-radius:12px;" /></body>`
                    );
                  }
                } else {
                  const fullUrl = src.startsWith("http")
                    ? src
                    : `${window.location.origin}${src.startsWith("/") ? "" : "/"}${src}`;
                  window.open(fullUrl, "_blank", "noopener,noreferrer");
                }
              }}
              title="View Profile Picture"
              className="block w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-[#D4AF37] overflow-hidden bg-black shadow-2xl relative group cursor-pointer hover:scale-105 transition-transform"
            >
              <Image
                src={currentUser.avatar || "/logo.jpg"}
                alt={currentUser.name || "User Avatar"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                🔍 Open
              </div>
            </button>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-0.5 rounded-md uppercase tracking-wider shadow-lg pointer-events-none">
              {currentUser.status || "FREE AGENT"}
            </span>
          </div>

          {/* User Name */}
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-wider text-[var(--text-main)] mt-3 font-serif">
            {currentUser.name}
          </h1>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {currentUser.facebook ? (
              <a
                href={currentUser.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Profile"
                className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#1877F2] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group"
              >
                <svg className="w-4 h-4 fill-[var(--text-muted)] group-hover:fill-[#1877F2] transition-colors" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-color)]/50 opacity-40 cursor-not-allowed flex items-center justify-center shadow-inner">
                <svg className="w-4 h-4 fill-[var(--text-muted)]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
            )}

            {cleanWhatsapp ? (
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`WhatsApp: ${currentUser.whatsapp}`}
                className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#25D366] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group"
              >
                <svg className="w-4 h-4 fill-[var(--text-muted)] group-hover:fill-[#25D366] transition-colors" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-color)]/50 opacity-40 cursor-not-allowed flex items-center justify-center shadow-inner">
                <svg className="w-4 h-4 fill-[var(--text-muted)]" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
            )}

            {currentUser.discord ? (
              <a
                href={
                  currentUser.discord.startsWith("http")
                    ? currentUser.discord
                    : `https://discord.com/users/${currentUser.discord}`
                }
                target="_blank"
                rel="noopener noreferrer"
                title={`Discord: ${currentUser.discord}`}
                className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#5865F2] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group"
              >
                <svg className="w-4 h-4 fill-[var(--text-muted)] group-hover:fill-[#5865F2] transition-colors" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-color)]/50 opacity-40 cursor-not-allowed flex items-center justify-center shadow-inner grayscale">
                <svg className="w-4 h-4 fill-[var(--text-muted)]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STABLE FIXED STICKY NAVIGATION BAR */}
      <div className="border-b border-[#D4AF37]/30 bg-[var(--bg-card)] backdrop-blur-md sticky top-0 z-40 shadow-2xl transition-all duration-300">
        <div className="max-w-5xl mx-auto flex items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto px-4 py-3.5 no-scrollbar text-xs font-black tracking-wider uppercase">
          {[
            "INFO",
            "ACHIEVEMENTS",
            "OVERVIEW",
            "SOLO",
            "FRANCHISE",
            "MILESTONES",
            "TIMELINE",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`shrink-0 px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#D4AF37] text-black font-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-6">
        
        {/* INFO TAB */}
        {activeTab === "INFO" && (
          <div className="space-y-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <span>🪪</span> AFFILIATIONS
              </h3>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
                  STATUS
                </span>
                <h4 className="text-sm font-black uppercase text-[var(--text-main)] mt-1">
                  {currentUser.status || "Free Agent"}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
                  No active contract
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <span>🎮</span> GAME SPECS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                  <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
                    KONAMI UID
                  </span>
                  <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
                    {currentUser.konamiId || "Not Provided"}
                  </h4>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                  <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
                    HARDWARE
                  </span>
                  <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
                    {currentUser.hardware || "Not Provided"}
                  </h4>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <span>👤</span> PROFILE DATA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                  <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase">
                    LOCATION
                  </span>
                  <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
                    {currentUser.location || "Not Set"}
                  </h4>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                  <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase flex items-center gap-1">
                    <span>🩸</span> BLOOD GROUP
                  </span>
                  <h4 className={`text-xs md:text-sm mt-1 ${currentUser.bloodGroup && currentUser.bloodGroup !== "Not Set" ? "text-red-500 font-black" : "text-[var(--text-main)] font-black"}`}>
                    {currentUser.bloodGroup || "Not Set"}
                  </h4>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                  <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase flex items-center gap-1">
                    <span>📅</span> DATE OF BIRTH
                  </span>
                  <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1">
                    {currentUser.dob || "Not Set"}
                  </h4>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl">
                  <span className="text-[10px] text-[var(--text-muted)] font-black block tracking-widest uppercase flex items-center gap-1">
                    <span>✉️</span> EMAIL ADDRESS
                  </span>
                  <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] mt-1 truncate">
                    {currentUser.email || "Not Set"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === "ACHIEVEMENTS" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-1 shadow-sm border-l-4 border-l-[#D4AF37]">
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <span>🏆</span> OFFICIAL MILESTONES & RANKING ACHIEVEMENTS
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Official tournament finishes and leaderboard rankings recorded automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl filter drop-shadow">🥇</span>
                  <span className={`text-2xl font-black ${achievements.championSolo > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {achievements.championSolo}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
                  Champion in solo tour
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Finished 1st Place</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl filter drop-shadow">🥈</span>
                  <span className={`text-2xl font-black ${achievements.runnerUpSolo > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {achievements.runnerUpSolo}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
                  Runner-up in solo tour
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Finished 2nd Place</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl filter drop-shadow">🥉</span>
                  <span className={`text-2xl font-black ${achievements.thirdPlaceSolo > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {achievements.thirdPlaceSolo}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
                  Third Place in solo tour
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Finished 3rd Place</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl filter drop-shadow">🏆</span>
                  <span className={`text-2xl font-black ${achievements.seasonTop10 > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {achievements.seasonTop10}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Season Top 10</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Ranked in Top 10 Overall</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl filter drop-shadow">🏅</span>
                  <span className={`text-2xl font-black ${achievements.monthTop5 > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {achievements.monthTop5}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Month Top 5</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Ranked in Top 5 Monthly</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl filter drop-shadow">🎗️</span>
                  <span className={`text-2xl font-black ${achievements.weekTop3 > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {achievements.weekTop3}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Week Top 3</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Ranked in Top 3 Weekly</p>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>⚽</span> GOALS & WINS MILESTONES
                </h3>
                <span className="text-[10px] font-black uppercase text-[var(--text-muted)] bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                  TOTAL WINS: {achievements.totalWins}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {milestoneGoals.map((target) => {
                  const isUnlocked = achievements.totalWins >= target;
                  const progressPct = Math.min(100, Math.round((achievements.totalWins / target) * 100));

                  return (
                    <div
                      key={target}
                      className={`p-3.5 rounded-xl border text-center transition-all duration-300 relative overflow-hidden ${
                        isUnlocked
                          ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg scale-105"
                          : "bg-[var(--bg-main)] border-[var(--border-color)] opacity-70"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{isUnlocked ? "⚡" : "🎯"}</span>
                      <h4 className="text-xs font-black text-[var(--text-main)] uppercase">
                        {target} {target === 50 ? "GOALS" : "WINS"}
                      </h4>
                      <div className="w-full bg-[var(--border-color)] h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div
                          className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-[var(--text-muted)] block mt-1.5 uppercase">
                        {isUnlocked ? "UNLOCKED" : `${progressPct}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "OVERVIEW" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1.5">
                  <span>⭐</span> OVR RATING
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-widest font-mono">
                  {overviewStats.ovrRating === 0 ? "00" : overviewStats.ovrRating.toLocaleString()}
                </h3>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1.5">
                  <span>🌐</span> GLOBAL RANK
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-[#D4AF37] tracking-widest font-mono">
                  {overviewStats.globalRank}
                </h3>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>🍰</span> PERFORMANCE ANALYTICS
                </h3>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as any)}
                  className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold px-3 py-1.5 rounded-xl outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="Overall">Overall</option>
                  <option value="Solo">Solo</option>
                  <option value="Franchise">Franchise</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg block mb-1">📚</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.matches}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">MATCHES</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg text-emerald-400 block mb-1">✓</span>
                  <h4 className="text-2xl font-black text-emerald-400">{overviewStats.wins}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">WINS</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg text-yellow-400 block mb-1">—</span>
                  <h4 className="text-2xl font-black text-yellow-400">{overviewStats.draws}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DRAWS</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg text-red-400 block mb-1">✕</span>
                  <h4 className="text-2xl font-black text-red-400">{overviewStats.losses}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">LOSSES</span>
                </div>
              </div>

              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                    <span className="text-yellow-400">⚡</span> OVERALL WIN RATE
                  </span>
                  <span className="text-[#D4AF37]">{overviewStats.winRate}%</span>
                </div>
                <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full" style={{ width: `${overviewStats.winRate}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>⚽</span> GOAL ANALYTICS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.scored}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">SCORED</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.conceded}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">CONCEDED</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-emerald-400">{overviewStats.goalDiff}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DIFFERENCE</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>🎖️</span> KEY MILESTONES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">🛡️</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.cleanSheets}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">CLEAN SHEETS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">⭐</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.motmAwards}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">MOTM AWARDS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">🔥</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.hatTricks}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">HAT-TRICKS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">💣</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{overviewStats.doubleHatTricks}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DOUBLE HT</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOLO TAB */}
        {activeTab === "SOLO" && (
          <div className="space-y-6 animate-fadeIn transition-all duration-300">
            
            {/* Header Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37] p-6 rounded-2xl text-center space-y-2 transition-all duration-300 shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-2">
                  <span>🏆</span> GAMES WON
                </span>
                <h3 className="text-4xl font-black text-[var(--text-main)] font-mono tracking-widest">
                  {soloStats.gamesWon}
                </h3>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37] p-6 rounded-2xl text-center space-y-2 transition-all duration-300 shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-2">
                  <span>🎯</span> SERIES PLAYED
                </span>
                <h3 className="text-4xl font-black text-[var(--text-main)] font-mono tracking-widest">
                  {soloStats.seriesPlayed}
                </h3>
              </div>
            </div>

            {/* MATCH RECORD */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>🏆</span> MATCH RECORD
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg block mb-1 text-emerald-400 font-bold">✓</span>
                  <h4 className="text-3xl font-black text-emerald-400">{soloStats.wins}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">WINS</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg block mb-1 text-amber-400 font-bold">—</span>
                  <h4 className="text-3xl font-black text-amber-400">{soloStats.draws}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DRAWS</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-lg block mb-1 text-red-400 font-bold">✕</span>
                  <h4 className="text-3xl font-black text-red-400">{soloStats.losses}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">LOSSES</span>
                </div>
              </div>

              {/* SOLO WIN RATE Bar */}
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                  <span className="flex items-center gap-2 text-[var(--text-main)]">
                    <span className="text-[#D4AF37]">⚡</span> SOLO WIN RATE
                  </span>
                  <span className="text-[#D4AF37] font-mono text-sm">{soloStats.winRate}%</span>
                </div>
                <div className="w-full bg-[var(--border-color)] h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-[#D4AF37] h-full rounded-full transition-all duration-700" style={{ width: `${soloStats.winRate}%` }} />
                </div>
              </div>
            </div>

            {/* GOAL ANALYTICS */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>⚽</span> GOAL ANALYTICS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{soloStats.scored}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">SCORED</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{soloStats.conceded}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">CONCEDED</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-emerald-400">{soloStats.goalDiff}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DIFFERENCE</span>
                </div>
              </div>
            </div>

            {/* GAME ANALYTICS */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>📊</span> GAME ANALYTICS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-3xl font-black text-emerald-400 font-mono">{soloStats.indvGamesWon}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">INDV. GAMES WON</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-3xl font-black text-red-400 font-mono">{soloStats.indvGamesLost}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">INDV. GAMES LOST</span>
                </div>
              </div>
            </div>

            {/* KEY MILESTONES */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>🎖️</span> KEY MILESTONES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">🛡️</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{soloStats.cleanSheets}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">CLEAN SHEETS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">🎩</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{soloStats.hatTricks}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">HAT-TRICKS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <span className="text-xl block mb-1">💣</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{soloStats.doubleHt}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DOUBLE HT</span>
                </div>
              </div>
            </div>

            {/* SOLO FORM (LAST 10) */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>📈</span> SOLO FORM
                </h3>
                <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase">(LAST 10)</span>
              </div>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-6 rounded-xl text-center">
                <p className="text-xs text-[var(--text-muted)] font-medium italic">No recent matches recorded.</p>
              </div>
            </div>

            {/* MATCH HISTORY */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>⚔️</span> MATCH HISTORY
              </h3>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-8 rounded-xl text-center">
                <p className="text-xs text-[var(--text-muted)] font-medium italic">No match history found.</p>
              </div>
            </div>

            {/* ADVANCED SOLO PRO INSIGHTS */}
            <div className="border-t-2 border-[#D4AF37]/20 pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>🔥</span> ADVANCED SOLO PRO INSIGHTS
                </h3>
                <span className="text-[9px] font-black text-black bg-[#D4AF37] px-2.5 py-0.5 rounded-md uppercase hidden sm:block">PRO ANALYTICS SUITE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-2 shadow-md hover:border-[#D4AF37] transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--text-main)] uppercase">🔥 CURRENT WIN STREAK</span>
                    <span className="text-xs font-mono font-black text-[#D4AF37]">{soloStats.currentStreak} MATCHES</span>
                  </div>
                  <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-[#D4AF37] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, soloStats.currentStreak * 10)}%` }} />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold">Consecutive victories in solo series.</p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-2 shadow-md hover:border-[#D4AF37] transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--text-main)] uppercase">⚽ AVG GOALS / MATCH</span>
                    <span className="text-xs font-mono font-black text-emerald-400">{soloStats.avgGoalsPerMatch}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold">Average goal ratio per tournament fixture.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-xl block mb-1">⚡</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">CLUTCH WIN RATE</span>
                  <h4 className="text-xl font-black text-[#D4AF37] font-mono">{soloStats.clutchWinRate}</h4>
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">Final-minute & Extra Time</span>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-xl block mb-1">♟️</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">FAVORITE FORMATION</span>
                  <h4 className="text-sm font-black text-[var(--text-main)]">{soloStats.favoriteFormation}</h4>
                  <span className="text-[9px] text-[#D4AF37] font-bold">Highest Win Rate Setup</span>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-xl block mb-1">🎯</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">PENALTY WIN RATE</span>
                  <h4 className="text-xl font-black text-emerald-400 font-mono">{soloStats.penaltyWinRate}</h4>
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">Shootout Record</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-[#D4AF37] transition-all">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] font-black uppercase">🔄 COMEBACK VICTORIES</span>
                    <h5 className="text-xl font-black text-[var(--text-main)] mt-0.5">{soloStats.comebackWins} Wins</h5>
                    <p className="text-[9px] text-[var(--text-muted)] font-semibold">Matches won after trailing in score.</p>
                  </div>
                  <span className="text-3xl">🛡️</span>
                </div>

                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/40 p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-[#D4AF37] transition-all">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] font-black uppercase">👑 SOLO MVP POINTS</span>
                    <h5 className="text-xl font-black text-[#D4AF37] font-mono mt-0.5">{soloStats.mvpPoints} PTS</h5>
                    <p className="text-[9px] text-[var(--text-muted)] font-semibold">Earned from match performance MVP badges.</p>
                  </div>
                  <span className="text-3xl">⭐</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* FRANCHISE TAB */}
        {activeTab === "FRANCHISE" && (
          <div className="space-y-6 animate-fadeIn transition-all duration-300">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>📊</span> FRANCHISE ANALYTICS
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-lg block mb-1">🎮</span>
                  <h4 className="text-3xl font-black text-[var(--text-main)]">{franchiseStats.matches}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">MATCHES</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-emerald-500/50 transition-all">
                  <span className="text-lg block mb-1 text-emerald-400 font-bold">✓</span>
                  <h4 className="text-3xl font-black text-emerald-400">{franchiseStats.wins}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">WINS</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-amber-500/50 transition-all">
                  <span className="text-lg block mb-1 text-amber-400 font-bold">—</span>
                  <h4 className="text-3xl font-black text-amber-400">{franchiseStats.draws}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DRAWS</span>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-red-500/50 transition-all">
                  <span className="text-lg block mb-1 text-red-400 font-bold">✕</span>
                  <h4 className="text-3xl font-black text-red-400">{franchiseStats.losses}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">LOSSES</span>
                </div>
              </div>

              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                  <span className="flex items-center gap-2 text-[var(--text-main)]">
                    <span className="text-[#D4AF37]">⚡</span> FRANCHISE WIN RATE
                  </span>
                  <span className="text-[#D4AF37] font-mono text-sm">{franchiseStats.winRate}%</span>
                </div>
                <div className="w-full bg-[var(--border-color)] h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-amber-300 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                    style={{ width: `${franchiseStats.winRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>⚽</span> GOAL ANALYTICS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{franchiseStats.scored}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">SCORED</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{franchiseStats.conceded}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">CONCEDED</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <h4 className="text-2xl font-black text-emerald-400">{franchiseStats.goalDiff}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DIFFERENCE</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>🎖️</span> KEY MILESTONES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-2xl block mb-1">🛡️</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{franchiseStats.cleanSheets}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">CLEAN SHEETS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-2xl block mb-1">⭐</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{franchiseStats.motmAwards}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">MOTM AWARDS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-2xl block mb-1">🔥</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{franchiseStats.hatTricks}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">HAT-TRICKS</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-2xl block mb-1">💣</span>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{franchiseStats.doubleHt}</h4>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-1 block">DOUBLE HT</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>📈</span> RECENT FORM
                </h3>
                <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase">(LAST 10)</span>
              </div>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-6 rounded-xl text-center">
                <p className="text-xs text-[var(--text-muted)] font-medium italic">No matches recorded.</p>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <span>⚔️</span> MATCH HISTORY
              </h3>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-8 rounded-xl text-center">
                <p className="text-xs text-[var(--text-muted)] font-medium italic">No match history found.</p>
              </div>
            </div>

            {/* ADVANCED CLUB & FRANCHISE INSIGHTS */}
            <div className="border-t-2 border-[#D4AF37]/20 pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>🚀</span> ADVANCED CLUB & FRANCHISE INSIGHTS
                </h3>
                <span className="text-[9px] font-black text-black bg-[#D4AF37] px-2.5 py-0.5 rounded-md uppercase hidden sm:block">PRO CLUB SUITE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">📜 ACTIVE CLUB CONTRACT</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/40 uppercase">ACTIVE</span>
                  </div>
                  <div className="bg-[var(--bg-main)] p-3 rounded-xl flex justify-between items-center border border-[var(--border-color)]">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Squad Role</span>
                      <h5 className="text-xs font-black text-[var(--text-main)]">{franchiseStats.contractRole}</h5>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase">Salary Tier</span>
                      <h5 className="text-xs font-black text-[#D4AF37]">Tier-1 Elite</h5>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">🧩 SQUAD SYNERGY SCORE</span>
                    <span className="text-xs font-mono font-black text-[#D4AF37]">{franchiseStats.clubSynergy}%</span>
                  </div>
                  <div className="w-full bg-[var(--border-color)] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-emerald-400 to-[#D4AF37] h-full rounded-full transition-all duration-500" style={{ width: `${franchiseStats.clubSynergy}%` }} />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold">Calculated from dynamic duo chemistry & squad pass completion.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-lg block mb-1">👥</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">BEST DUO PARTNER</span>
                  <h4 className="text-sm font-black text-[var(--text-main)]">{franchiseStats.bestDuoPartner}</h4>
                  <span className="text-[9px] text-[#D4AF37] font-bold">Win Rate: {franchiseStats.duoWinRate}</span>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-lg block mb-1">🔥</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">PRESSURE MATCH WIN %</span>
                  <h4 className="text-xl font-black text-amber-400 font-mono">{franchiseStats.pressureWinRate}</h4>
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">Title-decider & Knockouts</span>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-lg block mb-1">⭐</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">SQUAD IMPACT RATING</span>
                  <h4 className="text-xl font-black text-emerald-400 font-mono">{franchiseStats.squadImpactRating} / 10</h4>
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">Overall Game Contribution</span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-md">
                <h4 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
                  <span>🏟️</span> FIXTURE SPLIT & DEFENSIVE EFFICIENCY
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[var(--bg-main)] p-3 rounded-xl text-center border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-black block">HOME FIXTURE WIN %</span>
                    <h5 className="text-lg font-black text-[#D4AF37] font-mono">{franchiseStats.homeWinRate}</h5>
                  </div>
                  <div className="bg-[var(--bg-main)] p-3 rounded-xl text-center border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-black block">AWAY FIXTURE WIN %</span>
                    <h5 className="text-lg font-black text-[#D4AF37] font-mono">{franchiseStats.awayWinRate}</h5>
                  </div>
                  <div className="bg-[var(--bg-main)] p-3 rounded-xl text-center border border-[var(--border-color)]">
                    <span className="text-[10px] text-[var(--text-muted)] font-black block">CLEAN SHEETS PER 90</span>
                    <h5 className="text-lg font-black text-emerald-400 font-mono">{franchiseStats.cleanSheetsPer90}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === "MILESTONES" && (
          <div className="space-y-6 animate-fadeIn transition-all duration-300">
            
            {/* SUB TAB TOGGLE */}
            <div className="flex items-center justify-center gap-3 bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)] max-w-md mx-auto shadow-md">
              <button
                onClick={() => setMilestoneSubTab("BADGES")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  milestoneSubTab === "BADGES"
                    ? "bg-[#D4AF37] text-black shadow-md scale-105"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                <span>🔒</span> UNLOCKED BADGES
              </button>
              <button
                onClick={() => setMilestoneSubTab("PROGRESSION")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  milestoneSubTab === "PROGRESSION"
                    ? "bg-[#D4AF37] text-black shadow-md scale-105"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                <span>📊</span> PROGRESSION
              </button>
            </div>

            {/* Sub-Tab 1: UNLOCKED BADGES */}
            {milestoneSubTab === "BADGES" && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider hidden sm:inline">BADGE VAULT</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                    {(["ALL", "ATTACK", "DEFENSE", "SPECIAL"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMilestoneFilter(cat)}
                        className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                          milestoneFilter === cat
                            ? "bg-[#D4AF37] text-black"
                            : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {badgeList
                    .filter((b) => milestoneFilter === "ALL" || b.category === milestoneFilter)
                    .map((badge, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                          badge.unlocked
                            ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg"
                            : "bg-[var(--bg-card)] border-[var(--border-color)] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <span className="text-2xl block">{badge.icon}</span>
                        <h4 className="text-[11px] font-black text-[var(--text-main)] uppercase">{badge.name}</h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-semibold leading-tight">{badge.desc}</p>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded border block uppercase ${badge.unlocked ? "text-[#D4AF37] border-[#D4AF37] bg-[#D4AF37]/10" : "text-[var(--text-muted)] bg-[var(--bg-main)] border-[var(--border-color)]"}`}>
                          {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* Sub-Tab 2: PROGRESSION */}
            {milestoneSubTab === "PROGRESSION" && (
              <div className="space-y-4">
                {progressionList
                  .filter((item) => milestoneFilter === "ALL" || item.category === milestoneFilter)
                  .map((item, idx) => {
                    const remaining = Math.max(0, item.next - item.current);
                    const pct = Math.min(100, Math.round((item.current / item.next) * 100));

                    return (
                      <div
                        key={idx}
                        className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 p-5 rounded-2xl transition-all shadow-md space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span> {item.title}
                          </h4>
                          <span className="text-[10px] font-black uppercase bg-[var(--bg-main)] text-[#D4AF37] px-3 py-1 rounded-full border border-[var(--border-color)] font-mono">
                            Next: {item.next}
                          </span>
                        </div>

                        <div className="w-full bg-[var(--border-color)] h-2.5 rounded-full overflow-hidden p-0.5">
                          <div
                            className="bg-gradient-to-r from-[#D4AF37] to-amber-300 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-muted)] font-mono">
                          <span>{item.current} current</span>
                          <span>{remaining} remaining</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* MILESTONE PRESTIGE & MASTERY SUITE */}
            <div className="border-t-2 border-[#D4AF37]/20 pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <span>💎</span> MILESTONE PRESTIGE & MASTERY SUITE
                </h3>
                <span className="text-[9px] font-black text-black bg-[#D4AF37] px-2.5 py-0.5 rounded-md uppercase hidden sm:block">PRESTIGE SYSTEM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">⭐ TOTAL MILESTONE XP</span>
                    <span className="text-xs font-mono font-black text-[#D4AF37]">0 / 5,000 XP</span>
                  </div>
                  <div className="w-full bg-[var(--border-color)] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-amber-500 to-[#D4AF37] h-full rounded-full w-0" />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold">Earn XP for every progression step unlocked.</p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">🏅 PRESTIGE TIER</span>
                    <span className="text-[10px] bg-[#D4AF37] text-black font-black px-2.5 py-0.5 rounded uppercase">BRONZE NOVICE</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold">Unlock 5 Gold Badges to upgrade to Silver Tier status.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-2 hover:border-[#D4AF37] transition-all">
                  <span className="text-xl block">🎁</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">CLAIMABLE MASTERY REWARDS</span>
                  <button className="w-full bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] font-black text-[10px] py-1.5 rounded-xl uppercase cursor-not-allowed">
                    NO REWARDS READY
                  </button>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-xl block">👑</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">UPCOMING REWARD UNLOCK</span>
                  <h5 className="text-xs font-black text-[#D4AF37]">Gold Avatar Frame</h5>
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">At 50 Appearances</span>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
                  <span className="text-xl block">🌍</span>
                  <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">MILESTONE RANKING</span>
                  <h5 className="text-base font-black text-[var(--text-main)] font-mono">Unranked</h5>
                  <span className="text-[9px] text-[var(--text-muted)] font-semibold">0% Completion Rate</span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
                    <span>✨</span> RAREST UNLOCKED BADGE SHOWCASE
                  </h4>
                  <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase hidden sm:inline">COMMUNITY RARITY: N/A</span>
                </div>
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
                  <p className="text-xs text-[var(--text-muted)] font-medium italic">Unlock rare achievements to showcase them on your profile header.</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "TIMELINE" && (
          <div className="space-y-6 animate-fadeIn transition-all duration-300">
            
            {/* CAREER RECORDS SECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <span>📊</span> CAREER RECORDS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 rounded-2xl flex items-center gap-4 transition-all shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-2xl shrink-0">
                    ⚽
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">
                      MOST GOALS IN A MATCH
                    </span>
                    <h4 className="text-2xl font-black text-[var(--text-main)] font-mono">
                      {careerRecords.mostGoalsMatch}
                    </h4>
                  </div>
                </div>

                <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 rounded-2xl flex items-center gap-4 transition-all shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-2xl shrink-0">
                    📅
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">
                      CAREER STARTED
                    </span>
                    <h4 className="text-lg font-black text-[var(--text-main)] font-mono">
                      {careerRecords.careerStarted}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* JOURNEY TIMELINE SECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <span>📜</span> JOURNEY TIMELINE
              </h3>

              {journeyPosts && journeyPosts.length > 0 ? (
                <div className="space-y-3">
                  {journeyPosts.map((post: any, idx: number) => (
                    <div
                      key={post.id || idx}
                      onClick={() => {
                        if (post.newsUrl || post.link) {
                          router.push(post.newsUrl || post.link);
                        }
                      }}
                      className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37] p-4 rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{post.icon || "📰"}</span>
                        <div>
                          <h4 className="text-xs font-black uppercase text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 line-clamp-1">
                            {post.summary || post.description || "Click to view full news details"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 rounded-xl uppercase shrink-0 hidden sm:inline-block">
                        READ NEWS ➔
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-10 text-center space-y-3 shadow-lg">
                  <div className="text-3xl block filter drop-shadow">⏳</div>
                  <p className="text-xs text-[var(--text-muted)] font-medium max-w-sm mx-auto">
                    The journey has not begun. Play matches to build your timeline.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Profile Settings Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-card)] border-2 border-[#D4AF37] rounded-3xl p-6 max-w-2xl w-full space-y-5 my-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider">
                ⚙️ PROFILE SETTINGS
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[var(--text-main)] hover:text-[#D4AF37] font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-bold">
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
                    onChange={handleImageUpload}
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
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]"><div className="text-[#D4AF37] font-black tracking-widest animate-pulse">LOADING PROFILE...</div></div>}>
      <ProfileContent />
    </Suspense>
  );
}