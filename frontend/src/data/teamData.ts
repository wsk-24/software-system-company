import type { Employee, Department } from "../types/team";

export const departments: Department[] = [
  {
    id: "D01",
    name: "Engineering",
    color: "#2563EB",
    headId: "E001",
    budget: 8400000,
    headcount: 12,
    description: "Full-stack product and platform engineering"
  },
  {
    id: "D02",
    name: "Design",
    color: "#7C3AED",
    headId: "E002",
    budget: 2800000,
    headcount: 5,
    description: "Product design, brand, and UX research"
  },
  {
    id: "D03",
    name: "Marketing",
    color: "#D97706",
    headId: "E004",
    budget: 3200000,
    headcount: 6,
    description: "Growth, content, and performance marketing"
  },
  {
    id: "D04",
    name: "Product",
    color: "#059669",
    headId: "E005",
    budget: 4100000,
    headcount: 4,
    description: "Product strategy and roadmap management"
  },
  {
    id: "D05",
    name: "Backend",
    color: "#0891B2",
    headId: "E007",
    budget: 5600000,
    headcount: 7,
    description: "APIs, data infrastructure, DevOps"
  },
  {
    id: "D06",
    name: "HR & People",
    color: "#DB2777",
    headId: "E012",
    budget: 1800000,
    headcount: 3,
    description: "Talent acquisition, culture and operations"
  },
  {
    id: "D07",
    name: "Finance",
    color: "#6B7280",
    headId: "E013",
    budget: 1400000,
    headcount: 3,
    description: "Accounting, payroll, and financial planning"
  }
];

