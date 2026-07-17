"use client";

import React, { useRef } from 'react';
import { Mail, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Toggle from "@/components/ui/Toggle";
import { toast } from 'sonner';

export default function EmailSettings({
  emOn,
  setEmOn,
  ems,
  setEms,
  en,
  setEn,
  ee,
  setEe,
  setKbModal
}) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#161922] border border-[#2A3447]/65 hover:border-[#2A3447] rounded-xl p-4.5 space-y-4 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Mail size={17} />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-200 leading-tight">Email</h3>
            <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">Report recipients</p>
          </div>
        </div>
        <Toggle value={emOn} onChange={setEmOn} />
      </div>

      {emOn && (
        <div className="space-y-4 animate-in fade-in duration-200 pt-3 border-t border-[#2D3748]/40">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                Recipients &middot;{' '}
                <button 
                  onClick={() => setKbModal('contacts_em')}
                  className="text-brand hover:underline text-[9.5px] font-bold cursor-pointer bg-transparent border-none outline-none inline uppercase"
                >
                  {ems.length} contacts &rsaquo;
                </button>
              </label>
            </div>

            {/* Horizontal scrollable contact pills with navigation arrows */}
            <div className="flex items-center gap-1.5 bg-[#11141D] border border-[#2A3447]/50 rounded-xl p-1.5">
              <button 
                type="button"
                onClick={scrollLeft}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1A1F2B] border-none bg-transparent cursor-pointer shrink-0"
              >
                <ChevronLeft size={14} />
              </button>
              
              <div 
                ref={scrollContainerRef}
                className="flex-1 flex gap-2 overflow-x-auto scrollbar-none pb-0.5 shrink-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {ems.map((contact, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#1A1F2B] border border-[#2A3447] rounded-full pl-3 pr-2.5 py-1 flex items-center gap-2 text-[11px] shrink-0 select-none"
                  >
                    <span className="text-slate-300 font-semibold truncate max-w-[160px]">
                      <strong>{contact.n}</strong> {contact.e}
                    </span>
                    <button 
                      onClick={() => {
                        const prev = [...ems];
                        setEms(ems.filter((_, i) => i !== idx));
                        toast.info(`Recipient ${contact.n} removed`, {
                          action: { label: 'Undo', onClick: () => setEms(prev) }
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded cursor-pointer transition-colors border-none bg-transparent"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                type="button"
                onClick={scrollRight}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1A1F2B] border-none bg-transparent cursor-pointer shrink-0"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Add Contact inputs */}
            <div className="flex gap-2 mt-3">
              <input 
                type="text" 
                placeholder="Name"
                className="w-1/2 bg-[#11141D] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-brand"
                value={en}
                onChange={(e) => setEn(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="email@co.com"
                className="w-1/2 bg-[#11141D] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-brand"
                value={ee}
                onChange={(e) => setEe(e.target.value)}
              />
              <button 
                onClick={() => {
                  if (en && ee) {
                    setEms([...ems, { n: en, e: ee }]);
                    setEn("");
                    setEe("");
                    toast.success("Email recipient added successfully");
                  }
                }}
                className="bg-brand text-white p-2.5 rounded-xl cursor-pointer hover:opacity-90 border-none shrink-0"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
