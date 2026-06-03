import type { OTRecord, OTSummary, DeptOTStat } from "../types/overtime";

export const employees = [
  { id: "E001", name: "James Decker",   avatar: "JD", dept: "Engineering",  position: "Senior Dev",       basePH: 450 },
  { id: "E002", name: "Aria Chen",      avatar: "AC", dept: "Design",        position: "UI/UX Designer",   basePH: 380 },
  { id: "E003", name: "Marcus Webb",    avatar: "MW", dept: "Engineering",   position: "Backend Dev",      basePH: 420 },
  { id: "E004", name: "Sana Patel",     avatar: "SP", dept: "Marketing",     position: "Marketing Lead",   basePH: 350 },
  { id: "E005", name: "Leo Moreau",     avatar: "LM", dept: "Product",       position: "Product Manager",  basePH: 480 },
  { id: "E006", name: "Yuki Tanaka",    avatar: "YT", dept: "Engineering",   position: "DevOps Engineer",  basePH: 430 },
  { id: "E007", name: "Rafe Okafor",    avatar: "RO", dept: "Backend",       position: "API Engineer",     basePH: 400 },
];

export const avatarColors: Record<string, string> = {
  JD: "#2563EB", AC: "#7C3AED", MW: "#059669",
  SP: "#D97706", LM: "#DC2626", YT: "#0891B2", RO: "#DB2777",
};

export const deptColors: Record<string, string> = {
  Engineering: "#2563EB", Design: "#7C3AED", Marketing: "#D97706",
  Product: "#059669", Backend: "#0891B2",
};

export const otTypeConfig = {
  weekday: { label: "Weekday OT",  color: "#2563EB", bg: "#DBEAFE",  rate: 1.5, icon: "⚡" },
  weekend: { label: "Weekend OT",  color: "#7C3AED", bg: "#EDE9FE",  rate: 2.0, icon: "📅" },
  holiday: { label: "Holiday OT",  color: "#DC2626", bg: "#FEE2E2",  rate: 3.0, icon: "🎌" },
  night:   { label: "Night Shift", color: "#0891B2", bg: "#CFFAFE",  rate: 1.75, icon: "🌙" },
};

export const statusConfig = {
  pending:  { label: "Pending",  color: "#D97706", bg: "#FEF3C7" },
  approved: { label: "Approved", color: "#059669", bg: "#D1FAE5" },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2" },
  paid:     { label: "Paid",     color: "#2563EB", bg: "#DBEAFE" },
};

export const compensationConfig = {
  cash:     { label: "Cash",     icon: "💵", color: "#059669" },
  comp_off: { label: "Comp Off", icon: "📆", color: "#7C3AED" },
  pending:  { label: "TBD",      icon: "⏳", color: "#9CA3AF" },
};

