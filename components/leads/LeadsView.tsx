'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { LeadItem, LeadStatus } from '@/lib/types';
import {
  UserPlus,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Globe,
  Calendar,
  ExternalLink,
  ScanEye,
  CheckCircle2,
  Clock,
  X,
  User,
  ArrowRight,
} from 'lucide-react';

interface LeadsViewProps {
  onTriggerAuditForUrl: (url: string) => void;
  onNavigate: (section: any) => void;
}

export function LeadsView({ onTriggerAuditForUrl, onNavigate }: LeadsViewProps) {
  const {
    activeWorkspace,
    leadsForActiveWorkspace,
    addLead,
    updateLead,
    state,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Lead Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [requestedService, setRequestedService] = useState('Full Website Audit & Plan');
  const [notes, setNotes] = useState('');

  const filteredLeads = leadsForActiveWorkspace.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const site = (lead.websiteUrl || lead.website || '').toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        site.includes(q) ||
        lead.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addLead({
      workspaceId: state.activeWorkspaceId,
      name,
      company: name,
      email,
      phone,
      website: websiteUrl || 'example.com',
      websiteUrl: websiteUrl || 'example.com',
      requestedService,
      assignedOwner: state.user.name,
      notes: notes || 'Lead captured via audit inquiry.',
      followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'New',
    });

    setCreateModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setWebsiteUrl('');
    setNotes('');
  };

  const handleRunAuditForLead = (url: string) => {
    onTriggerAuditForUrl(url);
    onNavigate('audits');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Leads & Inbound Audit Inquiries</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30 font-semibold">
              Conversion Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Track prospective client audits, follow-up dates, and linked diagnostic runs for Arthur’s Creatives.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center gap-1.5 transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111738] border border-[#1E2554] p-4 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === st ? 'bg-[#4DA3FF] text-[#111738]' : 'bg-[#161D44] text-slate-300 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Leads' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads by name or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1E2554] text-slate-400 text-[11px]">
              <th className="py-3 px-3 font-semibold">Prospect & Company</th>
              <th className="py-3 px-3 font-semibold">Website</th>
              <th className="py-3 px-3 font-semibold">Requested Service</th>
              <th className="py-3 px-3 font-semibold">Follow-Up</th>
              <th className="py-3 px-3 font-semibold">Owner</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2554]">
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="hover:bg-[#161D44]/60 transition cursor-pointer"
              >
                <td className="py-3 px-3">
                  <div className="font-semibold text-white">{lead.name}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{lead.email}</span>
                    {lead.phone && <span>• {lead.phone}</span>}
                  </div>
                </td>

                <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                  {lead.websiteUrl || lead.website}
                </td>

                <td className="py-3 px-3 text-slate-300">
                  <span className="bg-[#161D44] px-2 py-0.5 rounded border border-[#252E63] text-[11px]">
                    {lead.requestedService}
                  </span>
                </td>

                <td className="py-3 px-3 text-slate-300">{lead.followUpDate || 'None'}</td>
                <td className="py-3 px-3 text-slate-300">{lead.assignedOwner}</td>

                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      lead.status === 'Won'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : lead.status === 'Proposal Sent'
                        ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                        : lead.status === 'Qualified'
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>

                <td className="py-3 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunAuditForLead(lead.websiteUrl || lead.website);
                    }}
                    className="px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] text-[11px] font-bold flex items-center gap-1 ml-auto"
                    title="Run live audit for prospect"
                  >
                    <ScanEye className="w-3 h-3" /> Audit Website
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#252E63]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedLead.name}</h3>
                <div className="text-[11px] text-slate-400">{selectedLead.websiteUrl || selectedLead.website}</div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>Email: <span className="text-white">{selectedLead.email}</span></div>
                <div>Phone: <span className="text-white">{selectedLead.phone || 'N/A'}</span></div>
                <div>Assigned: <span className="text-white">{selectedLead.assignedOwner}</span></div>
                <div>Follow-Up: <span className="text-white">{selectedLead.followUpDate}</span></div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Pipeline Status:</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    const updated = { ...selectedLead, status: e.target.value as LeadStatus };
                    updateLead(updated);
                    setSelectedLead(updated);
                  }}
                  className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg p-2 text-xs"
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won (Active Client)</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-[#0E132D] border border-[#252E63]">
                <div className="font-semibold text-[#D4AF37] mb-1">Notes & Scope:</div>
                <p className="text-slate-300 leading-relaxed">{selectedLead.notes}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#252E63]">
              <button
                onClick={() => {
                  handleRunAuditForLead(selectedLead.websiteUrl || selectedLead.website || 'example.com');
                  setSelectedLead(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111738] font-bold flex items-center gap-1.5"
              >
                <ScanEye className="w-3.5 h-3.5" /> Launch Audit Crawl
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-3 py-2 rounded-lg bg-[#161D44] text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#252E63]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#D4AF37]" /> Add Inbound Prospect Lead
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Laura Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E132D] border border-[#252E63] text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dr.chen@healthclinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E132D] border border-[#252E63] text-white rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (512) 555-0144"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E132D] border border-[#252E63] text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Prospect Website URL</label>
                  <input
                    type="text"
                    placeholder="e.g. healthclinic.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E132D] border border-[#252E63] text-white rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inquiry Scope / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Details on client needs, SEO pain points..."
                  className="w-full px-3 py-2 bg-[#0E132D] border border-[#252E63] text-white rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-[#161D44] text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] text-[#111738] font-bold rounded-lg"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
