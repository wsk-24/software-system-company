export type ProjectStatus =
  | "active"
  | "paused"
  | "completed"
  | "at_risk"
  | "archived";
export type SiteStatus = "live" | "staging" | "dev" | "maintenance" | "down";
export type DeployStatus =
  | "deployed"
  | "building"
  | "failed"
  | "queued"
  | "idle";
export type Priority = "critical" | "high" | "medium" | "low";
export type SiteEnv = "production" | "staging" | "development";

export type TechCategory =
  | "framework"
  | "language"
  | "database"
  | "cloud"
  | "cms"
  | "auth"
  | "payment"
  | "analytics"
  | "cdn"
  | "search"
  | "devops"
  | "monitoring"
  | "storage"
  | "email"
  | "messaging";

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
  version?: string;
  color: string;
  bg: string;
  icon: string; // emoji or short abbreviation
}

export interface Deployment {
  id: string;
  siteId: string;
  env: SiteEnv;
  status: DeployStatus;
  branch: string;
  commit: string;
  commitMsg: string;
  deployedBy: string;
  deployedAt: string;
  duration?: number; // seconds
  url?: string;
}

export interface SiteIssue {
  id: string;
  siteId: string;
  title: string;
  priority: Priority;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  assignee?: string;
}

export interface ClientSite {
  id: string;
  clientId: string;
  name: string;
  url: string;
  env: SiteEnv;
  status: SiteStatus;
  deployStatus: DeployStatus;
  techStack: TechItem[];
  lastDeploy?: string;
  uptime: number; // percent
  performance: number; // lighthouse score
  openIssues: number;
  description: string;
  region: string;
  recentDeployments: Deployment[];
}

export interface ClientContact {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface ClientProject {
  id: string;
  clientName: string;
  clientLogo: string; // initials
  clientColor: string;
  industry: string;
  country: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  progress: number;
  teamLead: string;
  teamMembers: string[];
  sites: ClientSite[];
  contacts: ClientContact[];
  description: string;
  tags: string[];
  lastActivity: string;
}

export type ViewMode = "grid" | "list";
export type ActiveView = "projects" | "sites" | "deployments";
