"use client";

import React from 'react';
import { ArrowLeft, Lock, ChevronDown, Check, RefreshCw, Upload, ShieldCheck, AlertTriangle, Globe, BarChart2, X, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import Tooltip from "@/components/ui/Tooltip";
import { MultiSelect, MultiSelectScroll } from "@/components/ui/MultiSelect";

export default function RegisterWizard({
  ssp,
  setSsp,
  apiKey,
  setApiKey,
  fetching,
  fetchStep,
  fApps,
  selApps,
  appData,
  expandedApp,
  setExpandedApp,
  fbStates,
  startFetch,
  toggleSelectRegApp,
  updateRegAppField,
  handleFbUploadReg,
  verifyFbReg,
  finalizeRegistration,
  onBack,
  colors,
  NETWORKS,
  APP_CATEGORIES,
  APP_AGES,
  INVENTORY_TYPES,
  BANNER_SIZES,
  BANNER_POS,
  INTER_TRIGGERS,
  INTER_FORMATS,
  REWARD_TYPES,
  GENDERS,
  LOCATIONS
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg bg-[#11141D] border border-[#1E293B] hover:text-foreground text-slate-400 transition-all cursor-pointer border-none outline-none"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Register Applications</h1>
          <p className="text-[12px] text-slate-500 font-semibold mt-1 font-sans">Connect your SSP dashboard network to import ad inventory setups.</p>
        </div>
      </div>

      {/* SSP Credentials */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pb-2 border-b border-[#1E293B]">
          <Lock size={16} /> SSP API credentials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">SSP Network Platform <Tooltip text="Select the supply-side platform provider connected to your app." /></label>
            <div className="relative">
              <select
                className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-4 pr-10 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none cursor-pointer appearance-none"
                value={ssp}
                onChange={(e) => setSsp(e.target.value)}
              >
                <option value="">Select SSP network...</option>
                {NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Secret Authorization Key <Tooltip text="The secret API token found in your SSP developer settings dashboard." /></label>
            <input 
              type="text"
              placeholder="sk-live-..."
              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none font-mono"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={startFetch}
          disabled={fetching || !ssp || !apiKey}
          className="bg-brand disabled:opacity-50 hover:opacity-90 transition-all text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer border-none outline-none"
        >
          {fetching ? <RefreshCw size={14} className="animate-spin" /> : null}
          <span>Fetch Applications</span>
        </button>

        {/* Fetching Progress indicators */}
        {fetchStep > 0 && fetchStep < 4 && (
          <div className="bg-[#1A1F2B] border border-[#1E293B] rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SSP Sync Status</div>
            {[
              { label: `Connecting to ${ssp} gateway API...`, step: 1 },
              { label: "Pulling 30 days of ad transactional auction statistics...", step: 2 },
              { label: "Analyzing application definitions, formats, and placements...", step: 3 }
            ].map((item) => {
              const isDone = fetchStep > item.step;
              const isAct = fetchStep === item.step;
              return (
                <div key={item.step} className="flex items-center gap-2.5 text-xs">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    isDone ? "bg-[#052E16] text-[#4ADE80]" : isAct ? "bg-brand/20 text-brand animate-pulse" : "bg-slate-800 text-slate-500"
                  )}>
                    {isDone ? "✓" : isAct ? "⟳" : "○"}
                  </div>
                  <span className={cn(isDone ? "text-slate-300" : isAct ? "text-slate-200 font-semibold" : "text-slate-500")}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Fetched apps checkboxes */}
        {fApps.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#1E293B] animate-in fade-in duration-200">
            <label className="block text-xs font-semibold text-slate-400">Select Apps to Register <Tooltip text="Select the apps to import. Each checked app will open an configuration drawer below." /></label>
            <div className="flex flex-wrap gap-2">
              {fApps.map(a => {
                const isChecked = selApps.includes(a.name);
                return (
                  <button
                    key={a.name}
                    onClick={() => toggleSelectRegApp(a.name)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-200 cursor-pointer",
                      isChecked 
                        ? "bg-[#1E1B4B] border-brand text-brand shadow-md"
                        : "bg-[#1A1F2B] border-[#2A3447] text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    )}
                  >
                    {isChecked ? <Check size={14} /> : null}
                    <span>{a.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">({a.platform})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected App Configuration Drawers */}
      <div className="space-y-4">
        {selApps.map((name, idx) => {
          const data = appData[name];
          if (!data) return null;
          const isOpen = expandedApp === name;
          const fb = fbStates[name] || { file: "", url: "", verifying: false, verified: false, error: "" };
          const revSum = [data.ra, data.ri, data.rs2, data.ro].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

          return (
            <div 
              key={name}
              className="bg-[#11141D] border border-[#1E293B] hover:border-slate-800 rounded-[20px] transition-all duration-200 overflow-hidden"
            >
              <div 
                onClick={() => setExpandedApp(isOpen ? null : name)}
                className="p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm", colors[idx % colors.length])}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-foreground">{name}</h3>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {data.plat} &middot; {data.cats?.join(', ') || "No Category"} &middot; {data.invs?.length || 0} Placements
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  {data.fbVerified && (
                    <span className="px-2 py-0.5 rounded bg-[#065F46] text-[#A7F3D0] text-[10px] font-bold">Firebase Conn</span>
                  )}
                  <ChevronDown size={18} className={cn("text-slate-500 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
                </div>
              </div>

              {isOpen && (
                <div className="p-6 border-t border-[#1E293B] space-y-6 bg-[#0E1017]">
                  
                  {/* Firebase connection */}
                  <div className="bg-[#11141D] border border-[#1E293B] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1E293B] pb-2">
                      <ShieldCheck size={15} /> Firebase Database configurations
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-sans">Account Service Credentials file (.json)</label>
                        <div className="flex items-center gap-3">
                          <label className="bg-[#1A1F2B] border border-[#2A3447] text-slate-300 hover:border-slate-500 transition-all font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer relative">
                            <input type="file" accept=".json" onChange={(e) => handleFbUploadReg(name, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Upload size={14} /> Upload JSON
                          </label>
                          {fb.file && <span className="text-xs text-emerald-400 font-semibold truncate max-w-[150px]">{fb.file}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Database Realtime URL</label>
                        <input 
                          type="text"
                          placeholder="https://..."
                          className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground font-mono outline-none"
                          value={data.fbUrl || ""}
                          onChange={(e) => updateRegAppField(name, 'fbUrl', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => verifyFbReg(name)}
                        disabled={fb.verifying || !fb.file || !data.fbUrl}
                        className="bg-[#5C59E8] disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer border-none"
                      >
                        {fb.verifying ? "Verifying..." : "Verify & Connect"}
                      </button>
                      {fb.verified && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">✓ Verified</span>}
                      {fb.error && <span className="text-xs text-red-400 font-semibold">{fb.error}</span>}
                    </div>
                  </div>

                  {/* App Priority */}
                  <div className="bg-[#11141D] border border-[#1E293B] rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1E293B] pb-2">
                      <AlertTriangle size={15} /> Monitoring importance tier
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Critical", "High", "Medium", "Low"].map(p => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => updateRegAppField(name, 'priority', p)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer select-none",
                            data.priority === p 
                              ? "bg-[#1E1B4B] text-brand border-brand" 
                              : "bg-[#1A1F2B] border-[#2A3447] text-slate-400 hover:border-slate-500 hover:text-slate-200"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* App Details & Audience */}
                  <div className="bg-[#11141D] border border-[#1E293B] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1E293B] pb-2">
                      <Globe size={15} /> Specifications & Target demographics
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Categories</label>
                        <MultiSelectScroll options={APP_CATEGORIES} selected={data.cats || []} onChange={(v) => updateRegAppField(name, 'cats', v)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">App Age</label>
                        <select
                          className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none cursor-pointer"
                          value={data.age || ""}
                          onChange={(e) => updateRegAppField(name, 'age', e.target.value)}
                        >
                          <option value="">Select...</option>
                          {APP_AGES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age Min</label>
                          <input type="number" className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none" value={data.amin} onChange={e => updateRegAppField(name, 'amin', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age Max</label>
                          <input type="number" className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none" value={data.amax} onChange={e => updateRegAppField(name, 'amax', e.target.value)} />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-sans">Value Proposition</label>
                        <textarea className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none" rows={2} value={data.val} onChange={e => updateRegAppField(name, 'val', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Genders</label>
                        <MultiSelect options={GENDERS} selected={data.gens || []} onChange={v => updateRegAppField(name, 'gens', v)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target locations</label>
                        <MultiSelectScroll options={LOCATIONS} selected={data.locs || []} onChange={v => updateRegAppField(name, 'locs', v)} />
                      </div>
                    </div>
                  </div>

                  {/* Revenue share splits */}
                  <div className="bg-[#11141D] border border-[#1E293B] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1E293B] pb-2">
                      <BarChart2 size={15} /> Monetization revenue distribution
                    </h4>
                    <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
                      {["ra", "ri", "rs2", "ro"].map((f, i) => {
                        const v = parseFloat(data[f]) || 0;
                        const pct = revSum > 0 ? (v / revSum) * 100 : 0;
                        return <div key={f} className={cn("h-full transition-all duration-300", colors[i])} style={{ width: `${pct}%` }} />;
                      })}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["AdMob Ads", "In-App Purchases", "Subscriptions", "Other channels"].map((label, i) => {
                        const f = ["ra", "ri", "rs2", "ro"][i];
                        return (
                          <div key={f}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <span className={cn("w-1.5 h-1.5 rounded-full", colors[i])} />
                              {label}
                            </label>
                            <input 
                              type="number" 
                              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl px-3 py-1.5 text-xs text-foreground outline-none" 
                              value={data[f]} 
                              onChange={e => updateRegAppField(name, f, e.target.value)} 
                              placeholder="0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inventory placements configs */}
                  <div className="bg-[#11141D] border border-[#1E293B] rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#1E293B] pb-2">
                      Placements formats configurations
                    </h4>
                    <div className="space-y-3">
                      {data.invs?.map((inv, i) => {
                        const updatePlacement = (key, val) => {
                          const list = [...data.invs];
                          list[i] = { ...list[i], [key]: val };
                          updateRegAppField(name, 'invs', list);
                        };

                        return (
                          <div key={i} className="bg-[#1A1F2B] border border-[#2A3447] rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200">🔒 {inv.n}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-bold uppercase">{inv.t}</span>
                            </div>

                            {(inv.t === "Banner" || inv.t === "Adaptive Banner") && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Banner Size</label>
                                  <select className="w-full bg-[#11141D] border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none" value={inv.sz} onChange={e => updatePlacement("sz", e.target.value)}>
                                    <option value="">Select...</option>
                                    {BANNER_SIZES.map(s => <option key={s}>{s}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Position</label>
                                  <select className="w-full bg-[#11141D] border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none" value={inv.pos} onChange={e => updatePlacement("pos", e.target.value)}>
                                    <option value="">Select...</option>
                                    {BANNER_POS.map(p => <option key={p}>{p}</option>)}
                                  </select>
                                </div>
                              </div>
                            )}

                            {inv.t === "Interstitial" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Trigger Condition</label>
                                  <select className="w-full bg-[#11141D] border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none" value={inv.trg} onChange={e => updatePlacement("trg", e.target.value)}>
                                    <option value="">Select...</option>
                                    {INTER_TRIGGERS.map(t => <option key={t}>{t}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ad Format</label>
                                  <select className="w-full bg-[#11141D] border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none" value={inv.fmt} onChange={e => updatePlacement("fmt", e.target.value)}>
                                    <option value="">Select...</option>
                                    {INTER_FORMATS.map(f => <option key={f}>{f}</option>)}
                                  </select>
                                </div>
                              </div>
                            )}

                            {(inv.t === "Rewarded Video" || inv.t === "Rewarded Interstitial") && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reward Item</label>
                                  <select className="w-full bg-[#11141D] border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none" value={inv.rt} onChange={e => updatePlacement("rt", e.target.value)}>
                                    <option value="">Select...</option>
                                    {REWARD_TYPES.map(t => <option key={t}>{t}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reward Value</label>
                                  <input type="number" className="w-full bg-[#11141D] border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none" value={inv.ra2} onChange={e => updatePlacement("ra2", e.target.value)} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Wizard Footer bar */}
      {selApps.length > 0 && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
          <button 
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-foreground border border-[#2A3447] bg-transparent hover:bg-slate-800/30 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={finalizeRegistration}
            className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-brand/20 cursor-pointer border-none outline-none"
          >
            Register {selApps.length} App{selApps.length > 1 ? "s" : ""} ✓
          </button>
        </div>
      )}
    </div>
  );
}
