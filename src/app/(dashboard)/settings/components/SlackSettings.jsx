"use client";

import React from 'react';
import Toggle from "@/components/ui/Toggle";

export default function SlackSettings({
  slOn,
  setSlOn,
  slackWebhook,
  setSlackWebhook
}) {
  return (
    <div className="bg-[#1A1F2B] border border-[#2A3447]/60 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
            S
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">Slack Webhooks</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Post real-time policy alerts into a Slack channel</p>
          </div>
        </div>
        <Toggle value={slOn} onChange={setSlOn} />
      </div>

      {slOn && (
        <div className="animate-in fade-in duration-200 pt-2 border-t border-[#2D3748]/55">
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slack Channel Incoming Webhook URL</label>
          <input 
            type="text" 
            placeholder="https://hooks.slack.com/services/..."
            className="w-full bg-[#11141D] border border-[#2A3447] rounded-lg px-3 py-2 text-xs text-foreground font-mono outline-none focus:border-brand"
            value={slackWebhook}
            onChange={(e) => setSlackWebhook(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
