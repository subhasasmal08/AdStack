"use client";

import React from 'react';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const isChatbot = pathname === '/chatbot';

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-[#5C59E8]/30 transition-colors duration-300">
      <Sidebar />
      <main className={cn(
        "flex-1 overflow-hidden",
        !isChatbot && "p-10 overflow-y-auto"
      )}>
        <div className={cn(
          "h-full animate-in fade-in slide-in-from-bottom-4 duration-700",
          !isChatbot && "max-w-[1400px] mx-auto"
        )}>
          {children}
        </div>
      </main>
      <CommandPalette />
    </div>
  );
};

export default DashboardLayout;
