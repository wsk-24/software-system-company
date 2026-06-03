import type { ClientProject, TechItem } from "../types/clientProjects";

// ── Tech stack registry ───────────────────────────────────────────────────────
const T = (
  id: string,
  name: string,
  category: Parameters<typeof Object.assign>[1]["category"],
  icon: string,
  color: string,
  bg: string,
  version?: string
): TechItem => ({
  id,
  name,
  category,
  icon,
  color,
  bg,
  ...(version ? { version } : {})
});

export const techRegistry: Record<string, TechItem> = {
  // Frameworks
  nextjs: T("nextjs", "Next.js", "framework", "N", "#000000", "#F3F4F6", "14"),
  react: T("react", "React", "framework", "⚛", "#0891B2", "#CFFAFE", "18"),
  nuxtjs: T("nuxtjs", "Nuxt.js", "framework", "N", "#059669", "#D1FAE5", "3"),
  vue: T("vue", "Vue.js", "framework", "V", "#059669", "#D1FAE5", "3"),
  laravel: T(
    "laravel",
    "Laravel",
    "framework",
    "L",
    "#DC2626",
    "#FEE2E2",
    "11"
  ),
  django: T("django", "Django", "framework", "Dj", "#059669", "#D1FAE5", "5"),
  express: T("express", "Express", "framework", "Ex", "#374151", "#F3F4F6"),
  astro: T("astro", "Astro", "framework", "A", "#7C3AED", "#EDE9FE", "4"),
  wordpress: T("wordpress", "WordPress", "cms", "WP", "#2563EB", "#DBEAFE"),
  // Languages
  typescript: T(
    "typescript",
    "TypeScript",
    "language",
    "TS",
    "#2563EB",
    "#DBEAFE"
  ),
  python: T("python", "Python", "language", "Py", "#D97706", "#FEF3C7", "3.12"),
  php: T("php", "PHP", "language", "PHP", "#7C3AED", "#EDE9FE", "8.3"),
  go: T("go", "Go", "language", "Go", "#0891B2", "#CFFAFE", "1.22"),
  ruby: T("ruby", "Ruby", "language", "Rb", "#DC2626", "#FEE2E2", "3.3"),
  // Databases
  postgres: T(
    "postgres",
    "PostgreSQL",
    "database",
    "Pg",
    "#2563EB",
    "#DBEAFE",
    "16"
  ),
  mysql: T("mysql", "MySQL", "database", "My", "#D97706", "#FEF3C7", "8"),
  mongo: T("mongo", "MongoDB", "database", "Mg", "#059669", "#D1FAE5", "7"),
  redis: T("redis", "Redis", "database", "Rd", "#DC2626", "#FEE2E2", "7"),
  supabase: T("supabase", "Supabase", "database", "Sb", "#059669", "#D1FAE5"),
  planetscale: T(
    "planetscale",
    "PlanetScale",
    "database",
    "PS",
    "#111827",
    "#F3F4F6"
  ),
  // Cloud / Infra
  vercel: T("vercel", "Vercel", "cloud", "▲", "#111827", "#F3F4F6"),
  aws: T("aws", "AWS", "cloud", "⬡", "#D97706", "#FEF3C7"),
  gcp: T("gcp", "GCP", "cloud", "G", "#DC2626", "#FEE2E2"),
  digitalocean: T(
    "digitalocean",
    "DigitalOcean",
    "cloud",
    "⬟",
    "#2563EB",
    "#DBEAFE"
  ),
  cloudflare: T("cloudflare", "Cloudflare", "cdn", "⚡", "#D97706", "#FEF3C7"),
  // Auth
  clerk: T("clerk", "Clerk", "auth", "Ck", "#7C3AED", "#EDE9FE"),
  auth0: T("auth0", "Auth0", "auth", "A0", "#DC2626", "#FEE2E2"),
  // Payments
  stripe: T("stripe", "Stripe", "payment", "S", "#7C3AED", "#EDE9FE"),
  // Analytics
  ga4: T("ga4", "GA4", "analytics", "GA", "#D97706", "#FEF3C7"),
  posthog: T("posthog", "PostHog", "analytics", "Ph", "#D97706", "#FEF3C7"),
  // DevOps
  docker: T("docker", "Docker", "devops", "🐳", "#2563EB", "#DBEAFE"),
  github_actions: T(
    "github_actions",
    "GH Actions",
    "devops",
    "⚙",
    "#111827",
    "#F3F4F6"
  ),
  // Monitoring
  sentry: T("sentry", "Sentry", "monitoring", "Se", "#DC2626", "#FEE2E2"),
  datadog: T("datadog", "Datadog", "monitoring", "Dd", "#7C3AED", "#EDE9FE"),
  // Storage
  s3: T("s3", "S3", "storage", "S3", "#D97706", "#FEF3C7"),
  cloudinary: T(
    "cloudinary",
    "Cloudinary",
    "storage",
    "Cl",
    "#2563EB",
    "#DBEAFE"
  ),
  // CMS
  contentful: T("contentful", "Contentful", "cms", "Cf", "#2563EB", "#DBEAFE"),
  sanity: T("sanity", "Sanity", "cms", "Sn", "#DC2626", "#FEE2E2")
};