export const otRecords: OTRecord[] = [
  {
    id: "OT001", employeeId: "E003", employeeName: "Marcus Webb", employeeAvatar: "MW",
    department: "Engineering", position: "Backend Dev",
    date: "2026-06-21", dayOfWeek: "Sun", otType: "weekend",
    startTime: "09:00", endTime: "17:00", hours: 8,
    project: "Nexus Platform Rebuild", task: "API Gateway migration",
    reason: "Critical sprint deadline — API gateway must be live before Monday deploy",
    status: "approved", compensation: "cash", rate: 2.0, baseSalaryPerHour: 420,
    totalPay: 6720, approvedBy: "Sarah Kim", approvedOn: "2026-06-22",
    submittedOn: "2026-06-21", attachmentCount: 1,
  },
  {
    id: "OT002", employeeId: "E001", employeeName: "James Decker", employeeAvatar: "JD",
    department: "Engineering", position: "Senior Dev",
    date: "2026-06-19", dayOfWeek: "Fri", otType: "weekday",
    startTime: "18:00", endTime: "22:00", hours: 4,
    project: "Nexus Platform Rebuild", task: "Performance optimization",
    reason: "Production latency spike — needed immediate fix before weekend",
    status: "approved", compensation: "cash", rate: 1.5, baseSalaryPerHour: 450,
    totalPay: 2700, approvedBy: "Sarah Kim", approvedOn: "2026-06-20",
    submittedOn: "2026-06-19", attachmentCount: 2,
  },
  {
    id: "OT003", employeeId: "E006", employeeName: "Yuki Tanaka", employeeAvatar: "YT",
    department: "Engineering", position: "DevOps Engineer",
    date: "2026-06-18", dayOfWeek: "Thu", otType: "night",
    startTime: "22:00", endTime: "02:00", hours: 4,
    project: "Data Pipeline Overhaul", task: "Database migration window",
    reason: "Zero-downtime migration required off-hours execution",
    status: "paid", compensation: "cash", rate: 1.75, baseSalaryPerHour: 430,
    totalPay: 3010, approvedBy: "Sarah Kim", approvedOn: "2026-06-19",
    submittedOn: "2026-06-18",
  },
  {
    id: "OT004", employeeId: "E007", employeeName: "Rafe Okafor", employeeAvatar: "RO",
    department: "Backend", position: "API Engineer",
    date: "2026-06-15", dayOfWeek: "Mon", otType: "weekday",
    startTime: "19:00", endTime: "23:00", hours: 4,
    project: "Mobile App v4.0", task: "Push notification endpoint",
    reason: "Client demo scheduled for Tuesday morning",
    status: "approved", compensation: "comp_off", rate: 1.5, baseSalaryPerHour: 400,
    totalPay: 0, approvedBy: "Sarah Kim", approvedOn: "2026-06-16",
    submittedOn: "2026-06-15", notes: "2 comp-off days credited",
  },
  {
    id: "OT005", employeeId: "E002", employeeName: "Aria Chen", employeeAvatar: "AC",
    department: "Design", position: "UI/UX Designer",
    date: "2026-06-14", dayOfWeek: "Sun", otType: "weekend",
    startTime: "10:00", endTime: "14:00", hours: 4,
    project: "Brand Identity Refresh", task: "Logo design final revisions",
    reason: "Client requested last-minute changes for Monday board meeting",
    status: "pending", compensation: "pending", rate: 2.0, baseSalaryPerHour: 380,
    totalPay: 3040,
    submittedOn: "2026-06-14", attachmentCount: 3,
  },
  {
    id: "OT006", employeeId: "E005", employeeName: "Leo Moreau", employeeAvatar: "LM",
    department: "Product", position: "Product Manager",
    date: "2026-06-13", dayOfWeek: "Sat", otType: "weekend",
    startTime: "09:00", endTime: "13:00", hours: 4,
    project: "Q3 Roadmap Planning", task: "Stakeholder deck preparation",
    reason: "Board presentation on Monday — required full weekend prep",
    status: "pending", compensation: "comp_off", rate: 2.0, baseSalaryPerHour: 480,
    totalPay: 0,
    submittedOn: "2026-06-13",
  },
  {
    id: "OT007", employeeId: "E001", employeeName: "James Decker", employeeAvatar: "JD",
    department: "Engineering", position: "Senior Dev",
    date: "2026-06-10", dayOfWeek: "Wed", otType: "weekday",
    startTime: "20:00", endTime: "23:00", hours: 3,
    project: "Nexus Platform Rebuild", task: "Security patch deployment",
    reason: "Zero-day CVE fix — could not wait until next day",
    status: "paid", compensation: "cash", rate: 1.5, baseSalaryPerHour: 450,
    totalPay: 2025, approvedBy: "Sarah Kim", approvedOn: "2026-06-11",
    submittedOn: "2026-06-10",
  },
  {
    id: "OT008", employeeId: "E004", employeeName: "Sana Patel", employeeAvatar: "SP",
    department: "Marketing", position: "Marketing Lead",
    date: "2026-06-09", dayOfWeek: "Tue", otType: "weekday",
    startTime: "18:30", endTime: "21:30", hours: 3,
    project: "Q2 Campaign Launch", task: "Email campaign QA & deploy",
    reason: "Campaign launch tied to partner announcement",
    status: "approved", compensation: "cash", rate: 1.5, baseSalaryPerHour: 350,
    totalPay: 1575, approvedBy: "Sarah Kim", approvedOn: "2026-06-10",
    submittedOn: "2026-06-09",
  },
  {
    id: "OT009", employeeId: "E003", employeeName: "Marcus Webb", employeeAvatar: "MW",
    department: "Engineering", position: "Backend Dev",
    date: "2026-06-07", dayOfWeek: "Sun", otType: "weekend",
    startTime: "10:00", endTime: "16:00", hours: 6,
    project: "Data Pipeline Overhaul", task: "Kafka cluster configuration",
    reason: "Infrastructure work requires downtime window — weekends only",
    status: "paid", compensation: "cash", rate: 2.0, baseSalaryPerHour: 420,
    totalPay: 5040, approvedBy: "Sarah Kim", approvedOn: "2026-06-08",
    submittedOn: "2026-06-07",
  },
  {
    id: "OT010", employeeId: "E006", employeeName: "Yuki Tanaka", employeeAvatar: "YT",
    department: "Engineering", position: "DevOps Engineer",
    date: "2026-06-05", dayOfWeek: "Fri", otType: "weekday",
    startTime: "19:00", endTime: "22:00", hours: 3,
    project: "CI/CD Migration", task: "GitHub Actions rollout",
    reason: "Final pipeline switch needed before sprint closure",
    status: "rejected", compensation: "pending", rate: 1.5, baseSalaryPerHour: 430,
    totalPay: 0, approvedBy: "Sarah Kim", approvedOn: "2026-06-06",
    rejectedReason: "OT not pre-approved — please request in advance",
    submittedOn: "2026-06-05",
  },
  {
    id: "OT011", employeeId: "E007", employeeName: "Rafe Okafor", employeeAvatar: "RO",
    department: "Backend", position: "API Engineer",
    date: "2026-06-22", dayOfWeek: "Mon", otType: "weekday",
    startTime: "18:00", endTime: "21:00", hours: 3,
    project: "Mobile App v4.0", task: "OAuth 2.0 integration",
    reason: "Authentication flow blocked QA team from proceeding",
    status: "pending", compensation: "cash", rate: 1.5, baseSalaryPerHour: 400,
    totalPay: 1800,
    submittedOn: "2026-06-22",
  },
  {
    id: "OT012", employeeId: "E002", employeeName: "Aria Chen", employeeAvatar: "AC",
    department: "Design", position: "UI/UX Designer",
    date: "2026-05-30", dayOfWeek: "Sat", otType: "weekend",
    startTime: "09:00", endTime: "13:00", hours: 4,
    project: "Mobile App v4.0", task: "Onboarding screens design",
    reason: "Handoff to dev scheduled Monday AM — needed weekend finalize",
    status: "paid", compensation: "cash", rate: 2.0, baseSalaryPerHour: 380,
    totalPay: 3040, approvedBy: "Sarah Kim", approvedOn: "2026-05-31",
    submittedOn: "2026-05-30",
  },
];

