"use client";

import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface TimelineTabProps {
  careerRecords: {
    mostGoalsMatch: number;
    careerStarted: string;
  };
  journeyPosts: any[];
  router: AppRouterInstance;
}

export default function TimelineTab({
  careerRecords,
  journeyPosts,
  router,
}: TimelineTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn transition-all duration-300">
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
  );
}