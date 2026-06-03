import type { Conversation, Participant } from "../types/messages";

export const ME: Participant = {
  id: "E001",
  name: "James Decker",
  avatar: "JD",
  avatarColor: "#2563EB",
  role: "VP of Engineering",
  presence: "online"
};

export const contacts: Participant[] = [
  {
    id: "E002",
    name: "Aria Chen",
    avatar: "AC",
    avatarColor: "#7C3AED",
    role: "Head of Design",
    presence: "online"
  },
  {
    id: "E003",
    name: "Marcus Webb",
    avatar: "MW",
    avatarColor: "#059669",
    role: "Senior Backend Engineer",
    presence: "online"
  },
  {
    id: "E004",
    name: "Sana Patel",
    avatar: "SP",
    avatarColor: "#D97706",
    role: "Marketing Lead",
    presence: "away"
  },
  {
    id: "E005",
    name: "Leo Moreau",
    avatar: "LM",
    avatarColor: "#DC2626",
    role: "Head of Product",
    presence: "busy"
  },
  {
    id: "E006",
    name: "Yuki Tanaka",
    avatar: "YT",
    avatarColor: "#0891B2",
    role: "DevOps Engineer",
    presence: "online"
  },
  {
    id: "E007",
    name: "Rafe Okafor",
    avatar: "RO",
    avatarColor: "#DB2777",
    role: "API Engineer",
    presence: "offline"
  },
  {
    id: "E012",
    name: "Sarah Kim",
    avatar: "SK",
    avatarColor: "#8B5CF6",
    role: "People & Culture",
    presence: "online"
  }
];

const t = (minutesAgo: number) => {
  const d = new Date(Date.now() - minutesAgo * 60_000);
  return d.toISOString();
};

