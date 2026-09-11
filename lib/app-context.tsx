'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AppState,
  loadState,
  saveState,
  resetState,
} from './storage';
import {
  AuditRun,
  AuditIssue,
  Task,
  KeywordItem,
  ContentItem,
  CompetitorSnapshot,
  BusinessProfile,
  LeadItem,
  ReportItem,
  Role,
  AIMessage,
  WorkerActivity,
  Website,
  Workspace,
  ClientAccount,
} from './types';

interface AppContextType {
  state: AppState;
  activeWorkspace?: Workspace;
  activeWebsite?: Website;
  activeClient?: ClientAccount;
  recentAudit?: AuditRun;
  issuesForActiveWebsite: AuditIssue[];
  tasksForActiveWebsite: Task[];
  keywordsForActiveWebsite: KeywordItem[];
  contentForActiveWebsite: ContentItem[];
  competitorsForActiveWebsite: CompetitorSnapshot[];
  leadsForActiveWorkspace: LeadItem[];
  reportsForActiveWebsite: ReportItem[];
  
  // Actions
  setActiveWorkspace: (id: string) => void;
  setActiveWebsite: (id: string) => void;
  setActiveClient: (id?: string) => void;
  setUserRole: (role: Role) => void;
  
  addAuditRun: (run: AuditRun, newIssues: AuditIssue[]) => void;
  createTaskFromIssue: (issueId: string) => Task | null;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTaskStatus: (
    taskId: string,
    status: Task['status'],
    dismissalReason?: string,
    completionNotes?: string
  ) => void;
  
