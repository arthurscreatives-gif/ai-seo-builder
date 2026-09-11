'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Role } from '@/lib/types';
import {
  LayoutDashboard,
  Brain,
  ScanEye,
  KeyRound,
  FileText,
  Users,
  MapPin,
  CheckSquare,
  FileBarChart,
  UserPlus,
  Network,
  Settings,
  Globe,
  Sparkles,
  ChevronDown,
  Building2,
  Bell,
  Search,
  Plus,
  ExternalLink,
  Shield,
  Menu,
  X,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

export type NavSection =
  | 'overview'
  | 'love-brain'
  | 'audits'
  | 'keywords'
  | 'content'
  | 'competitors'
  | 'local-seo'
  | 'tasks'
  | 'reports'
  | 'leads'
  | 'integrations'
  | 'settings';

interface AppLayoutProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onTriggerInstantAudit: () => void;
  children: React.ReactNode;
}

export function AppLayout({
  currentSection,
  onNavigate,
  onTriggerInstantAudit,
  children,
}: AppLayoutProps) {
  const {
    state,
    activeWorkspace,
    activeWebsite,
    activeClient,
    setActiveWorkspace,
    setActiveWebsite,
    setActiveClient,
    setUserRole,
    resetAllData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newSiteModalOpen, setNewSiteModalOpen] = useState(false);

  // New site form state
  const [newSiteDomain, setNewSiteDomain] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteType, setNewSiteType] = useState('Local Services');
  const [newSiteLocation, setNewSiteLocation] = useState('Austin, TX');
  const { addWebsite } = useApp();

  const navItems: { id: NavSection; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'love-brain', label: 'LOVE Brain', icon: Brain, badge: 'AI' },
    { id: 'audits', label: 'Website Audits', icon: ScanEye },
    { id: 'keywords', label: 'Keywords', icon: KeyRound },
    { id: 'content', label: 'Content Engine', icon: FileText },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'local-seo', label: 'Local SEO', icon: MapPin },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: `${state.tasks.filter((t) => t.status === 'Open').length}` },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'leads', label: 'Leads', icon: UserPlus, badge: `${state.leads.filter((l) => l.status === 'New').length}` },
    { id: 'integrations', label: 'Integrations', icon: Network },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteDomain) return;
    const created = addWebsite(
      newSiteDomain,
      newSiteName || newSiteDomain,
      newSiteType,
      newSiteLocation
    );
    setNewSiteModalOpen(false);
    setNewSiteDomain('');
    setNewSiteName('');
    onNavigate('audits');
  };

  return (
    <div className="min-h-screen bg-[#0E1229] text-slate-100 flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="no-print h-16 bg-[#111738] border-b border-[#1E2554] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#1a2250] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('overview')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#111738] via-[#1a2250] to-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center shadow-lg shadow-black/30 group-hover:border-[#D4AF37] transition">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">AI SEO Love</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">by Arthur’s Creatives</p>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-[#1E2554] mx-2" />

          {/* Active Website Selector */}
          <div className="relative hidden md:block">
            <button
              id="active-site-dropdown-btn"
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161D44] border border-[#252E63] hover:border-[#D4AF37]/50 transition text-xs text-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-[#4DA3FF]" />
              <span className="font-medium text-white max-w-[180px] truncate">
                {activeWebsite?.domain || 'Select Website'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                Score: {activeWebsite?.auditScore ?? 84}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {siteDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-[#141B42] border border-[#252E63] rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Active Websites
                </div>
                {state.websites
                  .filter((w) => w.workspaceId === activeWorkspace?.id)
                  .map((site) => (
                    <button
                      key={site.id}
                      onClick={() => {
                        setActiveWebsite(site.id);
                        setSiteDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#1C255A] transition ${
                        site.id === activeWebsite?.id
                          ? 'bg-[#1C255A] text-[#D4AF37] font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{site.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{site.domain}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111738] border border-[#252E63]">
                        {site.auditScore ? `${site.auditScore}/100` : 'Not Audited'}
                      </span>
                    </button>
                  ))}
                <div className="border-t border-[#252E63] mt-1 pt-1 px-2">
                  <button
                    onClick={() => {
                      setSiteDropdownOpen(false);
                      setNewSiteModalOpen(true);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-[#4DA3FF] hover:bg-[#1C255A] rounded flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          {/* Credits remaining indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161D44] border border-[#252E63] text-xs text-slate-300">
            <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              <strong className="text-white">{activeWorkspace?.creditsRemaining ?? 840}</strong>{' '}
              <span className="text-slate-400">/ {activeWorkspace?.totalCredits ?? 1000} credits</span>
            </span>
          </div>

          {/* Quick Action: Instant Audit */}
          <button
            id="quick-audit-btn"
            onClick={onTriggerInstantAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] text-xs font-semibold shadow-sm transition"
            title="Run instant real website crawl & audit"
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Run Audit</span>
          </button>

          {/* Quick Action: Ask LOVE Brain */}
          <button
            id="quick-love-brain-btn"
            onClick={() => onNavigate('love-brain')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4DA3FF]/15 hover:bg-[#4DA3FF]/25 text-[#4DA3FF] border border-[#4DA3FF]/40 text-xs font-semibold transition"
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="hidden md:inline">LOVE Brain</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#161D44] border border-[#252E63] text-xs text-slate-300 hover:text-white"
              title="Test RBAC role permissions"
            >
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-medium text-[11px]">{state.user.role}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-[#141B42] border border-[#252E63] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Role
                </div>
                {(['Owner', 'Administrator', 'Team Member', 'Client Viewer'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1C255A] ${
                      state.user.role === r ? 'text-[#D4AF37] font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Center */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#1a2250] relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#141B42] border border-[#252E63] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#252E63]">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  <span className="text-[10px] text-slate-400">3 new</span>
                </div>
                <div className="divide-y divide-[#252E63]/60 max-h-64 overflow-y-auto">
                  <div className="py-2.5 text-xs">
                    <p className="text-white font-medium">Critical Issue Detected</p>
                    <p className="text-slate-400 text-[11px]">
                      Missing canonical tag on /services/ai-seo-growth.
                    </p>
                    <span className="text-[10px] text-[#4DA3FF]">Audit Run #001</span>
                  </div>
                  <div className="py-2.5 text-xs">
                    <p className="text-white font-medium">New Lead Received</p>
                    <p className="text-slate-400 text-[11px]">
                      Samantha Hayes (BlueRidge Dental) requested an SEO audit.
                    </p>
                    <span className="text-[10px] text-emerald-400">Leads Hub</span>
                  </div>
                  <div className="py-2.5 text-xs">
                    <p className="text-white font-medium">Content Ready for Approval</p>
                    <p className="text-slate-400 text-[11px]">
                      &quot;2026 Agency AI SEO Guide&quot; drafted by Content Worker.
                    </p>
                    <span className="text-[10px] text-[#D4AF37]">Content Engine</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#1E2554]">
            <img
              src={state.user.avatar}
              alt={state.user.name}
              className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
            />
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-medium text-white">{state.user.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[110px]">{state.user.email}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`no-print fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#111738] border-r border-[#1E2554] flex flex-col transition-transform duration-200 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Workspace Switcher Header */}
          <div className="p-3 border-b border-[#1E2554]">
            <div className="relative">
              <button
                id="workspace-switcher-btn"
                onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-[#161D44] border border-[#252E63] hover:border-[#D4AF37]/60 transition text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {activeWorkspace?.name}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {activeWorkspace?.plan} • {activeWorkspace?.type}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>

              {workspaceDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-[#141B42] border border-[#252E63] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Workspaces
                  </div>
                  {state.workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setActiveWorkspace(ws.id);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1C255A] transition ${
                        ws.id === activeWorkspace?.id
                          ? 'text-[#D4AF37] font-semibold bg-[#1C255A]'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111738] text-slate-400">
                        {ws.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Client Switcher (for Agency accounts) */}
            {activeWorkspace?.type === 'agency' && (
              <div className="mt-2 pt-2 border-t border-[#1E2554]/60">
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mb-1">
                  <span>Client Account</span>
                  {activeClient && (
                    <button
                      onClick={() => setActiveClient(undefined)}
                      className="text-[10px] text-[#4DA3FF] hover:underline"
                    >
                      View All
                    </button>
                  )}
                </div>
                <select
                  id="client-switcher-select"
                  value={activeClient?.id || ''}
                  onChange={(e) => setActiveClient(e.target.value || undefined)}
                  className="w-full text-xs bg-[#161D44] border border-[#252E63] text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">All Agency Clients</option>
                  {state.clients
                    .filter((c) => c.workspaceId === activeWorkspace.id)
                    .map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition group ${
                    isActive
                      ? 'bg-[#1C255A] text-[#D4AF37] shadow-inner font-semibold border-l-2 border-[#D4AF37]'
                      : 'text-slate-300 hover:bg-[#161D44] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive
                          ? 'text-[#D4AF37]'
                          : 'text-slate-400 group-hover:text-[#4DA3FF]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#D4AF37] text-[#111738]'
                          : item.badge === 'AI'
                          ? 'bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/40'
                          : 'bg-[#161D44] text-slate-300 border border-[#252E63]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-3 border-t border-[#1E2554] bg-[#0E132D] space-y-2">
            <div className="p-2.5 rounded-xl bg-[#161D44] border border-[#252E63]">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Current Scope</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="text-xs font-semibold text-white truncate">
                {activeWebsite?.domain}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {activeWebsite?.businessType}
              </div>
            </div>

            <button
              onClick={resetAllData}
              className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
              title="Reset state to initial authentic demo seeds"
            >
              <RotateCcw className="w-3 h-3" /> Reset Demo Data
            </button>
          </div>
        </aside>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto bg-[#0A0D1F] p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Add New Website Modal */}
      {newSiteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D4AF37]" /> Add Website to Workspace
              </h3>
              <button
                onClick={() => setNewSiteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Website Domain / URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. example.com or https://example.com"
                  value={newSiteDomain}
                  onChange={(e) => setNewSiteDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Example Dental Clinic"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Business Category</label>
                  <input
                    type="text"
                    value={newSiteType}
                    onChange={(e) => setNewSiteType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Target Location</label>
                  <input
                    type="text"
                    value={newSiteLocation}
                    onChange={(e) => setNewSiteLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewSiteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#161D44] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111738] font-semibold hover:bg-[#c49f2b]"
                >
                  Create & Run Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
