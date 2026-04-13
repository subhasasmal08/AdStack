import React from 'react';
import { cn } from "@/lib/utils";
import { 
  Bot, 
  LayoutGrid, 
  TriangleAlert, 
  FileText, 
  Settings, 
  Search, 
  Sun,
  ChevronDown
} from "lucide-react";

const navItems = [
  { icon: Bot, label: "AI Chatbot", href: "/chatbot" },
  { icon: LayoutGrid, label: "My Apps", href: "/apps", active: true, badge: 2 },
  { icon: TriangleAlert, label: "Alerts", href: "/alerts", badge: 3 },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const Sidebar = () => {
  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-border-sidebar flex flex-col text-sidebar-foreground font-sans sticky top-0">
      {/* Header */}
      <div className="p-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-[#5C59E8] tracking-tight">AdStack</div>
          <button className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#2D3748] transition-colors shadow-inner">
            <Sun size={18} className="text-sidebar-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer hover:text-sidebar-foreground transition-colors group">
          <Search size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">⌘K</span>
        </div>
      </div>

      {/* Navigation Section Label */}
      <div className="px-8 mt-6">
         <h2 className="text-[11px] font-bold tracking-[0.25em] text-[#475569] uppercase opacity-70">
            Navigation
          </h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-4 mt-2">
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group",
                  item.active 
                    ? "bg-[#1E1B4B] text-[#FFFFFF] shadow-sm" 
                    : "hover:bg-[#1E293B] hover:text-[#FFFFFF]"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon 
                    size={22} 
                    className={cn(
                      "transition-colors duration-300",
                      item.active ? "text-[#5C59E8]" : "text-[#475569] group-hover:text-sidebar-foreground"
                    )} 
                  />
                  <span className="text-[15px] font-semibold tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[11px] font-bold min-w-[24px] text-center shadow-sm",
                    item.label === "Alerts" 
                      ? "bg-[#450A0A] text-[#EF4444] border border-[#7F1D1D]" 
                      : "bg-[#1E1B4B] text-[#5C59E8] border border-[#312E81]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-border-sidebar/50 bg-[#0B0E14]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#1E293B] transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#5C59E8] flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#5C59E8]/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-white tracking-wide">AdStack Labs</span>
              <span className="text-[12px] text-[#475569] font-medium">jekin@adstack.io</span>
            </div>
          </div>
          <ChevronDown size={18} className="text-[#475569] group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
