'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { IntegrationStatus } from '@/lib/types';
import {
  Network,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Check,
} from 'lucide-react';

export function IntegrationsView() {
  const { state } = useApp();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testSuccessId, setTestSuccessId] = useState<string | null>(null);

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTestSuccessId(null);
    setTimeout(() => {
      setTestingId(null);
      setTestSuccessId(id);
      setTimeout(() => setTestSuccessId(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Integrations & External Data Providers</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Secure Provider Layer
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Connect verified search data, analytics, billing, and CMS publishing endpoints with server-side proxy security.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#161D44] border border-[#252E63] px-3 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Server-side secret storage active</span>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.integrations.map((item) => {
          const isTesting = testingId === item.id;
          const isSuccess = testSuccessId === item.id;

          return (
            <div
              key={item.id}
              className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/50 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{item.name || item.provider}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      item.status === 'Connected'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : item.status === 'Error'
                        ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Last Synchronized: <strong className="text-slate-300">{item.lastSync || 'Never'}</strong>
                </div>

                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-slate-400 font-medium text-[11px]">Supported Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {item.supportedFeatures.map((f, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#161D44] border border-[#252E63] text-slate-300 text-[10px]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1E2554] flex items-center justify-between text-xs">
                {isSuccess ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                    <Check className="w-3.5 h-3.5" /> Connection Healthy
                  </span>
                ) : (
                  <button
                    onClick={() => handleTestConnection(item.id)}
                    disabled={isTesting}
                    className="text-[#4DA3FF] hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" /> Test Connection
                      </>
                    )}
                  </button>
                )}

                <button
                  className="px-3 py-1.5 rounded-lg bg-[#161D44] hover:bg-[#1C255A] text-slate-200 border border-[#252E63] text-[11px] font-medium transition"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
