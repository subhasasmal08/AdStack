"use client";

import React from 'react';
import { Clock, User, Plus, FileText, Settings, BarChart2, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";

const LOG_ICONS = {
  user: User,
  plus: Plus,
  report: FileText,
  settings: Settings,
  chart: BarChart2,
  shield: Shield,
  clock: Clock
};

export default function ActivityLog({ log }) {
  return (
    <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-4">
      <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
        <Clock size={16} /> Recent Activity Sync Logs
      </h2>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
        {log.map((item, i) => {
          const Icon = LOG_ICONS[item.icon] || Clock;
          return (
            <div 
              key={item.id || i} 
              className="flex items-center justify-between gap-4 p-3 bg-[#1A1F2B] border border-[#2D334E]/30 rounded-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                  <Icon size={15} />
                </div>
                <span className="text-xs font-bold text-slate-300">{item.action}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold shrink-0">{item.time}</span>
            </div>
          );
        })}

        {log.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500 italic">No recent activity synced.</div>
        )}
      </div>
    </div>
  );
}
