"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { 
  Bot, 
  LayoutGrid, 
  TriangleAlert, 
  FileText, 
  Settings, 
  Search, 
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";

const navItems = [
  { icon: Bot, label: "AI Chatbot", href: "/chatbot" },
  { icon: LayoutGrid, label: "My Apps", href: "/apps", badge: 2 },
  { icon: TriangleAlert, label: "Alerts", href: "/alerts", badge: 3 },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-border-sidebar flex flex-col text-sidebar-foreground font-sans sticky top-0 transition-all duration-300">
      {/* Header */}
      <div className="p-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold text-brand tracking-tight">AdStack</Link>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-sidebar-accent hover:opacity-80 transition-all shadow-inner border border-border-sidebar/50"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === "dark" ? (
              <Sun size={18} className="" />
            ) : (
              <Moon size={18} className="text-brand" />
            ))}
            {!mounted && <Sun size={18} className="text-sidebar-foreground" />}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-nav-label cursor-pointer hover:text-sidebar-foreground transition-colors group">
          <Search size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">⌘K</span>
        </div>
      </div>

      {/* Navigation Section Label */}
      <div className="px-8 mt-6">
         <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] dark:text-[#475569] light:text-slate-400 uppercase">
            Navigation
          </h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-4 mt-2">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/apps" && pathname === "/");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group",
                    isActive 
                      ? "bg-sidebar-accent text-white" 
                      : "hover:bg-sidebar-accent/50 hover:text-white text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon 
                      size={22} 
                      className={cn(
                        "transition-colors duration-300",
                        isActive ? "text-white" : "text-nav-label group-hover:text-white"
                      )} 
                    />
                    <span className="text-[15px] font-semibold tracking-wide">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-bold min-w-[24px] text-center transition-all duration-300",
                      item.label === "Alerts" 
                        ? (theme === "dark" ? "bg-[#1E1616] text-[#FF5D5D]" : "bg-red-50 text-red-500") 
                        : (theme === "dark" ? "bg-[#18182B] text-[#5C59E8]" : "bg-blue-50 text-blue-500")
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-border-sidebar/50 bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-sidebar-accent transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-white tracking-wide">AdStack Labs</span>
              <span className="text-[12px] text-nav-label font-medium truncate max-w-[120px]">jekin@adstack.io</span>
            </div>
          </div>
          <ChevronDown size={18} className="text-nav-label group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
