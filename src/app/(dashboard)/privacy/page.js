"use client";

import React from 'react';
import Legals from '../settings/components/Legals';

export default function PrivacyPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Privacy Policy</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          AdStack publisher metrics data protection and compliance privacy policies.
        </p>
      </div>

      <div className="mt-4">
        <Legals mode="privacy" />
      </div>
    </div>
  );
}