export const conversations: Conversation[] = [
  // ── 1. Direct: Aria Chen ──────────────────────────────────────────────────
  {
    id: "C001",
    type: "direct",
    participants: [ME, contacts[0]],
    pinned: true,
    muted: false,
    unread: 0,
    lastActivity: t(2),
    messages: [
      {
        id: "M001",
        convoId: "C001",
        senderId: "E002",
        text: "Hey James 👋 do you have a few mins to review the new onboarding designs?",
        timestamp: t(62),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M002",
        convoId: "C001",
        senderId: "E001",
        text: "Sure! Send it over",
        timestamp: t(58),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M003",
        convoId: "C001",
        senderId: "E002",
        text: "Here's the Figma link — I've finished the 5 core screens",
        timestamp: t(55),
        status: "read",
        reactions: [{ emoji: "👍", count: 1, byMe: true }],
        attachments: []
      },
      {
        id: "M004",
        convoId: "C001",
        senderId: "E001",
        text: "Just had a look — the empty state on screen 3 feels a bit cluttered. Can we simplify the CTA hierarchy?",
        timestamp: t(40),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M005",
        convoId: "C001",
        senderId: "E002",
        text: "Totally agree. I'll reduce it to one primary action and push the secondary below the fold.",
        timestamp: t(35),
        status: "read",
        reactions: [{ emoji: "🔥", count: 1, byMe: false }],
        attachments: []
      },
      {
        id: "M006",
        convoId: "C001",
        senderId: "E002",
        text: "Updated! Let me know if this version works better",
        timestamp: t(20),
        status: "read",
        reactions: [],
        attachments: [
          {
            id: "A001",
            name: "onboarding-v4.fig",
            size: "3.2 MB",
            type: "other"
          }
        ]
      },
      {
        id: "M007",
        convoId: "C001",
        senderId: "E001",
        text: "This looks great! Approving for dev handoff 🙌",
        timestamp: t(10),
        status: "read",
        reactions: [{ emoji: "❤️", count: 1, byMe: false }],
        attachments: []
      },
      {
        id: "M008",
        convoId: "C001",
        senderId: "E002",
        text: "Amazing, I'll prepare the spec sheet and share with Marcus by EOD",
        timestamp: t(2),
        status: "delivered",
        reactions: [],
        attachments: []
      }
    ]
  },
  // ── 2. Direct: Marcus Webb ───────────────────────────────────────────────
  {
    id: "C002",
    type: "direct",
    participants: [ME, contacts[1]],
    pinned: true,
    muted: false,
    unread: 3,
    lastActivity: t(8),
    messages: [
      {
        id: "M010",
        convoId: "C002",
        senderId: "E003",
        text: "James, the Kafka migration is done ✅ — all 12 consumers migrated, latency dropped by 38%",
        timestamp: t(90),
        status: "read",
        reactions: [{ emoji: "🔥", count: 1, byMe: true }],
        attachments: []
      },
      {
        id: "M011",
        convoId: "C002",
        senderId: "E001",
        text: "That's a huge win 🎉 Did the dead letter queue issue get resolved too?",
        timestamp: t(85),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M012",
        convoId: "C002",
        senderId: "E003",
        text: "Yes, implemented a retry policy with exponential backoff. Haven't seen a single DLQ message in 6 hours",
        timestamp: t(82),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M013",
        convoId: "C002",
        senderId: "E003",
        text: "Sharing the runbook:",
        timestamp: t(30),
        status: "read",
        reactions: [],
        attachments: [
          {
            id: "A002",
            name: "kafka-migration-runbook.pdf",
            size: "1.1 MB",
            type: "pdf"
          }
        ]
      },
      {
        id: "M014",
        convoId: "C002",
        senderId: "E003",
        text: "Also — staging DB is throwing connection timeouts this morning. Anything changed on your end?",
        timestamp: t(18),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M015",
        convoId: "C002",
        senderId: "E003",
        text: "Got the error logs if you need them",
        timestamp: t(12),
        status: "delivered",
        reactions: [],
        attachments: []
      },
      {
        id: "M016",
        convoId: "C002",
        senderId: "E003",
        text: "Attaching the trace:",
        timestamp: t(8),
        status: "delivered",
        reactions: [],
        attachments: [
          {
            id: "A003",
            name: "db-trace-2026-06-22.zip",
            size: "820 KB",
            type: "zip"
          }
        ]
      }
    ]
  },
  // ── 3. Group: Engineering Team ───────────────────────────────────────────
  {
    id: "C003",
    type: "group",
    name: "Engineering 🛠",
    description: "Main engineering coordination channel",
    participants: [ME, contacts[0], contacts[1], contacts[2], contacts[5]],
    pinned: false,
    muted: false,
    unread: 5,
    lastActivity: t(5),
    avatarColor: "#2563EB",
    messages: [
      {
        id: "M020",
        convoId: "C003",
        senderId: "E006",
        text: "🚀 Deployed CI/CD pipeline to GitHub Actions — all green!",
        timestamp: t(120),
        status: "read",
        reactions: [
          { emoji: "👏", count: 3, byMe: true },
          { emoji: "🔥", count: 2, byMe: false }
        ],
        attachments: []
      },
      {
        id: "M021",
        convoId: "C003",
        senderId: "E001",
        text: "Excellent work Yuki. Build time went from 18 min to 4 min 🤯",
        timestamp: t(115),
        status: "read",
        reactions: [{ emoji: "😮", count: 2, byMe: false }],
        attachments: []
      },
      {
        id: "M022",
        convoId: "C003",
        senderId: "E003",
        text: "Does the new pipeline have caching for node_modules?",
        timestamp: t(110),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M023",
        convoId: "C003",
        senderId: "E006",
        text: "Yes — using actions/cache with lockfile hash. Cache hit rate is ~80%",
        timestamp: t(108),
        status: "read",
        reactions: [{ emoji: "👍", count: 1, byMe: true }],
        attachments: []
      },
      {
        id: "M024",
        convoId: "C003",
        senderId: "E007",
        text: "Quick heads up — WMS deployment on the Ironclad project failed at 3am. I'm investigating now",
        timestamp: t(45),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M025",
        convoId: "C003",
        senderId: "E001",
        text: "Got it @Rafe — keep me posted. If it's not resolved by 10am let's jump on a call",
        timestamp: t(40),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M026",
        convoId: "C003",
        senderId: "E007",
        text: "Found it — PHP memory limit hit during migration. Bumping to 512M and retrying",
        timestamp: t(22),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M027",
        convoId: "C003",
        senderId: "E006",
        text: "Sprint review is today at 3pm Bangkok time (9am Berlin, 2pm Paris). Zoom link in calendar invite 📅",
        timestamp: t(10),
        status: "delivered",
        reactions: [],
        attachments: []
      },
      {
        id: "M028",
        convoId: "C003",
        senderId: "E003",
        text: "Will be there 👍",
        timestamp: t(8),
        status: "delivered",
        reactions: [],
        attachments: []
      },
      {
        id: "M029",
        convoId: "C003",
        senderId: "E007",
        text: "WMS is back up! Deployment succeeded ✅",
        timestamp: t(5),
        status: "delivered",
        reactions: [{ emoji: "👏", count: 2, byMe: false }],
        attachments: []
      }
    ]
  },
  // ── 4. Channel: Product Updates ──────────────────────────────────────────
  {
    id: "C004",
    type: "channel",
    name: "# product-updates",
    description: "Cross-team product announcements and decisions",
    participants: [
      ME,
      contacts[0],
      contacts[1],
      contacts[2],
      contacts[3],
      contacts[4],
      contacts[5],
      contacts[6]
    ],
    pinned: false,
    muted: false,
    unread: 2,
    lastActivity: t(45),
    avatarColor: "#059669",
    topic: "Q3 roadmap finalization — deadline June 28",
    messages: [
      {
        id: "M030",
        convoId: "C004",
        senderId: "E005",
        text: "📋 Q3 roadmap is now finalized and shared in Notion. Key themes: performance, mobile, and AI integrations",
        timestamp: t(180),
        status: "read",
        reactions: [
          { emoji: "👍", count: 5, byMe: true },
          { emoji: "🔥", count: 3, byMe: false }
        ],
        attachments: []
      },
      {
        id: "M031",
        convoId: "C004",
        senderId: "E001",
        text: "Engineering is aligned. We'll need to front-load the performance sprint — mobile will need DB work first",
        timestamp: t(170),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M032",
        convoId: "C004",
        senderId: "E005",
        text: "Agreed. I've scheduled a joint planning session for Monday 9am",
        timestamp: t(165),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M033",
        convoId: "C004",
        senderId: "E004",
        text: "Marketing is ready to support with launch content. Can we get early access to the AI feature spec?",
        timestamp: t(130),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M034",
        convoId: "C004",
        senderId: "E005",
        text: "Here's the brief:",
        timestamp: t(125),
        status: "read",
        reactions: [],
        attachments: [
          {
            id: "A004",
            name: "ai-features-brief-q3.pdf",
            size: "890 KB",
            type: "pdf"
          }
        ]
      },
      {
        id: "M035",
        convoId: "C004",
        senderId: "E002",
        text: "Design handoff for mobile v2 is ready! 48 screens, full component library",
        timestamp: t(60),
        status: "read",
        reactions: [{ emoji: "👏", count: 4, byMe: true }],
        attachments: [
          {
            id: "A005",
            name: "mobile-v2-handoff.zip",
            size: "24 MB",
            type: "zip"
          }
        ]
      },
      {
        id: "M036",
        convoId: "C004",
        senderId: "E005",
        text: "Reminder: all teams to update OKR progress by Friday EOD",
        timestamp: t(45),
        status: "delivered",
        reactions: [],
        attachments: []
      }
    ]
  },
  // ── 5. Direct: Leo Moreau ────────────────────────────────────────────────
  {
    id: "C005",
    type: "direct",
    participants: [ME, contacts[3]],
    pinned: false,
    muted: false,
    unread: 0,
    lastActivity: t(180),
    messages: [
      {
        id: "M040",
        convoId: "C005",
        senderId: "E005",
        text: "James — quick question. Should we prioritize the AI tutor feature or the marketplace search for Bloom EdTech?",
        timestamp: t(240),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M041",
        convoId: "C005",
        senderId: "E001",
        text: "Marketplace search. It unblocks revenue sooner and the AI feature needs more backend work first",
        timestamp: t(235),
        status: "read",
        reactions: [{ emoji: "👍", count: 1, byMe: false }],
        attachments: []
      },
      {
        id: "M042",
        convoId: "C005",
        senderId: "E005",
        text: "Makes sense. I'll update the client brief accordingly. Thanks!",
        timestamp: t(230),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M043",
        convoId: "C005",
        senderId: "E001",
        text: "One more thing — can we get a timeline for the LMS content builder? Marcus needs a firm date to scope the API",
        timestamp: t(190),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M044",
        convoId: "C005",
        senderId: "E005",
        text: "July 18 — that's the hard deadline from the client. I'll send it in writing",
        timestamp: t(185),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M045",
        convoId: "C005",
        senderId: "E001",
        text: "Perfect, passing to Marcus now",
        timestamp: t(180),
        status: "read",
        reactions: [],
        attachments: []
      }
    ]
  },
  // ── 6. Direct: Sana Patel ────────────────────────────────────────────────
  {
    id: "C006",
    type: "direct",
    participants: [ME, contacts[2]],
    pinned: false,
    muted: true,
    unread: 0,
    lastActivity: t(600),
    messages: [
      {
        id: "M050",
        convoId: "C006",
        senderId: "E004",
        text: "Hey! Can you review the launch email copy? We need technical accuracy sign-off",
        timestamp: t(660),
        status: "read",
        reactions: [],
        attachments: [
          {
            id: "A006",
            name: "launch-email-draft.docx",
            size: "45 KB",
            type: "doc"
          }
        ]
      },
      {
        id: "M051",
        convoId: "C006",
        senderId: "E001",
        text: "Reviewed! A couple of corrections in the API section — left comments in the doc",
        timestamp: t(640),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M052",
        convoId: "C006",
        senderId: "E004",
        text: "Thank you! Sending to client now 🙏",
        timestamp: t(635),
        status: "read",
        reactions: [{ emoji: "👍", count: 1, byMe: true }],
        attachments: []
      },
      {
        id: "M053",
        convoId: "C006",
        senderId: "E004",
        text: "Also — we're thinking of a product video. Could you do a 5 min walkthrough recording next week?",
        timestamp: t(605),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M054",
        convoId: "C006",
        senderId: "E001",
        text: "Sure, let's plan for Tuesday afternoon",
        timestamp: t(600),
        status: "read",
        reactions: [],
        attachments: []
      }
    ]
  },
  // ── 7. Group: Design + Engineering ──────────────────────────────────────
  {
    id: "C007",
    type: "group",
    name: "Design × Eng 🎨",
    description: "Collaboration between design and engineering teams",
    participants: [ME, contacts[0], contacts[1], contacts[5]],
    pinned: false,
    muted: false,
    unread: 1,
    lastActivity: t(30),
    avatarColor: "#7C3AED",
    messages: [
      {
        id: "M060",
        convoId: "C007",
        senderId: "E002",
        text: "Heads up — the component library now has dark mode tokens. I've exported the updated Figma variables",
        timestamp: t(120),
        status: "read",
        reactions: [{ emoji: "🔥", count: 2, byMe: true }],
        attachments: []
      },
      {
        id: "M061",
        convoId: "C007",
        senderId: "E003",
        text: "Perfect timing! I was just about to ask. Is the token naming aligned with our CSS variables?",
        timestamp: t(115),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M062",
        convoId: "C007",
        senderId: "E002",
        text: "Yes — same naming convention. --color-surface, --color-text-primary, etc.",
        timestamp: t(110),
        status: "read",
        reactions: [{ emoji: "👍", count: 1, byMe: false }],
        attachments: []
      },
      {
        id: "M063",
        convoId: "C007",
        senderId: "E006",
        text: "Added dark mode CSS variables to the shared design tokens package. npm install @nexus/tokens to get it",
        timestamp: t(60),
        status: "read",
        reactions: [{ emoji: "👏", count: 2, byMe: true }],
        attachments: []
      },
      {
        id: "M064",
        convoId: "C007",
        senderId: "E002",
        text: "Quick question — should the date picker use the modal or inline variant on mobile?",
        timestamp: t(30),
        status: "delivered",
        reactions: [],
        attachments: []
      }
    ]
  },
  // ── 8. Direct: Sarah Kim ─────────────────────────────────────────────────
  {
    id: "C008",
    type: "direct",
    participants: [ME, contacts[6]],
    pinned: false,
    muted: false,
    unread: 0,
    lastActivity: t(1440),
    messages: [
      {
        id: "M070",
        convoId: "C008",
        senderId: "E012",
        text: "Hi James! The offer letters for the 3 new hires are ready for your signature",
        timestamp: t(1500),
        status: "read",
        reactions: [],
        attachments: [
          {
            id: "A007",
            name: "offer-letters-batch-3.pdf",
            size: "2.1 MB",
            type: "pdf"
          }
        ]
      },
      {
        id: "M071",
        convoId: "C008",
        senderId: "E001",
        text: "Signed and sent back. Start dates confirmed?",
        timestamp: t(1480),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M072",
        convoId: "C008",
        senderId: "E012",
        text: "Yes! All three confirmed July 7. I'll prepare the onboarding packs this week",
        timestamp: t(1470),
        status: "read",
        reactions: [{ emoji: "👍", count: 1, byMe: true }],
        attachments: []
      },
      {
        id: "M073",
        convoId: "C008",
        senderId: "E012",
        text: "Also — Q2 performance review cycle starts July 1. I'll send managers the review template today",
        timestamp: t(1445),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M074",
        convoId: "C008",
        senderId: "E001",
        text: "Great. Please also flag any team members in the bottom quartile — I'd like to set up coaching sessions early",
        timestamp: t(1442),
        status: "read",
        reactions: [],
        attachments: []
      },
      {
        id: "M075",
        convoId: "C008",
        senderId: "E012",
        text: "Will do. I'll have that to you by end of this week",
        timestamp: t(1440),
        status: "read",
        reactions: [],
        attachments: []
      }
    ]
  }
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const presenceConfig = {
  online: { color: "#059669", label: "Online" },
  away: { color: "#D97706", label: "Away" },
  busy: { color: "#DC2626", label: "Busy" },
  offline: { color: "#9CA3AF", label: "Offline" }
};

export const attachmentConfig = {
  pdf: { icon: "📄", color: "#DC2626", bg: "#FEE2E2" },
  doc: { icon: "📝", color: "#2563EB", bg: "#DBEAFE" },
  zip: { icon: "📦", color: "#D97706", bg: "#FEF3C7" },
  code: { icon: "💻", color: "#059669", bg: "#D1FAE5" },
  image: { icon: "🖼", color: "#7C3AED", bg: "#EDE9FE" },
  other: { icon: "📎", color: "#6B7280", bg: "#F3F4F6" }
};

export const REACTIONS: string[] = ["👍", "❤️", "😂", "🔥", "👏", "😮"];
