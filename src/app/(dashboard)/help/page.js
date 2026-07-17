"use client";

import React from 'react';
import HelpCenter from '../settings/components/HelpCenter';

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Help Center</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Find tutorials and troubleshooting articles for supply networks setups.
        </p>
      </div>

      <div className="mt-4">
        <HelpCenter />
      </div>
    </div>
  );
}
