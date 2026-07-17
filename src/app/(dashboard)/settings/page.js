"use client";

import React, { useState } from 'react';
import { Bell, Globe } from 'lucide-react';
import { toast } from 'sonner';

// Import colocated components
import WhatsAppSettings from './components/WhatsAppSettings';
import EmailSettings from './components/EmailSettings';
import SlackSettings from './components/SlackSettings';
import KnowledgeBase from './components/KnowledgeBase';
import SettingsModals from './components/SettingsModals';

export default function SettingsPage() {
  // WhatsApp settings
  const [waOn, setWaOn] = useState(true);
  const [waS, setWaS] = useState("whsk_a1b2c3");
  const [waA, setWaA] = useState("waak_x7y8z9");
  const [waC, setWaC] = useState([
    { n: "Jekin Dedhia", p: "+91 98765 43210" },
    { n: "Priya Sharma", p: "+91 87654 32109" },
    { n: "Amit Patel", p: "+91 76543 21098" }
  ]);
  const [wn, setWn] = useState("");
  const [wp, setWp] = useState("");

  // Email settings
  const [emOn, setEmOn] = useState(true);
  const [ems, setEms] = useState([
    { n: "Jekin Dedhia", e: "jekin@adstack.io" },
    { n: "Reports Bot", e: "reports@adstack.io" },
    { n: "Team", e: "team@adstack.io" }
  ]);
  const [en, setEn] = useState("");
  const [ee, setEe] = useState("");

  // Slack settings
  const [slOn, setSlOn] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState("");

  // Knowledge Base - Documents
  const [files, setFiles] = useState([
    { n: "Q1_Report.pdf", e: "pdf", s: 245000 },
    { n: "Guidelines.docx", e: "docx", s: 128000 },
    { n: "Inventory_Map.xlsx", e: "xlsx", s: 89000 }
  ]);

  // Knowledge Base - URLs
  const [urls, setUrls] = useState([
    "https://support.google.com/admob",
    "https://developers.applovin.com",
    "https://docs.unity.com/ads"
  ]);
  const [nu, setNu] = useState("");
  const [editingUrlIdx, setEditingUrlIdx] = useState(null);
  const [editingUrlVal, setEditingUrlVal] = useState("");

  // Knowledge Base - Articles
  const [arts, setArts] = useState([
    { id: 1, t: "Ad Placement Practices", x: "Ensure ads are non-intrusive. Rewarded = opt-in only." },
    { id: 2, t: "Revenue Notes", x: "Track: eCPM, fill rate, ARPDAU. Aim <4 ads/session." },
    { id: 3, t: "Mediation Setup", x: "Waterfall: AppLovin for video, AdMob for banners." }
  ]);
  const [newArtText, setNewArtText] = useState("");
  const [editingArtId, setEditingArtId] = useState(null);
  const [editingArtText, setEditingArtText] = useState("");

  // Modals state
  const [kbModal, setKbModal] = useState(null);
  const [modalSearch, setModalSearch] = useState("");

  const handleFileUpload = (e) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const allowed = [".docx", ".pdf", ".xlsx", ".jpg", ".png", ".jpeg"];
    let count = 0;

    Array.from(uploadedFiles).forEach(file => {
      const ext = "." + file.name.split('.').pop().toLowerCase();
      if (allowed.includes(ext)) {
        setFiles(prev => [
          ...prev, 
          { n: file.name, e: file.name.split('.').pop().toLowerCase(), s: file.size }
        ]);
        count++;
      }
    });

    if (count > 0) {
      toast.success(`${count} file(s) uploaded successfully`);
    } else {
      toast.error("Unsupported file extension. Only docx, pdf, xlsx, jpg, png supported.");
    }
  };

  const fileFormatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileColorClass = (ext) => {
    const colorsMap = {
      pdf: "bg-red-500/10 text-red-400 border border-red-500/20",
      docx: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      xlsx: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      png: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      jpg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      jpeg: "bg-purple-500/10 text-purple-400 border border-purple-500/20"
    };
    return colorsMap[ext] || "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-foreground leading-none tracking-tight font-heading">Settings</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1.5 font-sans">
            Notifications and knowledge base.
          </p>
        </div>
        <button 
          onClick={() => toast.success("Settings saved")}
          className="bg-brand hover:opacity-90 transition-all text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl cursor-pointer border-none outline-none"
        >
          Save Settings
        </button>
      </div>

      {/* Stacking cards vertically */}
      <div className="flex flex-col gap-6 mt-4">
        <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-6">
          <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Bell size={16} /> Notifications
          </h2>

          <div className="space-y-5">
            <WhatsAppSettings 
              waOn={waOn}
              setWaOn={setWaOn}
              waS={waS}
              setWaS={setWaS}
              waA={waA}
              setWaA={setWaA}
              waC={waC}
              setWaC={setWaC}
              wn={wn}
              setWn={setWn}
              wp={wp}
              setWp={setWp}
              setKbModal={setKbModal}
            />

            <EmailSettings 
              emOn={emOn}
              setEmOn={setEmOn}
              ems={ems}
              setEms={setEms}
              en={en}
              setEn={setEn}
              ee={ee}
              setEe={setEe}
              setKbModal={setKbModal}
            />

            <SlackSettings 
              slOn={slOn}
              setSlOn={setSlOn}
              slackWebhook={slackWebhook}
              setSlackWebhook={setSlackWebhook}
            />
          </div>
        </div>

        <div className="bg-[#11141D] border border-[#1E293B] rounded-[20px] p-6 space-y-6">
          <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Globe size={16} /> Knowledge Base Index
          </h2>

          <KnowledgeBase 
            files={files}
            setFiles={setFiles}
            urls={urls}
            setUrls={setUrls}
            arts={arts}
            setArts={setArts}
            nu={nu}
            setNu={setNu}
            newArtText={newArtText}
            setNewArtText={setNewArtText}
            handleFileUpload={handleFileUpload}
            getFileColorClass={getFileColorClass}
            setKbModal={(modal) => { setKbModal(modal); setModalSearch(""); }}
          />
        </div>
      </div>

      {/* Settings Modal catalog */}
      <SettingsModals 
        kbModal={kbModal}
        setKbModal={setKbModal}
        modalSearch={modalSearch}
        setModalSearch={setModalSearch}
        files={files}
        setFiles={setFiles}
        urls={urls}
        setUrls={setUrls}
        arts={arts}
        setArts={setArts}
        waC={waC}
        setWaC={setWaC}
        ems={ems}
        setEms={setEms}
        editingUrlIdx={editingUrlIdx}
        setEditingUrlIdx={setEditingUrlIdx}
        editingUrlVal={editingUrlVal}
        setEditingUrlVal={setEditingUrlVal}
        editingArtId={editingArtId}
        setEditingArtId={setEditingArtId}
        editingArtText={editingArtText}
        setEditingArtText={setEditingArtText}
        getFileColorClass={getFileColorClass}
        fileFormatSize={fileFormatSize}
      />
    </div>
  );
}
