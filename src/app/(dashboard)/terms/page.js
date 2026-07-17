"use client";

import React from 'react';
import Legals from '../settings/components/Legals';

export default function TermsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Terms of Service</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Terms of service agreement for using the AdStack analytics monitoring tools.
        </p>
      </div>

      <div className="mt-4">
        <Legals mode="terms" />
      </div>
    </div>
  );
}
