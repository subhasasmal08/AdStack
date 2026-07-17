"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export function MultiSelect({ options, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(x => x !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {options.map(opt => {
        const isSel = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer select-none",
              isSel 
                ? "bg-[#1E1B4B] text-brand border-brand" 
                : "bg-[#1A1F2B] border-[#2A3447] text-slate-400 hover:border-slate-500 hover:text-slate-200"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function MultiSelectScroll({ options, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(x => x !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mt-1 scrollbar-thin">
      {options.map(opt => {
        const isSel = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer whitespace-nowrap",
              isSel 
                ? "bg-[#1E1B4B] text-brand border-brand" 
                : "bg-[#1A1F2B] border-[#2A3447] text-slate-400 hover:border-slate-500 hover:text-slate-200"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
