import {
  User,
  Workspace,
  ClientAccount,
  Website,
  AuditRun,
  AuditIssue,
  Task,
  KeywordItem,
  ContentItem,
  CompetitorSnapshot,
  BusinessProfile,
  LeadItem,
  ReportItem,
  IntegrationStatus,
  WorkerActivity,
  AIMessage,
  Role,
} from './types';
import {
  INITIAL_USER,
  INITIAL_WORKSPACES,
  INITIAL_CLIENTS,
  INITIAL_WEBSITES,
  INITIAL_AUDIT_RUNS,
  INITIAL_ISSUES,
  INITIAL_TASKS,
  INITIAL_KEYWORDS,
  INITIAL_CONTENT,
  INITIAL_COMPETITORS,
  INITIAL_BUSINESS_PROFILE,
  INITIAL_LEADS,
  INITIAL_REPORTS,
  INITIAL_INTEGRATIONS,
  INITIAL_WORKER_ACTIVITIES,
  INITIAL_AI_MESSAGES,
} from './mock-data';

export interface AppState {
  user: User;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  clients: ClientAccount[];
  activeClientId?: string;
  websites: Website[];
  activeWebsiteId: string;
  auditRuns: AuditRun[];
  issues: AuditIssue[];
  tasks: Task[];
  keywords: KeywordItem[];
  contentItems: ContentItem[];
  competitors: CompetitorSnapshot[];
  businessProfile: BusinessProfile;
  leads: LeadItem[];
  reports: ReportItem[];
  integrations: IntegrationStatus[];
  workerActivities: WorkerActivity[];
  aiMessages: AIMessage[];
}

const STORAGE_KEY = 'ai_seo_love_store_v1';

export function getInitialState(): AppState {
  return {
    user: INITIAL_USER,
    workspaces: INITIAL_WORKSPACES,
    activeWorkspaceId: INITIAL_WORKSPACES[0].id,
    clients: INITIAL_CLIENTS,
    websites: INITIAL_WEBSITES,
    activeWebsiteId: INITIAL_WEBSITES[0].id,
    auditRuns: INITIAL_AUDIT_RUNS,
    issues: INITIAL_ISSUES,
    tasks: INITIAL_TASKS,
    keywords: INITIAL_KEYWORDS,
    contentItems: INITIAL_CONTENT,
    competitors: INITIAL_COMPETITORS,
    businessProfile: INITIAL_BUSINESS_PROFILE,
    leads: INITIAL_LEADS,
    reports: INITIAL_REPORTS,
    integrations: INITIAL_INTEGRATIONS,
    workerActivities: INITIAL_WORKER_ACTIVITIES,
    aiMessages: INITIAL_AI_MESSAGES,
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getInitialState(),
        ...parsed,
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  const init = getInitialState();
  saveState(init);
  return init;
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('ai_seo_love_state_changed'));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

export function resetState(): AppState {
  const init = getInitialState();
  saveState(init);
  return init;
}
