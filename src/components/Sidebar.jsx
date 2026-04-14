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
  ChevronDown,
  User,
  Clock,
  HelpCircle,
  Crown,
  Shield,
  Globe,
  LogOut
} from "lucide-react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: Bot, label: "AI Chatbot", href: "/chatbot" },
  { icon: LayoutGrid, label: "My Apps", href: "/apps", badge: 2 },
  { icon: TriangleAlert, label: "Alerts", href: "/alerts", badge: 3 },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const menuItems = [
  { icon: User, label: "Profile", href: "#" },
  { icon: Clock, label: "Activity Log", href: "#" },
  { icon: HelpCircle, label: "Help", href: "#" },
  { icon: Crown, label: "Upgrade Plan", href: "#", color: "text-brand" },
  { icon: Shield, label: "Security", href: "#" },
  { type: "divider" },
  { icon: Globe, label: "Privacy Policy", href: "#" },
  { icon: FileText, label: "Terms of Service", href: "#" },
  { type: "divider" },
  { icon: LogOut, label: "Sign Out", href: "/login", isLogout: true },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    toast.success('Signed out successfully');
    router.push('/login');
  };

  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-border-sidebar flex flex-col text-sidebar-foreground font-sans sticky top-0 transition-all duration-300">
      {/* Header code stays the same... */}
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

      <div className="px-8 mt-6">
         <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] dark:text-[#475569] light:text-slate-400 uppercase">
            Navigation
          </h2>
      </div>

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
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon 
                      size={22} 
                      className={cn(
                        "transition-colors duration-300",
                        isActive ? "text-sidebar-accent-foreground" : "text-nav-label group-hover:text-sidebar-accent-foreground"
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

      <div className="p-4 border-t border-border-sidebar/50 bg-sidebar/50 backdrop-blur-sm relative">
        {/* Profile Menu Popup */}
        {isMenuOpen && (
          <div className="absolute bottom-[calc(100%+16px)] left-4 right-4 bg-sidebar border border-border-sidebar rounded-3xl p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 overflow-hidden backdrop-blur-xl">
            <div className="space-y-1">
              {menuItems.map((item, idx) => {
                if (item.type === "divider") {
                  return <div key={idx} className="h-px bg-border-sidebar my-2 mx-2" />;
                }
                const isSignOut = item.isLogout;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (isSignOut) handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group/item text-[14px] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left",
                      isSignOut && "text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    )}
                  >
                    <item.icon size={18} className={cn(
                      "transition-colors",
                      isSignOut ? "text-red-500 group-hover/item:text-red-600" : "text-nav-label group-hover/item:text-sidebar-accent-foreground",
                      item.color && item.color
                    )} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex items-center justify-between p-3 rounded-2xl hover:bg-sidebar-accent transition-all duration-300 cursor-pointer group",
            isMenuOpen && "bg-sidebar-accent shadow-inner border border-sidebar-border"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-sidebar-foreground tracking-wide">AdStack Labs</span>
              <span className="text-[12px] text-nav-label font-medium truncate max-w-[120px]">jekin@adstack.io</span>
            </div>
          </div>
          <ChevronDown 
            size={18} 
            className={cn(
              "text-nav-label group-hover:text-sidebar-foreground transition-all duration-300",
              isMenuOpen && "rotate-180 text-sidebar-foreground"
            )} 
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
