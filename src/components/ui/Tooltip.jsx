"use client";

import React, { useState } from 'react';

export default function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex ml-1.5 align-middle select-none">
      <span 
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-brand hover:border-brand cursor-help"
      >
        ?
      </span>
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#1A1F2B] border border-slate-700 rounded-lg text-[11px] text-slate-300 w-48 shadow-xl z-50 pointer-events-none line-height-1.4 leading-normal font-sans">
          {text}
        </span>
      )}
    </span>
  );
}
