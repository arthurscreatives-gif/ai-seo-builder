// Type definitions for AI SEO Love

export type Role = 'Owner' | 'Administrator' | 'Team Member' | 'Client Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
}

export interface Workspace {
  id: string;
  name: string;
  type: 'agency' | 'business';
  ownerId: string;
  plan: 'Starter' | 'Growth' | 'Agency Pro';
  creditsRemaining: number;
  totalCredits: number;
  createdAt: string;
}

export interface ClientAccount {
  id: string;
  workspaceId: string;
  name: string;
  contactName: string;
  contactEmail: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  websiteCount: number;
  activeTier: string;
  createdAt: string;
}

export interface Website {
  id: string;
  workspaceId: string;
  clientId?: string;
  domain: string;
  name: string;
  businessType: string;
  targetLocation: string;
  createdAt: string;
  lastAuditDate?: string;
  auditScore?: number;
  connectedGSC: boolean;
  connectedGA4: boolean;
  crawlSettings: {
    maxPages: number;
    crawlSubdomains: boolean;
    excludedPaths: string[];
    crawlFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Manual';
  };
}

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IssueCategory = 'Crawlability' | 'On-Page SEO' | 'Headings & Content' | 'Performance & Mobile' | 'Structured Data' | 'Links';

export interface AuditIssue {
  id: string;
  runId: string;
  websiteId: string;
  title: string;
  severity: IssueSeverity;
  category: IssueCategory;
  affectedUrl: string;
  observedEvidence: string;
  detectedAt: string;
  explanation: string;
  recommendedFix: string;
  verificationMethod: string;
  taskStatus: 'unassigned' | 'created' | 'resolved';
  taskId?: string;
  isHumanJudgmentNeeded?: boolean;
}

export interface AuditRun {
  id: string;
  websiteId: string;
  url: string;
  startedAt: string;
  completedAt?: string;
  status: 'queued' | 'crawling' | 'completed' | 'failed';
  score: number;
  pagesScanned: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  passedChecksCount: number;
  crawlScope: {
    maxPages: number;
    subdomains: boolean;
  };
  metrics: {
    avgResponseTimeMs: number;
    brokenLinks: number;
    missingTitles: number;
    missingDescriptions: number;
    missingH1: number;
    missingAltText: number;
    noIndexPages: number;
    schemaDetectedPages: number;
  };
}

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Open' | 'In Progress' | 'Awaiting Review' | 'Completed' | 'Dismissed';

