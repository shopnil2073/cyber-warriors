"use client";

import React, { useState, useEffect, ChangeEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getActiveUser,
  updateActiveUserProfile,
  logoutPlayer,
  getAllUsers,
  UserProfile,
  EMPTY_USER,
} from "../utils/userStore";

import HeaderSection from "./components/HeaderSection";
import TabNavigation from "./components/TabNavigation";
import InfoTab from "./components/InfoTab";
import AchievementsTab from "./components/AchievementsTab";
import OverviewTab from "./components/OverviewTab";
import SoloTab from "./components/SoloTab";
import FranchiseTab from "./components/FranchiseTab";
import MilestonesTab from "./components/MilestonesTab";
import TimelineTab from "./components/TimelineTab";
import ProfileEditModal from "./components/ProfileEditModal";

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

  const [calculatedRank, setCalculatedRank] = useState<string>("#1");
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

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
        
        setIsOwnProfile(active ? active.id === displayUser.id || active.email === displayUser.email : false);
      } else {
        router.push("/sign-in");
      }
    };

    loadProfileData();
  }, [router, queryId, overrideUser]);

  const fetchAndCalculateRank = (user: UserProfile, allPlayers: UserProfile[]) => {
    try {
      if (!allPlayers || allPlayers.length === 0) {
        setCalculatedRank("#1");
        return;
      }

      const sortedPlayers = [...allPlayers].sort((a: any, b: any) => {
        const ratingA = Number(a.ovrRating || a.rating || 0);
        const ratingB = Number(b.ovrRating || b.rating || 0);
        return ratingB - ratingA;
      });

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

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateActiveUserProfile(editForm);
    setCurrentUser(editForm);
    window.dispatchEvent(new Event("cw_auth_change"));
    setIsEditing(false);
  };

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

  const getCleanWhatsappNumber = (phoneStr?: string) => {
    if (!phoneStr) return "";
    return phoneStr.replace(/\D/g, "");
  };

  const cleanWhatsapp = getCleanWhatsappNumber(currentUser.whatsapp);

  const achievements = {
    championSolo: (currentUser as any).championSolo || 0,
    runnerUpSolo: (currentUser as any).runnerUpSolo || 0,
    thirdPlaceSolo: (currentUser as any).thirdPlaceSolo || 0,
    seasonTop10: (currentUser as any).seasonTop10 || 0,
    monthTop5: (currentUser as any).monthTop5 || 0,
    weekTop3: (currentUser as any).weekTop3 || 0,
    totalWins: (currentUser as any).soloWins || (currentUser as any).wins || 0,
    totalGoals: (currentUser as any).scored || (currentUser as any).totalGoals || 0,
  };

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

  const badgeList = [
    { name: "Centurion", icon: "🛡️", desc: "Play 100 Official Matches", category: "SPECIAL", unlocked: overviewStats.matches >= 100 },
    { name: "Sharpshooter", icon: "🎯", desc: "Score 50 Tournament Goals", category: "ATTACK", unlocked: overviewStats.scored >= 50 },
    { name: "Mastermind", icon: "🧠", desc: "Achieve 10 MOTM Awards", category: "SPECIAL", unlocked: overviewStats.motmAwards >= 10 },
    { name: "Wall of Steel", icon: "🧱", desc: "Maintain 15 Clean Sheets", category: "DEFENSE", unlocked: overviewStats.cleanSheets >= 15 },
    { name: "Hat-trick Hero", icon: "🎩", desc: "Score 5 Hat-Tricks", category: "ATTACK", unlocked: overviewStats.hatTricks >= 5 },
    { name: "Unstoppable", icon: "⚡", desc: "Reach 5 Win Streak", category: "SPECIAL", unlocked: overviewStats.winStreak >= 5 },
  ];

  // Registration / Join Date formatting
  const registrationDate = (currentUser as any).joinedAt || (currentUser as any).registeredAt || (currentUser as any).createdAt;
  const careerStartedFormatted = registrationDate 
    ? new Date(registrationDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
    : "Recently Joined";

  const careerRecords = {
    mostGoalsMatch: (currentUser as any).mostGoalsInMatch || 0,
    careerStarted: careerStartedFormatted,
  };

  const journeyPosts = (currentUser as any).timelinePosts || [];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-28 font-sans relative selection:bg-[#D4AF37] selection:text-black">
      <HeaderSection
        currentUser={currentUser}
        isOwnProfile={isOwnProfile}
        cleanWhatsapp={cleanWhatsapp}
        onBack={() => router.back()}
        onEditClick={() => {
          setEditForm(currentUser);
          setIsEditing(true);
        }}
        onLogoutClick={handleLogout}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-6">
        {activeTab === "INFO" && (
          <InfoTab currentUser={currentUser} isOwnProfile={isOwnProfile} />
        )}

        {activeTab === "ACHIEVEMENTS" && (
          <AchievementsTab achievements={achievements} />
        )}

        {activeTab === "OVERVIEW" && (
          <OverviewTab
            overviewStats={overviewStats}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
        )}

        {activeTab === "SOLO" && <SoloTab soloStats={soloStats} />}

        {activeTab === "FRANCHISE" && (
          <FranchiseTab franchiseStats={franchiseStats} />
        )}

        {activeTab === "MILESTONES" && (
          <MilestonesTab
            milestoneSubTab={milestoneSubTab}
            setMilestoneSubTab={setMilestoneSubTab}
            milestoneFilter={milestoneFilter}
            setMilestoneFilter={setMilestoneFilter}
            badgeList={badgeList}
            progressionList={progressionList}
          />
        )}

        {activeTab === "TIMELINE" && (
          <TimelineTab
            careerRecords={careerRecords}
            journeyPosts={journeyPosts}
            router={router}
          />
        )}
      </div>

      {isEditing && (
        <ProfileEditModal
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveEdit}
          onClose={() => setIsEditing(false)}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
          <div className="text-[#D4AF37] font-black tracking-widest animate-pulse">
            LOADING PROFILE...
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}