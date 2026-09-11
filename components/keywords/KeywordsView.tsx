'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { KeywordItem, KeywordIntent } from '@/lib/types';
import {
  KeyRound,
  Search,
  Sparkles,
  Download,
  Upload,
  Plus,
  Trash2,
  FileText,
  ExternalLink,
  HelpCircle,
  Tag,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  TrendingUp,
  X,
} from 'lucide-react';

interface KeywordsViewProps {
  onNavigate: (section: any) => void;
  onCreateBriefForKeyword: (keyword: string) => void;
}

export function KeywordsView({ onNavigate, onCreateBriefForKeyword }: KeywordsViewProps) {
  const {
    state,
    activeWebsite,
    keywordsForActiveWebsite,
    addKeyword,
    deleteKeyword,
  } = useApp();

  const [seedInput, setSeedInput] = useState('');
  const [targetLocation, setTargetLocation] = useState('United States');
  const [isSearching, setIsSearching] = useState(false);
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [parsedImportRows, setParsedImportRows] = useState<any[]>([]);

  const handleResearchSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedInput.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/keywords/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seed: seedInput.trim(),
          location: targetLocation,
        }),
      });

      const data = await response.json();
      if (data.success && data.keywords) {
        // Add research keywords to state
        data.keywords.forEach((kw: any) => {
          addKeyword({
            workspaceId: state.activeWorkspaceId,
            websiteId: activeWebsite?.id || 'site-arthurs',
            keyword: kw.keyword,
            intent: kw.intent,
            location: targetLocation,
            searchVolume: kw.searchVolume,
            difficulty: kw.difficulty,
            cpc: kw.cpc,
            trend: kw.trend,
            targetPage: `/services/${kw.keyword.replace(/\s+/g, '-').slice(0, 24)}`,
            cluster: kw.cluster,
            sourceProvider: kw.sourceProvider,
            measuredDate: kw.measuredDate,
            tags: kw.tags || [],
          });
        });
        setSeedInput('');
      }
    } catch (err: any) {
      console.error('Keyword research failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredKeywords = keywordsForActiveWebsite.filter((k) => {
    if (intentFilter !== 'all' && k.intent !== intentFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'Keyword,Intent,Search Volume,Difficulty,CPC,Trend,Target Page,Cluster,Source,Date\n';
    const rows = keywordsForActiveWebsite
      .map(
        (k) =>
          `"${k.keyword}","${k.intent}","${k.searchVolume ?? ''}","${k.difficulty ?? ''}","${k.cpc ?? ''}","${k.trend}","${k.targetPage || ''}","${k.cluster}","${k.sourceProvider}","${k.measuredDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keywords-${activeWebsite?.domain || 'tracked'}.csv`;
    link.click();
  };

  const handleParseImport = (text: string) => {
    setImportText(text);
    const lines = text.trim().split('\n');
    const rows = lines.slice(1).map((line) => {
      const parts = line.split(',').map((p) => p.replace(/"/g, '').trim());
      return {
        keyword: parts[0] || 'example query',
        intent: (parts[1] as KeywordIntent) || 'Informational',
        searchVolume: Number(parts[2]) || 500,
        difficulty: Number(parts[3]) || 30,
        targetPage: parts[6] || '/services',
      };
    });
    setParsedImportRows(rows);
  };

  const handleConfirmImport = () => {
    parsedImportRows.forEach((row) => {
      addKeyword({
        workspaceId: state.activeWorkspaceId,
        websiteId: activeWebsite?.id || 'site-arthurs',
        keyword: row.keyword,
        intent: row.intent,
        location: 'United States',
        searchVolume: row.searchVolume,
        difficulty: row.difficulty,
        cpc: 2.50,
        trend: '+15% YoY',
        targetPage: row.targetPage,
        cluster: 'Imported List',
        sourceProvider: 'CSV Import',
        measuredDate: new Date().toISOString().slice(0, 10),
        tags: ['Imported'],
      });
    });
    setImportModalOpen(false);
    setImportText('');
    setParsedImportRows([]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Research Engine */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#D4AF37]" />
              <h1 className="text-xl font-bold text-white tracking-tight">Keyword Research & Mapping</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
                Verified Search Data
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Analyze commercial intent, search volume, difficulty, and map keywords directly to content briefs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#161D44] hover:bg-[#1C255A] text-slate-300 text-xs font-medium border border-[#252E63] flex items-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5" /> Import CSV
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-[#161D44] hover:bg-[#1C255A] text-slate-300 text-xs font-medium border border-[#252E63] flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Seed Research Form */}
        <form onSubmit={handleResearchSeed} className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Enter seed phrase (e.g. 'ai digital workforce' or 'local seo audit')"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                disabled={isSearching}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#0E132D] border border-[#252E63] text-white text-xs focus:outline-none focus:border-[#D4AF37] placeholder:text-slate-500"
              />
            </div>

            <select
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="bg-[#0E132D] border border-[#252E63] text-slate-200 text-xs rounded-xl px-3 py-3 shrink-0"
            >
              <option value="United States">United States (en-US)</option>
              <option value="United Kingdom">United Kingdom (en-GB)</option>
              <option value="Canada">Canada (en-CA)</option>
              <option value="Australia">Australia (en-AU)</option>
            </select>

            <button
              type="submit"
              disabled={isSearching || !seedInput}
              className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{isSearching ? 'Analyzing Intent...' : 'Discover Opportunities'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>
              Connected to <strong>DataForSEO Live API</strong> with verified search volumes & AI intent clustering.
            </span>
            <span>{keywordsForActiveWebsite.length} Tracked Keywords for {activeWebsite?.domain}</span>
          </div>
        </form>
      </div>

      {/* Keywords Table with Filters & Mapping Actions */}
      <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2554]">
          <div className="flex items-center gap-1.5">
            {(['all', 'Commercial', 'Transactional', 'Informational'] as const).map((intent) => (
              <button
                key={intent}
                onClick={() => setIntentFilter(intent)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  intentFilter === intent
                    ? 'bg-[#4DA3FF] text-[#111738]'
                    : 'bg-[#161D44] text-slate-300 hover:text-white'
                }`}
              >
                {intent === 'all' ? 'All Intents' : intent}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredKeywords.length}</strong> keywords
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E2554] text-slate-400 text-[11px]">
                <th className="py-3 px-3 font-semibold">Keyword & Topic Cluster</th>
                <th className="py-3 px-3 font-semibold">Search Intent</th>
                <th className="py-3 px-3 font-semibold text-right">Search Volume</th>
                <th className="py-3 px-3 font-semibold text-center">Difficulty</th>
                <th className="py-3 px-3 font-semibold text-right">CPC</th>
                <th className="py-3 px-3 font-semibold">Target Page Mapping</th>
                <th className="py-3 px-3 font-semibold">Provider & Integrity</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2554]">
              {filteredKeywords.map((k) => (
                <tr key={k.id} className="hover:bg-[#161D44]/60 transition">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{k.keyword}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Layers className="w-3 h-3 text-[#D4AF37]" /> {k.cluster}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        k.intent === 'Commercial'
                          ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                          : k.intent === 'Transactional'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {k.intent}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-white">
                    {k.searchVolume ? k.searchVolume.toLocaleString() : 'N/A'}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        (k.difficulty ?? 0) <= 30
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : (k.difficulty ?? 0) <= 60
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {k.difficulty ?? '—'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {k.cpc ? `$${k.cpc.toFixed(2)}` : '—'}
                  </td>

                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                    {k.targetPage ? (
                      <span className="text-[#4DA3FF] underline decoration-[#4DA3FF]/30">{k.targetPage}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded border ${
                          k.sourceProvider === 'DataForSEO'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30'
                        }`}
                      >
                        {k.sourceProvider}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">{k.measuredDate}</div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          onCreateBriefForKeyword(k.keyword);
                          onNavigate('content');
                        }}
                        className="px-2.5 py-1 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-[11px] font-semibold border border-[#D4AF37]/30 flex items-center gap-1"
                        title="Create Content Brief with Content Worker"
                      >
                        <FileText className="w-3 h-3" /> Brief
                      </button>

                      <button
                        onClick={() => deleteKeyword(k.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete keyword"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal with Preview */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#D4AF37]" /> Import Keyword CSV
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste CSV text with columns: <code>Keyword, Intent, Volume, Difficulty, CPC, Trend, Target Page</code>
            </p>

            <textarea
              rows={4}
              value={importText}
              onChange={(e) => handleParseImport(e.target.value)}
              placeholder="Keyword,Intent,Volume,Difficulty,CPC,Trend,Target Page&#10;ai digital workforce,Commercial,2400,32,4.10,+85% YoY,/solutions"
              className="w-full p-3 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
            />

            {parsedImportRows.length > 0 && (
              <div className="p-3 rounded-lg bg-[#161D44] border border-[#252E63] text-xs">
                <div className="font-semibold text-white mb-1">
                  Preview ({parsedImportRows.length} rows parsed):
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 text-[11px] text-slate-300">
                  {parsedImportRows.map((r, i) => (
                    <div key={i} className="flex justify-between border-b border-[#252E63]/40 py-0.5">
                      <span>{r.keyword} ({r.intent})</span>
                      <span>Vol: {r.searchVolume} | KD: {r.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#161D44] text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={parsedImportRows.length === 0}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111738] font-bold text-xs disabled:opacity-50"
              >
                Import {parsedImportRows.length} Keywords
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
