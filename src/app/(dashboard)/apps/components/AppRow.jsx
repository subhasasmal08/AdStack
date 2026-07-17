"use client";

import React from 'react';
import { Pin, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AppRow({ app, index, pinned, togglePin, onView, onEdit, onDelete, colors }) {
  const isPinned = pinned.has(app.id);

  return (
    <tr 
      onClick={onView}
      className={cn(
        "border-b border-[#1E293B]/70 hover:bg-[#1A1F2B]/45 transition-colors cursor-pointer text-sm text-slate-300",
        isPinned ? "bg-[#1E1B4B]/10" : ""
      )}
    >
      <td className="py-4 px-6 font-semibold flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm", colors[index % colors.length])}>
          {app.app?.charAt(0) || "?"}
        </div>
        <div className="flex items-center gap-1.5">
          {isPinned && <Pin size={12} className="text-brand fill-brand shrink-0" />}
          <span className="text-foreground">{app.app}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
          app.plat === "Android" ? "bg-[#052E16] text-[#4ADE80]" : "bg-[#172554] text-[#60A5FA]"
        )}>
          {app.plat}
        </span>
      </td>
      <td className="py-4 px-4 font-medium text-slate-400">{app.net}</td>
      <td className="py-4 px-4 text-xs font-semibold text-slate-400">{app.age || "—"}</td>
      <td className="py-4 px-4 font-mono text-xs text-slate-400">{app.invs?.length || 0}</td>
      <td className="py-4 px-4">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
          app.priority === "Critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
          app.priority === "High" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
          app.priority === "Medium" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
          "bg-slate-500/10 text-slate-400 border border-slate-500/20"
        )}>
          {app.priority || "Medium"}
        </span>
      </td>
      <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => togglePin(app.id, e)}
            className={cn("p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors border-none bg-transparent outline-none cursor-pointer", isPinned ? "text-brand" : "")}
            title={isPinned ? "Unpin app" : "Pin app"}
          >
            <Pin size={14} className={isPinned ? "fill-brand" : ""} />
          </button>
          <button
            onClick={onView}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors border-none bg-transparent outline-none cursor-pointer"
            title="View App Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors border-none bg-transparent outline-none cursor-pointer"
            title="Edit App"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors border-none bg-transparent outline-none cursor-pointer"
            title="Delete App"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