export const employees: Employee[] = [
  {
    id: "E001",
    firstName: "James",
    lastName: "Decker",
    avatar: "JD",
    avatarColor: "#2563EB",
    email: "james.decker@nexus.dev",
    phone: "+66 81 234 5678",
    position: "VP of Engineering",
    department: "Engineering",
    departmentId: "D01",
    role: "admin",
    status: "active",
    contractType: "full_time",
    gender: "male",
    location: "Bangkok, Thailand",
    timezone: "ICT (UTC+7)",
    startDate: "2022-03-01",
    salary: 280000,
    directReports: ["E003", "E006", "E007"],
    skills: [
      { name: "TypeScript", level: 5, category: "tech" },
      { name: "System Design", level: 5, category: "tech" },
      { name: "Leadership", level: 5, category: "soft" },
      { name: "React", level: 4, category: "tech" },
      { name: "Go", level: 3, category: "tech" },
      { name: "Architecture", level: 5, category: "domain" }
    ],
    stats: {
      tasksCompleted: 48,
      tasksTotal: 52,
      overtimeHours: 7,
      leaveBalance: 9,
      attendanceRate: 98,
      performanceScore: 96,
      projectCount: 5
    },
    projects: ["Nexus Platform Rebuild", "Data Pipeline Overhaul"],
    bio: "10+ years building scalable systems. Former Staff Engineer at Grab. Passionate about developer experience and team culture.",
    activityLog: [
      {
        id: "a1",
        type: "promoted",
        description: "Promoted to VP of Engineering",
        date: "2024-01-15"
      },
      {
        id: "a2",
        type: "project",
        description: "Led Nexus Platform v3 launch",
        date: "2025-06-01"
      },
      {
        id: "a3",
        type: "review",
        description: "Annual performance review — Exceptional",
        date: "2025-12-01"
      }
    ],
    tags: ["leadership", "architecture", "mentoring"]
  },
  {
    id: "E002",
    firstName: "Aria",
    lastName: "Chen",
    avatar: "AC",
    avatarColor: "#7C3AED",
    email: "aria.chen@nexus.dev",
    phone: "+66 82 345 6789",
    position: "Head of Design",
    department: "Design",
    departmentId: "D02",
    role: "manager",
    status: "active",
    contractType: "full_time",
    gender: "female",
    location: "Bangkok, Thailand",
    timezone: "ICT (UTC+7)",
    startDate: "2022-07-15",
    salary: 220000,
    reportsTo: "E001",
    directReports: ["E009"],
    skills: [
      { name: "Figma", level: 5, category: "tech" },
      { name: "Design Systems", level: 5, category: "domain" },
      { name: "User Research", level: 4, category: "domain" },
      { name: "Storytelling", level: 5, category: "soft" },
      { name: "Framer", level: 4, category: "tech" },
      { name: "Brand Strategy", level: 4, category: "domain" }
    ],
    stats: {
      tasksCompleted: 62,
      tasksTotal: 67,
      overtimeHours: 8,
      leaveBalance: 7,
      attendanceRate: 97,
      performanceScore: 94,
      projectCount: 4
    },
    projects: ["Brand Identity Refresh", "Mobile App v4.0"],
    bio: "Formerly at Figma and Airbnb. Led 0-to-1 design for 3 unicorn startups. Believes great UX is invisible.",
    activityLog: [
      {
        id: "a4",
        type: "joined",
        description: "Joined as Senior Designer",
        date: "2022-07-15"
      },
      {
        id: "a5",
        type: "promoted",
        description: "Promoted to Head of Design",
        date: "2023-10-01"
      }
    ],
    tags: ["figma", "design-systems", "brand"]
  },
  {
    id: "E003",
    firstName: "Marcus",
    lastName: "Webb",
    avatar: "MW",
    avatarColor: "#059669",
    email: "marcus.webb@nexus.dev",
    phone: "+44 7700 900123",
    position: "Senior Backend Engineer",
    department: "Engineering",
    departmentId: "D01",
    role: "senior",
    status: "active",
    contractType: "full_time",
    gender: "male",
    location: "Remote — London, UK",
    timezone: "BST (UTC+1)",
    startDate: "2023-02-13",
    salary: 240000,
    reportsTo: "E001",
    directReports: [],
    skills: [
      { name: "Go", level: 5, category: "tech" },
      { name: "Kafka", level: 5, category: "tech" },
      { name: "PostgreSQL", level: 5, category: "tech" },
      { name: "Kubernetes", level: 4, category: "tech" },
      { name: "Python", level: 4, category: "tech" },
      { name: "Problem Solving", level: 5, category: "soft" }
    ],
    stats: {
      tasksCompleted: 71,
      tasksTotal: 78,
      overtimeHours: 14,
      leaveBalance: 11,
      attendanceRate: 99,
      performanceScore: 91,
      projectCount: 3
    },
    projects: ["Data Pipeline Overhaul", "Nexus Platform Rebuild"],
    bio: "Distributed systems specialist. Built real-time data pipelines handling 10M+ events/day at previous role.",
    activityLog: [
      {
        id: "a6",
        type: "joined",
        description: "Joined as Backend Engineer",
        date: "2023-02-13"
      },
      {
        id: "a7",
        type: "project",
        description: "Completed Kafka migration project",
        date: "2025-03-01"
      }
    ],
    tags: ["distributed-systems", "golang", "kafka"]
  },
  {
    id: "E004",
    firstName: "Sana",
    lastName: "Patel",
    avatar: "SP",
    avatarColor: "#D97706",
    email: "sana.patel@nexus.dev",
    phone: "+66 83 456 7890",
    position: "Marketing Lead",
    department: "Marketing",
    departmentId: "D03",
    role: "manager",
    status: "active",
    contractType: "full_time",
    gender: "female",
    location: "Bangkok, Thailand",
    timezone: "ICT (UTC+7)",
    startDate: "2023-05-01",
    salary: 180000,
    reportsTo: "E005",
    directReports: ["E010"],
    skills: [
      { name: "Growth Hacking", level: 5, category: "domain" },
      { name: "SEO/SEM", level: 4, category: "domain" },
      { name: "Analytics", level: 5, category: "tech" },
      { name: "Copywriting", level: 4, category: "soft" },
      { name: "HubSpot", level: 4, category: "tech" },
      { name: "Communication", level: 5, category: "soft" }
    ],
    stats: {
      tasksCompleted: 55,
      tasksTotal: 58,
      overtimeHours: 3,
      leaveBalance: 14,
      attendanceRate: 96,
      performanceScore: 88,
      projectCount: 2
    },
    projects: ["Q2 Campaign Launch", "Brand Identity Refresh"],
    activityLog: [
      {
        id: "a8",
        type: "joined",
        description: "Joined as Growth Manager",
        date: "2023-05-01"
      }
    ],
    tags: ["growth", "content", "seo"]
  },
  {
    id: "E005",
    firstName: "Leo",
    lastName: "Moreau",
    avatar: "LM",
    avatarColor: "#DC2626",
    email: "leo.moreau@nexus.dev",
    phone: "+33 6 12 34 56 78",
    position: "Head of Product",
    department: "Product",
    departmentId: "D04",
    role: "manager",
    status: "active",
    contractType: "full_time",
    gender: "male",
    location: "Remote — Paris, France",
    timezone: "CEST (UTC+2)",
    startDate: "2023-08-21",
    salary: 260000,
    reportsTo: "E001",
    directReports: ["E004"],
    skills: [
      { name: "Product Strategy", level: 5, category: "domain" },
      { name: "Roadmapping", level: 5, category: "domain" },
      { name: "Data Analysis", level: 4, category: "tech" },
      { name: "Stakeholder Mgmt", level: 5, category: "soft" },
      { name: "Agile / Scrum", level: 5, category: "domain" },
      { name: "OKR Frameworks", level: 4, category: "domain" }
    ],
    stats: {
      tasksCompleted: 39,
      tasksTotal: 42,
      overtimeHours: 4,
      leaveBalance: 6,
      attendanceRate: 97,
      performanceScore: 90,
      projectCount: 4
    },
    projects: ["Nexus Platform Rebuild", "Q3 Roadmap Planning"],
    bio: "Former Senior PM at Spotify. Built product teams from 2 to 30 people. Believer in ruthless prioritization.",
    activityLog: [
      {
        id: "a9",
        type: "joined",
        description: "Joined as Product Manager",
        date: "2023-08-21"
      }
    ],
    tags: ["strategy", "okr", "agile"]
  },
  {
    id: "E006",
    firstName: "Yuki",
    lastName: "Tanaka",
    avatar: "YT",
    avatarColor: "#0891B2",
    email: "yuki.tanaka@nexus.dev",
    phone: "+81 90 1234 5678",
    position: "DevOps Engineer",
    department: "Engineering",
    departmentId: "D01",
    role: "senior",
    status: "active",
    contractType: "full_time",
    gender: "female",
    location: "Remote — Tokyo, Japan",
    timezone: "JST (UTC+9)",
    startDate: "2023-11-06",
    salary: 230000,
    reportsTo: "E001",
    directReports: [],
    skills: [
      { name: "Kubernetes", level: 5, category: "tech" },
      { name: "Terraform", level: 5, category: "tech" },
      { name: "AWS", level: 5, category: "tech" },
      { name: "CI/CD", level: 5, category: "tech" },
      { name: "Python", level: 4, category: "tech" },
      { name: "Linux", level: 5, category: "tech" }
    ],
    stats: {
      tasksCompleted: 44,
      tasksTotal: 46,
      overtimeHours: 7,
      leaveBalance: 13,
      attendanceRate: 100,
      performanceScore: 93,
      projectCount: 3
    },
    projects: ["CI/CD Migration", "Data Pipeline Overhaul"],
    bio: "SRE background from AWS Japan. Zero-downtime deployments enthusiast. Maintains 99.99% uptime on all services.",
    activityLog: [
      {
        id: "a10",
        type: "joined",
        description: "Joined as DevOps Engineer",
        date: "2023-11-06"
      },
      {
        id: "a11",
        type: "project",
        description: "Led GitHub Actions migration",
        date: "2026-05-01"
      }
    ],
    tags: ["sre", "infrastructure", "automation"]
  },
  {
    id: "E007",
    firstName: "Rafe",
    lastName: "Okafor",
    avatar: "RO",
    avatarColor: "#DB2777",
    email: "rafe.okafor@nexus.dev",
    phone: "+234 80 1234 5678",
    position: "API Engineer & Tech Lead",
    department: "Backend",
    departmentId: "D05",
    role: "senior",
    status: "active",
    contractType: "full_time",
    gender: "male",
    location: "Remote — Lagos, Nigeria",
    timezone: "WAT (UTC+1)",
    startDate: "2024-01-15",
    salary: 210000,
    reportsTo: "E001",
    directReports: ["E008"],
    skills: [
      { name: "REST API Design", level: 5, category: "domain" },
      { name: "Node.js", level: 5, category: "tech" },
      { name: "GraphQL", level: 4, category: "tech" },
      { name: "PostgreSQL", level: 4, category: "tech" },
      { name: "Redis", level: 4, category: "tech" },
      { name: "Mentoring", level: 4, category: "soft" }
    ],
    stats: {
      tasksCompleted: 58,
      tasksTotal: 63,
      overtimeHours: 7,
      leaveBalance: 8,
      attendanceRate: 98,
      performanceScore: 89,
      projectCount: 3
    },
    projects: ["Mobile App v4.0", "Nexus Platform Rebuild"],
    activityLog: [
      {
        id: "a12",
        type: "joined",
        description: "Joined as API Engineer",
        date: "2024-01-15"
      }
    ],
    tags: ["api-design", "nodejs", "graphql"]
  },
  {
    id: "E008",
    firstName: "Priya",
    lastName: "Sharma",
    avatar: "PS",
    avatarColor: "#4F46E5",
    email: "priya.sharma@nexus.dev",
    phone: "+91 98 1234 5678",
    position: "Backend Engineer",
    department: "Backend",
    departmentId: "D05",
    role: "mid",
    status: "active",
    contractType: "full_time",
    gender: "female",
    location: "Remote — Bangalore, India",
    timezone: "IST (UTC+5:30)",
    startDate: "2024-06-03",
    salary: 165000,
    reportsTo: "E007",
    directReports: [],
    skills: [
      { name: "Python", level: 4, category: "tech" },
      { name: "FastAPI", level: 4, category: "tech" },
      { name: "PostgreSQL", level: 3, category: "tech" },
      { name: "Docker", level: 3, category: "tech" },
      { name: "Collaboration", level: 5, category: "soft" }
    ],
    stats: {
      tasksCompleted: 38,
      tasksTotal: 44,
      overtimeHours: 2,
      leaveBalance: 16,
      attendanceRate: 97,
      performanceScore: 82,
      projectCount: 2
    },
    projects: ["Mobile App v4.0"],
    activityLog: [
      {
        id: "a13",
        type: "joined",
        description: "Joined as Junior Backend Engineer",
        date: "2024-06-03"
      },
      {
        id: "a14",
        type: "promoted",
        description: "Promoted to Backend Engineer",
        date: "2025-06-03"
      }
    ],
    tags: ["python", "fastapi", "backend"]
  },
  {
    id: "E009",
    firstName: "Mia",
    lastName: "Laurent",
    avatar: "ML",
    avatarColor: "#EC4899",
    email: "mia.laurent@nexus.dev",
    phone: "+33 6 98 76 54 32",
    position: "UX Designer",
    department: "Design",
    departmentId: "D02",
    role: "mid",
    status: "on_leave",
    contractType: "full_time",
    gender: "female",
    location: "Remote — Lyon, France",
    timezone: "CEST (UTC+2)",
    startDate: "2024-09-02",
    salary: 155000,
    reportsTo: "E002",
    directReports: [],
    skills: [
      { name: "Figma", level: 4, category: "tech" },
      { name: "User Research", level: 4, category: "domain" },
      { name: "Prototyping", level: 4, category: "tech" },
      { name: "Empathy", level: 5, category: "soft" }
    ],
    stats: {
      tasksCompleted: 29,
      tasksTotal: 35,
      overtimeHours: 4,
      leaveBalance: 4,
      attendanceRate: 93,
      performanceScore: 80,
      projectCount: 2
    },
    projects: ["Brand Identity Refresh"],
    activityLog: [
      {
        id: "a15",
        type: "joined",
        description: "Joined as UX Designer",
        date: "2024-09-02"
      }
    ],
    tags: ["ux", "research", "figma"]
  },
  {
    id: "E010",
    firstName: "Daniel",
    lastName: "Park",
    avatar: "DP",
    avatarColor: "#F59E0B",
    email: "daniel.park@nexus.dev",
    phone: "+82 10 1234 5678",
    position: "Content Strategist",
    department: "Marketing",
    departmentId: "D03",
    role: "junior",
    status: "active",
    contractType: "full_time",
    gender: "male",
    location: "Remote — Seoul, South Korea",
    timezone: "KST (UTC+9)",
    startDate: "2025-01-13",
    salary: 110000,
    reportsTo: "E004",
    directReports: [],
    skills: [
      { name: "Copywriting", level: 4, category: "soft" },
      { name: "SEO", level: 3, category: "domain" },
      { name: "Social Media", level: 4, category: "domain" },
      { name: "Analytics", level: 3, category: "tech" }
    ],
    stats: {
      tasksCompleted: 51,
      tasksTotal: 56,
      overtimeHours: 0,
      leaveBalance: 18,
      attendanceRate: 99,
      performanceScore: 77,
      projectCount: 1
    },
    projects: ["Q2 Campaign Launch"],
    activityLog: [
      {
        id: "a16",
        type: "joined",
        description: "Joined as Content Strategist",
        date: "2025-01-13"
      }
    ],
    tags: ["content", "seo", "social"]
  },
  {
    id: "E011",
    firstName: "Tomás",
    lastName: "Rivera",
    avatar: "TR",
    avatarColor: "#10B981",
    email: "tomas.rivera@nexus.dev",
    phone: "+52 55 1234 5678",
    position: "Frontend Engineer",
    department: "Engineering",
    departmentId: "D01",
    role: "mid",
    status: "probation",
    contractType: "full_time",
    gender: "male",
    location: "Remote — Mexico City, Mexico",
    timezone: "CST (UTC−6)",
    startDate: "2026-04-01",
    salary: 150000,
    reportsTo: "E001",
    directReports: [],
    skills: [
      { name: "React", level: 4, category: "tech" },
      { name: "TypeScript", level: 3, category: "tech" },
      { name: "CSS", level: 4, category: "tech" },
      { name: "Testing", level: 3, category: "tech" }
    ],
    stats: {
      tasksCompleted: 18,
      tasksTotal: 24,
      overtimeHours: 0,
      leaveBalance: 20,
      attendanceRate: 96,
      performanceScore: 71,
      projectCount: 1
    },
    projects: ["Nexus Platform Rebuild"],
    activityLog: [
      {
        id: "a17",
        type: "joined",
        description: "Joined — on probation period",
        date: "2026-04-01"
      }
    ],
    tags: ["react", "frontend", "new-hire"]
  },
  {
    id: "E012",
    firstName: "Sarah",
    lastName: "Kim",
    avatar: "SK",
    avatarColor: "#8B5CF6",
    email: "sarah.kim@nexus.dev",
    phone: "+66 84 567 8901",
    position: "People & Culture Manager",
    department: "HR & People",
    departmentId: "D06",
    role: "manager",
    status: "active",
    contractType: "full_time",
    gender: "female",
    location: "Bangkok, Thailand",
    timezone: "ICT (UTC+7)",
    startDate: "2022-10-10",
    salary: 190000,
    reportsTo: "E001",
    directReports: [],
    skills: [
      { name: "Talent Acquisition", level: 5, category: "domain" },
      { name: "Culture Building", level: 5, category: "domain" },
      { name: "Conflict Resolution", level: 5, category: "soft" },
      { name: "HR Systems", level: 4, category: "tech" },
      { name: "Training & Dev", level: 4, category: "domain" }
    ],
    stats: {
      tasksCompleted: 66,
      tasksTotal: 70,
      overtimeHours: 1,
      leaveBalance: 10,
      attendanceRate: 99,
      performanceScore: 92,
      projectCount: 1
    },
    projects: ["Team Expansion Q2"],
    bio: "10 years in People Ops across startups and scale-ups. Hired 200+ engineers. Passionate about remote culture.",
    activityLog: [
      {
        id: "a18",
        type: "joined",
        description: "Joined as HR Manager",
        date: "2022-10-10"
      },
      {
        id: "a19",
        type: "promoted",
        description: "Promoted to People & Culture Manager",
        date: "2024-04-01"
      }
    ],
    tags: ["hr", "culture", "hiring"]
  },
  {
    id: "E013",
    firstName: "Oliver",
    lastName: "Nguyen",
    avatar: "ON",
    avatarColor: "#6366F1",
    email: "oliver.nguyen@nexus.dev",
    phone: "+66 85 678 9012",
    position: "Finance Controller",
    department: "Finance",
    departmentId: "D07",
    role: "senior",
    status: "active",
    contractType: "full_time",
    gender: "male",
    location: "Bangkok, Thailand",
    timezone: "ICT (UTC+7)",
    startDate: "2023-03-20",
    salary: 200000,
    reportsTo: "E001",
    directReports: [],
    skills: [
      { name: "Financial Modeling", level: 5, category: "domain" },
      { name: "Excel / Sheets", level: 5, category: "tech" },
      { name: "GAAP", level: 5, category: "domain" },
      { name: "Payroll Systems", level: 4, category: "tech" },
      { name: "Attention to Detail", level: 5, category: "soft" }
    ],
    stats: {
      tasksCompleted: 72,
      tasksTotal: 74,
      overtimeHours: 0,
      leaveBalance: 12,
      attendanceRate: 100,
      performanceScore: 91,
      projectCount: 0
    },
    projects: [],
    activityLog: [
      {
        id: "a20",
        type: "joined",
        description: "Joined as Finance Controller",
        date: "2023-03-20"
      }
    ],
    tags: ["finance", "payroll", "reporting"]
  }
];

