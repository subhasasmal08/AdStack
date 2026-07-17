"use client";

import React, { useState } from 'react';
import { Check, Star, Pin, Trash2, ShieldAlert, Flag, MessageSquare, MoreHorizontal, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

const SEV_COLORS = {
  critical: { bg: "bg-red-500/10", border: "border-red-500", text: "text-red-400", fill: "bg-red-500", label: "Critical" },
  high: { bg: "bg-orange-500/10", border: "border-orange-500", text: "text-orange-400", fill: "bg-orange-500", label: "High" },
  medium: { bg: "bg-blue-500/10", border: "border-blue-500", text: "text-blue-400", fill: "bg-blue-500", label: "Medium" },
  low: { bg: "bg-emerald-500/10", border: "border-emerald-500", text: "text-emerald-400", fill: "bg-emerald-500", label: "Low" }
};

const TYPE_LABELS = {
  revenue_drop_sudden: "Revenue Drop",
  revenue_drop_continuous: "Revenue Decline",
  requests_drop_sudden: "Requests Drop",
  requests_drop_continuous: "Requests Decline",
  policy_change: "Policy Change",
  policy_violation: "Policy Violation",
  dau_drop: "DAU Drop",
  dau_dav_gap: "DAU-DAV Gap"
};

export default function AlertCard({
  alert,
  selected,
  toggleSelect,
  expanded,
  toggleExpand,
  onViewDetail,
  toggleStar,
  togglePin,
  handleDelete,
  onReportFalse,
  onFeedback
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sev = SEV_COLORS[alert.severity] || SEV_COLORS.medium;

  const renderEvTable = (data) => {
    if (!data?.length) return null;
    const keys = Object.keys(data[0]);
    return (
      <div className="overflow-x-auto mt-2 rounded-lg border border-[#252838]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#191C28] text-slate-400 font-bold border-b border-[#252838]">
              {keys.map(k => <th key={k} className="py-2 px-3 capitalize">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[#252838]/60 text-slate-300 last:border-none">
                {keys.map(k => <td key={k} className="py-2 px-3 font-medium font-sans">{row[k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "bg-[#11141D] border rounded-[20px] transition-all duration-300 overflow-hidden relative",
        alert.pinned ? "border-brand/30 shadow-md shadow-brand/5" : "border-[#1E293B] hover:border-slate-700"
      )}
    >
      {/* Pinned Tag Indicator */}
      {alert.pinned && (
        <div className="absolute top-0 right-0 bg-brand/10 border-b border-l border-brand/20 text-brand text-[9px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
          <Pin size={10} className="fill-brand" /> Pinned
        </div>
      )}

      {/* Main Alert Card Header Click zone */}
      <div 
        className="p-5 flex items-start gap-4 cursor-pointer select-none"
        onClick={toggleExpand}
      >
        {/* Selection Checkbox */}
        <div 
          onClick={(e) => { e.stopPropagation(); toggleSelect(alert.id); }}
          className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer mt-1",
            selected 
              ? "bg-brand border-brand text-white" 
              : "border-[#2A3447] hover:border-slate-500 bg-[#1A1F2B]"
          )}
        >
          {selected && <Check size={12} strokeWidth={3} />}
        </div>

        {/* Severity Dot vertical bar */}
        <div className={cn("w-1.5 self-stretch rounded-full shrink-0", sev.fill)} />

        {/* Alert details */}
        <div className="flex-1 space-y-1 min-w-0 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            {alert.starred && <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
            <span className="font-bold text-[15px] text-foreground leading-snug truncate max-w-xl">{alert.title}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold flex-wrap">
            <span className="text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">{alert.app}</span>
            <span>&middot;</span>
            <span>{alert.date}</span>
          </div>

          <p className="text-xs text-slate-400 font-semibold line-clamp-2 mt-1">{alert.desc}</p>

          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase", sev.bg, sev.text)}>
              {sev.label}
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#1A1F2B] border border-[#2A3447] text-slate-300 uppercase">
              {TYPE_LABELS[alert.type] || alert.type}
            </span>
          </div>
        </div>

        {/* Dropdown Options menu */}
        <div className="flex flex-col items-end gap-3 self-stretch justify-between" onClick={e => e.stopPropagation()}>
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-foreground hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
            >
              <MoreHorizontal size={16} />
            </button>
            
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1.5 bg-[#161922] border border-[#2A3447] rounded-xl py-1.5 w-40 z-20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    onClick={() => { togglePin(alert.id); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Pin size={13} className={alert.pinned ? "fill-slate-300" : ""} />
                    <span>{alert.pinned ? "Unpin Alert" : "Pin Alert"}</span>
                  </button>
                  <button 
                    onClick={() => { toggleStar(alert.id); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Star size={13} className={alert.starred ? "fill-amber-400 text-amber-400" : ""} />
                    <span>{alert.starred ? "Unstar Alert" : "Star Alert"}</span>
                  </button>
                  <button 
                    onClick={() => { onReportFalse(alert.id); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Flag size={13} />
                    <span>Report False</span>
                  </button>
                  <button 
                    onClick={() => { onFeedback(alert.id); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Feedback</span>
                  </button>
                  <div className="h-px bg-[#2A3447] my-1" />
                  <button 
                    onClick={() => { handleDelete(alert.id); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete Alert</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <ChevronDown 
            size={18} 
            className={cn("text-slate-500 transition-transform duration-200", expanded ? "rotate-180" : "")} 
          />
        </div>
      </div>

      {/* Expanded Root Cause Analysis Inline Panel */}
      {expanded && (
        <div className="p-6 border-t border-[#1E293B] bg-[#0E1017] space-y-5 animate-in slide-in-from-top-2 duration-250">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B]/70 pb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-brand" /> Root Cause Analysis
            </h4>
            <button 
              disabled={true}
              className="bg-slate-800 border border-slate-700 text-slate-500 font-semibold text-xs px-3.5 py-1.5 rounded-lg cursor-not-allowed opacity-50"
            >
              View Detailed Apollo Report &rsaquo;
            </button>
          </div>

          <div className="space-y-4">
            {alert.rca.map((r, ri) => (
              <div key={ri} className="bg-[#11141D] border border-[#252838] rounded-xl p-4 space-y-3">
                <div className="text-[13px] font-bold text-slate-200">{r.p}</div>
                
                {r.ev.map((e, ei) => (
                  <div key={ei} className="space-y-1">
                    <div className="text-[11px] font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" /> {e.label}
                    </div>
                    {renderEvTable(e.data)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
