'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { ContentItem, ContentType, ContentStatus } from '@/lib/types';
import {
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Edit3,
  Copy,
  Download,
  Share2,
  UserCheck,
  History,
  Tag,
  BookOpen,
  Check,
  X,
  Send,
} from 'lucide-react';

interface ContentEngineViewProps {
  initialKeyword?: string;
  onNavigate: (section: any) => void;
}

export function ContentEngineView({ initialKeyword, onNavigate }: ContentEngineViewProps) {
  const {
    activeWebsite,
    contentForActiveWebsite,
    keywordsForActiveWebsite,
    addContentItem,
    updateContentItem,
    state,
  } = useApp();

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Content Creation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContentType>('Blog Post');
  const [newKeyword, setNewKeyword] = useState(initialKeyword || '');
  const [newIntent, setNewIntent] = useState<'Informational' | 'Commercial' | 'Transactional'>('Commercial');
  const [targetWordCount, setTargetWordCount] = useState(1200);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsGenerating(true);

    try {
      // Call AI Worker for Content
      const response = await fetch('/api/ai/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerName: 'Content Worker',
          websiteDomain: activeWebsite?.domain || 'arthurscreatives.com',
          inputData: {
            title: newTitle,
            type: newType,
            targetKeyword: newKeyword || 'ai digital workforce',
            intent: newIntent,
            targetWordCount,
          },
        }),
      });

      const data = await response.json();

      const created = addContentItem({
        workspaceId: state.activeWorkspaceId,
        websiteId: activeWebsite?.id || 'site-arthurs',
        title: newTitle,
        contentType: newType,
        targetKeyword: newKeyword || 'ai digital workforce',
        status: 'Review',
        assignedAuthor: state.user.name,
        assignedReviewer: 'Senior SEO Strategist',
        targetAudience: 'Agency owners and business leaders looking to automate growth.',
        brandVoice: 'Authoritative, clear, pragmatic, forward-looking',
        brief: {
          objective: 'Target high-intent organic searches and explain AI digital workforce advantages.',
          suggestedHeadings: [
            'H1: ' + newTitle,
            'H2: The Evolution of Search & AI Workforce Automation',
            'H2: Key Challenges Solved by Automated Audits',
            'H2: Step-by-Step Implementation Framework',
            'H2: Measuring ROI & Long-term Search Visibility',
          ],
          suggestedWordCount: targetWordCount,
          keyPoints: [
            'How AI improves website audit turnaround time',
            'Difference between observed facts and ranking hypotheses',
            'How agencies scale client reporting safely',
          ],
          internalLinkIdeas: ['/services/ai-seo-growth', '/solutions/agency-pro'],
        },
        draftContent: data.output || `# ${newTitle}\n\n## Introduction\nIn today's competitive landscape, deploying an AI digital workforce accelerates organic growth...\n\n## Implementation Strategy\nBy conducting regular deep audits, fixing technical issues first, and targeting high-intent keywords, businesses see consistent organic momentum.`,
        optimizationNotes: [
          `Target primary keyword "${newKeyword || 'ai digital workforce'}" embedded in introduction and H2 headings.`,
          'Structured schema recommendation included.',
        ],
        factualReviewNotes: [
          'VERIFY WITH CLIENT: Confirm exact percentage improvement metrics before external publication.',
          'CONFIRM INTEGRATIONS: Ensure mentioned CRM connectors (HubSpot, Salesforce) are actively supported.',
        ],
      });

      setIsCreatingNew(false);
      setSelectedItem(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDraft = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Content Engine & Briefs</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30 font-semibold">
              Factual Review Guardrails
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Structured workflow: Target Keyword → Brief → Outline → Draft → Factual Verification → Approval.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreatingNew(true);
            setSelectedItem(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center gap-2 transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Content Piece
        </button>
      </div>

      {/* Content Grid / List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Content Repository Table */}
        <div className="lg:col-span-2 bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
            <h2 className="text-sm font-bold text-white">
              Content Pipeline ({contentForActiveWebsite.length} Items)
            </h2>
            <div className="text-xs text-slate-400">
              Target domain: <strong className="text-white">{activeWebsite?.domain}</strong>
            </div>
          </div>

          <div className="space-y-3">
            {contentForActiveWebsite.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsCreatingNew(false);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1C255A] border-[#D4AF37] shadow-md'
                      : 'bg-[#161D44] border-[#252E63] hover:border-[#4DA3FF]/40'
                  }`}
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          item.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : item.status === 'Review'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-[#111738] px-2 py-0.5 rounded border border-[#1E2554]">
                        {item.contentType}
                      </span>
                      <span className="text-[10px] text-[#D4AF37] font-medium">
                        &quot;{item.targetKeyword}&quot;
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Author: {item.assignedAuthor}</span>
                      <span>•</span>
                      <span>Reviewer: {item.assignedReviewer || 'Unassigned'}</span>
                      <span>•</span>
                      <span>{item.brief?.suggestedWordCount || 1200} words</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {item.factualReviewNotes && item.factualReviewNotes.length > 0 && (
                      <span className="text-[10px] px-2 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        {item.factualReviewNotes.length} Verification Notes
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Editor / Brief Viewer or Creation Form */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl">
          {isCreatingNew ? (
            /* Creation Form */
            <form onSubmit={handleGenerateContent} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Create Content Brief
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Article / Page Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How Arthur’s AI Workforce Automates Healthcare Clinics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Content Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ContentType)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs"
                  >
                    <option value="Blog Post">Blog Post</option>
                    <option value="Service Page">Service Page</option>
                    <option value="Location Page">Location Page</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="FAQ">FAQ Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Search Intent</label>
                  <select
                    value={newIntent}
                    onChange={(e) => setNewIntent(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Informational">Informational</option>
                    <option value="Transactional">Transactional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Primary Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. ai phone receptionist for clinics"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Word Count</label>
                <input
                  type="number"
                  value={targetWordCount}
                  onChange={(e) => setTargetWordCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#161D44] border border-[#252E63] text-[11px] text-slate-300 space-y-1">
                <div className="font-semibold text-[#D4AF37]">Factual Guarantee Protocol:</div>
                <p>
                  Content Worker will generate the complete brief and draft while explicitly tagging statements that require business verification.
                </p>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !newTitle}
                className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Drafting Brief with Content Worker...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> Generate Structured Brief & Draft
                  </>
                )}
              </button>
            </form>
          ) : selectedItem ? (
            /* Selected Content Viewer / Review Studio */
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                    {selectedItem.title}
                  </h3>
                  <div className="text-[10px] text-slate-400">
                    Target: {selectedItem.targetKeyword}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyDraft(selectedItem.id, selectedItem.draftContent)}
                    className="p-1.5 rounded-lg bg-[#161D44] text-slate-300 hover:text-white border border-[#252E63]"
                    title="Copy Markdown"
                  >
                    {copiedId === selectedItem.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <select
                    value={selectedItem.status}
                    onChange={(e) => {
                      updateContentItem({
                        ...selectedItem,
                        status: e.target.value as ContentStatus,
                      });
                      setSelectedItem({
                        ...selectedItem,
                        status: e.target.value as ContentStatus,
                      });
                    }}
                    className="bg-[#161D44] border border-[#252E63] text-white rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Factual Review Guardrail Notes */}
              {selectedItem.factualReviewNotes && selectedItem.factualReviewNotes.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" /> Factual Review Flags:
                  </div>
                  <ul className="text-[11px] text-amber-200/90 space-y-1 pl-4 list-disc">
                    {selectedItem.factualReviewNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Heading Outline Box */}
              {selectedItem.brief?.suggestedHeadings && (
                <div className="p-3 rounded-lg bg-[#141B42] border border-[#252E63] space-y-1.5">
                  <div className="font-semibold text-[#D4AF37] text-xs">Approved Heading Outline:</div>
                  <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                    {selectedItem.brief.suggestedHeadings.map((h, i) => (
                      <div key={i} className="truncate">{h}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Draft Content Display */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white">Draft Preview (Markdown):</span>
                  <span className="text-[10px] text-slate-400">{selectedItem.brief?.suggestedWordCount || 1200} words</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0E132D] border border-[#252E63] max-h-72 overflow-y-auto font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.draftContent}
                </div>
              </div>

              {/* Internal Link Suggestions */}
              {selectedItem.brief?.internalLinkIdeas && (
                <div className="pt-2 border-t border-[#1E2554] text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Suggested Links:</span>
                  {selectedItem.brief.internalLinkIdeas.map((l, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#161D44] text-[#4DA3FF]">
                      {l}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600" />
              <p className="text-xs">
                Select a content piece from the repository or click <strong className="text-[#D4AF37]">&quot;Create New Content Piece&quot;</strong> to start.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
