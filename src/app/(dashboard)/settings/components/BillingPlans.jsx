"use client";

import React from 'react';
import { Crown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const PLANS = [
  { name: "Starter", price: "Free", feat: ["1 Registered App", "2 Ad Networks Platform", "Basic PDF Reports", "Email Support"], current: false },
  { name: "Pro", price: "$49/mo", feat: ["5 Registered Apps", "All Ad Networks Platforms", "Advanced PDF Reports", "Priority eCPM Support", "Unlimited AI Chatbot", "Dynamic dashboards"], current: true },
  { name: "Enterprise", price: "$199/mo", feat: ["Unlimited Apps", "All Networks + Custom sync", "White-label reports PDF", "Dedicated account CSM", "API Endpoint Access", "SLA contract guarantee"], current: false }
];

export default function BillingPlans() {
  return (
    <div className="space-y-6">
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-2">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <Crown size={16} className="text-brand" /> Subscription Upgrade Plans
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Upgrade your subscription plan tier to unlock additional apps, bidding networks integrations, and custom metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((p, i) => (
          <div 
            key={i} 
            className={cn(
              "bg-[#11141D] border rounded-[20px] p-6 flex flex-col justify-between min-h-[360px] relative transition-all duration-300 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5",
              p.current ? "border-brand/40 shadow-lg shadow-brand/5 ring-1 ring-brand/10" : "border-[#1E293B] hover:border-slate-700"
            )}
          >
            {p.current && (
              <span className="absolute top-4 right-4 bg-brand/10 border border-brand/20 text-brand text-[9px] font-bold px-2.5 py-0.5 rounded-full select-none uppercase tracking-wide">
                Current Plan
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-md font-bold text-slate-300">{p.name}</h3>
                <div className="text-2xl font-black text-foreground mt-1.5 font-heading tracking-tight">{p.price}</div>
              </div>

              <div className="space-y-2 pt-2">
                {p.feat.map((f, j) => (
                  <div key={j} className="flex items-start gap-2.5 text-xs text-slate-400 font-semibold leading-normal">
                    <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={cn(
                "w-full py-2.5 rounded-xl font-bold text-xs transition-colors duration-250 cursor-pointer border-none outline-none mt-6",
                p.current 
                  ? "bg-[#1A1F2B] border border-[#2A3447] text-slate-400 hover:text-white" 
                  : "bg-brand text-white hover:opacity-90 shadow-md shadow-brand/10"
              )}
              disabled={p.current}
            >
              {p.current ? "Active subscription" : "Upgrade Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
