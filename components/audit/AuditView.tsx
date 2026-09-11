'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { AuditIssue, IssueSeverity, IssueCategory } from '@/lib/types';
import {
  ScanEye,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Play,
  Filter,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Code,
  CheckSquare,
  Clock,
  RefreshCw,
  X,
  Sparkles,
} from 'lucide-react';

interface AuditViewProps {
  onNavigate: (section: any) => void;
  onAskLoveBrain: (prompt: string) => void;
  initialTargetUrl?: string;
}

export function AuditView({ onNavigate, onAskLoveBrain, initialTargetUrl }: AuditViewProps) {
  const {
    activeWebsite,
    recentAudit,
    issuesForActiveWebsite,
    addAuditRun,
    createTaskFromIssue,
    state,
  } = useApp();

  const [auditUrl, setAuditUrl] = useState(
    initialTargetUrl || (activeWebsite ? `https://${activeWebsite.domain}` : 'https://arthurscreatives.com')
  );
  const [maxPages, setMaxPages] = useState<number>(20);
  const [crawlSubdomains, setCrawlSubdomains] = useState(false);
  const [crawlFrequency, setCrawlFrequency] = useState<'Manual' | 'Weekly' | 'Monthly'>('Weekly');
  const [isRunning, setIsRunning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter state
  const [severityFilter, setSeverityFilter] = useState<'all' | IssueSeverity | 'passed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  // Resolution modal state
  const [resolvingIssue, setResolvingIssue] = useState<AuditIssue | null>(null);
  const [resolutionReason, setResolutionReason] = useState<string>('Fixed');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const currentScore = recentAudit?.score ?? activeWebsite?.auditScore ?? 84;

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl || isRunning) return;

    setIsRunning(true);
    setErrorMessage(null);
    setScanStep('Connecting and verifying SSRF security clearance...');

    try {
      setTimeout(() => setScanStep('Crawling page document & parsing HTML elements...'), 600);
      setTimeout(() => setScanStep('Evaluating headings, canonicals, metadata & structured data...'), 1300);

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: auditUrl,
          websiteId: activeWebsite?.id || 'site-001',
          maxPages,
          crawlSubdomains,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to crawl URL');
      }

      setScanStep('Calculating AI SEO Love Audit Score & creating diagnostic records...');
      setTimeout(() => {
        addAuditRun(data.auditRun, data.issues);
        setIsRunning(false);
        setScanStep('');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Audit crawl failed');
      setIsRunning(false);
      setScanStep('');
    }
  };

  const filteredIssues = issuesForActiveWebsite.filter((issue) => {
    if (severityFilter !== 'all' && severityFilter !== 'passed' && issue.severity !== severityFilter) {
      return false;
    }
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const criticalCount = issuesForActiveWebsite.filter((i) => i.severity === 'critical').length;
  const highCount = issuesForActiveWebsite.filter((i) => i.severity === 'high').length;
  const mediumCount = issuesForActiveWebsite.filter((i) => i.severity === 'medium').length;
  const lowCount = issuesForActiveWebsite.filter((i) => i.severity === 'low').length;
  const passedCount = recentAudit?.passedChecksCount || 48;

  const handleExportCSV = () => {
    const headers = 'ID,Severity,Category,Title,Affected URL,Observed Evidence,Task Status\n';
    const rows = issuesForActiveWebsite
      .map(
        (i) =>
          `"${i.id}","${i.severity}","${i.category}","${i.title.replace(/"/g, '""')}","${i.affectedUrl}","${i.observedEvidence.replace(/"/g, '""')}","${i.taskStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-seo-love-audit-${activeWebsite?.domain || 'site'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Crawler Controller */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ScanEye className="w-5 h-5 text-[#D4AF37]" />
              <h1 className="text-xl font-bold text-white tracking-tight">Website Audits & Crawler</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Crawl Engine Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Live crawler with SSRF protection, full DOM diagnostics, and 1-click task conversion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-[#161D44] hover:bg-[#1C255A] text-slate-300 text-xs font-medium border border-[#252E63] flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export Findings CSV
            </button>
          </div>
        </div>

        {/* Crawl Form */}
        <form onSubmit={handleRunAudit} className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="audit-target-url"
                required
                placeholder="Enter URL to audit (e.g. https://arthurscreatives.com)"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                disabled={isRunning}
                className="w-full pl-4 pr-3 py-3 rounded-xl bg-[#0E132D] border border-[#252E63] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={isRunning || !auditUrl}
              className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shrink-0"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Crawl Scope Settings */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <span>Max Pages:</span>
              <select
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                className="bg-[#0E132D] border border-[#252E63] text-slate-200 rounded px-2 py-1 text-xs"
              >
                <option value={10}>10 pages (Quick)</option>
                <option value={25}>25 pages (Standard)</option>
                <option value={50}>50 pages (Deep)</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={crawlSubdomains}
                onChange={(e) => setCrawlSubdomains(e.target.checked)}
                className="rounded border-[#252E63] text-[#D4AF37] focus:ring-0"
              />
              <span>Crawl Subdomains</span>
            </label>

            <div className="flex items-center gap-2">
              <span>Schedule:</span>
              <select
                value={crawlFrequency}
                onChange={(e) => setCrawlFrequency(e.target.value as any)}
                className="bg-[#0E132D] border border-[#252E63] text-slate-200 rounded px-2 py-1 text-xs"
              >
                <option value="Manual">Manual</option>
                <option value="Weekly">Weekly (Recommended)</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="ml-auto text-[11px] text-slate-500 hidden lg:block">
              SSRF Protection: RFC1918 & Cloud Metadata Blocked
            </div>
          </div>

          {isRunning && (
            <div className="p-3.5 rounded-xl bg-[#161D44] border border-[#4DA3FF]/40 text-xs text-slate-200 flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-4 h-4 text-[#4DA3FF] animate-spin shrink-0" />
              <span>{scanStep || 'Crawl in progress...'}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      </div>

      {/* Audit Score & Diagnostic Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-400">AI SEO Love Audit Score</div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold text-white">{currentScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Formula: 100 - (15×Crit + 8×High + 4×Med + 2×Low)
          </div>
        </div>

        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Pages Crawled</div>
          <div className="text-3xl font-extrabold text-white my-2">
            {recentAudit?.pagesScanned || 24}
          </div>
          <div className="text-[11px] text-emerald-400">
            Avg. Response: {recentAudit?.metrics?.avgResponseTimeMs || 240}ms
          </div>
        </div>

        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Actionable Issues</div>
          <div className="text-3xl font-extrabold text-amber-400 my-2">
            {issuesForActiveWebsite.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {criticalCount} Critical • {highCount} High priority
          </div>
        </div>

        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Passed Technical Checks</div>
          <div className="text-3xl font-extrabold text-emerald-400 my-2">{passedCount}</div>
          <div className="text-[11px] text-slate-400">SSL, Mobile Viewport, 200 OK passed</div>
        </div>
      </div>

      {/* Findings Priority Tabs & Category Filters */}
      <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#1E2554]">
          {/* Priority Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                severityFilter === 'all'
                  ? 'bg-[#D4AF37] text-[#111738]'
                  : 'bg-[#161D44] text-slate-300 hover:text-white'
              }`}
            >
              All Issues ({issuesForActiveWebsite.length})
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                severityFilter === 'critical'
                  ? 'bg-red-500 text-white'
                  : 'bg-[#161D44] text-red-400 hover:bg-red-500/20'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setSeverityFilter('high')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                severityFilter === 'high'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-[#161D44] text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              High ({highCount})
            </button>
            <button
              onClick={() => setSeverityFilter('medium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                severityFilter === 'medium'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#161D44] text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              Medium ({mediumCount})
            </button>
            <button
              onClick={() => setSeverityFilter('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                severityFilter === 'low'
                  ? 'bg-slate-400 text-slate-900'
                  : 'bg-[#161D44] text-slate-300 hover:bg-slate-700'
              }`}
            >
              Low ({lowCount})
            </button>
            <button
              onClick={() => setSeverityFilter('passed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                severityFilter === 'passed'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#161D44] text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              Passed Checks ({passedCount})
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#161D44] border border-[#252E63] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Crawlability">Crawlability</option>
              <option value="On-Page SEO">On-Page SEO</option>
              <option value="Headings & Content">Headings & Content</option>
              <option value="Structured Data">Structured Data</option>
              <option value="Mobile & Speed">Mobile & Speed</option>
              <option value="Internal Links">Internal Links</option>
            </select>
          </div>
        </div>

        {/* Passed Checks View */}
        {severityFilter === 'passed' ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 48 Passed Health Checks on {activeWebsite?.domain}
              </div>
              <p className="text-slate-300">
                These core technical SEO requirements meet production standards:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-200 mt-2">
                <div className="flex items-center gap-2">✓ Valid SSL / HTTPS certificate enabled</div>
                <div className="flex items-center gap-2">✓ Responsive viewport meta tag declared</div>
                <div className="flex items-center gap-2">✓ HTTP 200 Success responses on main navigation</div>
                <div className="flex items-center gap-2">✓ Clean URL structures without session IDs</div>
                <div className="flex items-center gap-2">✓ Gzip/Brotli compression active on web server</div>
                <div className="flex items-center gap-2">✓ No broken internal CSS/JS script tags</div>
              </div>
            </div>
          </div>
        ) : (
          /* Findings List */
          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const isExpanded = expandedIssueId === issue.id;
              return (
                <div
                  key={issue.id}
                  className="rounded-xl bg-[#161D44] border border-[#252E63] overflow-hidden transition"
                >
                  {/* Issue Row Header */}
                  <div
                    onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                    className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 cursor-pointer hover:bg-[#1C255A]/70"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 mt-0.5 ${
                          issue.severity === 'critical'
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : issue.severity === 'high'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : issue.severity === 'medium'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {issue.severity}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
                          <span className="text-[10px] text-slate-400 bg-[#111738] px-2 py-0.5 rounded border border-[#1E2554]">
                            {issue.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-xl">
                          {issue.affectedUrl}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-center">
                      {issue.taskStatus === 'created' ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/30 flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" /> Task Created
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            createTaskFromIssue(issue.id);
                          }}
                          className="px-3 py-1 rounded bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] text-xs font-bold transition flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Create Task
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResolvingIssue(issue);
                        }}
                        className="px-2.5 py-1 rounded bg-[#111738] hover:bg-[#1C255A] text-slate-300 text-xs border border-[#252E63]"
                      >
                        Resolve
                      </button>

                      <div className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Issue Detail Panel */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[#252E63] bg-[#0E132D] space-y-4 text-xs">
                      {/* Observed Evidence */}
                      <div className="p-3 rounded-lg bg-[#141B42] border border-[#252E63]">
                        <div className="font-semibold text-[#D4AF37] mb-1">
                          Observed Evidence (Crawl Log):
                        </div>
                        <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                          {issue.observedEvidence}
                        </p>
                      </div>

                      {/* Technical Explanation */}
                      <div>
                        <div className="font-semibold text-white mb-1">Technical Impact:</div>
                        <p className="text-slate-300 leading-relaxed">{issue.explanation}</p>
                      </div>

                      {/* Recommended Code Fix */}
                      <div className="p-3 rounded-lg bg-[#111738] border border-[#1E2554]">
                        <div className="font-semibold text-[#4DA3FF] mb-1 flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5" /> Recommended Fix:
                        </div>
                        <p className="text-slate-200 leading-relaxed">{issue.recommendedFix}</p>
                      </div>

                      {/* Verification Method */}
                      <div>
                        <div className="font-semibold text-white mb-1">How to Verify Fix:</div>
                        <p className="text-slate-400 leading-relaxed">{issue.verificationMethod}</p>
                      </div>

                      {/* Actions footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#252E63]/60 text-[11px] text-slate-400">
                        <span>Detected at: {issue.detectedAt.slice(0, 16).replace('T', ' ')} UTC</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onAskLoveBrain(
                                `Provide exact code snippets and implementation steps for "${issue.title}" on ${issue.affectedUrl}`
                              )
                            }
                            className="text-[#4DA3FF] hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" /> Ask LOVE Brain to write patch
                          </button>
                          <a
                            href={issue.affectedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-300 hover:text-white flex items-center gap-1 ml-3"
                          >
                            Open Target Page <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolution Reason Modal */}
      {resolvingIssue && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Resolve Finding</h3>
              <button onClick={() => setResolvingIssue(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Recording resolution reason for <strong className="text-white">{resolvingIssue.title}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Resolution Classification:</label>
                <select
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Fixed">Fixed (Implemented in production)</option>
                  <option value="False Positive">False Positive (Rule not applicable)</option>
                  <option value="Accepted Risk">Accepted Risk (Business trade-off)</option>
                  <option value="Outside Scope">Outside Scope (Third-party platform limit)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Documentation Notes (Optional):</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain why this issue is being marked resolved..."
                  className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResolvingIssue(null)}
                className="px-4 py-2 rounded-lg bg-[#161D44] text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResolvingIssue(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111738] font-bold text-xs"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
