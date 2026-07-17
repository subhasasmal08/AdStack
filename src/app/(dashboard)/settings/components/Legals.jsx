"use client";

import React from 'react';
import { Globe, FileText } from 'lucide-react';

export default function Legals({ mode }) {
  if (mode === 'terms') {
    return (
      <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-6">
        <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
          <FileText size={16} /> Terms of Service Agreement
        </h2>

        <div className="space-y-4 text-xs text-slate-400 font-semibold leading-relaxed">
          <div>
            <h3 className="text-slate-200 font-bold text-sm mb-1">1. Acceptance of Terms</h3>
            <p>By registering or using the AdStack analytics monitoring platform, you agree to comply with and be bound by these legal terms. Please review them carefully.</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-bold text-sm mb-1">2. Scope of Services</h3>
            <p>AdStack provides AI-assisted eCPM analysis, anomalies monitoring logs, mediation waterfall suggestions, and dashboards based on API keys provided by the client. We do not transact direct auctions.</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-bold text-sm mb-1">3. Publisher Compliance</h3>
            <p>Publishers must ensure their ad placements and layouts adhere to the policies of Google AdMob, AppLovin, and other connected network providers. AdStack is not liable for network suspension.</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-bold text-sm mb-1">4. Intellectual Property</h3>
            <p>All algorithm code, reality charts causal networks models, and custom chatbot engines remain the intellectual property of AdStack. Analytical outputs compiled from your data belong to you.</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-bold text-sm mb-1">5. Contact Information</h3>
            <p>For legal queries or compliance verification, contact legal counsel at <a href="mailto:legal@adstack.io" className="text-brand hover:underline font-bold">legal@adstack.io</a>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] p-6 space-y-6">
      <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
        <Globe size={16} /> Privacy Policy
      </h2>

      <div className="space-y-4 text-xs text-slate-400 font-semibold leading-relaxed">
        <div>
          <h3 className="text-slate-200 font-bold text-sm mb-1">1. Information We Collect</h3>
          <p>We collect credentials (company details, authorization API keys), registered app setups, file drops indexes, external URLs, and usage statistics to generate eCPM analytics audits.</p>
        </div>
        <div>
          <h3 className="text-slate-200 font-bold text-sm mb-1">2. Data Security &amp; Encryption</h3>
          <p>API keys and credentials are encrypted. Telemetry logs are stored securely. We enforce multi-factor authentication (MFA) and restrict system access sessions.</p>
        </div>
        <div>
          <h3 className="text-slate-200 font-bold text-sm mb-1">3. Data Sharing</h3>
          <p>AdStack does not sell, lease, or share your publisher metrics or credentials with outside marketing agencies. Data is used solely to compute mediation reports.</p>
        </div>
        <div>
          <h3 className="text-slate-200 font-bold text-sm mb-1">4. Your Data Control</h3>
          <p>Publishers retain full control. You can delete registered app connections, purge uploaded guidelines documents catalog, or request full account removal at any time.</p>
        </div>
        <div>
          <h3 className="text-slate-200 font-bold text-sm mb-1">5. Compliance Queries</h3>
          <p>If you have questions about regional data privacy laws compliance, reach our privacy officer at <a href="mailto:privacy@adstack.io" className="text-brand hover:underline font-bold">privacy@adstack.io</a>.</p>
        </div>
      </div>
    </div>
  );
}
