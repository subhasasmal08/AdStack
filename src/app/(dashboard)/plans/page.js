"use client";

import React from 'react';
import BillingPlans from '../settings/components/BillingPlans';

export default function PlansPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Upgrade Plan</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
          Manage pricing options and subscription tiers.
        </p>
      </div>

      <div className="mt-4">
        <BillingPlans />
      </div>
    </div>
  );
}
