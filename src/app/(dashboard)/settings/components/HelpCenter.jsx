"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronRight, BookOpen, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

const ARTICLES = [
  { t: "Getting Started Guide", d: "Set up AdStack account profile, connect networks keys, and register apps.", icon: BookOpen },
  { t: "Connecting Networks APIs", d: "Step-by-step credentials config for AdMob, AppLovin, and Unity Ads.", icon: HelpCircle },
  { t: "Registering Applications", d: "Configure placements formats, targeting demographics, and ad splits.", icon: BookOpen },
  { t: "Understanding Reports", d: "Read automated PDF revenue analysis, RCA causal trees, and actions.", icon: HelpCircle },
  { t: "AI Chatbot commands", d: "Use conversational prompts for revenue data analysis and dashboards.", icon: MessageSquare },
  { t: "Settings & Notifications", d: "Configure WhatsApp contact tags, Email report triggers, and Slack webhooks.", icon: HelpCircle },
  { t: "Security Practices", d: "Enable multi-factor TOTP authentication and manage active session details.", icon: HelpCircle },
  { t: "Billing Tiers & Plans", d: "Manage pricing tiers, subscription features, and enterprise integrations.", icon: HelpCircle }
];

export default function HelpCenter() {
  const [selectedArticleIdx, setSelectedArticleIdx] = useState(null);

  if (selectedArticleIdx !== null) {
    const article = ARTICLES[selectedArticleIdx];
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold border-b border-[#1E293B] pb-3">
          <button 
            onClick={() => setSelectedArticleIdx(null)} 
            className="hover:text-foreground text-slate-400 transition-colors bg-transparent border-none outline-none cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft size={13} /> Help Center
          </button>
          <span>&rsaquo;</span>
          <span className="text-slate-300 truncate max-w-xs">{article.t}</span>
        </div>

        <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-5">
          <h2 className="text-xl font-bold text-foreground font-heading">{article.t}</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">{article.d}</p>
          
          <div className="bg-[#1A1F2B] border border-[#1E293B] rounded-xl p-16 text-center text-xs text-slate-500 font-bold select-none border-dashed">
            [ Screenshot Interactive Walkthrough Guide Image Placeholder ]
          </div>

          <div className="space-y-3 pt-3 border-t border-[#1E293B] text-xs text-slate-400 font-semibold leading-normal">
            <h4 className="text-slate-300 font-bold text-sm">Need immediate technical assistance?</h4>
            <p>If you encounter configuration warnings or credentials issues, contact our support team at <a href="mailto:support@adstack.io" className="text-brand hover:underline font-bold">support@adstack.io</a>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-2">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <HelpCircle size={16} /> Help &amp; User Documentation Center
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Search help guides, SDK integration documentation, and tutorials to optimize mediation eCPMs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {ARTICLES.map((a, i) => {
          const Icon = a.icon;
          return (
            <div 
              key={i} 
              onClick={() => setSelectedArticleIdx(i)}
              className="bg-[#11141D] border border-[#1E293B] hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#5C59E8]/10 text-brand flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-slate-200 leading-snug">{a.t}</h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-normal line-clamp-3">{a.d}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-brand font-bold uppercase mt-4 group">
                <span>Read Guide</span>
                <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
