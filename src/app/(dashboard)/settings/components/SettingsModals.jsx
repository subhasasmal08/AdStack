"use client";

import React from 'react';
import { X, Search, Trash2, Edit, Link, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export default function SettingsModals({
  kbModal,
  setKbModal,
  modalSearch,
  setModalSearch,
  files,
  setFiles,
  urls,
  setUrls,
  arts,
  setArts,
  waC,
  setWaC,
  ems,
  setEms,
  editingUrlIdx,
  setEditingUrlIdx,
  editingUrlVal,
  setEditingUrlVal,
  editingArtId,
  setEditingArtId,
  editingArtText,
  setEditingArtText,
  getFileColorClass,
  fileFormatSize
}) {
  if (!kbModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      onClick={() => setKbModal(null)}
    >
      {/* 1. Documents Modal */}
      {kbModal === 'docs' && (
        <div 
          className="bg-[#11141D] border border-[#1E293B] rounded-[24px] max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#1E293B] pb-3">
            <h2 className="text-md font-bold text-foreground">Documents Catalog ({files.length})</h2>
            <button onClick={() => setKbModal(null)} className="text-slate-400 hover:text-foreground cursor-pointer bg-transparent border-none outline-none"><X size={18} /></button>
          </div>
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="Search documents by name..." 
              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>
          <div className="space-y-2.5">
            {files.filter(f => f.n.toLowerCase().includes(modalSearch.toLowerCase())).map((f, i) => (
              <div key={i} className="bg-[#1A1F2B] border border-[#2A3447] rounded-xl p-3 flex items-center justify-between text-xs hover:border-slate-700 transition-all duration-150">
                <div className="flex items-center gap-2">
                  <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", getFileColorClass(f.e))}>
                    {f.e}
                  </span>
                  <span className="text-slate-200 font-semibold" title={f.n}>{f.n}</span>
                  <span className="text-[10px] text-slate-500">({fileFormatSize(f.s)})</span>
                </div>
                <button 
                  onClick={() => {
                    const prev = [...files];
                    setFiles(files.filter(x => x.n !== f.n));
                    toast.info(`Document deleted`, {
                      action: { label: 'Undo', onClick: () => setFiles(prev) }
                    });
                  }}
                  className="text-red-400 hover:text-red-500 p-1 rounded-md cursor-pointer hover:bg-red-500/10 transition-colors border-none bg-transparent"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. URLs Modal */}
      {kbModal === 'urls' && (
        <div 
          className="bg-[#11141D] border border-[#1E293B] rounded-[24px] max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#1E293B] pb-3">
            <h2 className="text-md font-bold text-foreground">Indexed URL Catalog ({urls.length})</h2>
            <button onClick={() => setKbModal(null)} className="text-slate-400 hover:text-foreground cursor-pointer bg-transparent border-none outline-none"><X size={18} /></button>
          </div>
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="Search indexed URLs..." 
              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>
          <div className="space-y-2.5">
            {urls.filter(u => u.toLowerCase().includes(modalSearch.toLowerCase())).map((u, i) => {
              const isEditing = editingUrlIdx === i;
              return (
                <div key={i} className="bg-[#1A1F2B] border border-[#2A3447] rounded-xl p-3 flex items-center justify-between text-xs hover:border-slate-700 transition-all duration-150">
                  <div className="flex items-center gap-2 flex-1 mr-4 min-w-0">
                    <Link size={12} className="text-brand shrink-0" />
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-[#11141D] border border-brand/50 rounded px-2 py-0.5 text-xs text-slate-300 outline-none w-full font-mono"
                        value={editingUrlVal}
                        onChange={(e) => setEditingUrlVal(e.target.value)}
                        onBlur={() => {
                          setUrls(urls.map((x, j) => j === i ? editingUrlVal : x));
                          setEditingUrlIdx(null);
                          toast.success("URL modified");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setUrls(urls.map((x, j) => j === i ? editingUrlVal : x));
                            setEditingUrlIdx(null);
                            toast.success("URL modified");
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="text-brand font-mono text-[10.5px] truncate flex-1" title={u}>{u}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => { setEditingUrlIdx(i); setEditingUrlVal(u); }}
                      className="text-slate-400 hover:text-foreground p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent outline-none"
                    >
                      <Edit size={13} />
                    </button>
                    <button 
                      onClick={() => {
                        const prev = [...urls];
                        setUrls(urls.filter((_, idx) => idx !== i));
                        toast.info(`URL deleted`, {
                          action: { label: 'Undo', onClick: () => setUrls(prev) }
                        });
                      }}
                      className="text-red-400 hover:text-red-500 p-1 rounded-md cursor-pointer hover:bg-red-500/10 transition-colors border-none bg-transparent"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Written Articles Modal */}
      {kbModal === 'arts' && (
        <div 
          className="bg-[#11141D] border border-[#1E293B] rounded-[24px] max-w-2xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#1E293B] pb-3">
            <h2 className="text-md font-bold text-foreground">Written Articles & Notes ({arts.length})</h2>
            <button onClick={() => setKbModal(null)} className="text-slate-400 hover:text-foreground cursor-pointer bg-transparent border-none outline-none"><X size={18} /></button>
          </div>
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="Search articles by title..." 
              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {arts.filter(a => a.t.toLowerCase().includes(modalSearch.toLowerCase())).map((a) => {
              const isEditing = editingArtId === a.id;
              return (
                <div key={a.id} className="bg-[#1A1F2B] border border-[#2A3447] rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all duration-150">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200">{a.t}</span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => { setEditingArtId(a.id); setEditingArtText(a.x); }}
                        className="text-slate-400 hover:text-foreground p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent outline-none"
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => {
                          const prev = [...arts];
                          setArts(arts.filter(x => x.id !== a.id));
                          toast.info(`Article deleted`, {
                            action: { label: 'Undo', onClick: () => setArts(prev) }
                          });
                        }}
                        className="text-red-400 hover:text-red-500 p-1 rounded-md cursor-pointer hover:bg-red-500/10 transition-colors border-none bg-transparent"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full bg-[#11141D] border border-brand/50 rounded-lg p-2.5 text-xs text-slate-300 outline-none font-sans"
                        rows={3}
                        value={editingArtText}
                        onChange={(e) => setEditingArtText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setArts(arts.map(x => x.id === a.id ? { ...x, x: editingArtText } : x));
                            setEditingArtId(null);
                            toast.success("Article modified successfully");
                          }}
                          className="bg-brand text-white text-[11px] font-semibold px-3 py-1.5 rounded cursor-pointer border-none"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingArtId(null)}
                          className="bg-transparent border border-slate-700 text-slate-400 text-[11px] px-3 py-1.5 rounded cursor-pointer hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 leading-relaxed font-sans whitespace-pre-wrap">{a.x}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. WhatsApp Contacts Modal */}
      {kbModal === 'contacts_wa' && (
        <div 
          className="bg-[#11141D] border border-[#1E293B] rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[75vh] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#1E293B] pb-3">
            <h2 className="text-md font-bold text-foreground">WhatsApp Recipients ({waC.length})</h2>
            <button onClick={() => setKbModal(null)} className="text-slate-400 hover:text-foreground cursor-pointer bg-transparent border-none outline-none"><X size={18} /></button>
          </div>
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="Search recipients by name or phone..." 
              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>
          <div className="space-y-2">
            {waC.filter(c => c.n.toLowerCase().includes(modalSearch.toLowerCase()) || c.p.includes(modalSearch)).map((contact, i) => (
              <div key={i} className="bg-[#1A1F2B] border border-[#2A3447] rounded-xl p-3 flex items-center justify-between text-xs hover:border-slate-700 transition-all duration-150">
                <div>
                  <div className="font-bold text-slate-200">{contact.n}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{contact.p}</div>
                </div>
                <button 
                  onClick={() => {
                    const prev = [...waC];
                    setWaC(waC.filter((_, idx) => idx !== i));
                    toast.info(`Contact deleted`, {
                      action: { label: 'Undo', onClick: () => setWaC(prev) }
                    });
                  }}
                  className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-red-500/10 cursor-pointer transition-colors border-none bg-transparent"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Email Contacts Modal */}
      {kbModal === 'contacts_em' && (
        <div 
          className="bg-[#11141D] border border-[#1E293B] rounded-[24px] max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[75vh] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#1E293B] pb-3">
            <h2 className="text-md font-bold text-foreground">Email Recipients ({ems.length})</h2>
            <button onClick={() => setKbModal(null)} className="text-slate-400 hover:text-foreground cursor-pointer bg-transparent border-none outline-none"><X size={18} /></button>
          </div>
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="Search recipients by name or email..." 
              className="w-full bg-[#1A1F2B] border border-[#2A3447] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>
          <div className="space-y-2">
            {ems.filter(c => c.n.toLowerCase().includes(modalSearch.toLowerCase()) || c.e.toLowerCase().includes(modalSearch.toLowerCase())).map((item, i) => (
              <div key={i} className="bg-[#1A1F2B] border border-[#2A3447] rounded-xl p-3 flex items-center justify-between text-xs hover:border-slate-700 transition-all duration-150">
                <div>
                  <div className="font-bold text-slate-200">{item.n}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.e}</div>
                </div>
                <button 
                  onClick={() => {
                    const prev = [...ems];
                    setEms(ems.filter((_, idx) => idx !== i));
                    toast.info(`Recipient removed`, {
                      action: { label: 'Undo', onClick: () => setEms(prev) }
                    });
                  }}
                  className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-red-500/10 cursor-pointer transition-colors border-none bg-transparent"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