// ── Config ────────────────────────────────────────────────────────────────────
export const statusConfig = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5", dot: "#059669" },
  on_leave: {
    label: "On Leave",
    color: "#D97706",
    bg: "#FEF3C7",
    dot: "#D97706"
  },
  remote: { label: "Remote", color: "#2563EB", bg: "#DBEAFE", dot: "#2563EB" },
  probation: {
    label: "Probation",
    color: "#7C3AED",
    bg: "#EDE9FE",
    dot: "#7C3AED"
  },
  inactive: {
    label: "Inactive",
    color: "#6B7280",
    bg: "#F3F4F6",
    dot: "#9CA3AF"
  }
};

export const roleConfig = {
  admin: { label: "Admin", color: "#111827", bg: "#F3F4F6" },
  manager: { label: "Manager", color: "#7C3AED", bg: "#EDE9FE" },
  senior: { label: "Senior", color: "#059669", bg: "#D1FAE5" },
  mid: { label: "Mid-level", color: "#2563EB", bg: "#DBEAFE" },
  junior: { label: "Junior", color: "#D97706", bg: "#FEF3C7" },
  intern: { label: "Intern", color: "#6B7280", bg: "#F3F4F6" },
  contractor: { label: "Contractor", color: "#0891B2", bg: "#CFFAFE" }
};

export const contractConfig = {
  full_time: { label: "Full-time", icon: "◉" },
  part_time: { label: "Part-time", icon: "◎" },
  contractor: { label: "Contractor", icon: "◈" },
  intern: { label: "Intern", icon: "◷" }
};

export const skillLevelLabel = [
  "",
  "Beginner",
  "Basic",
  "Intermediate",
  "Advanced",
  "Expert"
];
export const skillCategoryColor = {
  tech: "#2563EB",
  soft: "#059669",
  domain: "#7C3AED"
};
