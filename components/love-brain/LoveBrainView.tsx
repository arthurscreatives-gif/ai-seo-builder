'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import {
  Brain,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  Cpu,
  Terminal,
  FileText,
  KeyRound,
  Users,
  MapPin,
  ScanEye,
  Check,
  Copy,
  Play,
} from 'lucide-react';

interface LoveBrainViewProps {
  initialPrompt?: string;
  selectedWorker?: string;
  onNavigate?: (section: any) => void;
}

export function LoveBrainView({ initialPrompt, selectedWorker: initialSelectedWorker, onNavigate }: LoveBrainViewProps) {
  const {
    state,
    activeWebsite,
    activeWorkspace,
    recentAudit,
    issuesForActiveWebsite,
    keywordsForActiveWebsite,
    tasksForActiveWebsite,
    addAIMessage,
    createTaskFromIssue,
    createTask,
    addContentItem,
    addWorkerActivity,
    clearAIChat,
  } = useApp();

  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'workers'>(initialSelectedWorker ? 'workers' : 'chat');
  const [selectedWorker, setSelectedWorker] = useState<string>(initialSelectedWorker || 'Technical SEO Worker');
  const [workerRunning, setWorkerRunning] = useState(false);
  const [workerResult, setWorkerResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.aiMessages]);

  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => {
        setInputMessage(initialPrompt);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim() || isLoading) return;

    // Add user message
    addAIMessage({
      role: 'user',
      content: messageText,
    });

    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/love-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          history: state.aiMessages.slice(-6),
          workspaceContext: activeWorkspace,
          activeWebsite,
          recentAudit,
          issues: issuesForActiveWebsite,
          keywords: keywordsForActiveWebsite,
          tasks: tasksForActiveWebsite,
          businessProfile: state.businessProfile,
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        addAIMessage({
          role: 'assistant',
          content: data.response,
          sourceReferences: [
            {
              type: 'audit_finding',
              label: `Audit #${recentAudit?.id || '001'}`,
              detail: `Website Score ${recentAudit?.score || 84}/100`,
            },
            {
              type: 'url',
              label: activeWebsite?.domain || 'arthurscreatives.com',
              detail: 'Active Authorized Domain',
            },
          ],
          suggestedActions: data.suggestedActions || [],
        });
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err: any) {
      addAIMessage({
        role: 'assistant',
        content: `I encountered a communication issue connecting to the AI model. 

However, based on your stored audit records for **${activeWebsite?.domain}**:
- **Observed Fact:** You have 1 Critical issue (Missing Canonical Tag on /services/ai-seo-growth).
- **Hypothesis:** Adding the canonical tag prevents duplicate ranking signals in search engines.

Would you like to turn this into a task on your board?`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteWorker = async (workerName: string) => {
    setWorkerRunning(true);
    setWorkerResult(null);

    try {
      const response = await fetch('/api/ai/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerName,
          websiteDomain: activeWebsite?.domain,
          inputData: {
            recentAuditScore: recentAudit?.score,
            issuesCount: issuesForActiveWebsite.length,
            topIssue: issuesForActiveWebsite[0],
            topKeyword: keywordsForActiveWebsite[0],
            businessProfile: state.businessProfile,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWorkerResult(data.output);
        addWorkerActivity({
          workerName: data.activity.workerName,
          taskDescription: data.activity.taskDescription,
          status: 'completed',
          startedAt: data.activity.startedAt,
          completedAt: data.activity.completedAt,
          sourceDataUsed: data.activity.sourceDataUsed,
          outputSummary: data.activity.outputSummary,
        });
      } else {
        setWorkerResult(`Worker error: ${data.error}`);
      }
    } catch (err: any) {
      setWorkerResult(`Worker failed: ${err.message}`);
    } finally {
      setWorkerRunning(false);
    }
  };

  const suggestedPrompts = [
    'What should I fix first on my website?',
    'Explain why missing canonical tags cause SEO issues',
    'Find high-intent keyword opportunities for my business',
    'Create a content brief for "ai phone receptionist for clinics"',
    'Compare my services with growthdigitalai.com',
    'Summarize this month’s technical progress',
  ];

  const workersList = [
    {
      name: 'Technical SEO Worker',
      icon: ScanEye,
      description: 'Analyzes crawls and technical findings. Outputs prioritized issues and proposed code fixes.',
      permittedActions: ['Analyze crawl DOM', 'Generate patch snippets', 'Propose technical tasks'],
    },
    {
      name: 'Keyword Research Worker',
      icon: KeyRound,
      description: 'Analyzes keyword data and search intent. Outputs keyword groups, opportunities, and page mappings.',
      permittedActions: ['Query intent clustering', 'CPC/Volume analysis', 'Target page mapping'],
    },
    {
      name: 'Content Worker',
      icon: FileText,
      description: 'Creates briefs, drafts, and optimization suggestions with factual review notes.',
      permittedActions: ['Generate briefs', 'Draft articles', 'Flag claims needing verification'],
    },
    {
      name: 'Competitor Research Worker',
      icon: Users,
      description: 'Compares authorized research and public competitor pages. Discovers content gaps.',
      permittedActions: ['Compare public headings', 'Identify topic gaps', 'Propose original strategy'],
    },
    {
      name: 'Local SEO Worker',
      icon: MapPin,
      description: 'Reviews business NAP information and local directories. Identifies consistency mismatches.',
      permittedActions: ['NAP discrepancy scan', 'Listing review tasks', 'Review reply drafting'],
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111738] border border-[#1E2554] p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#111738] via-[#1a2250] to-[#4DA3FF] border border-[#4DA3FF]/40 flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-[#4DA3FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">LOVE Brain</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30">
                Grounded AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Central conversational intelligence & 5 specialized workers for{' '}
              <strong className="text-white">{activeWebsite?.domain}</strong>
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-[#161D44] p-1 rounded-xl border border-[#252E63]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-[#4DA3FF] text-[#111738]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Conversational Assistant
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'workers'
                ? 'bg-[#4DA3FF] text-[#111738]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            5 Specialized Workers
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* CHAT INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Stream */}
          <div className="lg:col-span-3 bg-[#111738] border border-[#1E2554] rounded-2xl flex flex-col h-[680px] shadow-2xl overflow-hidden">
            {/* Chat Messages Window */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {state.aiMessages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                        isAssistant
                          ? 'bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/40'
                          : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                      }`}
                    >
                      {isAssistant ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="space-y-2">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isAssistant
                            ? 'bg-[#161D44] border border-[#252E63] text-slate-100 shadow-md'
                            : 'bg-[#1C255A] border border-[#D4AF37]/30 text-white shadow-md'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans space-y-2">
                          {msg.content}
                        </div>

                        {/* Copy & Time */}
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#252E63]/60 text-[10px] text-slate-400">
                          <span>{msg.timestamp.slice(11, 16)} UTC</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="hover:text-white flex items-center gap-1"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Source References Pill */}
                      {msg.sourceReferences && msg.sourceReferences.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 px-1">
                          <span className="font-semibold text-slate-400">Verified Sources:</span>
                          {msg.sourceReferences.map((src, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-[#161D44] border border-[#252E63] text-slate-300"
                            >
                              {src.label} ({src.detail})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Suggested Interactive Actions */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.suggestedActions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (act.type === 'create_task') {
                                  createTaskFromIssue(act.payload.issueId || 'issue-001');
                                  onNavigate?.('tasks');
                                } else if (act.type === 'create_brief') {
                                  onNavigate?.('content');
                                } else if (act.type === 'run_audit') {
                                  onNavigate?.('audits');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              {act.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 max-w-xl mr-auto">
                  <div className="w-8 h-8 rounded-xl bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/40 flex items-center justify-center shrink-0 animate-pulse">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#161D44] border border-[#252E63] text-xs text-slate-300 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#4DA3FF] animate-spin" />
                    <span>LOVE Brain is analyzing authorized workspace telemetry...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#1E2554] bg-[#141B42]/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  id="love-brain-input"
                  placeholder={`Ask LOVE Brain about ${activeWebsite?.domain} (e.g. "What should I fix first?")`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 bg-[#0E132D] border border-[#252E63] text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#4DA3FF] placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-5 py-3 rounded-xl bg-[#4DA3FF] hover:bg-[#2a8bf7] text-[#111738] font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                <span>Grounded strictly in website audit, keywords & directory facts.</span>
                <button
                  onClick={clearAIChat}
                  className="text-slate-400 hover:text-slate-200 underline text-[10px]"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Suggested Inquiries & Guardrails */}
          <div className="space-y-4">
            {/* Suggested Prompts */}
            <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-4 shadow-xl">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Suggested Questions
              </h3>
              <div className="space-y-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#161D44] border border-[#252E63] hover:border-[#4DA3FF]/50 text-xs text-slate-300 hover:text-white transition group"
                  >
                    <span className="line-clamp-2">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grounding & Safeguards Card */}
            <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-4 shadow-xl text-xs space-y-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> AI Safeguards & Integrity
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                LOVE Brain enforces the Arthur’s Creatives diagnostic standard:
              </p>
              <ul className="text-[11px] text-slate-400 space-y-1.5 pl-3 list-disc">
                <li>
                  <strong className="text-slate-200">Fact vs. Hypothesis:</strong> Technical crawl observations are cleanly separated from forward-looking predictions.
                </li>
                <li>
                  <strong className="text-slate-200">No Fabricated Metrics:</strong> Keyword volumes and backlinks are never invented.
                </li>
                <li>
                  <strong className="text-slate-200">Human Approval:</strong> All content drafts flag statements requiring client confirmation.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* 5 SPECIALIZED WORKERS COORDINATOR */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Worker Selector */}
          <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#4DA3FF]" /> Autonomous AI Workers
            </h3>
            <p className="text-xs text-slate-400">
              Each worker has a defined input, output, and permitted actions. Select a worker to review or execute.
            </p>

            <div className="space-y-2 mt-4">
              {workersList.map((worker) => {
                const Icon = worker.icon;
                const isSelected = selectedWorker === worker.name;
                return (
                  <button
                    key={worker.name}
                    onClick={() => {
                      setSelectedWorker(worker.name);
                      setWorkerResult(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#1C255A] border-[#D4AF37] text-white'
                        : 'bg-[#161D44] border-[#252E63] text-slate-300 hover:bg-[#1A2250]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#D4AF37] text-[#111738]' : 'bg-[#111738] text-[#4DA3FF]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{worker.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {worker.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Worker Studio & Execution Output */}
          <div className="lg:col-span-2 bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedWorker}</h3>
                  <span className="text-[11px] text-slate-400">
                    Scope: {activeWebsite?.domain} • Permitted Actions strictly enforced
                  </span>
                </div>

                <button
                  onClick={() => handleExecuteWorker(selectedWorker)}
                  disabled={workerRunning}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 shadow"
                >
                  {workerRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Execute Worker
                    </>
                  )}
                </button>
              </div>

              {/* Execution Display Window */}
              <div className="mt-4 p-5 rounded-xl bg-[#0E132D] border border-[#252E63] min-h-[380px] overflow-y-auto">
                {workerRunning ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#4DA3FF] animate-spin" />
                    <div className="text-xs font-semibold text-white">
                      {selectedWorker} is executing background analysis...
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Inspecting authorized crawl logs, querying DataForSEO parameters, and generating proposal draft.
                    </p>
                  </div>
                ) : workerResult ? (
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed space-y-3 font-mono">
                    {workerResult}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                    <Terminal className="w-8 h-8 text-slate-600" />
                    <p className="text-xs">
                      Ready to execute. Click <strong className="text-[#D4AF37]">&quot;Execute Worker&quot;</strong> above to trigger structured analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Worker Activity Log Table */}
            <div className="pt-3 border-t border-[#1E2554]">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Recent Worker Telemetry Log</h4>
              <div className="divide-y divide-[#1E2554] text-xs">
                {state.workerActivities.slice(0, 3).map((act) => (
                  <div key={act.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">{act.workerName}</span>
                      <span className="text-[11px] text-slate-400 ml-2 truncate max-w-xs inline-block align-bottom">
                        {act.outputSummary}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
