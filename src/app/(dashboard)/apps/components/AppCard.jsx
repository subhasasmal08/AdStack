"use client";

import React, { useState } from 'react';
import { Pin, MoreHorizontal, Eye, Settings, Trash2, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AppCard({ 
  app, 
  index, 
  pinned, 
  togglePin, 
  onClick, 
  onDelete, 
  colors 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPinned = pinned.has(app.id);

  // Formatting helpers
  const formatInstalls = (num) => {
    if (!num) return "—";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  const formatNumber = (num) => {
    if (!num) return "—";
    return num.toLocaleString();
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#11141D] border rounded-[20px] p-5 flex flex-col justify-between transition-all duration-300 relative group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/25",
        isPinned ? "border-brand/40 shadow-md shadow-brand/5" : "border-[#1E293B] hover:border-slate-700"
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-8">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0", colors[index % colors.length])}>
              {app.app?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <h3 className="text-[14.5px] font-bold text-foreground leading-tight tracking-wide truncate">{app.app}</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate">
                {app.plat} &middot; {app.cats?.[0] || "App"} &middot; {app.net || "Mediation"}
              </p>
            </div>
          </div>

          {/* Action Menu Dots */}
          <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-foreground hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
            >
              <MoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1.5 bg-[#161922] border border-[#2A3447] rounded-xl py-1.5 w-36 z-20 shadow-2xl animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => { onClick(); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Open App</span>
                  </button>
                  <button
                    onClick={() => { onClick(); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Settings size={13} />
                    <span>Configure</span>
                  </button>
                  <button
                    onClick={(e) => { togglePin(app.id, e); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Pin size={13} className={isPinned ? "fill-slate-300" : ""} />
                    <span>{isPinned ? "Unpin App" : "Pin App"}</span>
                  </button>
                  <div className="h-px bg-[#2A3447] my-1" />
                  <button
                    onClick={() => { if (onDelete) onDelete(app.id, app.app); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete App</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2.5 pt-4 mt-4 border-t border-[#1E293B]/70">
          <div>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Installs</span>
            <span className="text-[13px] font-bold text-slate-200 font-mono mt-0.5 block">{formatInstalls(app.installs)}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg DAV</span>
            <span className="text-[13px] font-bold text-slate-200 font-mono mt-0.5 block">{formatNumber(app.avg_dav)}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ads Share</span>
            <span className="text-[13px] font-bold text-slate-200 font-mono mt-0.5 block">{app.income_ads_pct || 0}%</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ad Units</span>
            <span className="text-[13px] font-bold text-slate-200 font-mono mt-0.5 block">{app.invs?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Bottom Tags List */}
      <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-[#1E293B]/40">
        {/* COPPA children directed */}
        {app.child_directed_coppa && (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-800/80 border border-slate-700 text-slate-400 select-none">
            COPPA
          </span>
        )}

        {/* Serving limited tag */}
        {app.ad_serving_limit_active && (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-red-500/10 border border-red-500/20 text-red-400 select-none">
            serving-limited
          </span>
        )}

        {/* Onboarding / Sync status */}
        {app.status === "onboarding" && (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-brand/10 border border-brand/20 text-brand select-none animate-pulse">
            syncing data
          </span>
        )}

        {/* Violation tag */}
        {app.violations?.length > 0 && (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-orange-500/10 border border-orange-500/20 text-orange-400 select-none flex items-center gap-1">
            <ShieldAlert size={10} /> {app.violations.length} violation{app.violations.length > 1 ? "s" : ""}
          </span>
        )}

        {/* Priority Badge when no other tags are present */}
        {!app.child_directed_coppa && !app.ad_serving_limit_active && app.status !== "onboarding" && (!app.violations || app.violations.length === 0) && (
          <span className={cn(
            "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border select-none",
            (app.priority === "Critical" || app.priority === "High")
              ? "bg-[#2D1A0F] text-[#F97316] border-[#C2410C]/20"
              : "bg-[#1E293B] text-[#94A3B8] border-[#334155]/20"
          )}>
            {app.priority || "Medium"}
          </span>
        )}
      </div>
    </div>
  );
}
