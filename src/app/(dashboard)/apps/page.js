"use client";

import React, { useState } from 'react';
import { Plus, Search, ChevronDown, BarChart2, FileText, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

// Import colocated components
import AppCard from './components/AppCard';
import AppRow from './components/AppRow';
import AppDetails from './components/AppDetails';
import RegisterWizard from './components/RegisterWizard';
import { axiosapiinstance } from '@/lib/request';
import { ENDPOINTS } from '@/lib/endpoints';

// ══════════════ CONSTANTS ══════════════
const NETWORKS = ["AdMob"];
const APP_CATEGORIES = ["Gaming", "Utility", "Content / Media", "Social / Community", "Productivity", "Education", "Finance", "Health & Fitness", "Other"];
const APP_AGES = ["< 6 months", "6-12 months", "1-3 years", "3+ years"];
const LOCATIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa", "India", "Southeast Asia", "China"];
const INVENTORY_TYPES = ["Banner", "Adaptive Banner", "Interstitial", "Rewarded Video", "Rewarded Interstitial", "Native Ads", "App Open Ads"];
const GENDERS = ["Male", "Female", "Transgender"];
const BANNER_SIZES = ["BANNER 320x50", "LARGE_BANNER 320x100", "MEDIUM_RECTANGLE 300x250", "LEADERBOARD 728x90", "ADAPTIVE dynamic"];
const BANNER_POS = ["Top of screen", "Bottom of screen", "Inline (scroll view)"];
const INTER_TRIGGERS = ["After level completion", "After button click", "On screen transition"];
const INTER_FORMATS = ["Portrait", "Landscape", "Static", "Video", "Playable"];
const REWARD_TYPES = ["Coins", "Gems", "Extra life", "Points", "Power-ups"];

const FETCHED_APPS = [
  {
    name: "Puzzle Quest Pro",
    platform: "Android",
    cat: "Gaming",
    val: "Addictive puzzle game with 500+ levels, daily challenges, and social leaderboards",
    age: "1-3 years",
    amin: "13",
    amax: "45",
    gens: ["Male", "Female"],
    locs: ["North America", "Europe", "India"],
    invs: [
      { n: "home_banner_1", t: "Adaptive Banner" },
      { n: "level_complete_inter", t: "Interstitial" },
      { n: "reward_coins_video", t: "Rewarded Video" },
      { n: "app_open_splash", t: "App Open Ads" }
    ]
  },
  {
    name: "Math Ninja",
    platform: "iOS",
    cat: "Education",
    val: "Gamified math learning for kids with AR challenges and progress tracking",
    age: "6-12 months",
    amin: "6",
    amax: "14",
    gens: ["Male", "Female"],
    locs: ["North America", "Europe"],
    invs: [
      { n: "lesson_banner", t: "Banner" },
      { n: "quiz_reward", t: "Rewarded Video" }
    ]
  },
  {
    name: "Weather Widget Plus",
    platform: "Android",
    cat: "Utility",
    val: "Hyper-local weather forecasting with customizable widgets and severe weather alerts",
    age: "3+ years",
    amin: "18",
    amax: "65",
    gens: ["Male", "Female", "Transgender"],
    locs: ["North America", "Europe", "Asia Pacific"],
    invs: [
      { n: "forecast_banner", t: "Adaptive Banner" },
      { n: "detail_native", t: "Native Ads" }
    ]
  },
  {
    name: "Daily Planner",
    platform: "iOS",
    cat: "Productivity",
    val: "AI-powered daily planner with smart scheduling, habit tracking, and team sync",
    age: "< 6 months",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female"],
    locs: ["North America", "Europe"],
    invs: [
      { n: "dashboard_banner", t: "Banner" },
      { n: "task_complete_inter", t: "Interstitial" }
    ]
  },
  {
    name: "FitTrack",
    platform: "Android",
    cat: "Health & Fitness",
    val: "AI-powered workout tracking with personalized routines and nutrition planning",
    age: "6-12 months",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female", "Transgender"],
    locs: ["India", "Southeast Asia"],
    invs: [
      { n: "dashboard_banner", t: "Adaptive Banner" },
      { n: "workout_complete_reward", t: "Rewarded Interstitial" }
    ]
  }
];

const INITIAL_APPS = [
  {
    id: 1,
    net: "AdMob",
    key: "sk-admob-pzq-****",
    app: "Puzzle Quest Pro",
    plat: "Android",
    cats: ["Gaming"],
    val: "Addictive puzzle game with 500+ levels",
    age: "1-3 years",
    amin: "13",
    amax: "45",
    gens: ["Male", "Female"],
    locs: ["North America", "Europe"],
    ra: "65",
    ri: "20",
    rs2: "10",
    ro: "5",
    uc: true,
    ur: true,
    ucr: false,
    ul: false,
    uf: true,
    ud: false,
    priority: "High",
    fbCert: "firebase-adminsdk.json",
    fbUrl: "https://puzzle-quest-admob.firebaseio.com",
    fbVerified: true,
    installs: 2500000,
    avg_dav: 85200,
    income_ads_pct: 80,
    child_directed_coppa: false,
    ad_serving_limit_active: false,
    status: "active",
    violations: [
      { id: 101, type: "accidental_clicks", status: "active" }
    ],
    invs: [
      { n: "home_banner_1", t: "Adaptive Banner", sz: "ADAPTIVE dynamic", pos: "Bottom of screen", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false },
      { n: "level_complete_inter", t: "Interstitial", sz: "", pos: "", trg: "After level completion", fmt: "Video", rt: "", ra2: "", cf: false, cc: false },
      { n: "reward_coins_video", t: "Rewarded Video", sz: "", pos: "", trg: "Watch ad to get coins", fmt: "", rt: "Coins", ra2: "50", cf: true, cc: true }
    ]
  },
  {
    id: 2,
    net: "AdMob",
    key: "sk-admob-ft-****",
    app: "FitTrack",
    plat: "Android",
    cats: ["Health & Fitness"],
    val: "AI-powered workout tracking",
    age: "6-12 months",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female", "Transgender"],
    locs: ["India", "Southeast Asia"],
    ra: "40",
    ri: "35",
    rs2: "20",
    ro: "5",
    uc: false,
    ur: false,
    ucr: false,
    ul: true,
    uf: true,
    ud: false,
    priority: "High",
    fbCert: "firebase-adminsdk.json",
    fbUrl: "https://fittrack-analytics.firebaseio.com",
    fbVerified: true,
    installs: 1200000,
    avg_dav: 32100,
    income_ads_pct: 70,
    child_directed_coppa: false,
    ad_serving_limit_active: false,
    status: "active",
    violations: [],
    invs: [
      { n: "dashboard_banner", t: "Adaptive Banner", sz: "ADAPTIVE dynamic", pos: "Top of screen", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false },
      { n: "workout_complete_reward", t: "Rewarded Interstitial", sz: "", pos: "", trg: "After task completion", fmt: "", rt: "Points", ra2: "20", cf: true, cc: false }
    ]
  },
  {
    id: 3,
    net: "AdMob",
    key: "sk-admob-app3-****",
    app: "BookWorm Reader",
    plat: "iOS",
    cats: ["Education"],
    val: "E-book reader with translation and dictionary tools",
    age: "3+ years",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female"],
    locs: ["North America"],
    ra: "55",
    ri: "25",
    rs2: "15",
    ro: "5",
    uc: false,
    ur: false,
    ucr: false,
    ul: false,
    uf: false,
    ud: false,
    priority: "High",
    installs: 800000,
    avg_dav: 14200,
    income_ads_pct: 60,
    child_directed_coppa: true,
    ad_serving_limit_active: false,
    status: "active",
    violations: [],
    invs: [{ n: "banner_main", t: "Adaptive Banner", sz: "ADAPTIVE", pos: "Bottom", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false }]
  },
  {
    id: 4,
    net: "AdMob",
    key: "sk-admob-app4-****",
    app: "CloudNotes",
    plat: "Android",
    cats: ["Productivity"],
    val: "Markdown note-taking with cloud sync and document collaboration",
    age: "1-3 years",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female"],
    locs: ["Europe"],
    ra: "55",
    ri: "25",
    rs2: "15",
    ro: "5",
    uc: false,
    ur: false,
    ucr: false,
    ul: false,
    uf: false,
    ud: false,
    priority: "Medium",
    installs: 450000,
    avg_dav: 8500,
    income_ads_pct: 50,
    child_directed_coppa: false,
    ad_serving_limit_active: true,
    status: "active",
    violations: [],
    invs: [{ n: "banner_main", t: "Adaptive Banner", sz: "ADAPTIVE", pos: "Bottom", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false }]
  },
  {
    id: 5,
    net: "AdMob",
    key: "sk-admob-app5-****",
    app: "RecipeHub",
    plat: "iOS",
    cats: ["Content / Media"],
    val: "Social cooking network with offline cooking guides and step-by-step videos",
    age: "6-12 months",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female"],
    locs: ["Asia Pacific"],
    ra: "55",
    ri: "25",
    rs2: "15",
    ro: "5",
    uc: false,
    ur: false,
    ucr: false,
    ul: false,
    uf: false,
    ud: false,
    priority: "Low",
    installs: 300000,
    avg_dav: 6200,
    income_ads_pct: 40,
    child_directed_coppa: false,
    ad_serving_limit_active: false,
    status: "active",
    violations: [],
    invs: [{ n: "banner_main", t: "Adaptive Banner", sz: "ADAPTIVE", pos: "Bottom", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false }]
  },
  {
    id: 6,
    net: "AdMob",
    key: "sk-admob-app6-****",
    app: "BudgetBuddy",
    plat: "Android",
    cats: ["Finance"],
    val: "Finance tracker with CSV budget exports, smart analytics, and alerts",
    age: "< 6 months",
    amin: "18",
    amax: "55",
    gens: ["Male", "Female"],
    locs: ["India"],
    ra: "55",
    ri: "25",
    rs2: "15",
    ro: "5",
    uc: false,
    ur: false,
    ucr: false,
    ul: false,
    uf: false,
    ud: false,
    priority: "Critical",
    installs: 150000,
    avg_dav: 2500,
    income_ads_pct: 30,
    child_directed_coppa: false,
    ad_serving_limit_active: false,
    status: "onboarding",
    violations: [],
    invs: [{ n: "banner_main", t: "Adaptive Banner", sz: "ADAPTIVE", pos: "Bottom", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false }]
  }
];

export default function AppsPage() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [view, setView] = useState('list'); // 'list' | 'reg' | 'detail'
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'
  const [pinned, setPinned] = useState(new Set([1]));

  // Filters & Search
  const [query, setQuery] = useState('');
  const [fCat, setFCat] = useState('all');
  const [fPlat, setFPlat] = useState('all');
  const [fAge, setFAge] = useState('all');
  const [fLoc, setFLoc] = useState('all');
  const [fPri, setFPri] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // Registration wizard state
  const [ssp, setSsp] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchStep, setFetchStep] = useState(0);
  const [fApps, setFApps] = useState([]);
  const [selApps, setSelApps] = useState([]);
  const [appData, setAppData] = useState({});
  const [expandedApp, setExpandedApp] = useState(null);
  const [fbStates, setFbStates] = useState({});

  // App edit state (for Detail View)
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showInvForm, setShowInvForm] = useState(false);
  const [invDraft, setInvDraft] = useState({ n: "", t: "", sz: "", pos: "", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false });
  const [fbDraft, setFbDraft] = useState({ verifying: false, error: "" });

  const ageOrder = ["< 6 months", "6-12 months", "1-3 years", "3+ years"];
  const priOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const allCats = [...new Set(apps.flatMap(a => a.cats || []))];
  const allPlats = [...new Set(apps.map(a => a.plat).filter(Boolean))];
  const allLocs = [...new Set(apps.flatMap(a => a.locs || []))];
  const colors = ["bg-brand", "bg-[#10B981]", "bg-[#F59E0B]", "bg-[#EF4444]", "bg-[#8B5CF6]", "bg-[#3B82F6]"];
  const uxLabels = {
    uc: "Ad complaints",
    ur: "Store reviews mention ads",
    ucr: "Crashes with ads",
    ul: "Ad load time issues",
    uf: "Frequency capping",
    ud: "Day-0 ads"
  };

  const togglePin = (id, e) => {
    e.stopPropagation();
    const next = new Set(pinned);
    if (next.has(id)) {
      next.delete(id);
      toast.success('App unpinned');
    } else {
      next.add(id);
      toast.success('App pinned to top');
    }
    setPinned(next);
  };

  const handleDelete = (id, name) => {
    const prev = [...apps];
    setApps(apps.filter(a => a.id !== id));
    toast.success(`App deleted: ${name}`, {
      action: {
        label: 'Undo',
        onClick: () => {
          setApps(prev);
          toast.info('App registration restored');
        }
      }
    });
    if (selectedAppId === id) setSelectedAppId(null);
  };

  // ══════════════ REGISTRATION FLOW WIZARD ══════════════
  const startFetch = async (token) => {
    if (!ssp) return;
    if (token) setApiKey(token);
    
    setFetching(true);
    setFetchStep(1);
    
    try {
      const res = await axiosapiinstance.post(ENDPOINTS.APPS.UPLOADED, {
        ad_network: "admob",
        secret_key: null
      });
      
      const data = res.data;
      // Use backend data from detail array
      const fetchedList = Array.isArray(data?.detail) ? data.detail : [];

      setFetchStep(2);
      setTimeout(() => {
        setFetchStep(3);
        setTimeout(() => {
          setFetchStep(4);
          setFetching(false);
          setFApps(fetchedList);
          
          const initialData = {};
          fetchedList.forEach((a, i) => {
            const appName = a.name || `App ${i+1}`;
            initialData[appName] = {
              net: ssp,
              key: token || apiKey,
              app: appName,
              plat: a.platform || "Android",
              cats: a.cat ? [a.cat] : ["Other"],
              val: a.val || "",
              age: a.age || "",
              amin: a.amin || "",
              amax: a.amax || "",
              gens: a.gens || [],
              locs: a.locs || [],
              ra: "50", ri: "25", rs2: "20", ro: "5",
              invs: (a.invs || []).map(inv => ({
                ...inv,
                sz: inv.t.includes("Banner") ? "ADAPTIVE dynamic" : "",
                pos: inv.t.includes("Banner") ? "Bottom of screen" : "",
                trg: inv.t.includes("Interstitial") || inv.t.includes("Rewarded") ? "After level completion" : "",
                fmt: inv.t.includes("Interstitial") ? "Video" : "",
                rt: inv.t.includes("Rewarded") ? "Coins" : "",
                ra2: inv.t.includes("Rewarded") ? "100" : "",
                cf: false, cc: false
              })),
              fbCert: "",
              fbUrl: "",
              fbVerified: false,
              priority: "Medium"
            };
          });
          setAppData(initialData);
          toast.success(`Successfully fetched ${fetchedList.length} apps from ${ssp}`);
        }, 800);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch apps from backend");
      setFetching(false);
      setFetchStep(0);
    }
  };

  const toggleSelectRegApp = (name) => {
    if (selApps.includes(name)) {
      setSelApps(selApps.filter(x => x !== name));
      if (expandedApp === name) setExpandedApp(null);
    } else {
      setSelApps([...selApps, name]);
      setExpandedApp(name);
    }
  };

  const updateRegAppField = (name, field, val) => {
    setAppData(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: val
      }
    }));
  };

  const handleFbUploadReg = (name, e) => {
    const file = e.target.files?.[0];
    if (file?.name.endsWith('.json')) {
      updateRegAppField(name, 'fbCert', file.name);
      setFbStates(prev => ({
        ...prev,
        [name]: { ...prev[name], file: file.name, error: "" }
      }));
    } else {
      setFbStates(prev => ({
        ...prev,
        [name]: { ...prev[name], error: "Only .json credentials files are supported" }
      }));
    }
  };

  const verifyFbReg = (name) => {
    const url = appData[name]?.fbUrl;
    if (!url || !url.startsWith('https://')) {
      setFbStates(prev => ({
        ...prev,
        [name]: { ...prev[name], error: "Database URL must start with https://" }
      }));
      return;
    }

    setFbStates(prev => ({
      ...prev,
      [name]: { ...prev[name], verifying: true, error: "" }
    }));

    setTimeout(() => {
      setFbStates(prev => ({
        ...prev,
        [name]: { ...prev[name], verifying: false, verified: true }
      }));
      updateRegAppField(name, 'fbVerified', true);
      toast.success(`Firebase DB connection verified for ${name}`);
    }, 1500);
  };

  const finalizeRegistration = () => {
    const newRegistered = selApps.map(name => ({
      ...appData[name],
      id: Date.now() + Math.random()
    }));

    setApps([...apps, ...newRegistered]);
    toast.success(`Registered ${newRegistered.length} app(s) successfully!`);
    
    setSsp('');
    setApiKey('');
    setFetchStep(0);
    setFApps([]);
    setSelApps([]);
    setAppData({});
    setFbStates({});
    setView('list');
  };

  // ══════════════ DETAIL EDIT ACTIONS ══════════════
  const startEdit = (appObj) => {
    setDraft({ ...appObj, invs: [...(appObj.invs || [])] });
    setEditMode(true);
  };

  const saveEdit = () => {
    setApps(apps.map(a => a.id === draft.id ? draft : a));
    setEditMode(false);
    setDraft(null);
    toast.success(`Changes saved for ${draft.app}`);
  };

  const handleFbUploadEdit = (e) => {
    const file = e.target.files?.[0];
    if (file?.name.endsWith('.json')) {
      setDraft(prev => ({ ...prev, fbCert: file.name, fbVerified: false }));
      setFbDraft({ verifying: false, error: "" });
    } else {
      setFbDraft({ verifying: false, error: "Only .json files are supported" });
    }
  };

  const verifyFbEdit = () => {
    if (!draft.fbCert || !draft.fbUrl) {
      setFbDraft({ verifying: false, error: "Upload certificate and provide DB URL" });
      return;
    }
    if (!draft.fbUrl.startsWith('https://')) {
      setFbDraft({ verifying: false, error: "URL must begin with https://" });
      return;
    }

    setFbDraft({ verifying: true, error: "" });
    setTimeout(() => {
      setFbDraft({ verifying: false, error: "" });
      setDraft(prev => ({ ...prev, fbVerified: true }));
      toast.success('Firebase credentials verified successfully');
    }, 1500);
  };

  const addInventory = () => {
    if (!invDraft.n || !invDraft.t) {
      toast.error('Inventory Placement Name and Type are required');
      return;
    }
    setDraft(prev => ({
      ...prev,
      invs: [...prev.invs, { ...invDraft }]
    }));
    setInvDraft({ n: "", t: "", sz: "", pos: "", trg: "", fmt: "", rt: "", ra2: "", cf: false, cc: false });
    setShowInvForm(false);
    toast.success('Ad inventory placement added');
  };

  const removeInventory = (idx) => {
    setDraft(prev => ({
      ...prev,
      invs: prev.invs.filter((_, i) => i !== idx)
    }));
  };

  // ══════════════ FILTER LOGIC ══════════════
  let filtered = apps.filter(a => {
    const matchesQuery = query === '' || 
      a.app.toLowerCase().includes(query.toLowerCase()) ||
      a.plat.toLowerCase().includes(query.toLowerCase()) ||
      a.cats.join(' ').toLowerCase().includes(query.toLowerCase()) ||
      a.net.toLowerCase().includes(query.toLowerCase());
      
    const matchesCat = fCat === 'all' || a.cats.includes(fCat);
    const matchesPlat = fPlat === 'all' || a.plat.toLowerCase() === fPlat.toLowerCase();
    const matchesAge = fAge === 'all' || a.age === fAge;
    const matchesLoc = fLoc === 'all' || (a.locs && a.locs.includes(fLoc));
    const matchesPri = fPri === 'all' || (a.priority || "Medium") === fPri;

    return matchesQuery && matchesCat && matchesPlat && matchesAge && matchesLoc && matchesPri;
  });

  filtered.sort((a, b) => {
    const pinA = pinned.has(a.id) ? 1 : 0;
    const pinB = pinned.has(b.id) ? 1 : 0;
    if (pinA !== pinB) return pinB - pinA;

    if (sortBy === 'name') return a.app.localeCompare(b.app);
    if (sortBy === 'age_new') return ageOrder.indexOf(a.age) - ageOrder.indexOf(b.age);
    if (sortBy === 'age_old') return ageOrder.indexOf(b.age) - ageOrder.indexOf(a.age);
    if (sortBy === 'priority') return priOrder[a.priority || "Medium"] - priOrder[b.priority || "Medium"];
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedApps = filtered.slice(startIndex, startIndex + PER_PAGE);

  const selectedApp = apps.find(a => a.id === selectedAppId);

  // ══════════════ RENDER DETAILS VIEW ══════════════
  if (view === 'detail') {
    return (
      <AppDetails 
        selectedApp={selectedApp}
        editMode={editMode}
        setEditMode={setEditMode}
        draft={draft}
        setDraft={setDraft}
        saveEdit={saveEdit}
        startEdit={startEdit}
        handleDelete={handleDelete}
        onBack={() => setView('list')}
        showInvForm={showInvForm}
        setShowInvForm={setShowInvForm}
        invDraft={invDraft}
        setInvDraft={setInvDraft}
        addInventory={addInventory}
        removeInventory={removeInventory}
        fbDraft={fbDraft}
        setFbDraft={setFbDraft}
        handleFbUploadEdit={handleFbUploadEdit}
        verifyFbEdit={verifyFbEdit}
        colors={colors}
        uxLabels={uxLabels}
        APP_CATEGORIES={APP_CATEGORIES}
        APP_AGES={APP_AGES}
        INVENTORY_TYPES={INVENTORY_TYPES}
        BANNER_SIZES={BANNER_SIZES}
        BANNER_POS={BANNER_POS}
        INTER_TRIGGERS={INTER_TRIGGERS}
        INTER_FORMATS={INTER_FORMATS}
        REWARD_TYPES={REWARD_TYPES}
        FETCHED_APPS={FETCHED_APPS}
        GENDERS={GENDERS}
        LOCATIONS={LOCATIONS}
      />
    );
  }

  // ══════════════ RENDER REGISTRATION WIZARD ══════════════
  if (view === 'reg') {
    return (
      <RegisterWizard 
        ssp={ssp}
        setSsp={setSsp}
        apiKey={apiKey}
        setApiKey={setApiKey}
        fetching={fetching}
        fetchStep={fetchStep}
        fApps={fApps}
        selApps={selApps}
        appData={appData}
        expandedApp={expandedApp}
        setExpandedApp={setExpandedApp}
        fbStates={fbStates}
        startFetch={startFetch}
        toggleSelectRegApp={toggleSelectRegApp}
        updateRegAppField={updateRegAppField}
        handleFbUploadReg={handleFbUploadReg}
        verifyFbReg={verifyFbReg}
        finalizeRegistration={finalizeRegistration}
        onBack={() => setView('list')}
        colors={colors}
        NETWORKS={NETWORKS}
        APP_CATEGORIES={APP_CATEGORIES}
        APP_AGES={APP_AGES}
        INVENTORY_TYPES={INVENTORY_TYPES}
        BANNER_SIZES={BANNER_SIZES}
        BANNER_POS={BANNER_POS}
        INTER_TRIGGERS={INTER_TRIGGERS}
        INTER_FORMATS={INTER_FORMATS}
        REWARD_TYPES={REWARD_TYPES}
        GENDERS={GENDERS}
        LOCATIONS={LOCATIONS}
      />
    );
  }

  // ══════════════ RENDER LIST VIEW ══════════════
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">My Apps</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1.5">
            Configure supply-side API credentials, targeting settings, and placements.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* List/Grid layout toggle */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setLayoutMode('grid')}
              className={cn(
                "p-1.5 rounded-lg text-slate-400 hover:text-foreground transition-all cursor-pointer border-none bg-transparent outline-none",
                layoutMode === 'grid' ? "bg-slate-800 text-foreground" : ""
              )}
              title="Card Grid Mode"
            >
              <BarChart2 size={16} />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={cn(
                "p-1.5 rounded-lg text-slate-400 hover:text-foreground transition-all cursor-pointer border-none bg-transparent outline-none",
                layoutMode === 'list' ? "bg-slate-800 text-foreground" : ""
              )}
              title="Tabular Row Mode"
            >
              <FileText size={16} />
            </button>
          </div>

          <button 
            onClick={() => setView('reg')}
            className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand/20 cursor-pointer self-start md:self-auto border-none outline-none"
          >
            <Plus size={18} />
            <span>Register app</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end mt-4">
        <div className="sm:col-span-2 md:col-span-2">
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Search</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="App name, platform, categories..."
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-brand outline-none"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Category</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fCat}
              onChange={(e) => { setFCat(e.target.value); setPage(1); }}
            >
              <option value="all">All Category</option>
              {allCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Platform</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fPlat}
              onChange={(e) => { setFPlat(e.target.value); setPage(1); }}
            >
              <option value="all">All Platform</option>
              {allPlats.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">App Age</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fAge}
              onChange={(e) => { setFAge(e.target.value); setPage(1); }}
            >
              <option value="all">All Lifecycles</option>
              {ageOrder.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Location</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fLoc}
              onChange={(e) => { setFLoc(e.target.value); setPage(1); }}
            >
              <option value="all">All Regions</option>
              {allLocs.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Priority</label>
          <div className="relative">
            <select
              className="w-full bg-[#11141D] border border-[#1E293B] rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-300 outline-none cursor-pointer appearance-none"
              value={fPri}
              onChange={(e) => { setFPri(e.target.value); setPage(1); }}
            >
              <option value="all">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sorting bar & details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-semibold border-b border-[#1E293B]/70 pb-3">
        <div>
          Showing {paginatedApps.length} of {filtered.length} apps {filtered.length !== apps.length && `(filtered from ${apps.length})`}
        </div>

        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <div className="relative">
            <select
              className="bg-transparent text-slate-300 border-none outline-none pr-6 font-semibold cursor-pointer appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">App Name (A-Z)</option>
              <option value="age_new">Age Lifecycle (Newest)</option>
              <option value="age_old">Age Lifecycle (Oldest)</option>
              <option value="priority">Priority Tier</option>
            </select>
            <ChevronDown size={12} className="absolute right-0 top-0.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Listing Content */}
      {paginatedApps.length === 0 ? (
        <div className="text-center py-16 bg-[#11141D] border border-[#1E293B] rounded-[20px]">
          <AlertTriangle size={32} className="mx-auto text-slate-600 mb-2" />
          <h3 className="font-bold text-slate-400">No applications matched</h3>
          <p className="text-xs text-slate-500 mt-1">Adjust filters or search metrics to find your registered applications.</p>
        </div>
      ) : layoutMode === 'grid' ? (
        
        // CARD GRID VIEW LAYOUT
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedApps.map((a, i) => (
            <AppCard 
              key={a.id}
              app={a}
              index={i}
              pinned={pinned}
              togglePin={togglePin}
              onClick={() => { setSelectedAppId(a.id); setView('detail'); }}
              onDelete={() => handleDelete(a.id, a.app)}
              colors={colors}
            />
          ))}
        </div>
      ) : (
        
        // TABULAR ROW LIST VIEW LAYOUT
        <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Application</th>
                  <th className="py-4 px-4">Platform</th>
                  <th className="py-4 px-4">SSP Network</th>
                  <th className="py-4 px-4">Lifecycle Age</th>
                  <th className="py-4 px-4">Placements</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApps.map((a, i) => (
                  <AppRow 
                    key={a.id}
                    app={a}
                    index={i}
                    pinned={pinned}
                    togglePin={togglePin}
                    onView={() => { setSelectedAppId(a.id); setView('detail'); }}
                    onEdit={() => { setSelectedAppId(a.id); setView('detail'); setTimeout(() => startEdit(a), 50); }}
                    onDelete={() => handleDelete(a.id, a.app)}
                    colors={colors}
                  />
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
