import type {
  MetricCard,
  DataPoint,
  ChartSeries,
  FunnelStep,
  TopItem,
  HeatmapCell,
  GoalProgress
} from "../types/analytics";

// ── Date labels ───────────────────────────────────────────────────────────────
export const labels30d = [
  "Jun 1",
  "Jun 3",
  "Jun 5",
  "Jun 7",
  "Jun 9",
  "Jun 11",
  "Jun 13",
  "Jun 15",
  "Jun 17",
  "Jun 19",
  "Jun 21",
  "Jun 23",
  "Jun 25",
  "Jun 27",
  "Jun 29",
  "Jun 30"
];
export const labels12m = [
  "Jul 25",
  "Aug 25",
  "Sep 25",
  "Oct 25",
  "Nov 25",
  "Dec 25",
  "Jan 26",
  "Feb 26",
  "Mar 26",
  "Apr 26",
  "May 26",
  "Jun 26"
];
export const labels7d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── KPI cards ─────────────────────────────────────────────────────────────────
export const metricCards: MetricCard[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "฿8.47M",
    rawValue: 8470000,
    delta: 18.4,
    deltaLabel: "vs last month",
    icon: "💰",
    color: "#2563EB",
    bg: "#DBEAFE",
    sparkline: [310, 340, 290, 380, 420, 390, 450, 510, 480, 560, 590, 640],
    category: "revenue",
    format: "currency"
  },
  {
    id: "users",
    title: "Active Users",
    value: "48,291",
    rawValue: 48291,
    delta: 12.7,
    deltaLabel: "vs last month",
    icon: "👤",
    color: "#059669",
    bg: "#D1FAE5",
    sparkline: [
      3200, 3600, 3400, 4100, 4600, 4300, 4900, 5300, 5000, 5800, 6100, 6400
    ],
    category: "users",
    format: "number"
  },
  {
    id: "conversion",
    title: "Conversion Rate",
    value: "5.73%",
    rawValue: 5.73,
    delta: 0.8,
    deltaLabel: "vs last month",
    icon: "◈",
    color: "#7C3AED",
    bg: "#EDE9FE",
    sparkline: [4.1, 4.4, 4.2, 4.8, 5.1, 4.9, 5.4, 5.6, 5.3, 5.7, 5.5, 5.7],
    category: "users",
    format: "percent"
  },
  {
    id: "avg_order",
    title: "Avg Order Value",
    value: "฿2,840",
    rawValue: 2840,
    delta: -3.2,
    deltaLabel: "vs last month",
    icon: "🛒",
    color: "#D97706",
    bg: "#FEF3C7",
    sparkline: [
      3100, 2900, 2800, 3000, 2850, 2700, 2900, 2800, 2750, 2820, 2810, 2840
    ],
    category: "revenue",
    format: "currency"
  },
  {
    id: "sessions",
    title: "Total Sessions",
    value: "312,840",
    rawValue: 312840,
    delta: 9.1,
    deltaLabel: "vs last month",
    icon: "⚡",
    color: "#0891B2",
    bg: "#CFFAFE",
    sparkline: [
      22000, 24000, 21000, 26000, 28000, 25000, 29000, 31000, 28000, 33000,
      35000, 32000
    ],
    category: "acquisition",
    format: "number"
  },
  {
    id: "bounce",
    title: "Bounce Rate",
    value: "38.2%",
    rawValue: 38.2,
    delta: -2.1,
    deltaLabel: "vs last month (lower = better)",
    icon: "↩",
    color: "#DC2626",
    bg: "#FEE2E2",
    sparkline: [44, 42, 43, 41, 40, 38, 39, 37, 38, 36, 37, 38],
    category: "performance",
    format: "percent"
  }
];

// ── Revenue chart (12 months) ─────────────────────────────────────────────────
export const revenueChartSeries: ChartSeries[] = [
  {
    id: "revenue",
    label: "Revenue",
    color: "#2563EB",
    data: [
      480000, 520000, 490000, 580000, 640000, 610000, 710000, 750000, 720000,
      820000, 890000, 847000
    ]
  },
  {
    id: "target",
    label: "Target",
    color: "#E5E7EB",
    data: [
      500000, 540000, 510000, 600000, 660000, 630000, 730000, 780000, 750000,
      850000, 920000, 900000
    ]
  }
];

