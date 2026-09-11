'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/app-context';
import { AppLayout, NavSection } from '@/components/layout/AppLayout';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { LoveBrainView } from '@/components/love-brain/LoveBrainView';
import { AuditView } from '@/components/audit/AuditView';
import { KeywordsView } from '@/components/keywords/KeywordsView';
import { ContentEngineView } from '@/components/content/ContentEngineView';
import { CompetitorsView } from '@/components/competitors/CompetitorsView';
import { LocalSeoView } from '@/components/local/LocalSeoView';
import { TasksView } from '@/components/tasks/TasksView';
import { ReportsView } from '@/components/reports/ReportsView';
import { LeadsView } from '@/components/leads/LeadsView';
import { IntegrationsView } from '@/components/integrations/IntegrationsView';
import { SettingsView } from '@/components/settings/SettingsView';

function AppContent() {
  const { activeWebsite } = useApp();
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');

  // Cross-view interactive parameters
  const [loveBrainPrompt, setLoveBrainPrompt] = useState<string | undefined>(undefined);
  const [loveBrainWorker, setLoveBrainWorker] = useState<string | undefined>(undefined);
  const [auditTargetUrl, setAuditTargetUrl] = useState<string | undefined>(undefined);
  const [contentBriefKeyword, setContentBriefKeyword] = useState<string | undefined>(undefined);

  const handleNavigate = (section: NavSection) => {
    setCurrentSection(section);
  };

  const handleAskLoveBrain = (prompt: string, worker?: string) => {
    setLoveBrainPrompt(prompt);
    setLoveBrainWorker(worker);
    setCurrentSection('love-brain');
  };

  const handleTriggerInstantAudit = (url?: string) => {
    if (url) {
      setAuditTargetUrl(url);
    } else if (activeWebsite) {
      setAuditTargetUrl(`https://${activeWebsite.domain}`);
    }
    setCurrentSection('audits');
  };

  const handleCreateBriefForKeyword = (keyword: string) => {
    setContentBriefKeyword(keyword);
    setCurrentSection('content');
  };

  return (
    <AppLayout
      currentSection={currentSection}
      onNavigate={handleNavigate}
      onTriggerInstantAudit={() => handleTriggerInstantAudit()}
    >
      {currentSection === 'overview' && (
        <OverviewView
          onNavigate={handleNavigate}
          onAskLoveBrain={handleAskLoveBrain}
          onRunAudit={() => handleTriggerInstantAudit()}
        />
      )}

      {currentSection === 'love-brain' && (
        <LoveBrainView
          initialPrompt={loveBrainPrompt}
          selectedWorker={loveBrainWorker}
          onNavigate={handleNavigate}
        />
      )}

      {currentSection === 'audits' && (
        <AuditView
          onAskLoveBrain={handleAskLoveBrain}
          onNavigate={handleNavigate}
          initialTargetUrl={auditTargetUrl}
        />
      )}

      {currentSection === 'keywords' && (
        <KeywordsView
          onNavigate={handleNavigate}
          onCreateBriefForKeyword={handleCreateBriefForKeyword}
        />
      )}

      {currentSection === 'content' && (
        <ContentEngineView
          initialKeyword={contentBriefKeyword}
          onNavigate={handleNavigate}
        />
      )}

      {currentSection === 'competitors' && (
        <CompetitorsView
          onAskLoveBrain={handleAskLoveBrain}
          onNavigate={handleNavigate}
        />
      )}

      {currentSection === 'local-seo' && (
        <LocalSeoView onNavigate={handleNavigate} />
      )}

      {currentSection === 'tasks' && (
        <TasksView onAskLoveBrain={handleAskLoveBrain} />
      )}

      {currentSection === 'reports' && (
        <ReportsView onAskLoveBrain={handleAskLoveBrain} />
      )}

      {currentSection === 'leads' && (
        <LeadsView
          onTriggerAuditForUrl={(url) => handleTriggerInstantAudit(url)}
          onNavigate={handleNavigate}
        />
      )}

      {currentSection === 'integrations' && <IntegrationsView />}

      {currentSection === 'settings' && <SettingsView />}
    </AppLayout>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
