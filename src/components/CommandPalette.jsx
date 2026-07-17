"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Grid, LayoutGrid, LineChart, TrendingUp, Bell, 
  MessageSquare, Settings, User, Clock, HelpCircle, Crown, 
  Shield, Globe, FileText, Plus 
} from 'lucide-react';
import { cn } from "@/lib/utils";

const PAGES = [
  { label: "My Registered Apps", href: "/apps", icon: LayoutGrid, category: "Dashboards" },
  { label: "Anomalies Alerts Logs", href: "/alerts", icon: Bell, category: "Anomalies" },
  { label: "Apollo AI Chatbot", href: "/chatbot", icon: MessageSquare, category: "Support" },
  { label: "System Configuration Settings", href: "/settings", icon: Settings, category: "Configuration" },
  { label: "User Account Profile", href: "/profile", icon: User, category: "Configuration" },
  { label: "Activity Sync Log", href: "/log", icon: Clock, category: "Configuration" },
  { label: "AdStack Help Center Guide", href: "/help", icon: HelpCircle, category: "Support" },
  { label: "Upgrade Plan Tier", href: "/plans", icon: Crown, category: "Billing" },
  { label: "MFA Account Security", href: "/security", icon: Shield, category: "Configuration" },
  { label: "Privacy Policy Document", href: "/privacy", icon: Globe, category: "Legals" },
  { label: "Terms of Service Agreement", href: "/terms", icon: FileText, category: "Legals" },
  { label: "Register New Application", href: "/apps", icon: Plus, category: "Dashboards" }
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Listen to keyboard shortcut and custom events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleToggle = () => {
      setOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleToggle);
    };
  }, []);

  // Reset indices and focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // Filter items
  const filtered = PAGES.filter(p => 
    p.label.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  // Handle navigate
  const handleNavigate = (href) => {
    router.push(href);
    setOpen(false);
  };

  // Keyboard navigation inside list
  const handleListKeyDown = (e) => {
    if (!open || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleNavigate(filtered[activeIndex].href);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (scrollRef.current && activeIndex >= 0) {
      const activeElement = scrollRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 select-none animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div 
        className="bg-[#11141D] border border-[#1E293B] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[420px] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search header bar */}
        <div className="relative border-b border-[#1E293B] flex items-center">
          <Search className="absolute left-4 text-slate-500" size={18} />
          <input 
            ref={inputRef}
            type="text"
            className="w-full bg-transparent pl-12 pr-12 py-4 text-sm text-foreground focus:outline-none placeholder-slate-500 font-sans"
            placeholder="Type page name or category to search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={handleListKeyDown}
          />
          <span className="absolute right-4 border border-[#252838] px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-mono">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin"
        >
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching pages or shortcuts found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavigate(item.href)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer border-none outline-none",
                    isSelected 
                      ? "bg-brand text-white shadow-lg shadow-brand/10" 
                      : "bg-transparent text-slate-300 hover:bg-[#1A1F2B]"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={18} className={isSelected ? "text-white" : "text-slate-400"} />
                    <span className="text-[13.5px] font-semibold tracking-wide font-sans">{item.label}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                    isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-500"
                  )}>
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info help bar */}
        <div className="border-t border-[#1E293B] bg-[#0E1017] px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-semibold font-sans">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
          </div>
          <span>Rapid Navigation Palette</span>
        </div>
      </div>
    </div>
  );
}
