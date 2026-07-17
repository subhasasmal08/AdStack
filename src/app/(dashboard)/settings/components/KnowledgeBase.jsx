"use client";

import React from 'react';
import { Upload, X, Link, FileText, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export default function KnowledgeBase({
  files,
  setFiles,
  urls,
  setUrls,
  arts,
  setArts,
  nu,
  setNu,
  newArtText,
  setNewArtText,
  handleFileUpload,
  getFileColorClass,
  setKbModal
}) {
  return (
    <div className="space-y-6">
      {/* Documents section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-400 uppercase">Documents</label>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">{files.length}</span>
        </div>
        
        {/* File Dropzone */}
        <div className="border border-dashed border-[#2A3447] rounded-xl p-4 text-center cursor-pointer hover:border-brand/50 hover:bg-slate-800/10 transition-all relative">
          <input type="file" multiple accept=".docx,.pdf,.xlsx,.jpg,.png,.jpeg" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <Upload size={14} className="text-brand" />
            <span>Click to browse or drop ad guidelines documents</span>
          </div>
        </div>

        {/* Document chips */}
        {files.length > 0 && (
          <div className="space-y-2 pt-1.5">
            <div className="flex flex-wrap gap-1.5">
              {files.slice(0, 5).map((f, idx) => (
                <div key={idx} className="bg-[#1A1F2B] border border-[#2A3447]/70 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs max-w-[200px] select-none">
                  <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", getFileColorClass(f.e))}>
                    {f.e}
                  </span>
                  <span className="text-slate-300 font-medium truncate flex-1" title={f.n}>{f.n}</span>
                  <button 
                    onClick={() => {
                      const prev = [...files];
                      setFiles(files.filter((_, i) => i !== idx));
                      toast.info(`Document ${f.n} deleted`, {
                        action: { label: 'Undo', onClick: () => setFiles(prev) }
                      });
                    }}
                    className="text-slate-500 hover:text-red-400 cursor-pointer transition-colors border-none bg-transparent"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {files.length > 5 && (
              <button 
                onClick={() => setKbModal('docs')}
                className="text-xs text-brand hover:underline font-semibold block pt-1 bg-transparent border-none outline-none cursor-pointer"
              >
                See all {files.length} documents &rarr;
              </button>
            )}
          </div>
        )}
      </div>

      {/* URLs section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-400 uppercase">External URLs</label>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">{urls.length}</span>
        </div>

        {urls.length > 0 && (
          <div className="space-y-2 pt-1.5">
            <div className="flex flex-wrap gap-1.5">
              {urls.slice(0, 3).map((u, idx) => (
                <div key={idx} className="bg-[#1A1F2B] border border-[#2A3447]/70 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs max-w-[260px] select-none">
                  <Link size={12} className="text-brand shrink-0" />
                  <span className="text-brand font-medium truncate flex-1 font-mono text-[10.5px]" title={u}>{u}</span>
                  <button 
                    onClick={() => {
                      const prev = [...urls];
                      setUrls(urls.filter((_, i) => i !== idx));
                      toast.info(`URL deleted`, {
                        action: { label: 'Undo', onClick: () => setUrls(prev) }
                      });
                    }}
                    className="text-slate-500 hover:text-red-400 cursor-pointer transition-colors border-none bg-transparent"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {urls.length > 3 && (
              <button 
                onClick={() => setKbModal('urls')}
                className="text-xs text-brand hover:underline font-semibold block bg-transparent border-none outline-none cursor-pointer"
              >
                See all {urls.length} indexed URLs &rarr;
              </button>
            )}
          </div>
        )}

        {/* Add URL */}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="https://docs.mediation-network.com/guidelines"
            className="flex-1 bg-[#1A1F2B] border border-[#2A3447] rounded-lg px-3 py-1.5 text-xs text-foreground outline-none font-mono focus:border-brand"
            value={nu}
            onChange={(e) => setNu(e.target.value)}
          />
          <button 
            onClick={() => {
              if (nu) {
                setUrls([...urls, nu]);
                setNu("");
                toast.success("Knowledge base URL indexed");
              }
            }}
            className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border-none"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {/* Articles section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-400 uppercase">Written Articles</label>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">{arts.length}</span>
        </div>

        {arts.length > 0 && (
          <div className="space-y-2 pt-1.5">
            <div className="flex flex-wrap gap-1.5">
              {arts.slice(0, 3).map((a) => (
                <div key={a.id} className="bg-[#1A1F2B] border border-[#2A3447]/70 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs max-w-[220px] select-none">
                  <FileText size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-300 font-semibold truncate flex-1">{a.t}</span>
                  <button 
                    onClick={() => {
                      const prev = [...arts];
                      setArts(arts.filter(x => x.id !== a.id));
                      toast.info(`Article deleted`, {
                        action: { label: 'Undo', onClick: () => setArts(prev) }
                      });
                    }}
                    className="text-slate-500 hover:text-red-400 cursor-pointer transition-colors border-none bg-transparent"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {arts.length > 3 && (
              <button 
                onClick={() => setKbModal('arts')}
                className="text-xs text-brand hover:underline font-semibold block bg-transparent border-none outline-none cursor-pointer"
              >
                See all {arts.length} written articles &rarr;
              </button>
            )}
          </div>
        )}

        {/* Add Written Article */}
        <div className="space-y-2">
          <textarea 
            placeholder="Draft a new mediation strategy or policy notes..."
            className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-brand"
            rows={2}
            value={newArtText}
            onChange={(e) => setNewArtText(e.target.value)}
          />
          <button 
            onClick={() => {
              if (newArtText) {
                setArts([
                  ...arts, 
                  { id: Date.now(), t: `Mediation Strategy Note #${arts.length + 1}`, x: newArtText }
                ]);
                setNewArtText("");
                toast.success("Written article added to Knowledge Base");
              }
            }}
            className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border-none"
          >
            <Plus size={12} /> Save Article
          </button>
        </div>
      </div>
    </div>
  );
}