const tk = (...ids: string[]): TechItem[] =>
  ids.map((id) => techRegistry[id]).filter(Boolean);

// ── Projects ──────────────────────────────────────────────────────────────────
export const clientProjects: ClientProject[] = [
  {
    id: "CP001",
    clientName: "Luminary Retail",
    clientLogo: "LR",
    clientColor: "#2563EB",
    industry: "E-Commerce",
    country: "Thailand",
    status: "active",
    priority: "critical",
    startDate: "2025-11-01",
    endDate: "2026-09-30",
    budget: 2800000,
    spent: 1640000,
    progress: 62,
    teamLead: "James Decker",
    teamMembers: ["JD", "AC", "MW", "SP"],
    description:
      "Full omnichannel retail platform with 3 regional storefronts, shared inventory API, and an internal ops portal.",
    tags: ["e-commerce", "multi-region", "headless"],
    lastActivity: "2026-06-22",
    contacts: [
      {
        name: "Priya Nair",
        role: "CTO",
        email: "p.nair@luminary.co.th",
        avatar: "PN"
      },
      {
        name: "Tom Krueger",
        role: "PM",
        email: "t.krueger@luminary.co.th",
        avatar: "TK"
      }
    ],
    sites: [
      {
        id: "S001",
        clientId: "CP001",
        name: "TH Storefront",
        url: "https://th.luminaryretail.com",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "nextjs",
          "typescript",
          "postgres",
          "redis",
          "stripe",
          "cloudflare",
          "vercel",
          "sentry",
          "contentful",
          "clerk"
        ),
        lastDeploy: "2026-06-22T14:30:00Z",
        uptime: 99.98,
        performance: 94,
        openIssues: 2,
        description:
          "Main Thailand customer storefront — headless commerce with Contentful CMS",
        region: "ap-southeast-1",
        recentDeployments: [
          {
            id: "D001",
            siteId: "S001",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "a3f2c1d",
            commitMsg: "feat: add installment payment option",
            deployedBy: "MW",
            deployedAt: "2026-06-22T14:30:00Z",
            duration: 142,
            url: "https://th.luminaryretail.com"
          },
          {
            id: "D002",
            siteId: "S001",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "b9e4f2a",
            commitMsg: "fix: cart persistence on mobile",
            deployedBy: "JD",
            deployedAt: "2026-06-19T09:15:00Z",
            duration: 118,
            url: "https://th.luminaryretail.com"
          }
        ]
      },
      {
        id: "S002",
        clientId: "CP001",
        name: "SG Storefront",
        url: "https://sg.luminaryretail.com",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "nextjs",
          "typescript",
          "postgres",
          "redis",
          "stripe",
          "cloudflare",
          "vercel",
          "sentry",
          "contentful",
          "clerk"
        ),
        lastDeploy: "2026-06-20T10:00:00Z",
        uptime: 99.95,
        performance: 91,
        openIssues: 1,
        description:
          "Singapore regional storefront — same stack as TH, localised pricing & currency",
        region: "ap-southeast-1",
        recentDeployments: [
          {
            id: "D003",
            siteId: "S002",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "c7d3e9b",
            commitMsg: "chore: update SGD pricing tables",
            deployedBy: "MW",
            deployedAt: "2026-06-20T10:00:00Z",
            duration: 130,
            url: "https://sg.luminaryretail.com"
          }
        ]
      },
      {
        id: "S003",
        clientId: "CP001",
        name: "Ops Portal",
        url: "https://ops.luminaryretail.com",
        env: "production",
        status: "live",
        deployStatus: "building",
        techStack: tk(
          "react",
          "typescript",
          "supabase",
          "docker",
          "aws",
          "github_actions",
          "datadog",
          "s3"
        ),
        lastDeploy: "2026-06-21T16:00:00Z",
        uptime: 99.8,
        performance: 87,
        openIssues: 4,
        description:
          "Internal operations dashboard — inventory, orders, staff management",
        region: "ap-southeast-1",
        recentDeployments: [
          {
            id: "D004",
            siteId: "S003",
            env: "production",
            status: "building",
            branch: "release/ops-v2.3",
            commit: "e1f8a4c",
            commitMsg: "feat: bulk order processing UI",
            deployedBy: "AC",
            deployedAt: "2026-06-22T17:45:00Z",
            duration: 0
          }
        ]
      }
    ]
  },
  {
    id: "CP002",
    clientName: "Zenith Health",
    clientLogo: "ZH",
    clientColor: "#059669",
    industry: "HealthTech",
    country: "Singapore",
    status: "active",
    priority: "high",
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    budget: 3500000,
    spent: 980000,
    progress: 38,
    teamLead: "Aria Chen",
    teamMembers: ["AC", "YT", "RO"],
    description:
      "HIPAA-compliant patient portal, clinic admin system, and mobile API backend — 3 independent deployments.",
    tags: ["healthcare", "HIPAA", "mobile-api"],
    lastActivity: "2026-06-21",
    contacts: [
      {
        name: "Dr. Sarah Lin",
        role: "CTO",
        email: "s.lin@zenith.sg",
        avatar: "SL"
      }
    ],
    sites: [
      {
        id: "S004",
        clientId: "CP002",
        name: "Patient Portal",
        url: "https://portal.zenithhealth.sg",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "nextjs",
          "typescript",
          "postgres",
          "auth0",
          "aws",
          "cloudflare",
          "sentry",
          "posthog",
          "s3"
        ),
        lastDeploy: "2026-06-18T11:00:00Z",
        uptime: 99.99,
        performance: 89,
        openIssues: 1,
        description:
          "Patient-facing portal: appointments, records, telemedicine",
        region: "ap-southeast-1",
        recentDeployments: [
          {
            id: "D005",
            siteId: "S004",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "f2a9c3e",
            commitMsg: "feat: video consultation room v2",
            deployedBy: "RO",
            deployedAt: "2026-06-18T11:00:00Z",
            duration: 98
          }
        ]
      },
      {
        id: "S005",
        clientId: "CP002",
        name: "Clinic Admin",
        url: "https://admin.zenithhealth.sg",
        env: "production",
        status: "maintenance",
        deployStatus: "idle",
        techStack: tk(
          "nuxtjs",
          "typescript",
          "postgres",
          "redis",
          "auth0",
          "aws",
          "docker",
          "github_actions",
          "datadog"
        ),
        lastDeploy: "2026-06-10T08:00:00Z",
        uptime: 98.5,
        performance: 82,
        openIssues: 6,
        description:
          "Staff-facing admin: scheduling, billing, patient records management",
        region: "ap-southeast-1",
        recentDeployments: [
          {
            id: "D006",
            siteId: "S005",
            env: "staging",
            status: "deployed",
            branch: "feat/billing-v3",
            commit: "a4b7c2d",
            commitMsg: "wip: insurance billing module",
            deployedBy: "YT",
            deployedAt: "2026-06-21T14:00:00Z",
            duration: 210
          }
        ]
      },
      {
        id: "S006",
        clientId: "CP002",
        name: "Mobile API",
        url: "https://api.zenithhealth.sg",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "go",
          "postgres",
          "redis",
          "aws",
          "docker",
          "github_actions",
          "sentry",
          "datadog"
        ),
        lastDeploy: "2026-06-20T09:30:00Z",
        uptime: 99.97,
        performance: 97,
        openIssues: 0,
        description: "REST + WebSocket API powering iOS/Android patient app",
        region: "ap-southeast-1",
        recentDeployments: [
          {
            id: "D007",
            siteId: "S006",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "b3d8e1f",
            commitMsg: "perf: cache patient records endpoint",
            deployedBy: "RO",
            deployedAt: "2026-06-20T09:30:00Z",
            duration: 74
          }
        ]
      }
    ]
  },
  {
    id: "CP003",
    clientName: "Forêt Studio",
    clientLogo: "FS",
    clientColor: "#7C3AED",
    industry: "Creative Agency",
    country: "France",
    status: "active",
    priority: "medium",
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    budget: 850000,
    spent: 510000,
    progress: 71,
    teamLead: "Marcus Webb",
    teamMembers: ["MW", "SP", "LM"],
    description:
      "Agency website, portfolio CMS, and client extranet — 3 sites with distinct creative stacks.",
    tags: ["agency", "portfolio", "cms"],
    lastActivity: "2026-06-20",
    contacts: [
      {
        name: "Camille Dupont",
        role: "Director",
        email: "c.dupont@foret.studio",
        avatar: "CD"
      }
    ],
    sites: [
      {
        id: "S007",
        clientId: "CP003",
        name: "Agency Website",
        url: "https://foret.studio",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "astro",
          "typescript",
          "cloudflare",
          "cloudinary",
          "posthog",
          "sentry"
        ),
        lastDeploy: "2026-06-20T12:00:00Z",
        uptime: 99.99,
        performance: 99,
        openIssues: 0,
        description:
          "Lightning-fast marketing site built with Astro — static-first",
        region: "eu-west-1",
        recentDeployments: [
          {
            id: "D008",
            siteId: "S007",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "c9e2f4a",
            commitMsg: "content: update 2026 portfolio section",
            deployedBy: "SP",
            deployedAt: "2026-06-20T12:00:00Z",
            duration: 38
          }
        ]
      },
      {
        id: "S008",
        clientId: "CP003",
        name: "Portfolio CMS",
        url: "https://studio.foret.studio",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "nuxtjs",
          "typescript",
          "sanity",
          "cloudinary",
          "vercel",
          "posthog"
        ),
        lastDeploy: "2026-06-17T15:30:00Z",
        uptime: 99.9,
        performance: 92,
        openIssues: 1,
        description:
          "Sanity-powered portfolio with drag-and-drop case study builder",
        region: "eu-west-1",
        recentDeployments: [
          {
            id: "D009",
            siteId: "S008",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "d5a3b7c",
            commitMsg: "feat: video background support",
            deployedBy: "MW",
            deployedAt: "2026-06-17T15:30:00Z",
            duration: 95
          }
        ]
      },
      {
        id: "S009",
        clientId: "CP003",
        name: "Client Extranet",
        url: "https://clients.foret.studio",
        env: "staging",
        status: "staging",
        deployStatus: "deployed",
        techStack: tk(
          "nextjs",
          "typescript",
          "supabase",
          "clerk",
          "vercel",
          "s3"
        ),
        lastDeploy: "2026-06-19T11:00:00Z",
        uptime: 99.5,
        performance: 85,
        openIssues: 3,
        description:
          "Password-protected client portal: project updates, file sharing, approvals",
        region: "eu-west-1",
        recentDeployments: [
          {
            id: "D010",
            siteId: "S009",
            env: "staging",
            status: "deployed",
            branch: "feat/approval-flow",
            commit: "e8b2c4f",
            commitMsg: "feat: client approval workflow",
            deployedBy: "LM",
            deployedAt: "2026-06-19T11:00:00Z",
            duration: 112
          }
        ]
      }
    ]
  },
  {
    id: "CP004",
    clientName: "Ironclad Logistics",
    clientLogo: "IL",
    clientColor: "#DC2626",
    industry: "Logistics & Supply Chain",
    country: "Germany",
    status: "at_risk",
    priority: "critical",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    budget: 4200000,
    spent: 3890000,
    progress: 88,
    teamLead: "Yuki Tanaka",
    teamMembers: ["YT", "RO", "JD"],
    description:
      "Fleet tracking platform, driver mobile API, and warehouse management system — near delivery, multiple open issues.",
    tags: ["logistics", "iot", "real-time", "mobile"],
    lastActivity: "2026-06-22",
    contacts: [
      {
        name: "Klaus Fischer",
        role: "Director",
        email: "k.fischer@ironclad.de",
        avatar: "KF"
      },
      {
        name: "Anna Müller",
        role: "PM",
        email: "a.muller@ironclad.de",
        avatar: "AM"
      }
    ],
    sites: [
      {
        id: "S010",
        clientId: "CP004",
        name: "Fleet Dashboard",
        url: "https://fleet.ironclad.de",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "react",
          "typescript",
          "postgres",
          "redis",
          "aws",
          "docker",
          "github_actions",
          "sentry",
          "datadog",
          "ga4"
        ),
        lastDeploy: "2026-06-21T07:00:00Z",
        uptime: 99.85,
        performance: 78,
        openIssues: 7,
        description:
          "Real-time fleet tracking with live map, route optimisation, alerts",
        region: "eu-central-1",
        recentDeployments: [
          {
            id: "D011",
            siteId: "S010",
            env: "production",
            status: "deployed",
            branch: "hotfix/map-crash",
            commit: "f1c9d2e",
            commitMsg: "hotfix: fix map viewport crash on Firefox",
            deployedBy: "YT",
            deployedAt: "2026-06-21T07:00:00Z",
            duration: 88
          },
          {
            id: "D012",
            siteId: "S010",
            env: "production",
            status: "failed",
            branch: "release/v3.2",
            commit: "g4e7f1b",
            commitMsg: "feat: multi-depot routing",
            deployedBy: "RO",
            deployedAt: "2026-06-20T19:00:00Z",
            duration: 212
          }
        ]
      },
      {
        id: "S011",
        clientId: "CP004",
        name: "Driver API",
        url: "https://api.ironclad.de",
        env: "production",
        status: "live",
        deployStatus: "deployed",
        techStack: tk(
          "go",
          "redis",
          "postgres",
          "aws",
          "docker",
          "sentry",
          "datadog"
        ),
        lastDeploy: "2026-06-20T14:00:00Z",
        uptime: 99.96,
        performance: 96,
        openIssues: 1,
        description:
          "High-throughput REST API for the driver mobile app — location streaming",
        region: "eu-central-1",
        recentDeployments: [
          {
            id: "D013",
            siteId: "S011",
            env: "production",
            status: "deployed",
            branch: "main",
            commit: "h7b3a5c",
            commitMsg: "feat: offline sync protocol v2",
            deployedBy: "RO",
            deployedAt: "2026-06-20T14:00:00Z",
            duration: 64
          }
        ]
      },
      {
        id: "S012",
        clientId: "CP004",
        name: "WMS",
        url: "https://wms.ironclad.de",
        env: "production",
        status: "down",
        deployStatus: "failed",
        techStack: tk(
          "laravel",
          "php",
          "mysql",
          "redis",
          "aws",
          "docker",
          "sentry"
        ),
        lastDeploy: "2026-06-22T03:00:00Z",
        uptime: 94.2,
        performance: 64,
        openIssues: 12,
        description:
          "Warehouse management system — barcode scanning, stock control, dispatch",
        region: "eu-central-1",
        recentDeployments: [
          {
            id: "D014",
            siteId: "S012",
            env: "production",
            status: "failed",
            branch: "release/wms-v4",
            commit: "i2d8f3a",
            commitMsg: "feat: new barcode scanner integration",
            deployedBy: "JD",
            deployedAt: "2026-06-22T03:00:00Z",
            duration: 0
          }
        ]
      }
    ]
  },
  {
    id: "CP005",
    clientName: "Bloom EdTech",
    clientLogo: "BE",
    clientColor: "#D97706",
    industry: "Education Technology",
    country: "Australia",
    status: "active",
    priority: "medium",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    budget: 1900000,
    spent: 420000,
    progress: 24,
    teamLead: "Leo Moreau",
    teamMembers: ["LM", "AC", "MW"],
    description:
      "Learning management system, course marketplace, and an AI-powered tutoring chatbot — early build phase.",
    tags: ["edtech", "ai", "lms", "marketplace"],
    lastActivity: "2026-06-21",
    contacts: [
      {
        name: "Sophie Walsh",
        role: "CEO",
        email: "s.walsh@bloom.edu.au",
        avatar: "SW"
      }
    ],
    sites: [
      {
        id: "S013",
        clientId: "CP005",
        name: "LMS Platform",
        url: "https://app.bloomedtech.au",
        env: "development",
        status: "dev",
        deployStatus: "deployed",
        techStack: tk(
          "nextjs",
          "typescript",
          "postgres",
          "redis",
          "aws",
          "clerk",
          "stripe",
          "cloudinary",
          "sentry"
        ),
        lastDeploy: "2026-06-21T16:00:00Z",
        uptime: 99.2,
        performance: 73,
        openIssues: 8,
        description:
          "Core LMS: course builder, video hosting, assessments, certificates",
        region: "ap-southeast-2",
        recentDeployments: [
          {
            id: "D015",
            siteId: "S013",
            env: "staging",
            status: "deployed",
            branch: "feat/course-builder-v2",
            commit: "j5c4d6e",
            commitMsg: "feat: drag-and-drop lesson reordering",
            deployedBy: "LM",
            deployedAt: "2026-06-21T16:00:00Z",
            duration: 158
          }
        ]
      },
      {
        id: "S014",
        clientId: "CP005",
        name: "Course Marketplace",
        url: "https://market.bloomedtech.au",
        env: "development",
        status: "dev",
        deployStatus: "queued",
        techStack: tk(
          "nuxtjs",
          "typescript",
          "postgres",
          "stripe",
          "cloudflare",
          "sanity",
          "posthog"
        ),
        lastDeploy: "2026-06-18T10:00:00Z",
        uptime: 98.8,
        performance: 68,
        openIssues: 5,
        description: "Public marketplace for educator-created courses",
        region: "ap-southeast-2",
        recentDeployments: [
          {
            id: "D016",
            siteId: "S014",
            env: "staging",
            status: "queued",
            branch: "feat/instructor-dashboard",
            commit: "k8e2f9c",
            commitMsg: "feat: instructor earnings dashboard",
            deployedBy: "AC",
            deployedAt: "2026-06-22T18:00:00Z",
            duration: 0
          }
        ]
      },
      {
        id: "S015",
        clientId: "CP005",
        name: "AI Tutor API",
        url: "https://tutor.bloomedtech.au",
        env: "development",
        status: "dev",
        deployStatus: "idle",
        techStack: tk(
          "python",
          "django",
          "postgres",
          "redis",
          "aws",
          "docker",
          "github_actions",
          "sentry"
        ),
        lastDeploy: "2026-06-15T12:00:00Z",
        uptime: 98.0,
        performance: 81,
        openIssues: 3,
        description:
          "Python/Django API powering AI tutoring chatbot — LLM integration layer",
        region: "ap-southeast-2",
        recentDeployments: [
          {
            id: "D017",
            siteId: "S015",
            env: "development",
            status: "deployed",
            branch: "feat/rag-context",
            commit: "l3g7h1i",
            commitMsg: "feat: course-aware RAG context injection",
            deployedBy: "MW",
            deployedAt: "2026-06-15T12:00:00Z",
            duration: 185
          }
        ]
      }
    ]
  }
];