export const otSummaries: OTSummary[] = [
  { employeeId: "E001", employeeName: "James Decker",  employeeAvatar: "JD", department: "Engineering", totalHours: 7,  totalPay: 4725,  approvedHours: 7,  pendingHours: 0, paidAmount: 2025, unpaidAmount: 2700, recordCount: 2, trend: "down", trendPct: 12 },
  { employeeId: "E002", employeeName: "Aria Chen",     employeeAvatar: "AC", department: "Design",       totalHours: 8,  totalPay: 6080,  approvedHours: 4,  pendingHours: 4, paidAmount: 3040, unpaidAmount: 3040, recordCount: 2, trend: "up",   trendPct: 33 },
  { employeeId: "E003", employeeName: "Marcus Webb",   employeeAvatar: "MW", department: "Engineering", totalHours: 14, totalPay: 11760, approvedHours: 8,  pendingHours: 0, paidAmount: 5040, unpaidAmount: 6720, recordCount: 2, trend: "up",   trendPct: 8  },
  { employeeId: "E004", employeeName: "Sana Patel",    employeeAvatar: "SP", department: "Marketing",   totalHours: 3,  totalPay: 1575,  approvedHours: 3,  pendingHours: 0, paidAmount: 0,    unpaidAmount: 1575, recordCount: 1, trend: "flat", trendPct: 0  },
  { employeeId: "E005", employeeName: "Leo Moreau",    employeeAvatar: "LM", department: "Product",     totalHours: 4,  totalPay: 0,     approvedHours: 0,  pendingHours: 4, paidAmount: 0,    unpaidAmount: 0,    recordCount: 1, trend: "up",   trendPct: 100 },
  { employeeId: "E006", employeeName: "Yuki Tanaka",   employeeAvatar: "YT", department: "Engineering", totalHours: 7,  totalPay: 3010,  approvedHours: 4,  pendingHours: 0, paidAmount: 3010, unpaidAmount: 0,    recordCount: 2, trend: "down", trendPct: 25 },
  { employeeId: "E007", employeeName: "Rafe Okafor",   employeeAvatar: "RO", department: "Backend",     totalHours: 7,  totalPay: 1800,  approvedHours: 4,  pendingHours: 3, paidAmount: 0,    unpaidAmount: 1800, recordCount: 2, trend: "up",   trendPct: 17 },
];

export const deptStats: DeptOTStat[] = [
  { dept: "Engineering", hours: 28, amount: 22495, color: "#2563EB" },
  { dept: "Design",      hours: 8,  amount: 6080,  color: "#7C3AED" },
  { dept: "Backend",     hours: 7,  amount: 1800,  color: "#0891B2" },
  { dept: "Marketing",   hours: 3,  amount: 1575,  color: "#D97706" },
  { dept: "Product",     hours: 4,  amount: 0,     color: "#059669" },
];

export const weeklyHours = [
  { week: "W21", hours: 18 },
  { week: "W22", hours: 24 },
  { week: "W23", hours: 12 },
  { week: "W24", hours: 31 },
  { week: "W25", hours: 28 },
  { week: "W26", hours: 50 },
];
