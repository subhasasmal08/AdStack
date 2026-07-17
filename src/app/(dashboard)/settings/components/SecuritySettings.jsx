"use client";

import React, { useState } from 'react';
import { Lock, Shield, Monitor, Eye, EyeOff, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import Toggle from "@/components/ui/Toggle";
import { toast } from 'sonner';

const DEVICES = [
  { id: "DEV-A7X2K9", os: "Windows 11", loc: "Mumbai, MH, India", mac: "3C:22:FB:01:AB:C8", current: true },
  { id: "DEV-M3P8Q1", os: "macOS Sonoma", loc: "Bangalore, KA, India", mac: "A4:83:E7:2D:5F:90", current: false },
  { id: "DEV-J5N4R6", os: "Android 14", loc: "Delhi, DL, India", mac: "F0:18:98:4C:D2:E1", current: false },
  { id: "DEV-W9T1L3", os: "iOS 17", loc: "London, UK", mac: "B8:27:EB:3A:F7:44", current: false }
];

export default function SecuritySettings({ onAddLog }) {
  const [showPw, setShowPw] = useState(false);
  const [mfa, setMfa] = useState(false);
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const [devs, setDevs] = useState(DEVICES);

  const [pwVisible, setPwVisible] = useState({ old: false, new1: false, new2: false });

  const handleUpdatePw = () => {
    if (!pw.old || !pw.new1 || !pw.new2) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (pw.new1 !== pw.new2) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Password updated successfully");
    setShowPw(false);
    setPw({ old: "", new1: "", new2: "" });
    if (onAddLog) onAddLog("Password updated");
  };

  const handleLogoutDev = (id) => {
    const prev = [...devs];
    setDevs(devs.filter(d => d.id !== id));
    toast.success(`Logged out of device ${id}`, {
      action: {
        label: "Undo",
        onClick: () => {
          setDevs(prev);
          toast.info("Session restored");
        }
      }
    });
  };

  const renderPwInput = (key, placeholder) => {
    const isVisible = pwVisible[key];
    return (
      <div className="relative">
        <input 
          type={isVisible ? "text" : "password"} 
          className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-4 pr-11 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-brand outline-none"
          value={pw[key]}
          placeholder={placeholder}
          onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
        />
        <button
          type="button"
          onClick={() => setPwVisible({ ...pwVisible, [key]: !isVisible })}
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 border-none bg-transparent cursor-pointer"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Password changes */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <Lock size={16} /> Change Password
        </h2>

        {!showPw ? (
          <button 
            onClick={() => setShowPw(true)}
            className="bg-[#1A1F2B] border border-[#2A3447] text-slate-300 hover:border-slate-500 transition-all font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer outline-none"
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Password</label>
              {renderPwInput("old", "Enter current password...")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
                {renderPwInput("new1", "Enter new password...")}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm New Password</label>
                {renderPwInput("new2", "Confirm new password...")}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleUpdatePw}
                className="bg-brand text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer border-none"
              >
                Update
              </button>
              <button 
                onClick={() => setShowPw(false)}
                className="bg-transparent border border-slate-700 text-slate-400 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MFA Security */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <Shield size={16} /> Multi-Factor Authentication (MFA)
        </h2>

        <div className="flex items-center justify-between p-4 bg-[#1A1F2B] rounded-xl border border-[#1E293B]/30">
          <div>
            <h3 className="text-xs font-bold text-slate-200">Two-Factor Authentication</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Protect your account with TOTP authenticator (Google Authenticator)</p>
          </div>
          <Toggle 
            value={mfa} 
            onChange={(v) => {
              setMfa(v);
              toast.success(v ? "MFA enabled" : "MFA disabled");
              if (onAddLog) onAddLog(v ? "MFA enabled" : "MFA disabled");
            }}
          />
        </div>

        {mfa && (
          <div className="p-4 bg-[#065F46]/10 border border-[#059669]/30 text-[#A7F3D0] rounded-xl text-xs font-bold animate-in fade-in duration-200">
            ✓ Two-factor security authentication is active on this account.
          </div>
        )}
      </div>

      {/* Active Devices logs */}
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <Monitor size={16} /> Active Devices &amp; Sessions
        </h2>

        <div className="space-y-3">
          {devs.map((d, i) => (
            <div 
              key={d.id} 
              className="bg-[#1A1F2B] border border-[#2A3447]/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs flex-1">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Device ID</span>
                  <span className="font-mono text-slate-300 font-semibold">{d.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Platform OS</span>
                  <span className="text-slate-300 font-semibold">{d.os}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">IP Location</span>
                  <span className="text-slate-300 font-semibold truncate block max-w-[120px]" title={d.loc}>{d.loc}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">MAC Address</span>
                  <span className="font-mono text-slate-300 font-semibold">{d.mac}</span>
                </div>
              </div>

              {d.current ? (
                <span className="px-2.5 py-0.5 rounded-full bg-[#052E16] text-[#4ADE80] text-[10px] font-bold self-start md:self-auto border border-[#22C55E]/10 select-none">
                  This Device
                </span>
              ) : (
                <button 
                  onClick={() => handleLogoutDev(d.id)}
                  className="bg-transparent border border-red-500/20 text-red-400 hover:bg-red-500/10 text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer self-start md:self-auto"
                >
                  Log out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