export interface Task {
  id: string;
  workspaceId: string;
  websiteId: string;
  issueId?: string;
  title: string;
  description: string;
  affectedUrl: string;
  priority: TaskPriority;
  category: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  supportingEvidence?: string;
  suggestedFix?: string;
  completionNotes?: string;
  dismissalReason?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type KeywordIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';

export interface KeywordItem {
  id: string;
  workspaceId: string;
  websiteId: string;
  keyword: string;
  intent: KeywordIntent;
  location: string;
  searchVolume: number | null; // null if not supplied
  difficulty: number | null; // null if not supplied
  cpc: number | null;
  trend: string | null;
  targetPage?: string;
  cluster: string;
  sourceProvider: 'Google Search Console' | 'DataForSEO' | 'Semrush' | 'AI Suggestion' | 'CSV Import';
  measuredDate?: string;
  tags: string[];
}

export type ContentStatus = 'Draft' | 'Review' | 'Approved' | 'Published';
export type ContentType = 'Blog Article' | 'Blog Post' | 'Service Page' | 'Landing Page' | 'Location Page' | 'FAQ Section' | 'Product Description' | 'Metadata Optimization';

export interface ContentItem {
  id: string;
  workspaceId: string;
  websiteId: string;
  title: string;
  contentType: ContentType;
  targetKeyword: string;
  status: ContentStatus;
  targetUrl?: string;
  assignedAuthor: string;
  assignedReviewer: string;
  targetAudience: string;
  brandVoice: string;
  brief: {
    objective: string;
    suggestedHeadings: string[];
    suggestedWordCount: number;
    keyPoints: string[];
    internalLinkIdeas: string[];
  };
  draftContent: string;
  optimizationNotes: string[];
  factualReviewNotes: string[]; // Flags claims that require confirmation
  versionHistory: {
    version: number;
    updatedAt: string;
    updatedBy: string;
    summary: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorSnapshot {
  id: string;
  workspaceId: string;
  websiteId: string;
  competitorDomain: string;
  competitorName: string;
  researchDate: string;
  sharedTopics: string[];
  contentGaps: {
    topic: string;
    competitorUrl: string;
    opportunityExplanation: string;
    estimatedValue: string;
  }[];
  observedStrengths: string[];
  observedWeaknesses: string[];
  publicCTAs: string[];
  topRankingPages: {
    title: string;
    url: string;
    primaryKeyword: string;
  }[];
}

export interface BusinessProfile {
  id: string;
  websiteId: string;
  businessName: string;
  category: string;
  primaryCategory?: string;
  address: string;
  serviceArea: string;
  phone: string;
  websiteUrl: string;
  website?: string;
  hours: string;
  services: string[];
  businessDescription: string;
  description?: string;
  socialProfiles: { platform: string; url: string }[];
  gbpConnected: boolean;
  gbpSyncStatus: 'Verified' | 'Pending Verification' | 'Not Connected';
  directoryListings: {
    directory: string;
    status: 'Consistent' | 'Mismatch' | 'Not Listed' | 'Pending';
    listedName: string;
    listedAddress: string;
    listedPhone: string;
    lastChecked: string;
  }[];
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Audit Sent' | 'Proposal' | 'Proposal Sent' | 'Won' | 'Archived';

export interface LeadItem {
  id: string;
  workspaceId: string;
  websiteId?: string;
  name: string;
  company?: string;
  website: string;
  websiteUrl?: string;
  email: string;
  phone: string;
  requestedService: string;
  source?: string;
  notes: string;
  assignedOwner: string;
  followUpDate: string;
  status: LeadStatus;
  relatedAuditId?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  workspaceId: string;
  websiteId: string;
  title: string;
  reportingPeriod: string;
  generatedAt: string;
  isScheduled: boolean;
  frequency?: 'Weekly' | 'Monthly' | 'Quarterly';
  clientViewable: boolean;
  executiveSummary: string;
  dataSources: string[];
  auditScoreChange: {
    previous: number;
    current: number;
  };
  completedTasksCount: number;
  outstandingIssuesCount: number;
  contentPiecesProduced: number;
  searchPerformanceSnapshot?: {
    totalClicks: number;
    totalImpressions: number;
    avgCTR: number;
    avgPosition: number;
  };
  keyRecommendations: string[];
  deliveryStatus: 'Ready' | 'Scheduled' | 'Sent via Email' | 'Delivered to Portal';
}

export interface IntegrationStatus {
  id: string;
  name: string;
  provider?: string;
  category: 'Search & Analytics' | 'Data Providers' | 'AI & Content' | 'Business & CMS' | 'Communication';
  status: 'Connected' | 'Not Connected' | 'Expired' | 'Error';
  lastSync?: string;
  description: string;
  supportedFeatures: string[];
  configuredAccount?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sourceReferences?: {
    type: 'audit_finding' | 'url' | 'metric' | 'research';
    label: string;
    detail: string;
  }[];
  observedFacts?: string[];
  hypotheses?: string[];
  suggestedActions?: {
    type: 'create_task' | 'create_brief' | 'run_audit' | 'view_issue';
    label: string;
    payload: any;
  }[];
  workerType?: 'Technical SEO' | 'Keyword Research' | 'Content Worker' | 'Competitor Research' | 'Local SEO';
}

export interface WorkerActivity {
  id: string;
  workerName: 'Technical SEO Worker' | 'Keyword Research Worker' | 'Content Worker' | 'Competitor Research Worker' | 'Local SEO Worker';
  taskDescription: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  sourceDataUsed: string;
  outputSummary: string;
}
