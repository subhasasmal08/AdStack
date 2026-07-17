"use client";

import React from 'react';
import { 
  ArrowLeft, Edit, Trash2, Check, FileText, Globe, Lock, 
  Upload, ShieldCheck, AlertTriangle, HelpCircle, BarChart2, Plus, X, ChevronDown 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Toggle from "@/components/ui/Toggle";
import Tooltip from "@/components/ui/Tooltip";
import { MultiSelect, MultiSelectScroll } from "@/components/ui/MultiSelect";

export default function AppDetails({
  selectedApp,
  editMode,
  setEditMode,
  draft,
  setDraft,
  saveEdit,
  startEdit,
  handleDelete,
  onBack,
  showInvForm,
  setShowInvForm,
  invDraft,
  setInvDraft,
  addInventory,
  removeInventory,
  fbDraft,
  setFbDraft,
  handleFbUploadEdit,
  verifyFbEdit,
  colors,
  uxLabels,
  APP_CATEGORIES,
  APP_AGES,
  INVENTORY_TYPES,
  BANNER_SIZES,
  BANNER_POS,
  INTER_TRIGGERS,
  INTER_FORMATS,
  REWARD_TYPES,
  FETCHED_APPS,
  GENDERS,
  LOCATIONS
}) {
  const activeDetailApp = editMode && draft ? draft : selectedApp;
  if (!activeDetailApp) return null;

  const metadata = FETCHED_APPS.find(f => f.name === activeDetailApp.app) || { gens: GENDERS, locs: LOCATIONS };
  const revTotal = [activeDetailApp.ra, activeDetailApp.ri, activeDetailApp.rs2, activeDetailApp.ro]
    .reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditMode(false); setDraft(null); onBack(); }}
            className="p-2 rounded-lg bg-[#11141D] border border-[#1E293B] hover:text-foreground text-slate-400 transition-all cursor-pointer border-none outline-none"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground font-heading">{activeDetailApp.app}</h1>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                activeDetailApp.plat === "Android" ? "bg-[#052E16] text-[#4ADE80]" : "bg-[#172554] text-[#60A5FA]"
              )}>
                {activeDetailApp.plat}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 font-semibold mt-1">
              Connected: {activeDetailApp.net} &middot; App Age: {activeDetailApp.age || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!editMode ? (
            <>
              <button 
                onClick={() => startEdit(selectedApp)}
                className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-brand/20 cursor-pointer border-none outline-none"
              >
                <Edit size={15} />
                <span>Edit App</span>
              </button>
              <button 
                onClick={() => handleDelete(activeDetailApp.id, activeDetailApp.app)}
                className="bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-semibold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer outline-none"
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={saveEdit}
                className="bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-semibold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer border-none outline-none"
              >
                <Check size={15} />
                <span>Save Changes</span>
              </button>
              <button 
                onClick={() => { setEditMode(false); setDraft(null); }}
                className="bg-transparent border border-[#2A3447] text-slate-400 hover:text-foreground transition-all font-semibold text-[13px] px-4 py-2 rounded-xl cursor-pointer outline-none"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {editMode && (
        <div className="bg-[#1E1B4B] border border-brand/30 rounded-xl px-4 py-3 text-xs text-brand-foreground font-semibold flex items-center gap-2">
          <Info size={16} className="text-brand" />
          <span>Edit Mode &mdash; Supply-Side Platform configuration parameters are locked. All details can be modified.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* App Details card */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
              <FileText size={16} />
              App Specification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Value Proposition</label>
                {editMode ? (
                  <textarea 
                    className="w-full bg-[#1A1F2B] border border-brand/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none"
                    rows={3}
                    value={activeDetailApp.val || ""}
                    onChange={(e) => setDraft({ ...draft, val: e.target.value })}
                  />
                ) : (
                  <div className="bg-[#1A1F2B] rounded-xl px-4 py-3 text-sm border border-[#1E293B]/50 text-slate-300 min-h-[50px] leading-relaxed">
                    {activeDetailApp.val || "—"}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category Tags</label>
                  {editMode ? (
                    <MultiSelect options={APP_CATEGORIES} selected={activeDetailApp.cats || []} onChange={(v) => setDraft({ ...draft, cats: v })} />
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {activeDetailApp.cats?.map(c => (
                        <span key={c} className="px-3 py-1 rounded-full text-xs bg-[#1E1B4B] text-brand border border-brand/20 font-semibold">{c}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">App Age</label>
                  {editMode ? (
                    <div className="relative">
                      <select
                        className="w-full bg-[#1A1F2B] border border-brand/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none cursor-pointer appearance-none"
                        value={activeDetailApp.age || ""}
                        onChange={(e) => setDraft({ ...draft, age: e.target.value })}
                      >
                        <option value="">Select app lifecycle age...</option>
                        {APP_AGES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-slate-500 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="bg-[#1A1F2B] border border-[#1E293B]/50 rounded-xl px-4 py-2.5 text-sm text-slate-300 font-semibold">
                      {activeDetailApp.age || "—"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience card */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
              <Globe size={16} />
              Target Audience Demographics
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Minimum Age Target</label>
                  <input 
                    type="number"
                    disabled={!editMode}
                    className={cn(
                      "w-full bg-[#1A1F2B] border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none",
                      editMode ? "border-brand/50 focus:ring-1 focus:ring-brand" : "border-[#1E293B]/50 opacity-80"
                    )}
                    value={activeDetailApp.amin || ""}
                    onChange={(e) => setDraft({ ...draft, amin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Maximum Age Target</label>
                  <input 
                    type="number"
                    disabled={!editMode}
                    className={cn(
                      "w-full bg-[#1A1F2B] border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none",
                      editMode ? "border-brand/50 focus:ring-1 focus:ring-brand" : "border-[#1E293B]/50 opacity-80"
                    )}
                    value={activeDetailApp.amax || ""}
                    onChange={(e) => setDraft({ ...draft, amax: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender <Tooltip text="Demographics filtered from application app store page listing information." /></label>
                {editMode ? (
                  <MultiSelect options={metadata.gens || GENDERS} selected={activeDetailApp.gens || []} onChange={(v) => setDraft({ ...draft, gens: v })} />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {activeDetailApp.gens?.map(g => (
                      <span key={g} className="px-3 py-1 rounded-full text-xs bg-[#1A1F2B] border border-[#2A3447] text-slate-300 font-semibold">{g}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Locations <Tooltip text="Regions identified from ad auction transactional requests." /></label>
                {editMode ? (
                  <MultiSelectScroll options={metadata.locs || LOCATIONS} selected={activeDetailApp.locs || []} onChange={(v) => setDraft({ ...draft, locs: v })} />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {activeDetailApp.locs?.map(l => (
                      <span key={l} className="px-3 py-1 rounded-full text-xs bg-[#1A1F2B] border border-[#2A3447] text-slate-300 font-semibold">{l}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Placement configurations */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <BarChart2 size={16} />
                Ad Placements & Inventory
              </h2>
              {editMode && (
                <button 
                  onClick={() => setShowInvForm(!showInvForm)}
                  className="px-3.5 py-1.5 rounded-xl border border-brand text-brand hover:bg-[#1E1B4B] transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer bg-transparent"
                >
                  <Plus size={14} /> Add Placement
                </button>
              )}
            </div>

            {/* Add Placement inline Form */}
            {showInvForm && (
              <div className="bg-[#1A1F2B] border border-brand/50 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-3 duration-250">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Placement Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. game_over_reward"
                      className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-brand"
                      value={invDraft.n}
                      onChange={(e) => setInvDraft({ ...invDraft, n: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ad Format Type</label>
                    <div className="relative">
                      <select
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs text-foreground outline-none cursor-pointer appearance-none"
                        value={invDraft.t}
                        onChange={(e) => setInvDraft({ ...invDraft, t: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {INVENTORY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {(invDraft.t === 'Banner' || invDraft.t === 'Adaptive Banner') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Banner Size</label>
                      <select 
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none cursor-pointer"
                        value={invDraft.sz}
                        onChange={(e) => setInvDraft({ ...invDraft, sz: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {BANNER_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Placement Position</label>
                      <select 
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none cursor-pointer"
                        value={invDraft.pos}
                        onChange={(e) => setInvDraft({ ...invDraft, pos: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {BANNER_POS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {invDraft.t === 'Interstitial' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Trigger Condition</label>
                      <select 
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none cursor-pointer"
                        value={invDraft.trg}
                        onChange={(e) => setInvDraft({ ...invDraft, trg: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {INTER_TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ad Format type</label>
                      <select 
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none cursor-pointer"
                        value={invDraft.fmt}
                        onChange={(e) => setInvDraft({ ...invDraft, fmt: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {INTER_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {(invDraft.t === 'Rewarded Video' || invDraft.t === 'Rewarded Interstitial') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Payout Reward Item</label>
                      <select 
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none cursor-pointer"
                        value={invDraft.rt}
                        onChange={(e) => setInvDraft({ ...invDraft, rt: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {REWARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Reward Amount Value</label>
                      <input 
                        type="number"
                        placeholder="e.g. 100"
                        className="w-full bg-[#11141D] border border-slate-700 rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-brand"
                        value={invDraft.ra2}
                        onChange={(e) => setInvDraft({ ...invDraft, ra2: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setShowInvForm(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-medium cursor-pointer hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={addInventory}
                    className="px-3 py-1.5 rounded-lg bg-[#5C59E8] text-white text-xs font-semibold cursor-pointer border-none"
                  >
                    Add Placement
                  </button>
                </div>
              </div>
            )}

            {/* Placements listing */}
            <div className="space-y-3">
              {activeDetailApp.invs?.map((inv, idx) => (
                <div key={idx} className="bg-[#1A1F2B] border border-[#1E293B]/70 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all duration-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock size={12} className="text-slate-500" />
                      <span className="font-bold text-[14px] text-foreground">{inv.n}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#1E1B4B] text-brand border border-brand/20 font-bold uppercase">{inv.t}</span>
                    </div>
                    
                    {/* Configuration Details */}
                    <div className="text-[11px] text-[#94A3B8] font-medium flex flex-wrap gap-x-3">
                      {inv.sz && <span>Size: {inv.sz}</span>}
                      {inv.pos && <span>Position: {inv.pos}</span>}
                      {inv.trg && <span>Trigger: {inv.trg}</span>}
                      {inv.fmt && <span>Format: {inv.fmt}</span>}
                      {inv.rt && <span>Reward: {inv.ra2} {inv.rt}</span>}
                    </div>
                  </div>

                  {editMode && (
                    <button 
                      onClick={() => removeInventory(idx)}
                      className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer self-end md:self-auto transition-colors border-none bg-transparent"
                      title="Remove Placement"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              {(!activeDetailApp.invs || activeDetailApp.invs.length === 0) && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No active ad placements configured.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* SSP Credentials (Locked) */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
              <Lock size={15} />
              SSP connection
            </h2>
            <div className="space-y-3">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Network platform</span>
                <span className="text-sm font-semibold text-slate-300 block mt-1">{activeDetailApp.net}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">SSP API Key</span>
                <span className="font-mono text-xs text-slate-400 block mt-1 break-all bg-[#1A1F2B] border border-[#1E293B]/70 rounded-lg px-2.5 py-1.5">
                  {activeDetailApp.key}
                </span>
              </div>
            </div>
          </div>

          {/* Firebase Card */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <ShieldCheck size={16} />
                Firebase connection
              </h2>
              {activeDetailApp.fbVerified && (
                <span className="px-2 py-0.5 rounded bg-[#065F46] text-[#A7F3D0] text-[10px] font-bold">Verified</span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Database credentials file (.json)</label>
                {editMode ? (
                  <div className="flex items-center gap-3">
                    <label className="bg-[#1A1F2B] border border-[#2A3447] text-slate-300 hover:border-slate-500 transition-all font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer relative">
                      <input type="file" accept=".json" onChange={handleFbUploadEdit} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Upload size={14} /> Upload JSON
                    </label>
                    {activeDetailApp.fbCert && (
                      <span className="text-[11px] text-emerald-400 truncate max-w-[120px]" title={activeDetailApp.fbCert}>{activeDetailApp.fbCert}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-300 font-semibold block">{activeDetailApp.fbCert || "Not uploaded"}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Database URL</label>
                <input 
                  type="text"
                  disabled={!editMode}
                  className={cn(
                    "w-full bg-[#1A1F2B] border rounded-xl px-3 py-2 text-xs text-slate-300 font-mono outline-none",
                    editMode ? "border-brand/50 focus:ring-1 focus:ring-brand" : "border-[#1E293B]/50 opacity-80"
                  )}
                  placeholder="https://your-app.firebaseio.com"
                  value={activeDetailApp.fbUrl || ""}
                  onChange={(e) => setDraft({ ...draft, fbUrl: e.target.value })}
                />
              </div>

              {editMode && (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <button 
                    type="button"
                    onClick={verifyFbEdit}
                    disabled={fbDraft.verifying || !activeDetailApp.fbCert || !activeDetailApp.fbUrl}
                    className="w-full bg-brand text-white font-semibold text-xs py-2 rounded-xl cursor-pointer border-none"
                  >
                    {fbDraft.verifying ? "Verifying..." : "Verify Credentials"}
                  </button>
                  {fbDraft.error && <span className="text-[10px] text-red-400 text-center">{fbDraft.error}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Monitoring Priority settings */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
              <AlertTriangle size={15} />
              Monitoring priority
            </h2>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Importance tier</label>
              {editMode ? (
                <div className="flex flex-wrap gap-1.5">
                  {["Critical", "High", "Medium", "Low"].map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setDraft({ ...draft, priority: p })}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer select-none",
                        activeDetailApp.priority === p 
                          ? "bg-[#1E1B4B] text-brand border-brand" 
                          : "bg-[#1A1F2B] border-[#2A3447] text-slate-400 hover:border-slate-500 hover:text-slate-200"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-300 font-bold">{activeDetailApp.priority || "Medium"}</span>
              )}
            </div>
          </div>

          {/* UX vs Ads settings */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
              <HelpCircle size={15} />
              UX impact parameters
            </h2>
            <div className="space-y-2.5">
              {Object.entries(uxLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-[#1A1F2B] rounded-xl text-xs text-slate-300 font-semibold border border-[#1E293B]/30">
                  <span>{label}</span>
                  {editMode ? (
                    <Toggle value={!!activeDetailApp[key]} onChange={(val) => setDraft({ ...draft, [key]: val })} />
                  ) : (
                    <span className={cn("font-bold", activeDetailApp[key] ? "text-amber-400" : "text-slate-500")}>
                      {activeDetailApp[key] ? "Active" : "Disabled"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Splits */}
          <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
              <BarChart2 size={15} />
              Monetization revenue split
            </h2>
            
            {/* Split Bar */}
            <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
              {["ra", "ri", "rs2", "ro"].map((field, i) => {
                const val = parseFloat(activeDetailApp[field]) || 0;
                const pct = revTotal > 0 ? (val / revTotal) * 100 : 0;
                return (
                  <div 
                    key={field} 
                    className={cn("h-full transition-all duration-300", colors[i])} 
                    style={{ width: `${pct}%` }} 
                  />
                );
              })}
            </div>

            {/* Form Input fields */}
            <div className="grid grid-cols-2 gap-4">
              {["AdMob Ads", "In-App Purchases", "Subscriptions", "Other channels"].map((label, i) => {
                const field = ["ra", "ri", "rs2", "ro"][i];
                return (
                  <div key={field}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                      <span className={cn("w-2 h-2 rounded-full", colors[i])} />
                      {label}
                    </label>
                    <input 
                      type="number"
                      disabled={!editMode}
                      placeholder="0"
                      className={cn(
                        "w-full bg-[#1A1F2B] border rounded-xl px-3 py-1.5 text-xs text-foreground outline-none",
                        editMode ? "border-brand/50 focus:ring-1 focus:ring-brand" : "border-[#1E293B]/50 opacity-80"
                      )}
                      value={activeDetailApp[field] || ""}
                      onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
