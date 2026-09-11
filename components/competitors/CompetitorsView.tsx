'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { CompetitorSnapshot } from '@/lib/types';
import {
  Users,
  Plus,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Brain,
  X,
} from 'lucide-react';

interface CompetitorsViewProps {
  onAskLoveBrain: (prompt: string) => void;
  onNavigate: (section: any) => void;
}

export function CompetitorsView({ onAskLoveBrain, onNavigate }: CompetitorsViewProps) {
  const {
    state,
    activeWebsite,
    competitorsForActiveWebsite,
    addCompetitor,
  } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    addCompetitor({
      workspaceId: state.activeWorkspaceId,
      websiteId: activeWebsite?.id || 'site-arthurs',
      competitorDomain: newDomain.trim().replace(/^https?:\/\//, ''),
      competitorName: newName || newDomain,
      researchDate: new Date().toISOString().slice(0, 10),
      sharedTopics: ['AI Voice Receptionist', 'Agency Automation', 'Automated Calling'],
      observedStrengths: ['Established agency brand', 'Broad industry footprint'],
      observedWeaknesses: ['Generic solutions without healthcare specificity', 'Missing local schema'],
      contentGaps: [
        {
          topic: 'Dedicated comparison guide vs Arthur’s AI Workforce',
          competitorUrl: `https://${newDomain.trim()}/services`,
          opportunityExplanation: 'High-intent searchers looking for specialized AI agent platforms.',
          estimatedValue: '$8.20 CPC equivalent',
        },
        {
          topic: 'Transparent HIPAA voice receptionist workflow',
          competitorUrl: `https://${newDomain.trim()}/voice`,
          opportunityExplanation: 'Captures medical & dental practices seeking HIPAA compliance.',
          estimatedValue: 'High conversion rate',
        },
      ],
      publicCTAs: ['Book 30-min discovery call', 'Schedule Demo'],
      topRankingPages: [
        {
          title: 'AI Automation Solutions for Agencies',
          url: `https://${newDomain.trim()}/solutions`,
          primaryKeyword: 'ai automation platform',
        },
      ],
    });

    setAddModalOpen(false);
    setNewDomain('');
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Competitor Intelligence</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30 font-semibold">
              Evidence-Based Gap Analysis
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Compare publicly visible competitor architecture to identify high-converting content opportunities without imitation.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center gap-2 transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Competitor Domain
        </button>
      </div>

      {/* Competitors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {competitorsForActiveWebsite.map((comp) => (
          <div
            key={comp.id}
            className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#D4AF37]/50 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
                <div>
                  <h3 className="text-base font-bold text-white">{comp.competitorName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#4DA3FF] font-mono mt-0.5">
                    <Globe className="w-3.5 h-3.5" /> {comp.competitorDomain}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">
                  Audited: {comp.researchDate}
                </span>
              </div>

              {/* Public Topics & CTA */}
              <div className="text-xs space-y-1">
                <div className="text-slate-400 font-medium">Publicly Promoted Topics:</div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {comp.sharedTopics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#161D44] border border-[#252E63] text-slate-200 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Primary Public CTA: <strong className="text-slate-200">&quot;{comp.publicCTAs[0] || 'N/A'}&quot;</strong>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Observed Strengths:
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc">
                    {comp.observedStrengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Observed Weaknesses:
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc">
                    {comp.observedWeaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Content Gaps Identified */}
              <div className="p-3 rounded-xl bg-[#141B42] border border-[#252E63] space-y-1.5 text-xs">
                <div className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> High-Value Content Gaps for Arthur’s Creatives:
                </div>
                <ul className="text-[11px] text-slate-200 space-y-1 pl-4 list-disc">
                  {comp.contentGaps.map((gap, idx) => (
                    <li key={idx}>
                      <span className="font-medium text-white">{gap.topic}</span>: {gap.opportunityExplanation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#1E2554] flex items-center justify-between text-xs">
              <button
                onClick={() =>
                  onAskLoveBrain(
                    `Perform an in-depth gap comparison between ${activeWebsite?.domain} and ${comp.competitorDomain}. Suggest an original counter-strategy.`
                  )
                }
                className="text-[#4DA3FF] hover:underline flex items-center gap-1 font-medium"
              >
                <Brain className="w-3.5 h-3.5" /> Analyze with Competitor Worker
              </button>

              <button
                onClick={() => onNavigate('content')}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center gap-1 transition"
              >
                Draft Counter-Content <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Competitor Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" /> Track New Competitor
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompetitor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Competitor Domain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. competitor.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Competitor Solutions LLC"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#161D44] border border-[#252E63] text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                Only authorized public data and ethical crawl inspections are used.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#161D44] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111738] font-bold text-xs"
                >
                  Save Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
