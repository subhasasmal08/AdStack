"use client";
import React from 'react';
import { cn } from "@/lib/utils";

const AuthCard = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className={cn(
        "w-full max-w-[480px] bg-card border border-border rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl",
        "animate-in fade-in slide-in-from-bottom-8 duration-700",
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
