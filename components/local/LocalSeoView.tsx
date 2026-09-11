'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { BusinessProfile } from '@/lib/types';
import {
  MapPin,
  Building,
  Phone,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Edit2,
  Save,
  MessageSquare,
  Send,
  ShieldCheck,
  PlusCircle,
  Copy,
  Check,
} from 'lucide-react';

interface LocalSeoViewProps {
  onNavigate: (section: any) => void;
}

function getFutureDateString(daysAhead: number = 4): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

export function LocalSeoView({ onNavigate }: LocalSeoViewProps) {
  const {
    state,
    updateBusinessProfile,
    createTask,
  } = useApp();

  const [profile, setProfile] = useState<BusinessProfile>(state.businessProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Review Response Generator State
  const [customerReviewText, setCustomerReviewText] = useState(
    '“Arthur’s Creatives transformed our dental practice. Within 3 weeks of deploying their AI receptionist and local SEO strategy, we booked 42 new patient consultations without adding front-desk staff.”'
  );
  const [reviewerName, setReviewerName] = useState('Dr. Marcus Vance');
  const [starRating, setStarRating] = useState(5);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(profile);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleGenerateReviewResponse = () => {
    const responseTemplate = `Dear ${reviewerName},\n\nThank you so much for the wonderful 5-star review! We are thrilled to hear that Arthur’s AI receptionist and targeted local SEO strategy delivered 42 new patient consultations for your practice. Empowering healthcare teams to focus on patient care while automated AI workflows handle inquiries seamlessly is exactly why we built this platform.\n\nWe look forward to continuing to grow your local search presence across the greater Austin area!\n\nWarm regards,\nThe Arthur’s Creatives Team`;
    setGeneratedResponse(responseTemplate);
  };

  const handleFixDirectoryMismatch = (directoryName: string) => {
    createTask({
      workspaceId: state.activeWorkspaceId,
      websiteId: state.activeWebsiteId,
      title: `Correct NAP Information on ${directoryName}`,
      description: `Phone number is inconsistent on ${directoryName}. Update phone to ${profile.phone} and address to ${profile.address}.`,
      affectedUrl: `${directoryName} Listing Portal`,
      priority: 'Medium',
      category: 'Local SEO',
      owner: state.user.name,
      dueDate: getFutureDateString(4),
      status: 'Open',
      supportingEvidence: `Local SEO worker crawl detected mismatch on ${directoryName}.`,
      suggestedFix: `Log into ${directoryName} Business Manager and update primary contact phone.`,
    });
    onNavigate('tasks');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Local SEO & Business Profile</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              GBP Sync Verified
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Manage single source of truth for NAP (Name, Address, Phone), audit directory citations, and draft review replies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#111738] font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-[#161D44] hover:bg-[#1C255A] text-slate-200 border border-[#252E63] font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Information
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Business profile successfully synchronized and saved!</span>
        </div>
      )}

      {/* Profile Details & Directory Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Master Business Profile */}
        <div className="lg:col-span-2 bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-[#D4AF37]" /> Core Business Identity (NAP)
            </h2>
            <span className="text-[11px] text-slate-400">Canonical Profile Record</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Official Business Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Primary Category</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.primaryCategory || profile.category || ''}
                  onChange={(e) => setProfile({ ...profile, primaryCategory: e.target.value, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-medium">Street Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Official Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Website Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.websiteUrl || profile.website || ''}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Operating Hours</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.hours}
                  onChange={(e) => setProfile({ ...profile, hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Service Area</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.serviceArea}
                  onChange={(e) => setProfile({ ...profile, serviceArea: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-medium">Business Description</label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={profile.description || profile.businessDescription || ''}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value, businessDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white disabled:opacity-80"
                />
              </div>
            </div>
          </form>

          {/* Directory Consistency Audit */}
          <div className="pt-4 border-t border-[#1E2554] space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span>Directory Consistency Audit (NAP Check)</span>
              <span className="text-[10px] text-amber-400">1 Action Required</span>
            </h3>

            <div className="space-y-2">
              {(profile.directoryListings || []).map((dir, idx) => {
                const directoryName = dir.directory || (dir as any).platform || 'Directory';
                const isMismatch = dir.status === 'Mismatch' || (dir.status as string) === 'Mismatch Detected';

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#161D44] border border-[#252E63] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{directoryName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded border font-medium ${
                            dir.status === 'Consistent'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {dir.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Listed: {dir.listedPhone} • Last audited: {dir.lastChecked}
                      </div>
                    </div>

                    {isMismatch ? (
                      <button
                        onClick={() => handleFixDirectoryMismatch(directoryName)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs transition flex items-center gap-1 self-start sm:self-auto shadow"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Create Fix Task
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Synchronized
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Review Response Generator */}
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2554]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Review Reply Generator
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#4DA3FF]/15 text-[#4DA3FF]">AI Worker</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Customer / Patient Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Customer Review Content</label>
              <textarea
                rows={3}
                value={customerReviewText}
                onChange={(e) => setCustomerReviewText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0E132D] border border-[#252E63] text-white text-xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerateReviewResponse}
              className="w-full py-2.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2a8bf7] text-[#111738] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Sparkles className="w-4 h-4" /> Draft Professional Response
            </button>

            {generatedResponse && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#0E132D] border border-[#252E63] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                    Drafted Response (Editable)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedResponse);
                      setCopiedResponse(true);
                      setTimeout(() => setCopiedResponse(false), 2000);
                    }}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedResponse ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedResponse ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={generatedResponse}
                  onChange={(e) => setGeneratedResponse(e.target.value)}
                  className="w-full bg-transparent text-slate-200 text-xs font-sans leading-relaxed focus:outline-none resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
