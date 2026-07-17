"use client";

import React, { useRef } from 'react';
import { MessageSquare, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Toggle from "@/components/ui/Toggle";
import { toast } from 'sonner';

export default function WhatsAppSettings({
  waOn,
  setWaOn,
  waS,
  setWaS,
  waA,
  setWaA,
  waC,
  setWaC,
  wn,
  setWn,
  wp,
  setWp,
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
          <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
            <MessageSquare size={17} className="fill-current" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-200 leading-tight">WhatsApp</h3>
            <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">API keys + recipients</p>
          </div>
        </div>
        <Toggle value={waOn} onChange={setWaOn} />
      </div>

      {waOn && (
        <div className="space-y-4 animate-in fade-in duration-200 pt-3 border-t border-[#2D3748]/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Secret Key</label>
              <input 
                type="text" 
                className="w-full bg-[#11141D] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none font-mono focus:border-brand"
                value={waS} 
                onChange={(e) => setWaS(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Key</label>
              <input 
                type="text" 
                className="w-full bg-[#11141D] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none font-mono focus:border-brand"
                value={waA} 
                onChange={(e) => setWaA(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                Recipients &middot;{' '}
                <button 
                  onClick={() => setKbModal('contacts_wa')}
                  className="text-brand hover:underline text-[9.5px] font-bold cursor-pointer bg-transparent border-none outline-none inline uppercase"
                >
                  {waC.length} contacts &rsaquo;
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
                {waC.map((contact, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#1A1F2B] border border-[#2A3447] rounded-full pl-3 pr-2.5 py-1 flex items-center gap-2 text-[11px] shrink-0 select-none"
                  >
                    <span className="text-slate-300 font-semibold truncate max-w-[150px]">
                      <strong>{contact.n}</strong> {contact.p}
                    </span>
                    <button 
                      onClick={() => {
                        const prev = [...waC];
                        setWaC(waC.filter((_, i) => i !== idx));
                        toast.info(`Contact ${contact.n} removed`, {
                          action: { label: 'Undo', onClick: () => setWaC(prev) }
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
                value={wn}
                onChange={(e) => setWn(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="+91..."
                className="w-1/2 bg-[#11141D] border border-[#2A3447] rounded-xl px-3 py-2 text-xs text-foreground outline-none font-mono focus:border-brand"
                value={wp}
                onChange={(e) => setWp(e.target.value)}
              />
              <button 
                onClick={() => {
                  if (wn && wp) {
                    setWaC([...waC, { n: wn, p: wp }]);
                    setWn("");
                    setWp("");
                    toast.success("WhatsApp recipient added successfully");
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
