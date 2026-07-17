"use client";

import React, { useState } from 'react';
import { FileText, Trash2, Search, ChevronDown, Check, MoreHorizontal, Flag, Star, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

// ══════════════ DATASET ══════════════
const INITIAL_REPORTS = [
  {
    id: 1,
    title: "Q1 2025 Revenue Analysis",
    date: "Apr 1, 2025",
    app: "All Apps",
    criticality: "High",
    status: "completed",
    summary: "Ad revenue up 18.3% vs Q4. Rewarded video eCPM +24%, fill rates improved. Total: $52,340. UA costs -12%, LTV +31%."
  },
  {
    id: 2,
    title: "Ad Performance Audit - Puzzle Quest",
    date: "Apr 2, 2025",
    app: "Puzzle Quest Pro",
    criticality: "Medium",
    status: "completed",
    summary: "Audited 3 placements. Interstitials: $8.50 eCPM, 34% skip rate. Rewarded: 92% completion, $14.30 eCPM."
  },
  {
    id: 3,
    title: "User Retention & Monetization",
    date: "Apr 3, 2025",
    app: "FitTrack",
    criticality: "Critical",
    status: "flagged",
    summary: "Users >5 ads/session churn 2.3x faster. Rewarded users: 60% higher D30 retention."
  },
  {
    id: 4,
    title: "Weekly Performance Snapshot",
    date: "Apr 4, 2025",
    app: "Puzzle Quest Pro",
    criticality: "Medium",
    status: "completed",
    summary: "Weekly KPIs trending up across all formats."
  },
  {
    id: 5,
    title: "eCPM Optimization Audit",
    date: "Apr 5, 2025",
    app: "FitTrack",
    criticality: "High",
    status: "completed",
    summary: "Banner eCPM lagging benchmarks by 18%."
  },
  {
    id: 6,
    title: "Mediation Stack Review",
    date: "Apr 6, 2025",
    app: "All Apps",
    criticality: "Low",
    status: "completed",
    summary: "Current waterfall is efficient. Minor tweaks suggested."
  },
  {
    id: 7,
    title: "Fill Rate Anomaly Q2",
    date: "Apr 7, 2025",
    app: "BookWorm Reader",
    criticality: "Critical",
    status: "flagged",
    summary: "Fill rate dropped to 62% on iOS 17.4 devices."
  },
  {
    id: 8,
    title: "UA Campaign ROI",
    date: "Apr 8, 2025",
    app: "SpeedRacer 3D",
    criticality: "High",
    status: "completed",
    summary: "UA spend ROI at 1.8x — within target."
  },
  {
    id: 9,
    title: "Monthly Revenue Report",
    date: "Apr 9, 2025",
    app: "All Apps",
    criticality: "Medium",
    status: "completed",
    summary: "Total revenue $84,200 (+12% MoM)."
  },
  {
    id: 10,
    title: "Crash Impact on Ad Revenue",
    date: "Apr 10, 2025",
    app: "CloudNotes",
    criticality: "Critical",
    status: "flagged",
    summary: "ANR crashes correlate with -22% ad revenue."
  },
  {
    id: 11,
    title: "Rewarded Video Deep Dive",
    date: "Apr 11, 2025",
    app: "MeditateNow",
    criticality: "Low",
    status: "completed",
    summary: "Rewarded performing above industry avg."
  },
  {
    id: 12,
    title: "Quarterly Health Check",
    date: "Apr 12, 2025",
    app: "All Apps",
    criticality: "High",
    status: "completed",
    summary: "All apps healthy. 2 minor warnings."
  }
];

const CRIT_COLORS = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/25",
  High: "bg-orange-500/10 text-orange-400 border border-orange-500/25",
  Medium: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
  Low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
};

