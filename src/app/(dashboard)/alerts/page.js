"use client";

import React, { useState } from 'react';
import { ShieldAlert, Trash2, Search, ChevronDown, RefreshCw, X, MessageSquare } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

// Import colocated subcomponents
import AlertCard from './components/AlertCard';
import ApolloRCA from './components/ApolloRCA';

// ══════════════ DATASET ══════════════
const INITIAL_ALERTS = [
  {
    id: 1,
    type: "revenue_drop_sudden",
    severity: "critical",
    title: "Revenue dropped 32% on Apr 3",
    desc: "Daily revenue fell from $1,780 to $1,210 — a 32% single-day drop on Puzzle Quest Pro.",
    app: "Puzzle Quest Pro",
    date: "Apr 3, 2025",
    starred: false,
    pinned: true,
    rca: [
      {
        p: "AdMob interstitial fill rate crashed from 96% to 61% due to demand-side budget exhaustion",
        ev: [
          {
            label: "Fill rate hourly breakdown",
            data: [
              { hour: "12AM-6AM", fillRate: "94%", status: "Normal" },
              { hour: "6AM-12PM", fillRate: "72%", status: "Declining" },
              { hour: "12PM-6PM", fillRate: "54%", status: "Critical" },
              { hour: "6PM-12AM", fillRate: "61%", status: "Critical" }
            ]
          },
          {
            label: "Network response codes",
            data: [
              { code: "NO_FILL", count: "12,840", pctOfTotal: "39%" },
              { code: "SUCCESS", count: "19,200", pctOfTotal: "61%" },
              { code: "TIMEOUT", count: "480", pctOfTotal: "1.5%" }
            ]
          }
        ]
      },
      {
        p: "AppLovin mediation waterfall failed to compensate — their API returned errors between 2PM-8PM",
        ev: [
          {
            label: "AppLovin error log",
            data: [
              { time: "2:00 PM", error: "502 Bad Gateway", requests: "3,200" },
              { time: "4:00 PM", error: "503 Service Unavailable", requests: "2,800" },
              { time: "6:00 PM", error: "502 Bad Gateway", requests: "3,100" },
              { time: "8:00 PM", error: "Recovered", requests: "0" }
            ]
          }
        ]
      },
      {
        p: "No fallback ad source was configured for interstitial placements",
        ev: [
          {
            label: "Mediation config",
            data: [
              { placement: "level_complete_inter", primary: "AdMob", secondary: "AppLovin", fallback: "None ⚠️" },
              { placement: "home_banner_1", primary: "AdMob", secondary: "AppLovin", fallback: "Unity Ads ✓" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    type: "revenue_drop_continuous",
    severity: "high",
    title: "Revenue declining 10 consecutive days (-52%)",
    desc: "Puzzle Quest Pro revenue has dropped from $1,850/day to $890/day over the last 10 days — a cumulative 52% decline.",
    app: "Puzzle Quest Pro",
    date: "Apr 2, 2025",
    starred: false,
    pinned: false,
    rca: [
      {
        p: "eCPM has been declining steadily as Q1 seasonal budgets expire — industry-wide advertiser pullback",
        ev: [
          {
            label: "Daily eCPM trend",
            data: [
              { day: "Mar 24", ecpm: "$8.50" },
              { day: "Mar 26", ecpm: "$7.80" },
              { day: "Mar 28", ecpm: "$7.10" },
              { day: "Mar 30", ecpm: "$6.40" },
              { day: "Apr 1", ecpm: "$5.60" },
              { day: "Apr 2", ecpm: "$5.20" }
            ]
          },
          {
            label: "Industry benchmark comparison",
            data: [
              { network: "AdMob Gaming avg", trend: "-18% WoW" },
              { network: "AppLovin Gaming avg", trend: "-22% WoW" },
              { network: "Your apps", trend: "-24% WoW" }
            ]
          }
        ]
      },
      {
        p: "User acquisition campaign ended on Mar 25, reducing new user inflow by 60%",
        ev: [
          {
            label: "UA campaign data",
            data: [
              { metric: "Daily installs (during campaign)", value: "1,240" },
              { metric: "Daily installs (after)", value: "480" },
              { metric: "Drop", value: "-61.3%" },
              { metric: "Campaign end date", value: "Mar 25" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    type: "requests_drop_sudden",
    severity: "critical",
    title: "Ad requests dropped 45% on Apr 3",
    desc: "Total ad requests fell from 142K to 78K in a single day across all placements on FitTrack.",
    app: "FitTrack",
    date: "Apr 3, 2025",
    starred: true,
    pinned: false,
    rca: [
      {
        p: "App update v3.2.1 introduced a bug in ad initialization — ads not loading on first 3 screens",
        ev: [
          {
            label: "Version comparison",
            data: [
              { version: "v3.2.0", dailyRequests: "142K", initSuccess: "98.4%" },
              { version: "v3.2.1", dailyRequests: "78K", initSuccess: "54.2%" }
            ]
          },
          {
            label: "Crash reports",
            data: [
              { error: "AdMob SDK init timeout", count: "8,420", affectedScreens: "Home, Dashboard, Profile" }
            ]
          }
        ]
      },
      {
        p: "Android 14 devices disproportionately affected — 72% of failed inits are on Android 14+",
        ev: [
          {
            label: "Device breakdown",
            data: [
              { os: "Android 12-13", failRate: "12%", share: "35%" },
              { os: "Android 14", failRate: "48%", share: "45%" },
              { os: "Android 15", failRate: "52%", share: "20%" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    type: "requests_drop_continuous",
    severity: "medium",
    title: "Requests declining for 10 days (-55%)",
    desc: "FitTrack ad requests dropped from 145K/day to 65K/day over the past 10 days.",
    app: "FitTrack",
    date: "Apr 1, 2025",
    starred: false,
    pinned: false,
    rca: [
      {
        p: "Seasonal user decline — fitness app engagement typically drops 25-30% in early April post New Year resolution fade",
        ev: [
          {
            label: "Monthly DAU pattern",
            data: [
              { month: "Jan", dau: "48K", note: "Peak (NY resolutions)" },
              { month: "Feb", dau: "42K", note: "" },
              { month: "Mar", dau: "35K", note: "Declining" },
              { month: "Apr", dau: "28K", note: "Seasonal low" }
            ]
          }
        ]
      },
      {
        p: "Push notification delivery rate dropped from 82% to 41% after iOS 17.4 update changed notification permissions",
        ev: [
          {
            label: "Notification stats",
            data: [
              { metric: "Delivery rate (before)", value: "82%" },
              { metric: "Delivery rate (after iOS 17.4)", value: "41%" },
              { metric: "Affected users", value: "~12,000 iOS users" },
              { metric: "Impact on DAU", value: "-18% iOS DAU" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    type: "policy_change",
    severity: "medium",
    title: "AdMob Rewarded Ads policy updated",
    desc: "Google updated the 'Rewarded Advertising' policy on Apr 5, 2025. New requirements for reward disclosure and opt-in language.",
    app: "All Apps",
    date: "Apr 5, 2025",
    starred: false,
    pinned: false,
    rca: [
      {
        p: "New policy requires explicit reward amount disclosure before ad plays — your current implementation shows reward after",
        ev: [
          {
            label: "Policy requirements",
            data: [
              { requirement: "Pre-play reward disclosure", yourStatus: "❌ Not compliant", deadline: "May 1, 2025" },
              { requirement: "Opt-in button text", yourStatus: "⚠️ Needs update", deadline: "May 1, 2025" },
              { requirement: "Skip option after 5s", yourStatus: "✓ Compliant", deadline: "N/A" }
            ]
          }
        ]
      },
      {
        p: "Non-compliance after May 1 may result in ad serving restrictions or account-level policy warning",
        ev: [
          {
            label: "Risk assessment",
            data: [
              { scenario: "Comply before deadline", revenueImpact: "None" },
              { scenario: "Non-compliance warning", revenueImpact: "-10-20% fill rate" },
              { scenario: "Account restriction", revenueImpact: "-100% rewarded revenue" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    type: "policy_violation",
    severity: "critical",
    title: "Policy violation: Accidental clicks detected",
    desc: "AdMob flagged 'Accidental Clicks' policy violation on Puzzle Quest Pro banner placement. Immediate action required.",
    app: "Puzzle Quest Pro",
    date: "Apr 4, 2025",
    starred: false,
    pinned: true,
    rca: [
      {
        p: "Banner ad at bottom of game screen overlaps with the 'Next Level' button — 12% of clicks classified as accidental",
        ev: [
          {
            label: "Click analysis",
            data: [
              { metric: "Total banner clicks", value: "4,280" },
              { metric: "Flagged as accidental", value: "514 (12%)" },
              { metric: "Industry threshold", value: "<3%" },
              { metric: "Your rate", value: "12% ⚠️" }
            ]
          },
          {
            label: "Placement heatmap data",
            data: [
              { zone: "Next Level button", clickDensity: "Very High", overlap: "18px overlap with banner" },
              { zone: "Banner safe zone", clickDensity: "Normal", overlap: "None" }
            ]
          }
        ]
      },
      {
        p: "Issue only affects 320x50 banner — adaptive banner on FitTrack has 1.2% accidental click rate (compliant)",
        ev: [
          {
            label: "Comparison across apps",
            data: [
              { app: "Puzzle Quest (320x50)", accidentalRate: "12%", status: "⚠️ Violation" },
              { app: "FitTrack (Adaptive)", accidentalRate: "1.2%", status: "✓ Compliant" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    type: "dau_drop",
    severity: "high",
    title: "DAU dropped 28% on FitTrack",
    desc: "Daily Active Users fell from 32,100 to 23,100 — a sudden 28% drop on a single day.",
    app: "FitTrack",
    date: "Apr 3, 2025",
    starred: false,
    pinned: false,
    rca: [
      {
        p: "Negative app store reviews surged after v3.2.1 update — average rating dropped from 4.3 to 3.6 stars",
        ev: [
          {
            label: "Review analysis",
            data: [
              { period: "Before v3.2.1", avgRating: "4.3★", negReviews: "~12/day" },
              { period: "After v3.2.1", avgRating: "3.6★", negReviews: "~85/day" },
              { period: "Top complaint", topic: "App crashes on workout screen", count: "47 reviews" }
            ]
          }
        ]
      },
      {
        p: "Server outage between 6AM-10AM IST caused 4-hour downtime for Indian users (62% of user base)",
        ev: [
          {
            label: "Outage timeline",
            data: [
              { time: "6:00 AM IST", status: "Server down" },
              { time: "8:00 AM IST", status: "Partial recovery" },
              { time: "10:00 AM IST", status: "Fully restored" },
              { time: "Impact", status: "~14,400 users affected" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    type: "dau_dav_gap",
    severity: "high",
    title: "80% DAU-DAV gap on Puzzle Quest Pro",
    desc: "Of 85,200 daily active users, only 17,040 generated any ad revenue (DAV). 80% of your users produce zero ad revenue.",
    app: "Puzzle Quest Pro",
    date: "Apr 2, 2025",
    starred: false,
    pinned: false,
    rca: [
      {
        p: "68% of zero-revenue users are on the Day-0 ad-free cohort — they haven't been exposed to ads yet",
        ev: [
          {
            label: "User segmentation",
            data: [
              { segment: "Day-0 to Day-3 (no ads)", users: "46,200", revenue: "$0", pctOfDAU: "54%" },
              { segment: "Day-3 to Day-7 (rewarded only)", users: "12,800", revenue: "$180", pctOfDAU: "15%" },
              { segment: "Day-7+ (full ads)", users: "26,200", revenue: "$1,600", pctOfDAU: "31%" }
            ]
          }
        ]
      },
      {
        p: "Ad blockers detected on 11% of sessions — these users see zero ads regardless of cohort",
        ev: [
          {
            label: "Ad blocker stats",
            data: [
              { metric: "Sessions with ad blocker", value: "11.2%" },
              { metric: "Revenue lost (estimated)", value: "$210/day" },
              { metric: "Platform breakdown", value: "Android 8.4%, iOS 15.1%" }
            ]
          }
        ]
      },
      {
        p: "Users who only play 1-2 levels per session never trigger interstitial or rewarded placements",
        ev: [
          {
            label: "Session depth analysis",
            data: [
              { levels: "1-2 levels", pctUsers: "34%", adsServed: "0.2 avg", revenue: "$0.001 ARPU" },
              { levels: "3-5 levels", pctUsers: "38%", adsServed: "1.8 avg", revenue: "$0.012 ARPU" },
              { levels: "6+ levels", pctUsers: "28%", adsServed: "4.1 avg", revenue: "$0.038 ARPU" }
            ]
          }
        ]
      }
    ]
  }
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(null); // for Apollo detailed view
  
  // Search & Filters
  const [query, setQuery] = useState('');
  const [fSeverity, setFSeverity] = useState('all');
  const [fCategory, setFCategory] = useState('all');
  const [fApp, setFApp] = useState('all');
  const [fDateFrom, setFDateFrom] = useState('');
  const [fDateTo, setFDateTo] = useState('');
  const [fStarred, setFStarred] = useState(false);
  const [sortBy, setSortBy] = useState('severity');

  // List States
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  // Feedback/False report Modals
  const [modal, setModal] = useState(null); // { type: 'feedback'|'reportFalse', id: number }
  const [modalText, setModalText] = useState('');

  const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const allApps = [...new Set(alerts.map(a => a.app))];
  const allCategories = [...new Set(alerts.map(a => a.type))];

  const parseDate = (d) => new Date(d.replace(/(\w+)\s(\d+),\s(\d+)/, "$1 $2, $3"));

  // Toggle selection
  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkSelectToggle = () => {
    if (selectedIds.size === filteredAlerts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAlerts.map(a => a.id)));
    }
  };

  // Star / Pin / Delete
  const toggleStar = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, starred: !a.starred } : a));
    const target = alerts.find(a => a.id === id);
    toast.success(target?.starred ? "Alert unstarred" : "Alert starred");
  };

  const togglePin = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
    const target = alerts.find(a => a.id === id);
    toast.success(target?.pinned ? "Alert unpinned" : "Alert pinned to top");
  };

  const handleDelete = (id) => {
    const prev = [...alerts];
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSelectedIds(new Set());
    toast.success("Alert deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setAlerts(prev);
          toast.info("Alert restored");
        }
      }
    });
  };

  // Bulk Actions
  const bulkStar = () => {
    setAlerts(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, starred: true } : a));
    toast.success(`${selectedIds.size} alerts starred`);
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    const prev = [...alerts];
    setAlerts(prev => prev.filter(a => !selectedIds.has(a.id)));
    const deletedCount = selectedIds.size;
    setSelectedIds(new Set());
    toast.success(`${deletedCount} alert(s) deleted`, {
      action: {
        label: "Undo",
        onClick: () => {
          setAlerts(prev);
          toast.info("Alerts restored");
        }
      }
    });
  };

  // Modal actions
  const submitModal = () => {
    if (modal?.type === "reportFalse") {
      setAlerts(prev => prev.map(a => a.id === modal.id ? { ...a, severity: "low", title: `[Reported False] ${a.title}` } : a));
      toast.success("Alert reported as false. Severity lowered.");
    } else {
      toast.success("Feedback submitted successfully");
    }
    setModal(null);
    setModalText('');
  };

  // ══════════════ FILTER LOGIC ══════════════
  let filteredAlerts = alerts.filter(a => {
    const matchesQuery = query === '' || 
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase()) ||
      a.app.toLowerCase().includes(query.toLowerCase());

    const matchesSeverity = fSeverity === 'all' || a.severity === fSeverity;
    const matchesCategory = fCategory === 'all' || a.type === fCategory;
    const matchesApp = fApp === 'all' || a.app === fApp;
    const matchesStarred = !fStarred || a.starred;

    let matchesDate = true;
    if (fDateFrom) {
      matchesDate = matchesDate && parseDate(a.date) >= new Date(fDateFrom);
    }
    if (fDateTo) {
      const toDate = new Date(fDateTo);
      toDate.setHours(23, 59, 59);
      matchesDate = matchesDate && parseDate(a.date) <= toDate;
    }

    return matchesQuery && matchesSeverity && matchesCategory && matchesApp && matchesStarred && matchesDate;
  });

  // Sorting
  filteredAlerts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    if (sortBy === 'severity') return sevOrder[a.severity] - sevOrder[b.severity];
    if (sortBy === 'date_desc') return parseDate(b.date) - parseDate(a.date);
    if (sortBy === 'date_asc') return parseDate(a.date) - parseDate(b.date);
    if (sortBy === 'category') return a.type.localeCompare(b.type);
    if (sortBy === 'app') return a.app.localeCompare(b.app);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + PER_PAGE);

  const activeFilters = (fSeverity !== "all" ? 1 : 0) + 
                       (fCategory !== "all" ? 1 : 0) + 
                       (fApp !== "all" ? 1 : 0) + 
                       (fStarred ? 1 : 0) + 
                       (fDateFrom ? 1 : 0) + 
                       (fDateTo ? 1 : 0);

  const clearFilters = () => {
    setFSeverity("all");
    setFCategory("all");
    setFApp("all");
    setFDateFrom("");
    setFDateTo("");
    setFStarred(false);
  };

  // Render Apollo detailed RCA report screen
  if (selectedAlert) {
    return (
      <ApolloRCA 
        alert={selectedAlert}
        onBack={() => setSelectedAlert(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Alerts</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Business anomalies notifications and policy violations details.
          <span className="text-red-400 font-bold ml-1.5">
            {alerts.filter(a => a.severity === "critical").length} critical
          </span> items need attention.
        </p>
      </div>

      {/* Advanced Filter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end mt-4">
        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Criticality</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fSeverity}
              onChange={(e) => { setFSeverity(e.target.value); setPage(1); }}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Category</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fCategory}
              onChange={(e) => { setFCategory(e.target.value); setPage(1); }}
            >
              <option value="all">All Categories</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

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

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Date Range</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="w-1/2 bg-[#11141D] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
              value={fDateFrom}
              onChange={(e) => { setFDateFrom(e.target.value); setPage(1); }}
            />
            <span className="text-slate-500 text-xs">to</span>
            <input 
              type="date" 
              className="w-1/2 bg-[#11141D] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
              value={fDateTo}
              onChange={(e) => { setFDateTo(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Sorting, count details and star filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-semibold border-b border-[#1E293B]/70 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span>Showing {paginatedAlerts.length} of {filteredAlerts.length} alerts</span>
          {activeFilters > 0 && (
            <span className="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-bold">
              {activeFilters} filter{activeFilters > 1 ? "s" : ""} active
            </span>
          )}
          {activeFilters > 0 && (
            <button 
              onClick={clearFilters}
              className="text-red-400 hover:text-red-500 hover:underline border-none bg-transparent outline-none cursor-pointer"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setFStarred(!fStarred)}
            className={cn(
              "px-3 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer bg-transparent",
              fStarred 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/40" 
                : "border-[#1E293B] text-slate-400 hover:text-white"
            )}
          >
            ★ Starred Only
          </button>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <div className="relative">
              <select
                className="bg-transparent text-slate-300 border-none outline-none pr-6 font-semibold cursor-pointer appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="severity">Severity (High &rarr; Low)</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="category">Category (A &rarr; Z)</option>
                <option value="app">App Name (A &rarr; Z)</option>
              </select>
              <ChevronDown size={12} className="absolute right-0 top-0.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bg-[#1A1F2B] border border-brand/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-brand/5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBulkSelectToggle}
              className="bg-[#11141D] border border-[#2A3447] text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer outline-none"
            >
              {selectedIds.size === filteredAlerts.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-xs font-bold text-slate-200">
              {selectedIds.size} selected item{selectedIds.size > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={bulkStar}
              className="bg-[#11141D] border border-[#2A3447] text-slate-300 hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
            >
              ★ Star Selected
            </button>
            <button 
              onClick={bulkDelete}
              className="bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete Selected
            </button>
            <button 
              onClick={() => setSelectedIds(new Set())}
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
          placeholder="Search alerts by title, description or app name..."
          className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-brand outline-none"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
        <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
      </div>

      {/* Alerts listing */}
      {paginatedAlerts.length === 0 ? (
        <div className="text-center py-16 bg-[#11141D] border border-[#1E293B] rounded-[24px]">
          <ShieldAlert size={36} className="mx-auto text-slate-600 mb-2" />
          <h3 className="font-bold text-slate-400">No anomalies detected</h3>
          <p className="text-xs text-slate-500 mt-1">Adjust filters or search parameters to browse your notifications log.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedAlerts.map(a => (
            <AlertCard 
              key={a.id}
              alert={a}
              selected={selectedIds.has(a.id)}
              toggleSelect={toggleSelect}
              expanded={expandedId === a.id}
              toggleExpand={() => setExpandedId(expandedId === a.id ? null : a.id)}
              onViewDetail={() => setSelectedAlert(a)}
              toggleStar={toggleStar}
              togglePin={togglePin}
              handleDelete={handleDelete}
              onReportFalse={(id) => setModal({ type: 'reportFalse', id })}
              onFeedback={(id) => setModal({ type: 'feedback', id })}
            />
          ))}
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

      {/* Feedback/False report Dialog Modals */}
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
                {modal.type === "reportFalse" ? "Report Alert as False" : "Feedback Comments"}
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
                  {modal.type === "reportFalse" ? "Please explain why this anomaly alert is a false positive:" : "Provide details or notes about this alert:"}
                </label>
                <textarea 
                  className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground focus:border-brand outline-none"
                  rows={4}
                  value={modalText}
                  onChange={e => setModalText(e.target.value)}
                  placeholder={modal.type === "reportFalse" ? "e.g. Server updates scheduled during this timeframe..." : "Type comments..."}
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
