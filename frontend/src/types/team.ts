export type EmployeeStatus =
  | "active"
  | "on_leave"
  | "remote"
  | "probation"
  | "inactive";
export type EmployeeRole =
  | "admin"
  | "manager"
  | "senior"
  | "mid"
  | "junior"
  | "intern"
  | "contractor";
export type Gender = "male" | "female" | "other";
export type ContractType = "full_time" | "part_time" | "contractor" | "intern";

export interface Skill {
  name: string;
  level: number; // 1-5
  category: "tech" | "soft" | "domain";
}

export interface EmployeeStats {
  tasksCompleted: number;
  tasksTotal: number;
  overtimeHours: number;
  leaveBalance: number;
  attendanceRate: number; // percent
  performanceScore: number; // 1-100
  projectCount: number;
}

export interface ActivityLog {
  id: string;
  type: "joined" | "promoted" | "left" | "project" | "leave" | "review";
  description: string;
  date: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string; // initials
  avatarColor: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  departmentId: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  contractType: ContractType;
  gender: Gender;
  location: string;
  timezone: string;
  startDate: string;
  salary: number;
  reportsTo?: string; // employee id
  directReports: string[]; // employee ids
  skills: Skill[];
  stats: EmployeeStats;
  projects: string[];
  bio?: string;
  activityLog: ActivityLog[];
  tags: string[];
  linkedin?: string;
}

export interface Department {
  id: string;
  name: string;
  color: string;
  headId: string; // employee id
  budget: number;
  headcount: number;
  description: string;
}

export interface TeamViewMode {
  type: "grid" | "list" | "org";
}
export type ActiveTab = "overview" | "members" | "departments" | "org";

export interface AddEmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  role: EmployeeRole;
  contractType: ContractType;
  location: string;
  startDate: string;
  salary: string;
  reportsTo: string;
  bio: string;
}
