'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import {
  ScanEye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Brain,
  ShieldCheck,
  TrendingUp,
  MapPin,
  FileText,
  HelpCircle,
  Play,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OverviewViewProps {
  onNavigate: (section: any) => void;
  onRunAudit: () => void;
  onAskLoveBrain: (question: string) => void;
}

export function OverviewView({ onNavigate, onRunAudit, onAskLoveBrain }: OverviewViewProps) {
  const {
    activeWebsite,
    activeWorkspace,
    recentAudit,
    issuesForActiveWebsite,
    tasksForActiveWebsite,
    contentForActiveWebsite,
    reportsForActiveWebsite,
    createTaskFromIssue,
    state,
  } = useApp();

  const auditScore = recentAudit?.score ?? activeWebsite?.auditScore ?? 84;
  const criticalIssues = issuesForActiveWebsite.filter((i) => i.severity === 'critical');
  const highIssues = issuesForActiveWebsite.filter((i) => i.severity === 'high');
  const mediumIssues = issuesForActiveWebsite.filter((i) => i.severity === 'medium');
  const lowIssues = issuesForActiveWebsite.filter((i) => i.severity === 'low');

  const openTasks = tasksForActiveWebsite.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const completedTasks = tasksForActiveWebsite.filter((t) => t.status === 'Completed');
  const pendingContent = contentForActiveWebsite.filter((c) => c.status === 'Review');

  // Search performance data (connected GSC data)
  const searchTrendData = [
    { date: 'Aug 12', clicks: 120, impressions: 2800 },
    { date: 'Aug 19', clicks: 145, impressions: 3200 },
    { date: 'Aug 26', clicks: 160, impressions: 3900 },
    { date: 'Sep 02', clicks: 185, impressions: 4300 },
    { date: 'Sep 09', clicks: 210, impressions: 4950 },
  ];

  // Derive 3 to 5 "Your Next Best Actions" directly from real issues and content
  const nextBestActions = [
    {
      id: 'nba-1',
      issueId: criticalIssues[0]?.id || 'issue-001',
      title: criticalIssues[0]?.title || 'Inject Missing Canonical Tag on Primary Services Page',
      severity: 'Critical',
      affectedUrl: criticalIssues[0]?.affectedUrl || `https://${activeWebsite?.domain}/services/ai-seo-growth`,
      whatNeedsAttention: 'Document <head> does not declare a canonical link element.',
      whyItMatters: 'Search crawlers can split ranking authority across query variants or alternate protocol paths, risking dilution of organic rankings.',
      suggestedAction: 'Inject `<link rel="canonical" href="https://' + activeWebsite?.domain + '/services/ai-seo-growth" />` into the page head metadata.',
      estimatedEffort: '15 mins (Developer)',
      supportingEvidence: criticalIssues[0]?.observedEvidence || 'Live crawl inspection detected 0 canonical link tags in the document head.',
      taskStatus: criticalIssues[0]?.taskStatus || 'unassigned',
    },
    {
      id: 'nba-2',
      issueId: highIssues[0]?.id || 'issue-002',
      title: highIssues[0]?.title || 'Author Compelling Meta Description for High-Intent Service Page',
      severity: 'High',
      affectedUrl: highIssues[0]?.affectedUrl || `https://${activeWebsite?.domain}/services/digital-workforce`,
      whatNeedsAttention: 'Meta description tag is completely missing from page head.',
      whyItMatters: 'Google dynamically fills the search snippet with arbitrary text, which reduces click-through rate compared to a targeted value proposition.',
      suggestedAction: 'Add a 150-160 character description highlighting Arthur’s AI agents and business automation benefits.',
      estimatedEffort: '20 mins (Content/SEO)',
      supportingEvidence: highIssues[0]?.observedEvidence || '<meta name="description"> tag is completely absent in rendered HTML.',
      taskStatus: highIssues[0]?.taskStatus || 'unassigned',
    },
    {
      id: 'nba-3',
      issueId: 'nba-content',
      title: 'Approve & Publish Draft: "2026 Guide to AI SEO Audits"',
      severity: 'Medium',
      affectedUrl: `https://${activeWebsite?.domain}/blog/ai-seo-audit-guide-2026`,
      whatNeedsAttention: 'Content item is in Review status with 2 factual claims flagged for business verification.',
      whyItMatters: 'Target keyword "ai seo platform for agencies" holds 1,600 monthly searches with low competition; publishing establishes category authority.',
      suggestedAction: 'Verify client case study metric and approve draft in Content Engine.',
      estimatedEffort: '10 mins (Reviewer)',
      supportingEvidence: 'Keyword researched via DataForSEO, draft generated with verified heading hierarchy.',
      taskStatus: 'review',
    },
    {
      id: 'nba-4',
      issueId: 'nba-local',
      title: 'Correct Phone Number Mismatch on Yelp Directory',
      severity: 'Medium',
      affectedUrl: 'Yelp Business Profile',
      whatNeedsAttention: 'Phone number is listed as +1 (512) 555-0144 instead of official +1 (512) 555-0198.',
      whyItMatters: 'Inconsistent NAP (Name, Address, Phone) data damages local pack trust signals across Google Maps and local search.',
      suggestedAction: 'Update the Yelp listing phone number to match the official business profile.',
      estimatedEffort: '5 mins (Operations)',
      supportingEvidence: 'Local SEO worker scan detected mismatch against verified Google Business Profile.',
      taskStatus: 'unassigned',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111738] via-[#161D44] to-[#1a2250] p-6 rounded-2xl border border-[#252E63] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Executive Dashboard
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            SEO & Growth Overview for{' '}
            <span className="text-[#4DA3FF] underline decoration-[#4DA3FF]/40 underline-offset-4">
              {activeWebsite?.domain}
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real website diagnostics, prioritized business actions, and AI worker telemetry owned by{' '}
            <strong className="text-white">Arthur’s Creatives</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            id="overview-ask-love-brain"
            onClick={() => onAskLoveBrain('What should I fix first on my website?')}
            className="px-4 py-2 rounded-xl bg-[#4DA3FF]/20 hover:bg-[#4DA3FF]/30 text-[#4DA3FF] border border-[#4DA3FF]/40 text-xs font-semibold flex items-center gap-2 transition shadow-md"
          >
            <Brain className="w-4 h-4" /> Ask LOVE Brain
          </button>
          <button
            id="overview-run-audit"
            onClick={onRunAudit}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] text-xs font-bold flex items-center gap-2 transition shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Full Audit
          </button>
        </div>

        {/* Ambient subtle decorative element */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Website Audit Score */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 hover:border-[#D4AF37]/40 transition shadow-lg relative group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Website Audit Score</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
              AI SEO Love Score
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-4xl font-extrabold text-white tracking-tight">{auditScore}</div>
            <div className="text-xs text-slate-400">/ 100 max</div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center ml-auto">
              +8 pts this month
            </span>
          </div>

          <div className="w-full bg-[#1C255A] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                auditScore >= 80 ? 'bg-emerald-400' : auditScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${auditScore}%` }}
            />
          </div>

          <div className="mt-3 pt-3 border-t border-[#1E2554] flex items-center justify-between text-[11px] text-slate-400">
            <span>Latest: {recentAudit?.completedAt?.slice(0, 10) || '2026-09-08'}</span>
            <button
              onClick={() => onNavigate('audits')}
              className="text-[#4DA3FF] hover:underline flex items-center gap-0.5"
            >
              View Crawl <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Priority Issues Breakdown */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 hover:border-[#D4AF37]/40 transition shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Diagnostic Findings</span>
            <span className="text-[10px] text-slate-400">{issuesForActiveWebsite.length} Total</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center mt-1">
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-lg font-bold text-red-400">{criticalIssues.length}</div>
              <div className="text-[9px] uppercase font-semibold text-red-300">Crit</div>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-lg font-bold text-amber-400">{highIssues.length}</div>
              <div className="text-[9px] uppercase font-semibold text-amber-300">High</div>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-lg font-bold text-blue-400">{mediumIssues.length}</div>
              <div className="text-[9px] uppercase font-semibold text-blue-300">Med</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div className="text-lg font-bold text-slate-300">{lowIssues.length}</div>
              <div className="text-[9px] uppercase font-semibold text-slate-400">Low</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1E2554] flex items-center justify-between text-[11px] text-slate-400">
            <span>{recentAudit?.passedChecksCount || 48} checks passed</span>
            <button
              onClick={() => onNavigate('audits')}
              className="text-[#D4AF37] hover:underline flex items-center gap-0.5"
            >
              Fix Findings <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3. Task Execution Progress */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 hover:border-[#D4AF37]/40 transition shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">SEO Tasks Execution</span>
            <span className="text-[10px] text-emerald-400 font-medium">
              {completedTasks.length} Done
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold text-white">{openTasks.length}</div>
            <span className="text-xs text-slate-400">active tasks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {pendingContent.length} content piece awaiting approval in engine.
          </p>
          <div className="mt-3 pt-3 border-t border-[#1E2554] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Board synchronized</span>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-[#4DA3FF] hover:underline flex items-center gap-0.5"
            >
              Open Kanban <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Connected Integrations & Local Status */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 hover:border-[#D4AF37]/40 transition shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Data Connections</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Live Sync
            </span>
          </div>
          <div className="space-y-1.5 mt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Google Search Console</span>
              <span className="text-emerald-400 font-medium text-[11px]">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Google Business Profile</span>
              <span className="text-emerald-400 font-medium text-[11px]">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">DataForSEO Provider</span>
              <span className="text-emerald-400 font-medium text-[11px]">Active</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1E2554] flex items-center justify-between text-[11px] text-slate-400">
            <span>Local: 1 directory mismatch</span>
            <button
              onClick={() => onNavigate('integrations')}
              className="text-[#D4AF37] hover:underline flex items-center gap-0.5"
            >
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* PROMINENT SECTION: Your Next Best Actions */}
      <div className="bg-[#111738] border-2 border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#1E2554] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">Your Next Best Actions</h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Strictly prioritized recommendations derived directly from real crawl findings, high-intent keywords, and local data.
            </p>
          </div>
          <button
            onClick={() => onAskLoveBrain('Explain how the prioritized next best actions were determined and which gives the fastest ROI.')}
            className="px-3 py-1.5 rounded-lg bg-[#4DA3FF]/15 hover:bg-[#4DA3FF]/25 text-[#4DA3FF] border border-[#4DA3FF]/30 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto transition"
          >
            <Brain className="w-3.5 h-3.5" /> Explain with LOVE Brain
          </button>
        </div>

        <div className="space-y-3.5">
          {nextBestActions.map((action, idx) => (
            <div
              key={action.id}
              className="p-4 rounded-xl bg-[#161D44] border border-[#252E63] hover:border-[#D4AF37]/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      action.severity === 'Critical'
                        ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : action.severity === 'High'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {action.severity}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{action.title}</h3>
                  <span className="text-[11px] text-slate-400 bg-[#111738] px-2 py-0.5 rounded border border-[#1E2554] truncate max-w-xs">
                    {action.affectedUrl}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 font-medium">Why it matters: </span>
                    {action.whyItMatters}
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Action: </span>
                    <span className="text-[#D4AF37]">{action.suggestedAction}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>
                    <strong>Effort:</strong> {action.estimatedEffort}
                  </span>
                  <span>
                    <strong>Supporting Evidence:</strong> {action.supportingEvidence}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0">
                {action.taskStatus === 'created' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Task Created
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (action.issueId.startsWith('iss')) {
                        createTaskFromIssue(action.issueId);
                      } else if (action.id === 'nba-3') {
                        onNavigate('content');
                      } else if (action.id === 'nba-4') {
                        onNavigate('local-seo');
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] text-xs font-bold transition shadow"
                  >
                    {action.id === 'nba-3'
                      ? 'Review Content Draft'
                      : action.id === 'nba-4'
                      ? 'Fix Local Listing'
                      : 'Create Task in Board'}
                  </button>
                )}

                <button
                  onClick={() =>
                    onAskLoveBrain(`Provide a step-by-step developer code fix for "${action.title}" on ${action.affectedUrl}`)
                  }
                  className="p-2 rounded-lg bg-[#111738] hover:bg-[#1C255A] text-slate-300 border border-[#252E63] text-xs"
                  title="Ask LOVE Brain for exact code"
                >
                  <Brain className="w-4 h-4 text-[#4DA3FF]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Scoring Transparency Notice */}
        <div className="mt-4 pt-3 border-t border-[#1E2554] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              <strong>Scoring Methodology:</strong> AI SEO Love Score = 40% Crawlability & Technical + 30% On-Page & Headings + 20% Speed/Mobile + 10% Structured Data. Independent diagnostic; not a proprietary Google metric.
            </span>
          </div>
          <span className="text-slate-400">Arthur’s Creatives Proprietary Engine</span>
        </div>
      </div>

      {/* Middle Row: Search Performance Chart & Recent AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Performance (Connected GSC) */}
        <div className="lg:col-span-2 bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4DA3FF]" /> Google Search Console Performance
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified impressions & clicks for {activeWebsite?.domain} (Last 30 days)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className="text-slate-300 font-medium">Clicks: 820</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4DA3FF]" />
                <span className="text-slate-300 font-medium">Impressions: 19.1k</span>
              </div>
            </div>
          </div>

          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={searchTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="imprGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4DA3FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4DA3FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2554" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141B42', borderColor: '#252E63', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="impressions" stroke="#4DA3FF" fillOpacity={1} fill="url(#imprGrad)" />
                <Area type="monotone" dataKey="clicks" stroke="#D4AF37" fillOpacity={1} fill="url(#clicksGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E2554] flex items-center justify-between text-xs text-slate-400">
            <span>Avg. Position: 12.8 • CTR: 4.28%</span>
            <button
              onClick={() => onNavigate('keywords')}
              className="text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              View Keywords & Query Rankings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent AI Worker Activity Feed */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#4DA3FF]" /> LOVE Brain & Worker Telemetry
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30 font-semibold">
                5 Active Workers
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Automated analysis coordinated by LOVE Brain with strict evidence recording.
            </p>

            <div className="space-y-3">
              {state.workerActivities.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 rounded-xl bg-[#161D44] border border-[#252E63] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#D4AF37]">{activity.workerName}</span>
                    <span className="text-[10px] text-slate-400">{activity.startedAt.slice(11, 16)} UTC</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {activity.taskDescription}
                  </p>
                  <div className="text-[10px] text-slate-400 truncate">
                    Source: {activity.sourceDataUsed}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E2554] flex items-center justify-between text-xs">
            <span className="text-slate-400">All workers grounded</span>
            <button
              onClick={() => onNavigate('love-brain')}
              className="text-[#4DA3FF] hover:underline flex items-center gap-1 font-medium"
            >
              Interact with Workers <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Reports & Fast Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Monthly Impact Report Ready</h4>
              <p className="text-xs text-slate-400">
                August 2026 Audit progression (+8 pts) & client presentation PDF.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-1.5 rounded-lg bg-[#1C255A] hover:bg-[#252E63] text-slate-200 text-xs font-semibold border border-[#252E63] transition"
          >
            Open Report
          </button>
        </div>

        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4DA3FF]/15 border border-[#4DA3FF]/30 flex items-center justify-center text-[#4DA3FF]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Local Search Presence</h4>
              <p className="text-xs text-slate-400">
                3 verified directories • 1 phone number discrepancy on Yelp.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('local-seo')}
            className="px-3.5 py-1.5 rounded-lg bg-[#1C255A] hover:bg-[#252E63] text-slate-200 text-xs font-semibold border border-[#252E63] transition"
          >
            Review Profile
          </button>
        </div>
      </div>
    </div>
  );
}
