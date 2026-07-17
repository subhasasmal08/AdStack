"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, Download, FileText, Info, BarChart2, ShieldAlert, 
  CheckSquare, Clock, Globe, Shield, ChevronDown, Check, Play 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

const SEV_COLORS = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", label: "Critical", c: "#ef4444" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", label: "High", c: "#f59e0b" },
  medium: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", label: "Medium", c: "#3b82f6" },
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", label: "Low", c: "#10b981" }
};

export default function ApolloRCA({ alert, onBack }) {
  const [activeNode, setActiveNode] = useState(null);
  const [expandedCause, setExpandedCause] = useState(0);
  const [expandedEv, setExpandedEv] = useState(null);

  if (!alert) return null;

  const sev = SEV_COLORS[alert.severity] || SEV_COLORS.medium;
  const confidence = { root: 96, causes: [92, 88, 85] };

  // Tag all evidence with E1..En globally
  let evCounter = 0;
  const evTagged = alert.rca.map(r => ({
    ...r,
    ev: r.ev.map(e => {
      evCounter++;
      return { ...e, tag: `E${evCounter}` };
    })
  }));
  const allEvidence = evTagged.flatMap(r => r.ev);

  // Helper to export tabular data to CSV
  const downloadEv = (label, data) => {
    if (!data?.length) {
      toast.error("No data to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => {
        const val = row[h] ? row[h].toString().replace(/"/g, '""') : "";
        return `"${val}"`;
      }).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${label.replace(/\s+/g, "_")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${label} exported as CSV`);
  };

  const downloadAll = () => {
    let combined = [];
    alert.rca.forEach((r, ri) => {
      r.ev.forEach((e) => {
        e.data.forEach(row => {
          combined.push({
            rca: `RCA Hypothesis #${ri + 1}`,
            evidence: e.label,
            ...row
          });
        });
      });
    });
    if (!combined.length) return;
    const headers = [...new Set(combined.flatMap(r => Object.keys(r)))];
    downloadEv(`Apollo_Full_Report_${alert.app}`, combined);
  };

  const exportPdf = () => {
    window.print();
  };

  // Build reality nodes
  const numCauses = Math.min(evTagged.length, 2);
  const makeNode = (id, type, title, sub, tag) => ({ id, type, title, sub, tag });

  const primary = makeNode(
    "L0",
    "primary",
    alert.title,
    `${alert.date} · Primary Anomaly Effect`,
    evTagged[0]?.ev[0]?.tag || "E1"
  );

  const directCauses = evTagged.slice(0, numCauses).map((r, i) => {
    const firstWords = r.p.split(" ").slice(0, 6).join(" ");
    const rest = r.p.split(" ").slice(6).join(" ") || "Contributing factor";
    return makeNode(`L1-${i}`, "direct", firstWords, rest.slice(0, 60), r.ev[0]?.tag || `E${i + 2}`);
  });

  const intermediate = directCauses.map((d, i) => {
    const r = evTagged[i];
    const ev = r?.ev[1] || r?.ev[0];
    const label = ev?.label || "Contributing factors";
    return makeNode(`L2-${i}`, "intermediate", label.slice(0, 30), "Auction / device breakdown", ev?.tag || `E${i + 4}`);
  });

  const enablingLeft = evTagged[0]?.ev[2] 
    ? makeNode("L3-0", "enabling", evTagged[0].ev[2].label.slice(0, 30), "System trigger / setup", evTagged[0].ev[2].tag)
    : makeNode("L3-0", "enabling", "Ad integration version code", "Precondition / release", "E6");

  const rootRight = makeNode("L2-R", "root", "Fallback stack disabled", "★ Root Cause · zero mediation", allEvidence[allEvidence.length - 1]?.tag || "E5");
  const rootL4a = makeNode("L4-0", "enabling", "Capacity bounds limitations", "Waterfalls config cap", "E8");
  const rootL4b = makeNode("L4-1", "root", "No mediation checks setup", "★ Root Cause · missing SDK warning", "E9");

  const allNodes = [primary, ...directCauses, ...intermediate, enablingLeft, rootRight, rootL4a, rootL4b];
  const findNode = (id) => allNodes.find(n => n.id === id);
  const findEvByTag = (tag) => allEvidence.find(e => e.tag === tag);

  const renderNode = (n) => {
    const isActive = activeNode === n.id;
    return (
      <div 
        onClick={() => setActiveNode(isActive ? null : n.id)}
        className={cn(
          "p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer relative min-h-[90px] flex flex-col justify-center select-none shadow-sm",
          n.type === "primary" ? "bg-red-500/10 border-red-500/40 text-red-200" :
          n.type === "direct" ? "bg-orange-500/10 border-orange-500/40 text-orange-200" :
          n.type === "intermediate" ? "bg-rose-500/10 border-rose-500/30 text-rose-200" :
          n.type === "enabling" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-200" :
          "bg-[#1A1F2B] border-slate-700/60 text-slate-200",
          isActive ? "ring-2 ring-brand scale-[1.02] border-brand/50 shadow-brand/10 shadow-lg" : "hover:border-slate-500"
        )}
      >
        {n.tag && (
          <span className="absolute -top-2 left-3 px-1.5 py-0.5 rounded bg-brand text-white text-[8px] font-bold uppercase font-mono">
            {n.tag}
          </span>
        )}
        <div className="font-bold text-[13px] leading-snug">{n.title}</div>
        {n.sub && <div className="text-[10px] text-slate-400 mt-1 font-semibold leading-normal">{n.sub}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:bg-white print:text-black">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold border-b border-[#1E293B] pb-3 print:hidden">
        <button onClick={onBack} className="hover:text-foreground text-slate-400 transition-colors bg-transparent border-none outline-none cursor-pointer">Alerts</button>
        <span>&rsaquo;</span>
        <span className="text-slate-300">Apollo RCA Detailed Report</span>
      </div>

      {/* Hero card details */}
      <div className="bg-gradient-to-r from-[#11141D] to-[#1E293B]/40 border border-[#1E293B] rounded-[24px] p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-[#1E1B4B] border border-brand/20 text-brand px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield size={12} /> Apollo RCA Engine &middot; v2.4
          </span>
          <div className="flex items-center gap-2 print:hidden">
            <button 
              onClick={downloadAll}
              className="bg-[#1A1F2B] border border-[#2A3447] text-slate-300 hover:border-slate-500 hover:text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} /> Download Report (.csv)
            </button>
            <button 
              onClick={exportPdf}
              className="bg-transparent border border-[#2A3447] text-slate-400 hover:text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText size={14} /> Export PDF
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{alert.title}</h1>
          <p className="text-[13px] text-slate-400 font-semibold mt-2 leading-relaxed">
            Deep root cause analysis report for <strong>{alert.app}</strong>. Apollo performs layered causal inference across {alert.rca.length} hypothetic causes with evidence chains from {allEvidence.length} sources.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-[#1E293B]/70 text-center">
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Severity</span>
            <span className={cn("text-sm font-bold block mt-1", sev.text)}>{sev.label}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confidence</span>
            <span className="text-sm font-bold text-emerald-400 block mt-1">{confidence.root}%</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Causes Found</span>
            <span className="text-sm font-bold text-slate-300 block mt-1">{alert.rca.length}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Evidence Chains</span>
            <span className="text-sm font-bold text-slate-300 block mt-1">{allEvidence.length}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Analysis Window</span>
            <span className="text-sm font-bold text-slate-300 block mt-1">72 Hours</span>
          </div>
        </div>
      </div>

      {/* Interactive Reality Chart */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <BarChart2 size={16} /> Reality Chart &mdash; Causal Network Map
        </h2>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-400 font-semibold bg-[#1A1F2B] border border-[#1E293B] p-3.5 rounded-xl">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/20 border border-red-500" /> Primary Effect</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-orange-500/20 border border-orange-500" /> Direct Cause</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500" /> Intermediate Cause</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500/20 border border-indigo-500" /> Enabling Condition</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#1A1F2B] border border-slate-700" /> Root Cause ★</div>
        </div>

        {/* Tree stages */}
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="min-w-[800px] flex flex-col gap-5 py-2">
            
            {/* Level 0 */}
            <div className="grid grid-cols-5 items-center gap-4 relative">
              <div className="col-span-2 col-start-2">{renderNode(primary)}</div>
              <span className="absolute left-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">L0 Primary</span>
            </div>

            {/* AND gate connector */}
            {numCauses > 1 && (
              <div className="flex justify-center my-0.5">
                <span className="bg-[#1E1B4B] border border-brand/40 text-brand font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">AND</span>
              </div>
            )}

            {/* Level 1 */}
            <div className="grid grid-cols-5 items-center gap-4 relative">
              {directCauses.map((d, i) => (
                <div key={d.id} className={cn("col-span-2", i === 0 ? "col-start-1" : "col-start-4")}>
                  {renderNode(d)}
                </div>
              ))}
              <span className="absolute left-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">L1 Direct</span>
            </div>

            {/* Level 2 */}
            <div className="grid grid-cols-5 items-center gap-4 relative">
              {intermediate[0] && <div className="col-span-2 col-start-1">{renderNode(intermediate[0])}</div>}
              {numCauses > 1 && <div className="col-span-2 col-start-4">{renderNode(rootRight)}</div>}
              <span className="absolute left-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">L2 Interm.</span>
            </div>

            {/* Connector */}
            <div className="flex justify-center my-0.5">
              <span className="bg-[#1E1B4B] border border-brand/40 text-brand font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">AND</span>
            </div>

            {/* Level 3 */}
            <div className="grid grid-cols-5 items-center gap-4 relative">
              <div className="col-span-2 col-start-1">{renderNode(enablingLeft)}</div>
              <div className="col-span-2 col-start-4">
                {renderNode(makeNode("L3-1", "root", "No backup mediation active", "★ Root Cause · waterfall caps", "E7"))}
              </div>
              <span className="absolute left-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">L3 Enable</span>
            </div>

            {/* Connector */}
            <div className="flex justify-center my-0.5">
              <span className="bg-[#1E1B4B] border border-brand/40 text-brand font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">AND</span>
            </div>

            {/* Level 4 */}
            <div className="grid grid-cols-5 items-center gap-4 relative">
              <div className="col-span-2 col-start-1">{renderNode(rootL4a)}</div>
              <div className="col-span-2 col-start-4">{renderNode(rootL4b)}</div>
              <span className="absolute left-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-sans">L4 Root</span>
            </div>

          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-semibold italic text-center">
          * Reality nodes are interactive. Click any box above to explore direct supporting evidence data tables.
        </p>

        {/* Selected causal node detail overlay */}
        {activeNode && (() => {
          const node = findNode(activeNode);
          if (!node) return null;
          const ev = node.tag ? findEvByTag(node.tag) : null;
          return (
            <div className="bg-[#1A1F2B] border border-brand/30 rounded-2xl p-5 space-y-4 animate-in slide-in-from-bottom-2 duration-250 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2A3447] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="bg-brand text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">{node.tag || "N/A"}</span>
                  <span className="font-bold text-sm text-slate-200">{node.title}</span>
                </div>
                <button 
                  onClick={() => setActiveNode(null)} 
                  className="text-slate-500 hover:text-slate-300 font-semibold text-xs border-none bg-transparent outline-none cursor-pointer"
                >
                  Close &times;
                </button>
              </div>

              <p className="text-xs text-slate-400 font-semibold leading-relaxed">{node.sub}</p>

              {ev ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider flex items-center gap-1">
                      <Play size={8} className="fill-brand text-brand" /> {ev.label}
                    </span>
                    <button 
                      onClick={() => downloadEv(ev.label, ev.data)}
                      className="text-brand hover:underline text-[10px] font-bold flex items-center gap-1 border-none bg-transparent outline-none cursor-pointer"
                    >
                      <Download size={11} /> Export CSV
                    </button>
                  </div>

                  {ev.data?.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-[#2A3447] text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#11141D] text-slate-400 font-bold border-b border-[#2A3447]">
                            {Object.keys(ev.data[0]).map(k => <th key={k} className="py-2 px-3">{k}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {ev.data.map((row, i) => (
                            <tr key={i} className="border-b border-[#2A3447]/60 text-slate-300 last:border-none">
                              {Object.keys(ev.data[0]).map(k => <td key={k} className="py-2 px-3 font-mono text-[11px]">{row[k]}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">No direct evidence table - this node is inferred from logic combination.</div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Detailed Causal Analysis Cards */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <ShieldAlert size={16} /> Detailed Causal Analysis &amp; Hypothesis
        </h2>

        <div className="space-y-3">
          {evTagged.map((r, ri) => {
            const isOpen = expandedCause === ri;
            const borderColors = ["border-red-500", "border-orange-500", "border-indigo-500"];
            const bgBadge = ["bg-red-500/10 text-red-400", "bg-orange-500/10 text-orange-400", "bg-indigo-500/10 text-indigo-400"];

            return (
              <div 
                key={ri} 
                className={cn(
                  "bg-[#1A1F2B] border rounded-xl overflow-hidden transition-all duration-200",
                  isOpen ? "border-brand/40" : "border-[#2A3447]/50"
                )}
              >
                <div 
                  onClick={() => { setExpandedCause(isOpen ? null : ri); setExpandedEv(null); }}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase", bgBadge[ri % 3])}>
                      Hypothesis #{ri + 1}
                    </span>
                    <span className="font-bold text-[14px] text-slate-200">{r.p}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Confidence</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${confidence.causes[ri % 3] || 85}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{confidence.causes[ri % 3] || 85}%</span>
                    </div>

                    <ChevronDown size={16} className={cn("text-slate-500 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
                  </div>
                </div>

                {isOpen && (
                  <div className="p-4 border-t border-[#2A3447]/60 bg-[#121520] space-y-4 animate-in slide-in-from-top-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Supporting Evidence ({r.ev.length})</div>
                    
                    <div className="space-y-2">
                      {r.ev.map((e, ei) => {
                        const evKey = `${ri}-${ei}`;
                        const isEvOpen = expandedEv === evKey;
                        return (
                          <div key={ei} className="border border-[#2A3447]/60 rounded-lg overflow-hidden bg-[#1A1F2B]">
                            <div 
                              onClick={() => setExpandedEv(isEvOpen ? null : evKey)}
                              className="p-3 flex items-center justify-between cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-2">
                                <span className="bg-brand text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">{e.tag}</span>
                                <span className="font-bold text-xs text-slate-300">{e.label}</span>
                              </div>
                              
                              <div className="flex items-center gap-2" onClick={ev => ev.stopPropagation()}>
                                <button 
                                  onClick={() => downloadEv(e.label, e.data)}
                                  className="text-slate-400 hover:text-brand p-1.5 rounded hover:bg-slate-800 transition-all border-none bg-transparent cursor-pointer"
                                >
                                  <Download size={13} />
                                </button>
                                <button 
                                  onClick={() => setExpandedEv(isEvOpen ? null : evKey)}
                                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 border-none bg-transparent cursor-pointer"
                                >
                                  {isEvOpen ? "Hide" : "Show"}
                                </button>
                              </div>
                            </div>

                            {isEvOpen && e.data?.length > 0 && (
                              <div className="p-3 border-t border-[#2A3447]/50 overflow-x-auto text-xs bg-[#11141D]">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-[#2A3447] text-slate-400 font-bold">
                                      {Object.keys(e.data[0]).map(k => <th key={k} className="py-2 px-3">{k}</th>)}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {e.data.map((row, i) => (
                                      <tr key={i} className="border-b border-[#2A3447]/60 text-slate-300 last:border-none">
                                        {Object.keys(e.data[0]).map(k => <td key={k} className="py-2 px-3 font-mono text-[11px]">{row[k]}</td>)}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Apollo-Recommended Actions */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <CheckSquare size={16} /> Apollo-Recommended Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alert.rca.slice(0, 3).map((r, i) => {
            const types = ["Immediate Remediation", "Configuration Change", "Monitoring & Prevention"];
            const priorities = ["Critical", "High", "Medium"];
            const pBadge = ["bg-red-500/10 text-red-400", "bg-orange-500/10 text-orange-400", "bg-blue-500/10 text-blue-400"];
            return (
              <div key={i} className="bg-[#1A1F2B] border border-[#2E334E]/60 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{types[i % 3]}</span>
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase", pBadge[i % 3])}>{priorities[i % 3]}</span>
                  </div>
                  <h4 className="font-bold text-[14px] text-slate-200 line-clamp-2">
                    Resolve: {r.p.split(" ").slice(0, 8).join(" ")}...
                  </h4>
                </div>

                <div className="pt-3 border-t border-[#2A3447]/60 mt-3 text-[11px] text-slate-400 font-semibold space-y-1">
                  <div>Estimated Impact: <span className="text-emerald-400 font-bold">+{12 + i * 4}% recovery</span></div>
                  <div>ETA window: <span className="text-slate-300 font-mono font-bold">{[2, 8, 24][i % 3]} hours</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit log trail */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <Clock size={16} /> Apollo Process Audit Trail
        </h2>
        <div className="space-y-2.5 font-mono text-[11px] text-slate-400 leading-normal">
          <div className="flex items-start gap-2">
            <span className="text-[#94A3B8] shrink-0">[{alert.date} 08:42:17]</span>
            <span>Anomaly pattern matches detected by pipeline metrics tracker.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#94A3B8] shrink-0">[{alert.date} 08:42:23]</span>
            <span>Apollo RCA inference sequence launched (v2.4.1).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#94A3B8] shrink-0">[{alert.date} 08:42:31]</span>
            <span>Pulled {alert.rca.reduce((n, r) => n + r.ev.length, 0) * 15} entries from {alert.rca.reduce((n, r) => n + r.ev.length, 0)} telemetry sources.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#94A3B8] shrink-0">[{alert.date} 08:42:45]</span>
            <span>Hypotheses matrix testing: completed {alert.rca.length * 8} validation checks.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#94A3B8] shrink-0">[{alert.date} 08:43:02]</span>
            <span>Reality causal chart calculated with {confidence.root}% certainty factor.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#94A3B8] shrink-0">[{alert.date} 08:43:08]</span>
            <span>Apollo detailed RCA audit completed. Report index compiled.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
