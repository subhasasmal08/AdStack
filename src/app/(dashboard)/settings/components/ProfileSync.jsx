"use client";

import React, { useState } from 'react';
import { User, RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

const SYNC_STEPS = [
  "Syncing Ad Units from AdMob",
  "Syncing Countries from AdMob",
  "Syncing Formats from AdMob",
  "Syncing Ad Sources from AdMob",
  "Syncing Revenue States from AdMob",
  "Syncing Mediation Group Details from AdMob",
  "Syncing Inventory Details from Firebase",
  "Syncing DAU and DAV from Firebase",
  "Syncing App Logs from Firebase"
];

export default function ProfileSync({ user, onSave, onAddLog }) {
  const [f, sF] = useState({
    company: user?.c || "AdStack Labs",
    email: user?.e || "jekin@adstack.io",
    phone: user?.ph || "+91 98765 43210",
    companyAge: "5"
  });

  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Mar 30, 2025 — 02:15 AM");
  const [syncStep, setSyncStep] = useState(-1);

  const u = (k) => (e) => sF({ ...f, [k]: e.target.value });

  const doSync = () => {
    setSyncing(true);
    setSyncStep(0);
    let i = 0;
    
    const tick = () => {
      if (i < SYNC_STEPS.length - 1) {
        i++;
        setSyncStep(i);
        setTimeout(tick, 650);
      } else {
        setTimeout(() => {
          setSyncing(false);
          setSyncStep(-1);
          const t = new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
          setLastSync(t);
          toast.success("Publisher profile synced successfully");
          if (onAddLog) onAddLog("Publisher profile synced");
        }, 650);
      }
    };
    setTimeout(tick, 650);
  };

  const handleSaveProfile = () => {
    onSave({
      ...user,
      c: f.company,
      e: f.email,
      ph: f.phone
    });
    toast.success("Account profile updated");
    if (onAddLog) onAddLog("Profile updated");
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <User size={16} /> Account Details
          </h2>
          <button 
            onClick={handleSaveProfile}
            className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-xs px-4 py-2 rounded-xl border-none outline-none cursor-pointer"
          >
            Save Profile
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company Name</label>
            <input className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none" value={f.company} onChange={u("company")}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company Age (years)</label>
              <input className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none" type="number" value={f.companyAge} onChange={u("companyAge")}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
              <input className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none" value={f.phone} onChange={u("phone")}/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email (Username)</label>
            <input className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none" type="email" value={f.email} onChange={u("email")}/>
          </div>
        </div>
      </div>

      <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <RefreshCw size={15} /> Sync Publisher Profile
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button 
              className="bg-brand hover:opacity-90 disabled:opacity-60 text-white font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer border-none outline-none flex items-center gap-1"
              onClick={doSync} 
              disabled={syncing}
            >
              {syncing && <RefreshCw size={12} className="animate-spin" />}
              <span>{syncing ? "Syncing..." : "Sync Now"}</span>
            </button>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0 border",
              syncing 
                ? "bg-brand/10 border-brand/20 text-brand" 
                : "bg-slate-800 border-slate-700 text-slate-400"
            )}>
              {syncing ? "In Progress" : "Idle"}
            </span>
            <span className="text-xs text-slate-500 font-semibold">Last sync: {lastSync}</span>
          </div>

          {syncing && (
            <div className="bg-[#1A1F2B] border border-[#1E293B] rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Real-time Sync Status</div>
              <div className="space-y-2.5">
                {SYNC_STEPS.map((step, si) => {
                  const done = si < syncStep;
                  const act = si === syncStep;
                  return (
                    <div 
                      key={si} 
                      className={cn(
                        "flex items-center gap-2.5 text-xs transition-all",
                        done || act ? "text-slate-300" : "text-slate-500 opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                        done ? "bg-[#052E16] text-[#4ADE80]" : act ? "bg-brand/20 text-brand animate-pulse" : "bg-slate-850 text-slate-600"
                      )}>
                        {done ? "✓" : act ? "⟳" : "○"}
                      </div>
                      <span className={act ? "font-semibold text-slate-200" : ""}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