// ── Config maps ───────────────────────────────────────────────────────────────
export const projectStatusConfig = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5" },
  paused: { label: "Paused", color: "#D97706", bg: "#FEF3C7" },
  completed: { label: "Completed", color: "#2563EB", bg: "#DBEAFE" },
  at_risk: { label: "At Risk", color: "#DC2626", bg: "#FEE2E2" },
  archived: { label: "Archived", color: "#6B7280", bg: "#F3F4F6" }
};

export const siteStatusConfig = {
  live: { label: "Live", color: "#059669", bg: "#D1FAE5", dot: "#059669" },
  staging: {
    label: "Staging",
    color: "#D97706",
    bg: "#FEF3C7",
    dot: "#D97706"
  },
  dev: { label: "Dev", color: "#2563EB", bg: "#DBEAFE", dot: "#2563EB" },
  maintenance: {
    label: "Maintenance",
    color: "#7C3AED",
    bg: "#EDE9FE",
    dot: "#7C3AED"
  },
  down: { label: "Down", color: "#DC2626", bg: "#FEE2E2", dot: "#DC2626" }
};

export const deployStatusConfig = {
  deployed: { label: "Deployed", color: "#059669", bg: "#D1FAE5", icon: "✓" },
  building: { label: "Building", color: "#D97706", bg: "#FEF3C7", icon: "⟳" },
  failed: { label: "Failed", color: "#DC2626", bg: "#FEE2E2", icon: "✕" },
  queued: { label: "Queued", color: "#6B7280", bg: "#F3F4F6", icon: "…" },
  idle: { label: "Idle", color: "#9CA3AF", bg: "#F9FAFB", icon: "–" }
};

