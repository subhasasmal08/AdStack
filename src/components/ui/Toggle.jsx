"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export default function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "w-9 h-5 rounded-full relative transition-all duration-300 cursor-pointer outline-none border-none",
        value ? "bg-brand" : "bg-slate-700"
      )}
    >
      <span 
        className={cn(
          "w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all duration-300",
          value ? "left-4.75" : "left-0.75"
        )}
      />
    </button>
  );
}
