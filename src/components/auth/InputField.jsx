"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils";

const InputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  className, 
  id,
  value,
  onChange,
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={cn(
            "w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/40",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300",
            isPassword && "pr-12",
            className
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
