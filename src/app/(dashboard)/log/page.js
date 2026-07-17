"use client";

import React, { useState } from 'react';
import ActivityLog from '../settings/components/ActivityLog';

const INITIAL_LOG = [
  { id: 1, action: "Account created", time: "Mar 15, 2025 09:00 AM", icon: "user" },
  { id: 2, action: "App registered: Puzzle Quest Pro", time: "Mar 15, 2025 09:15 AM", icon: "plus" },
  { id: 3, action: "App registered: FitTrack", time: "Mar 16, 2025 11:30 AM", icon: "plus" },
  { id: 4, action: "Report generated: Q1 2025 Revenue Analysis", time: "Apr 1, 2025 02:00 AM", icon: "report" },
  { id: 5, action: "Settings updated: WhatsApp notifications enabled", time: "Apr 1, 2025 10:22 AM", icon: "settings" },
  { id: 6, action: "Publisher profile synced", time: "Apr 2, 2025 02:15 AM", icon: "chart" },
  { id: 7, action: "Report generated: Ad Performance Audit", time: "Apr 2, 2025 02:00 AM", icon: "report" },
  { id: 8, action: "Security: MFA enabled", time: "Apr 3, 2025 04:10 PM", icon: "shield" }
];

export default function LogPage() {
  const [log, setLog] = useState(INITIAL_LOG);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Activity Log</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Chronological logs of system and publisher actions.
        </p>
      </div>

      <div className="mt-4">
        <ActivityLog log={log} />
      </div>
    </div>
  );
}
