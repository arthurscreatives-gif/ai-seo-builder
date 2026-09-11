'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Role } from '@/lib/types';
import {
  Settings,
  Building,
  Users,
  CreditCard,
  Shield,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Plus,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';

export function SettingsView() {
  const {
    activeWorkspace,
    activeWebsite,
    state,
    setUserRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'workspace' | 'clients' | 'billing' | 'crawler'>('billing');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      priceMonthly: 49,
      priceAnnual: 39,
      websites: '1 website',
      pages: '100 pages / crawl',
      keywords: '50 keywords',
      credits: '100 AI credits / mo',
      features: ['Core Website Crawler', 'Actionable Task Board', 'LOVE Brain Basic'],
      isCurrent: activeWorkspace?.plan === 'Starter',
    },
    {
      name: 'Growth',
      priceMonthly: 149,
      priceAnnual: 119,
      websites: '5 websites',
      pages: '500 pages / crawl',
      keywords: '250 keywords',
      credits: '500 AI credits / mo',
      features: [
        'Everything in Starter',
        'Competitor Tracking (3 domains)',
        'Local SEO & GBP Sync',
        'All 5 Specialized AI Workers',
      ],
      isCurrent: activeWorkspace?.plan === 'Growth',
    },
    {
      name: 'Agency Pro',
      priceMonthly: 399,
      priceAnnual: 319,
      websites: '20 websites',
      pages: 'Unlimited pages',
      keywords: '1,000 keywords',
      credits: '2,000 AI credits / mo',
      features: [
        'Everything in Growth',
        'White-Label PDF Reports',
        'Read-Only Client Portal Access',
        'Unlimited Agency Workspaces',
        'Stripe & Webhook Integrations',
      ],
      isCurrent: activeWorkspace?.plan === 'Agency Pro',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Workspace & Account Settings</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
              Arthur’s Creatives
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Manage plans, billing meters, client accounts, and team permission roles.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#161D44] p-1 rounded-xl border border-[#252E63] text-xs">
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'billing' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Billing & Plans
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'workspace' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Team & Permissions
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'clients' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Client Portals
          </button>
          <button
            onClick={() => setActiveTab('crawler')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'crawler' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Crawler Limits
          </button>
        </div>
      </div>

      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Usage Meters Card */}
          <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" /> Current Usage & AI Credits Meter
                </h3>
                <p className="text-xs text-slate-400">
                  Active plan: <strong className="text-white">{activeWorkspace?.plan}</strong> • Renews October 1, 2026
                </p>
              </div>

              <button className="px-3.5 py-1.5 rounded-lg bg-[#161D44] hover:bg-[#1C255A] text-slate-200 border border-[#252E63] text-xs font-semibold">
                Manage via Stripe Portal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#161D44] border border-[#252E63] space-y-2">
                <div className="text-slate-400">AI Credits Remaining</div>
                <div className="text-2xl font-extrabold text-[#D4AF37]">
                  {activeWorkspace?.creditsRemaining ?? 840} <span className="text-xs text-slate-400">/ 1,000</span>
                </div>
                <div className="w-full bg-[#0E132D] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D4AF37] h-full w-[84%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161D44] border border-[#252E63] space-y-2">
                <div className="text-slate-400">Websites Added</div>
                <div className="text-2xl font-extrabold text-white">
                  {state.websites.length} <span className="text-xs text-slate-400">/ 20</span>
                </div>
                <div className="w-full bg-[#0E132D] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4DA3FF] h-full w-[15%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161D44] border border-[#252E63] space-y-2">
                <div className="text-slate-400">Keywords Monitored</div>
                <div className="text-2xl font-extrabold text-white">
                  {state.keywords.length} <span className="text-xs text-slate-400">/ 1,000</span>
                </div>
                <div className="w-full bg-[#0E132D] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[10%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161D44] border border-[#252E63] space-y-2">
                <div className="text-slate-400">Audits Executed</div>
                <div className="text-2xl font-extrabold text-white">
                  {state.auditRuns.length} <span className="text-xs text-slate-400">runs</span>
                </div>
                <div className="text-[11px] text-emerald-400">Unlimited in Agency Pro</div>
              </div>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Subscription Tiers</h3>
              <div className="flex items-center gap-2 text-xs bg-[#161D44] p-1 rounded-xl border border-[#252E63]">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    billingCycle === 'monthly' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    billingCycle === 'annual' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-400'
                  }`}
                >
                  Annual (20% Off)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => {
                const price = billingCycle === 'monthly' ? p.priceMonthly : p.priceAnnual;
                return (
                  <div
                    key={p.name}
                    className={`bg-[#111738] border rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 ${
                      p.isCurrent ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-[#1E2554]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-white">{p.name}</h4>
                        {p.isCurrent && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#D4AF37] text-[#111738]">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">${price}</span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-[#1E2554]">
                        <div className="font-semibold text-[#D4AF37]">{p.websites}</div>
                        <div>{p.pages}</div>
                        <div>{p.keywords}</div>
                        <div>{p.credits}</div>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-[#1E2554] text-xs">
                        <div className="text-slate-400 font-medium">Included Capabilities:</div>
                        {p.features.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-200 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={p.isCurrent}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                        p.isCurrent
                          ? 'bg-[#161D44] text-slate-400 cursor-default'
                          : 'bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738]'
                      }`}
                    >
                      {p.isCurrent ? 'Current Plan' : `Upgrade to ${p.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workspace' && (
        /* Team & Roles */
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" /> Team Members & Role Permissions
              </h3>
              <p className="text-xs text-slate-400">
                Manage roles with strict role-based access control (RBAC).
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#111738] font-bold text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Invite Member
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#161D44] border border-[#252E63] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={state.user.avatar}
                  alt={state.user.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]"
                />
                <div>
                  <div className="font-semibold text-white">{state.user.name} (You)</div>
                  <div className="text-[11px] text-slate-400">{state.user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold">
                  {state.user.role}
                </span>
              </div>
            </div>

            {/* Permission Matrix Guide */}
            <div className="p-4 rounded-xl bg-[#0E132D] border border-[#252E63] space-y-2 text-xs">
              <div className="font-bold text-white">Role Permission Matrix:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div>
                  <strong className="text-[#D4AF37]">Owner:</strong> Full billing management, workspace deletion, team invites, and API integrations.
                </div>
                <div>
                  <strong className="text-[#D4AF37]">Administrator:</strong> Can add websites, manage tasks, execute audits, and run specialized workers.
                </div>
                <div>
                  <strong className="text-[#D4AF37]">Team Member:</strong> Can view audits, create content drafts, execute tasks, and converse with LOVE Brain.
                </div>
                <div>
                  <strong className="text-[#D4AF37]">Client Viewer:</strong> Read-only access to their assigned client website reports and progress.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        /* Client Accounts */
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-[#D4AF37]" /> Agency Client Accounts
              </h3>
              <p className="text-xs text-slate-400">
                Isolate client websites, invite client viewers, and configure custom report white-labeling.
              </p>
            </div>
            <button className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-[#111738] font-bold text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.clients.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#161D44] border border-[#252E63] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Client
                  </span>
                </div>
                <div className="text-slate-300">
                  Primary Contact: <strong>{c.primaryContactName || c.contactName}</strong> ({c.primaryContactEmail || c.contactEmail})
                </div>
                <div className="text-slate-400 text-[11px]">
                  Portal Access: <span className="font-mono text-[#4DA3FF]">https://portal.arthurscreatives.com/{c.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'crawler' && (
        /* Crawler Limits */
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#1E2554]">
            <Sliders className="w-4 h-4 text-[#D4AF37]" /> Global Crawler Settings & Safeguards
          </h3>

          <div className="space-y-3 max-w-lg">
            <div>
              <label className="block text-slate-400 mb-1">Default User-Agent String</label>
              <input
                type="text"
                readOnly
                value="AI-SEO-Love-Audit-Bot/1.0 (+https://arthurscreatives.com/bot)"
                className="w-full bg-[#0E132D] border border-[#252E63] text-white p-2.5 rounded-lg font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Request Delay (Rate Limiting)</label>
              <input
                type="text"
                readOnly
                value="300ms (Polite crawling standard)"
                className="w-full bg-[#0E132D] border border-[#252E63] text-white p-2.5 rounded-lg text-xs"
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Active Security Policy:
              </div>
              <p className="text-[11px] text-slate-300">
                All crawl outbound requests strictly filter loopback (127.0.0.1, localhost), link-local addresses, private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and cloud metadata endpoints (169.254.169.254).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
