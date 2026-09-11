'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import {
  FileBarChart,
  Download,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Building,
  Code,
  Globe,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface ReportsViewProps {
  onAskLoveBrain: (prompt: string) => void;
}

export function ReportsView({ onAskLoveBrain }: ReportsViewProps) {
  const {
    activeWebsite,
    activeWorkspace,
    recentAudit,
    tasksForActiveWebsite,
    issuesForActiveWebsite,
    keywordsForActiveWebsite,
    state,
  } = useApp();

  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isWhiteLabel, setIsWhiteLabel] = useState(false);
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);

  const completedTasks = tasksForActiveWebsite.filter((t) => t.status === 'Completed');
  const outstandingIssues = issuesForActiveWebsite.filter((i) => i.taskStatus !== 'resolved');

  const embedScriptSnippet = `<!-- AI SEO Love Lead Audit Widget for ${activeWebsite?.domain} -->
<div id="ai-seo-love-widget" data-agency="arthurs-creatives" data-domain="${activeWebsite?.domain}"></div>
<script src="https://arthurscreatives.com/widget/v1/audit-embed.js" async></script>`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedScriptSnippet);
    setEmbedCodeCopied(true);
    setTimeout(() => setEmbedCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="no-print bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Reports Hub & Client Portal</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              PDF Print Ready
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Executive audit progression, completed impact tasks, and white-label client presentation view.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* White-label Agency Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-300 bg-[#161D44] border border-[#252E63] px-3 py-2 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isWhiteLabel}
              onChange={(e) => setIsWhiteLabel(e.target.checked)}
              className="rounded text-[#D4AF37] focus:ring-0"
            />
            <span>White-Label Mode</span>
          </label>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#161D44] border border-[#252E63] text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="Last 30 Days">Last 30 Days (August 2026)</option>
            <option value="Q3 2026">Q3 2026 Summary</option>
            <option value="Year to Date">Year to Date 2026</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        id="printable-client-report"
        className="bg-white text-slate-900 rounded-2xl p-8 lg:p-12 shadow-2xl space-y-8 border border-slate-200"
      >
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-200 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Executive Search & Growth Performance Report
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {activeWebsite?.name || 'Arthur’s Creatives'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mt-0.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>https://{activeWebsite?.domain}</span>
              <span>•</span>
              <span>Period: {dateRange}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-[#111738]">
              {isWhiteLabel ? 'Growth Digital Agency' : 'Arthur’s Creatives'}
            </div>
            <div className="text-xs text-slate-500">
              {isWhiteLabel ? 'Verified Partner Report' : 'AI SEO Love Platform'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Generated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Executive Summary Block */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            1. Executive Summary & Audit Score Progression
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            During this reporting cycle, <strong>{activeWebsite?.domain}</strong> demonstrated marked technical improvements following the remediation of duplicate title elements and mobile viewport optimizations. The proprietary <strong>AI SEO Love Audit Score</strong> advanced from <strong>76/100 to {recentAudit?.score ?? 84}/100 (+8 pts)</strong>. Organic clicks registered through Google Search Console rose +18.4% month-over-month.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-center">
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <div className="text-2xl font-black text-blue-700">{recentAudit?.score ?? 84}/100</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Audit Score</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <div className="text-2xl font-black text-emerald-700">{completedTasks.length} Done</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Remediated Tasks</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <div className="text-2xl font-black text-slate-900">{keywordsForActiveWebsite.length} Keywords</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Rankings Monitored</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <div className="text-2xl font-black text-purple-700">100% Verified</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Google Business NAP</div>
            </div>
          </div>
        </div>

        {/* 2. Completed Tasks Impact */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            2. Completed Work & Verified SEO Impact
          </h3>
          <table className="w-full text-left text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3 font-bold">Action Completed</th>
                <th className="py-2.5 px-3 font-bold">Category</th>
                <th className="py-2.5 px-3 font-bold">Page / Asset</th>
                <th className="py-2.5 px-3 font-bold">Owner</th>
                <th className="py-2.5 px-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {completedTasks.slice(0, 4).map((task) => (
                <tr key={task.id}>
                  <td className="py-2.5 px-3 font-semibold">{task.title}</td>
                  <td className="py-2.5 px-3 text-slate-600">{task.category}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 truncate max-w-xs">{task.affectedUrl}</td>
                  <td className="py-2.5 px-3 text-slate-600">{task.owner}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">Verified ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Outstanding Priorities for Next Sprint */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            3. Prioritized Strategic Roadmap for Next Sprint
          </h3>
          <div className="space-y-2">
            {outstandingIssues.slice(0, 3).map((issue) => (
              <div key={issue.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{issue.title}</span>
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {issue.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Recommended Fix:</strong> {issue.recommendedFix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t-2 border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Prepared by Arthur’s Creatives for {activeWebsite?.name} • Confidential Business Report
          </div>
          <div>Page 1 of 1</div>
        </div>
      </div>

      {/* Embeddable Lead Audit Widget Code Box */}
      <div className="no-print bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-[#D4AF37]" /> Embeddable Website Audit Lead Magnet Widget
            </h3>
            <p className="text-xs text-slate-400">
              Embed this interactive audit box on your marketing website to capture high-intent prospect leads automatically.
            </p>
          </div>

          <button
            onClick={handleCopyEmbed}
            className="px-3.5 py-1.5 rounded-lg bg-[#161D44] hover:bg-[#1C255A] text-slate-200 text-xs font-semibold border border-[#252E63] flex items-center gap-1.5 transition"
          >
            {embedCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {embedCodeCopied ? 'Code Copied!' : 'Copy Script Embed'}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#0E132D] border border-[#252E63] font-mono text-xs text-[#4DA3FF] overflow-x-auto">
          <code>{embedScriptSnippet}</code>
        </div>
      </div>
    </div>
  );
}