export const priorityConfig = {
  critical: { label: "Critical", color: "#DC2626", bg: "#FEE2E2" },
  high: { label: "High", color: "#D97706", bg: "#FEF3C7" },
  medium: { label: "Medium", color: "#2563EB", bg: "#DBEAFE" },
  low: { label: "Low", color: "#6B7280", bg: "#F3F4F6" }
};

export const teamAvatarColors: Record<string, string> = {
  JD: "#2563EB",
  AC: "#7C3AED",
  MW: "#059669",
  SP: "#D97706",
  LM: "#DC2626",
  YT: "#0891B2",
  RO: "#DB2777"
};

export const techCategoryConfig: Record<
  string,
  { label: string; icon: string }
> = {
  framework: { label: "Framework", icon: "⬡" },
  language: { label: "Language", icon: "{ }" },
  database: { label: "Database", icon: "⊕" },
  cloud: { label: "Cloud", icon: "☁" },
  cms: { label: "CMS", icon: "⬚" },
  auth: { label: "Auth", icon: "⦿" },
  payment: { label: "Payment", icon: "◈" },
  analytics: { label: "Analytics", icon: "◉" },
  cdn: { label: "CDN", icon: "⚡" },
  devops: { label: "DevOps", icon: "⚙" },
  monitoring: { label: "Monitor", icon: "◎" },
  storage: { label: "Storage", icon: "◱" },
  email: { label: "Email", icon: "✉" },
  messaging: { label: "Messaging", icon: "✆" },
  search: { label: "Search", icon: "⌕" }
};