  addKeyword: (keyword: Omit<KeywordItem, 'id'>) => KeywordItem;
  deleteKeyword: (id: string) => void;
  
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'versionHistory'>) => ContentItem;
  updateContentItem: (item: ContentItem) => void;
  
  addLead: (lead: Omit<LeadItem, 'id' | 'createdAt'>) => LeadItem;
  updateLead: (lead: LeadItem) => void;
  
  addReport: (report: Omit<ReportItem, 'id' | 'generatedAt'>) => ReportItem;
  
  updateBusinessProfile: (profile: BusinessProfile) => void;
  
  addCompetitor: (competitor: Omit<CompetitorSnapshot, 'id'>) => CompetitorSnapshot;
  
  addAIMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => AIMessage;
  clearAIChat: () => void;
  
  addWorkerActivity: (activity: Omit<WorkerActivity, 'id'>) => void;
  
  addWebsite: (domain: string, name: string, businessType: string, location: string) => Website;
  addWorkspace: (name: string, type: 'agency' | 'business') => Workspace;
  
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    const handleStateChange = () => {
      setState(loadState());
    };
    window.addEventListener('ai_seo_love_state_changed', handleStateChange);
    return () => {
      window.removeEventListener('ai_seo_love_state_changed', handleStateChange);
    };
  }, []);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  };

  const activeWorkspace = state.workspaces.find((w) => w.id === state.activeWorkspaceId) || state.workspaces[0];
  const activeWebsite = state.websites.find((s) => s.id === state.activeWebsiteId) || state.websites[0];
  const activeClient = state.clients.find((c) => c.id === state.activeClientId);

  const issuesForActiveWebsite = state.issues.filter((i) => i.websiteId === activeWebsite?.id);
  const tasksForActiveWebsite = state.tasks.filter((t) => t.websiteId === activeWebsite?.id);
  const keywordsForActiveWebsite = state.keywords.filter((k) => k.websiteId === activeWebsite?.id);
  const contentForActiveWebsite = state.contentItems.filter((c) => c.websiteId === activeWebsite?.id);
  const competitorsForActiveWebsite = state.competitors.filter((c) => c.websiteId === activeWebsite?.id);
  const leadsForActiveWorkspace = state.leads.filter((l) => l.workspaceId === activeWorkspace?.id);
  const reportsForActiveWebsite = state.reports.filter((r) => r.websiteId === activeWebsite?.id);

  const recentAudit = state.auditRuns
    .filter((a) => a.websiteId === activeWebsite?.id)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];

  const setActiveWorkspace = (id: string) => {
    updateState((prev) => {
      const targetSites = prev.websites.filter((s) => s.workspaceId === id);
      return {
        ...prev,
        activeWorkspaceId: id,
        activeWebsiteId: targetSites[0]?.id || prev.activeWebsiteId,
        activeClientId: undefined,
      };
    });
  };

  const setActiveWebsite = (id: string) => {
    updateState((prev) => ({
      ...prev,
      activeWebsiteId: id,
    }));
  };

  const setActiveClient = (id?: string) => {
    updateState((prev) => {
      if (!id) {
        return { ...prev, activeClientId: undefined };
      }
      const clientSites = prev.websites.filter((s) => s.clientId === id);
      return {
        ...prev,
        activeClientId: id,
        activeWebsiteId: clientSites[0]?.id || prev.activeWebsiteId,
      };
    });
  };

  const setUserRole = (role: Role) => {
    updateState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        role,
      },
    }));
  };

  const addAuditRun = (run: AuditRun, newIssues: AuditIssue[]) => {
    updateState((prev) => {
      // Update website's last audit date and score
      const updatedWebsites = prev.websites.map((site) => {
        if (site.id === run.websiteId) {
          return {
            ...site,
            lastAuditDate: run.completedAt || run.startedAt,
            auditScore: run.score,
          };
        }
        return site;
      });

      return {
        ...prev,
        websites: updatedWebsites,
        auditRuns: [run, ...prev.auditRuns],
        issues: [...newIssues, ...prev.issues],
      };
    });
  };

  const createTaskFromIssue = (issueId: string): Task | null => {
    const issue = state.issues.find((i) => i.id === issueId);
    if (!issue) return null;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      workspaceId: state.activeWorkspaceId,
      websiteId: issue.websiteId,
      issueId: issue.id,
      title: `Fix: ${issue.title}`,
      description: issue.explanation,
      affectedUrl: issue.affectedUrl,
      priority: issue.severity === 'critical' ? 'Critical' : issue.severity === 'high' ? 'High' : issue.severity === 'medium' ? 'Medium' : 'Low',
      category: issue.category,
      owner: state.user.name,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'Open',
      supportingEvidence: issue.observedEvidence,
      suggestedFix: issue.recommendedFix,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      issues: prev.issues.map((i) =>
        i.id === issueId ? { ...i, taskStatus: 'created', taskId: newTask.id } : i
      ),
    }));

    return newTask;
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    return newTask;
  };

  const updateTaskStatus = (
    taskId: string,
    status: Task['status'],
    dismissalReason?: string,
    completionNotes?: string
  ) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            dismissalReason: dismissalReason ?? t.dismissalReason,
            completionNotes: completionNotes ?? t.completionNotes,
            updatedBy: prev.user.name,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      }),
    }));
  };

  const addKeyword = (keywordData: Omit<KeywordItem, 'id'>): KeywordItem => {
    const newKw: KeywordItem = {
      ...keywordData,
      id: `kw-${Date.now()}`,
    };
    updateState((prev) => ({
      ...prev,
      keywords: [newKw, ...prev.keywords],
    }));
    return newKw;
  };

  const deleteKeyword = (id: string) => {
    updateState((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k.id !== id),
    }));
  };

  const addContentItem = (
    itemData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'versionHistory'>
  ): ContentItem => {
    const newItem: ContentItem = {
      ...itemData,
      id: `cnt-${Date.now()}`,
      versionHistory: [
        {
          version: 1,
          updatedAt: new Date().toISOString(),
          updatedBy: state.user.name,
          summary: 'Initial draft created by Content Engine',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      contentItems: [newItem, ...prev.contentItems],
    }));
    return newItem;
  };

  const updateContentItem = (item: ContentItem) => {
    updateState((prev) => ({
      ...prev,
      contentItems: prev.contentItems.map((c) => (c.id === item.id ? item : c)),
    }));
  };

  const addLead = (leadData: Omit<LeadItem, 'id' | 'createdAt'>): LeadItem => {
    const newLead: LeadItem = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads],
    }));
    return newLead;
  };

  const updateLead = (lead: LeadItem) => {
    updateState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === lead.id ? lead : l)),
    }));
  };

  const addReport = (reportData: Omit<ReportItem, 'id' | 'generatedAt'>): ReportItem => {
    const newReport: ReportItem = {
      ...reportData,
      id: `rep-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      reports: [newReport, ...prev.reports],
    }));
    return newReport;
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    updateState((prev) => ({
      ...prev,
      businessProfile: profile,
    }));
  };

  const addCompetitor = (competitorData: Omit<CompetitorSnapshot, 'id'>): CompetitorSnapshot => {
    const newComp: CompetitorSnapshot = {
      ...competitorData,
      id: `comp-${Date.now()}`,
    };
    updateState((prev) => ({
      ...prev,
      competitors: [newComp, ...prev.competitors],
    }));
    return newComp;
  };

  const addAIMessage = (msgData: Omit<AIMessage, 'id' | 'timestamp'>): AIMessage => {
    const newMsg: AIMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      aiMessages: [...prev.aiMessages, newMsg],
    }));
    return newMsg;
  };

  const clearAIChat = () => {
    updateState((prev) => ({
      ...prev,
      aiMessages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Chat session refreshed. How can **LOVE Brain** assist your SEO strategy for **${activeWebsite?.domain}** today?`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  const addWorkerActivity = (activityData: Omit<WorkerActivity, 'id'>) => {
    const newActivity: WorkerActivity = {
      ...activityData,
      id: `act-${Date.now()}`,
    };
    updateState((prev) => ({
      ...prev,
      workerActivities: [newActivity, ...prev.workerActivities],
    }));
  };

  const addWebsite = (
    domain: string,
    name: string,
    businessType: string,
    location: string
  ): Website => {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const newSite: Website = {
      id: `site-${Date.now()}`,
      workspaceId: state.activeWorkspaceId,
      clientId: state.activeClientId,
      domain: cleanDomain,
      name,
      businessType,
      targetLocation: location,
      createdAt: new Date().toISOString(),
      connectedGSC: false,
      connectedGA4: false,
      crawlSettings: {
        maxPages: 30,
        crawlSubdomains: false,
        excludedPaths: [],
        crawlFrequency: 'Weekly',
      },
    };
    updateState((prev) => ({
      ...prev,
      websites: [newSite, ...prev.websites],
      activeWebsiteId: newSite.id,
    }));
    return newSite;
  };

  const addWorkspace = (name: string, type: 'agency' | 'business'): Workspace => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      type,
      ownerId: state.user.id,
      plan: type === 'agency' ? 'Agency Pro' : 'Growth',
      creditsRemaining: 500,
      totalCredits: 500,
      createdAt: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      workspaces: [...prev.workspaces, newWs],
      activeWorkspaceId: newWs.id,
    }));
    return newWs;
  };

  const resetAllData = () => {
    const fresh = resetState();
    setState(fresh);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        activeWorkspace,
        activeWebsite,
        activeClient,
        recentAudit,
        issuesForActiveWebsite,
        tasksForActiveWebsite,
        keywordsForActiveWebsite,
        contentForActiveWebsite,
        competitorsForActiveWebsite,
        leadsForActiveWorkspace,
        reportsForActiveWebsite,
        setActiveWorkspace,
        setActiveWebsite,
        setActiveClient,
        setUserRole,
        addAuditRun,
        createTaskFromIssue,
        createTask,
        updateTaskStatus,
        addKeyword,
        deleteKeyword,
        addContentItem,
        updateContentItem,
        addLead,
        updateLead,
        addReport,
        updateBusinessProfile,
        addCompetitor,
        addAIMessage,
        clearAIChat,
        addWorkerActivity,
        addWebsite,
        addWorkspace,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