export default function ReportsPage() {
  const [reps, setReps] = useState(INITIAL_REPORTS.map(r => ({ ...r, starred: false })));
  
  // Search & Filters
  const [query, setQuery] = useState('');
  const [fApp, setFApp] = useState('all');
  const [fCrit, setFCrit] = useState('all');
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // List states
  const [selected, setSelected] = useState(new Set());
  const [menuId, setMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const R_PER = 6;

  // Modals state
  const [modal, setModal] = useState(null); // { type: 'feedback'|'report', rid: number }
  const [modalText, setModalText] = useState('');

  const critOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const allApps = [...new Set(reps.map(r => r.app))];

  const parseDate = (d) => new Date(d.replace(/(\w+)\s(\d+),\s(\d+)/, "$1 $2, $3"));

  // Toggle selection
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(r => r.id)));
    }
  };

  // Star / Delete
  const handleToggleStar = (id) => {
    setReps(prev => prev.map(r => r.id === id ? { ...r, starred: !r.starred } : r));
    const target = reps.find(r => r.id === id);
    toast.success(target?.starred ? "Report unstarred" : "Report starred");
  };

  const handleDelete = (id) => {
    const prev = [...reps];
    setReps(prev => prev.filter(r => r.id !== id));
    setSelected(new Set());
    toast.success("Report deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setReps(prev);
          toast.info("Report restored");
        }
      }
    });
  };

  // Bulk Actions
  const bulkStar = () => {
    setReps(prev => prev.map(r => selected.has(r.id) ? { ...r, starred: true } : r));
    toast.success(`${selected.size} reports starred`);
    setSelected(new Set());
  };

  const bulkDelete = () => {
    const prev = [...reps];
    setReps(prev => prev.filter(r => !selected.has(r.id)));
    toast.success(`${selected.size} reports deleted`, {
      action: {
        label: "Undo",
        onClick: () => {
          setReps(prev);
          toast.info("Reports restored");
        }
      }
    });
    setSelected(new Set());
  };

  const submitModal = () => {
    if (modal?.type === "report") {
      setReps(prev => prev.map(r => r.id === modal.rid ? { ...r, status: "flagged", title: `[Reported False] ${r.title}` } : r));
      toast.success("Report flagged as false");
    } else {
      toast.success("Feedback submitted successfully");
    }
    setModal(null);
    setModalText("");
  };

  // ══════════════ FILTER LOGIC ══════════════
  let filtered = reps.filter(r => {
    const matchesQuery = query === '' || 
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.app.toLowerCase().includes(query.toLowerCase()) ||
      r.summary.toLowerCase().includes(query.toLowerCase());

    const matchesApp = fApp === 'all' || r.app === fApp;
    const matchesCrit = fCrit === 'all' || r.criticality === fCrit;

    let matchesDate = true;
    if (fFrom) {
      matchesDate = matchesDate && parseDate(r.date) >= new Date(fFrom);
    }
    if (fTo) {
      const toDate = new Date(fTo);
      toDate.setHours(23, 59, 59);
      matchesDate = matchesDate && parseDate(r.date) <= toDate;
    }

    return matchesQuery && matchesApp && matchesCrit && matchesDate;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return parseDate(b.date) - parseDate(a.date);
    if (sortBy === 'oldest') return parseDate(a.date) - parseDate(b.date);
    if (sortBy === 'app') return a.app.localeCompare(b.app);
    if (sortBy === 'criticality') return critOrder[a.criticality] - critOrder[b.criticality];
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / R_PER));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * R_PER;
  const paginated = filtered.slice(startIndex, startIndex + R_PER);

  const activeFilters = (fApp !== 'all' ? 1 : 0) + 
                       (fCrit !== 'all' ? 1 : 0) + 
                       (fFrom ? 1 : 0) + 
                       (fTo ? 1 : 0);

  const clearFilters = () => {
    setFApp('all');
    setFCrit('all');
    setFFrom('');
    setFTo('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Reports</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Generated analytics reports and performance metrics.
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end mt-4">
        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">App Name</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fApp}
              onChange={(e) => { setFApp(e.target.value); setPage(1); }}
            >
              <option value="all">All Apps</option>
              {allApps.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Criticality</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fCrit}
              onChange={(e) => { setFCrit(e.target.value); setPage(1); }}
            >
              <option value="all">All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Date Range</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="w-1/2 bg-[#11141D] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
              value={fFrom}
              onChange={(e) => { setFFrom(e.target.value); setPage(1); }}
            />
            <span className="text-slate-500 text-xs">to</span>
            <input 
              type="date" 
              className="w-1/2 bg-[#11141D] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
              value={fTo}
              onChange={(e) => { setFTo(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Sort By</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none animate-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="app">App Name (A-Z)</option>
              <option value="criticality">Criticality</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sorting bar info & clear */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-[#1E293B]/70 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span>Showing {filtered.length} of {reps.length} reports</span>
          {activeFilters > 0 && (
            <button 
              onClick={clearFilters}
              className="text-red-400 hover:text-red-500 hover:underline border-none bg-transparent outline-none cursor-pointer"
            >
              ✕ Clear ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-[#1A1F2B] border border-brand/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-brand/5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSelectAll}
              className="bg-[#11141D] border border-[#2A3447] text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer outline-none"
            >
              {selected.size === filtered.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-xs font-bold text-slate-200">
              {selected.size} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={bulkStar}
              className="bg-[#11141D] border border-[#2A3447] text-slate-300 hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
            >
              ★ Star
            </button>
            <button 
              onClick={bulkDelete}
              className="bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete
            </button>
            <button 
              onClick={() => setSelected(new Set())}
              className="text-slate-500 hover:text-slate-300 text-xs font-semibold px-2 cursor-pointer bg-transparent border-none"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input 
          type="text"
          placeholder="Search reports by title, app name or summary details..."
          className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-brand outline-none"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
        <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
      </div>

      {/* Grid of Report Cards */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 bg-[#11141D] border border-[#1E293B] rounded-[24px]">
          <FileText size={36} className="mx-auto text-slate-600 mb-2" />
          <h3 className="font-bold text-slate-400">No reports generated</h3>
          <p className="text-xs text-slate-500 mt-1">Adjust filters or search parameters to browse your notifications log.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((r, i) => {
            const isSelected = selected.has(r.id);
            const cols = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];
            return (
              <div 
                key={r.id} 
                className={cn(
                  "bg-[#11141D] border rounded-[20px] p-5 flex flex-col justify-between min-h-[190px] relative transition-all duration-300 select-none group border-[#1E293B] hover:border-slate-700 hover:shadow-xl hover:shadow-black/25"
                )}
              >
                {/* Selection Checkbox & Options Menu */}
                <div className="flex items-start justify-between">
                  <div 
                    onClick={(e) => toggleSelect(r.id, e)}
                    className={cn(
                      "w-4.5 h-4.5 rounded border flex items-center justify-center transition-all shrink-0 cursor-pointer",
                      isSelected 
                        ? "bg-brand border-brand text-white" 
                        : "border-[#2A3447] hover:border-slate-500 bg-[#1A1F2B]"
                    )}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>

                  <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setMenuId(menuId === r.id ? null : r.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-foreground hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <MoreHorizontal size={15} />
                    </button>

                    {menuId === r.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                        <div className="absolute right-0 mt-1.5 bg-[#161922] border border-[#2A3447] rounded-xl py-1.5 w-36 z-20 shadow-2xl animate-in fade-in slide-in-from-top-1">
                          <button
                            onClick={() => { handleToggleStar(r.id); setMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                          >
                            <Star size={13} className={r.starred ? "fill-amber-400 text-amber-400" : ""} />
                            <span>{r.starred ? "Unstar" : "Star"}</span>
                          </button>
                          <button
                            onClick={() => { setModal({ type: 'report', rid: r.id }); setMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                          >
                            <Flag size={13} />
                            <span>Report False</span>
                          </button>
                          <button
                            onClick={() => { setModal({ type: 'feedback', rid: r.id }); setMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-[#1E293B] hover:text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
                          >
                            <FileText size={13} />
                            <span>Feedback</span>
                          </button>
                          <div className="h-px bg-[#2A3447] my-1" />
                          <button
                            onClick={() => { handleDelete(r.id); setMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Report Content Body */}
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {r.starred && <span className="text-amber-400 text-sm select-none">★</span>}
                    <h3 className="font-bold text-[14px] text-slate-200 line-clamp-1">{r.title}</h3>
                  </div>

                  <p className="text-[11.5px] text-slate-400 font-semibold line-clamp-2 leading-relaxed">
                    {r.summary}
                  </p>

                  <div className="text-[10.5px] text-slate-500 font-semibold">
                    {r.date} &middot; {r.app}
                  </div>
                </div>

                {/* Tags Footer */}
                <div className="flex items-center justify-between border-t border-[#1E293B]/70 pt-3 mt-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                    CRIT_COLORS[r.criticality] || CRIT_COLORS.Medium
                  )}>
                    {r.criticality}
                  </span>

                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                    r.status === "completed" 
                      ? "bg-[#052E16] border border-[#22C55E]/10 text-[#4ADE80]" 
                      : "bg-[#2D1A0F] border border-[#F97316]/10 text-[#F97316]"
                  )}>
                    {r.status === "completed" ? "Completed" : "Flagged"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-[#1E293B] rounded-xl text-slate-400 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer bg-[#11141D]"
          >
            ‹ Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, j) => (
            <button
              key={j}
              onClick={() => setPage(j + 1)}
              className={cn(
                "w-9 h-9 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                currentPage === j + 1
                  ? "bg-brand text-white border-brand shadow-lg shadow-brand/10"
                  : "border-[#1E293B] text-slate-400 hover:text-foreground bg-[#11141D]"
              )}
            >
              {j + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-[#1E293B] rounded-xl text-slate-400 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer bg-[#11141D]"
          >
            Next ›
          </button>
        </div>
      )}

      {/* Dialog Modals */}
      {modal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div 
            className="bg-[#11141D] border border-[#1E293B] rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#1E293B] pb-3">
              <h3 className="text-md font-bold text-foreground">
                {modal.type === "report" ? "Report as False Positive" : "Provide Feedback"}
              </h3>
              <button 
                onClick={() => setModal(null)} 
                className="text-slate-400 hover:text-foreground cursor-pointer bg-transparent border-none outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">
                  Comments or reasons:
                </label>
                <textarea 
                  className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground focus:border-brand outline-none"
                  rows={4}
                  value={modalText}
                  onChange={e => setModalText(e.target.value)}
                  placeholder="Type notes..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E293B]/70">
                <button 
                  onClick={() => setModal(null)} 
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-medium cursor-pointer bg-transparent hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitModal}
                  className="bg-brand text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer border-none"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