// ── Users over time ───────────────────────────────────────────────────────────
export const usersChartSeries: ChartSeries[] = [
  {
    id: "new",
    label: "New Users",
    color: "#059669",
    data: [
      1800, 2100, 1900, 2400, 2700, 2500, 2900, 3200, 2800, 3500, 3900, 4100
    ]
  },
  {
    id: "returning",
    label: "Returning",
    color: "#A7F3D0",
    data: [
      1400, 1500, 1500, 1700, 1900, 1800, 2000, 2100, 2200, 2300, 2200, 2300
    ]
  }
];

// ── Traffic by device ─────────────────────────────────────────────────────────
export const deviceData: DataPoint[] = [
  { label: "Mobile", value: 56.3 },
  { label: "Desktop", value: 34.1 },
  { label: "Tablet", value: 9.6 }
];

// ── Traffic sources ───────────────────────────────────────────────────────────
export const sourceData: DataPoint[] = [
  { label: "Organic Search", value: 41.2 },
  { label: "Direct", value: 22.4 },
  { label: "Social Media", value: 17.8 },
  { label: "Email", value: 11.6 },
  { label: "Referral", value: 7.0 }
];

// ── Funnel ────────────────────────────────────────────────────────────────────
export const funnelSteps: FunnelStep[] = [
  { label: "Page Views", value: 312840, pct: 100, color: "#2563EB" },
  { label: "Sign-ups", value: 18742, pct: 5.99, color: "#7C3AED" },
  { label: "Free Trial", value: 9124, pct: 2.92, color: "#059669" },
  { label: "Subscription", value: 2614, pct: 0.84, color: "#D97706" },
  { label: "Annual Plan", value: 884, pct: 0.28, color: "#DC2626" }
];

// ── Top pages ─────────────────────────────────────────────────────────────────
export const topPages: TopItem[] = [
  {
    rank: 1,
    label: "/dashboard",
    sub: "Main dashboard",
    value: 48290,
    pct: 15.4,
    delta: 8.2
  },
  {
    rank: 2,
    label: "/pricing",
    sub: "Pricing page",
    value: 38140,
    pct: 12.2,
    delta: 24.1
  },
  {
    rank: 3,
    label: "/features",
    sub: "Features overview",
    value: 29810,
    pct: 9.5,
    delta: 3.7
  },
  {
    rank: 4,
    label: "/blog/ai-trends",
    sub: "Blog article",
    value: 24320,
    pct: 7.8,
    delta: 61.3
  },
  {
    rank: 5,
    label: "/signup",
    sub: "Registration page",
    value: 18742,
    pct: 6.0,
    delta: 12.4
  },
  {
    rank: 6,
    label: "/integrations",
    sub: "Integration catalog",
    value: 14590,
    pct: 4.7,
    delta: -5.1
  },
  {
    rank: 7,
    label: "/docs",
    sub: "Documentation root",
    value: 12140,
    pct: 3.9,
    delta: 2.8
  }
];

// ── Top countries ─────────────────────────────────────────────────────────────
export const topCountries: TopItem[] = [
  {
    rank: 1,
    label: "Thailand",
    value: 12840,
    pct: 26.6,
    delta: 14.2,
    flag: "🇹🇭"
  },
  {
    rank: 2,
    label: "Singapore",
    value: 8210,
    pct: 17.0,
    delta: 8.6,
    flag: "🇸🇬"
  },
  {
    rank: 3,
    label: "United States",
    value: 6940,
    pct: 14.4,
    delta: 22.4,
    flag: "🇺🇸"
  },
  {
    rank: 4,
    label: "Germany",
    value: 4820,
    pct: 10.0,
    delta: -3.1,
    flag: "🇩🇪"
  },
  { rank: 5, label: "Japan", value: 3680, pct: 7.6, delta: 31.8, flag: "🇯🇵" },
  {
    rank: 6,
    label: "Australia",
    value: 2940,
    pct: 6.1,
    delta: 11.5,
    flag: "🇦🇺"
  },
  { rank: 7, label: "France", value: 2310, pct: 4.8, delta: -1.8, flag: "🇫🇷" }
];

// ── Heatmap (24h × 7 days) ────────────────────────────────────────────────────
export const heatmapData: HeatmapCell[] = (() => {
  const cells: HeatmapCell[] = [];
  // day 0=Mon, hour 0-23
  const peak = [
    [0, 9],
    [0, 10],
    [0, 14],
    [0, 15],
    [1, 10],
    [1, 11],
    [1, 14],
    [2, 9],
    [2, 10],
    [2, 11],
    [2, 14],
    [2, 15],
    [3, 10],
    [3, 11],
    [3, 14],
    [3, 15],
    [4, 9],
    [4, 10]
  ];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let base = 200;
      if (h >= 22 || h <= 5) base = 40;
      else if (h >= 6 && h <= 8) base = 120;
      else if (h >= 9 && h <= 11) base = 520;
      else if (h >= 12 && h <= 13) base = 300;
      else if (h >= 14 && h <= 16) base = 480;
      else if (h >= 17 && h <= 18) base = 260;
      else if (h >= 19 && h <= 21) base = 180;
      if (d >= 5) base = Math.floor(base * 0.35);
      const jitter = Math.floor(Math.random() * 80) - 40;
      cells.push({ day: d, hour: h, value: Math.max(0, base + jitter) });
    }
  }
  return cells;
})();

// ── Goals ─────────────────────────────────────────────────────────────────────
export const goals: GoalProgress[] = [
  {
    id: "g1",
    label: "Monthly Revenue",
    current: 8470000,
    target: 10000000,
    color: "#2563EB",
    unit: "฿",
    deadline: "Jun 30"
  },
  {
    id: "g2",
    label: "New Signups",
    current: 18742,
    target: 25000,
    color: "#059669",
    unit: "",
    deadline: "Jun 30"
  },
  {
    id: "g3",
    label: "NPS Score",
    current: 68,
    target: 75,
    color: "#7C3AED",
    unit: "",
    deadline: "Q3 2026"
  },
  {
    id: "g4",
    label: "Churn Rate",
    current: 3.2,
    target: 2.5,
    color: "#D97706",
    unit: "%",
    deadline: "Q3 2026"
  }
];

// ── Revenue breakdown ─────────────────────────────────────────────────────────
export const revenueBreakdown: DataPoint[] = [
  { label: "Subscriptions", value: 5840000 },
  { label: "One-time", value: 1620000 },
  { label: "Enterprise", value: 810000 },
  { label: "Add-ons", value: 200000 }
];

// ── Real-time mini stream ─────────────────────────────────────────────────────
export const realtimeEvents = [
  {
    type: "signup",
    label: "New signup",
    sub: "priya.s@…",
    time: "now",
    icon: "👤",
    color: "#059669"
  },
  {
    type: "purchase",
    label: "Purchase ฿4,200",
    sub: "Bangkok, TH",
    time: "1m",
    icon: "💰",
    color: "#2563EB"
  },
  {
    type: "upgrade",
    label: "Plan upgraded",
    sub: "Starter → Pro",
    time: "3m",
    icon: "⬆",
    color: "#7C3AED"
  },
  {
    type: "purchase",
    label: "Purchase ฿1,800",
    sub: "Singapore",
    time: "5m",
    icon: "💰",
    color: "#2563EB"
  },
  {
    type: "signup",
    label: "New signup",
    sub: "leo.m@…",
    time: "7m",
    icon: "👤",
    color: "#059669"
  },
  {
    type: "refund",
    label: "Refund ฿850",
    sub: "Tokyo, JP",
    time: "11m",
    icon: "↩",
    color: "#DC2626"
  },
  {
    type: "purchase",
    label: "Purchase ฿9,600",
    sub: "Berlin, DE",
    time: "14m",
    icon: "💰",
    color: "#2563EB"
  }
];

// ── Cohort retention (6 cohorts × 6 periods) ─────────────────────────────────
export const cohortData = [
  { cohort: "Jan 26", periods: [100, 62, 48, 41, 38, 36] },
  { cohort: "Feb 26", periods: [100, 65, 51, 44, 40, 0] },
  { cohort: "Mar 26", periods: [100, 68, 54, 47, 0, 0] },
  { cohort: "Apr 26", periods: [100, 71, 57, 0, 0, 0] },
  { cohort: "May 26", periods: [100, 74, 0, 0, 0, 0] },
  { cohort: "Jun 26", periods: [100, 0, 0, 0, 0, 0] }
];
