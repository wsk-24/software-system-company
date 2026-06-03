import React, { useState, useMemo, useCallback } from "react";
import type {
  ClientProject,
  ClientSite,
  ViewMode
} from "../types/clientProjects";
import {
  clientProjects as initialProjects,
  projectStatusConfig,
  siteStatusConfig,
  deployStatusConfig,
  priorityConfig,
  teamAvatarColors,
  techCategoryConfig
} from "../data/clientProjectsData";
import "./ClientProjectsPage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtCurrency = (n: number) => `฿${(n / 1000000).toFixed(2)}M`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
const fmtRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return fmtDate(iso);
};
const perfColor = (n: number) =>
  n >= 90 ? "#059669" : n >= 70 ? "#D97706" : "#DC2626";
const uptimeColor = (n: number) =>
  n >= 99.9 ? "#059669" : n >= 99 ? "#D97706" : "#DC2626";

// ── Tech Stack Display ────────────────────────────────────────────────────────
const TechStack: React.FC<{ site: ClientSite; limit?: number }> = ({
  site,
  limit
}) => {
  const grouped = useMemo(() => {
    const cats: Record<string, typeof site.techStack> = {};
    site.techStack.forEach((t) => {
      if (!cats[t.category]) cats[t.category] = [];
      cats[t.category].push(t);
    });
    return cats;
  }, [site]);

  const all = site.techStack;
  const shown = limit ? all.slice(0, limit) : all;
  const remaining = limit ? Math.max(0, all.length - limit) : 0;

  if (limit) {
    return (
      <div className="cp-tech-chips">
        {shown.map((t) => (
          <span
            key={t.id}
            className="cp-tech-chip"
            style={{ background: t.bg, color: t.color }}
            title={`${t.name}${t.version ? ` v${t.version}` : ""}`}
          >
            <span className="cp-tech-chip__abbr">{t.icon}</span>
            {t.name}
          </span>
        ))}
        {remaining > 0 && (
          <span
            className="cp-tech-chip"
            style={{ background: "#F3F4F6", color: "#6B7280" }}
          >
            +{remaining}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="cp-tech-section">
      {Object.entries(grouped).map(([cat, items]) => {
        const catCfg = techCategoryConfig[cat];
        return (
          <div key={cat} className="cp-tech-category">
            <div className="cp-tech-cat-label">
              {catCfg?.icon ?? "◈"} {catCfg?.label ?? cat}
            </div>
            <div className="cp-tech-chips">
              {items.map((t) => (
                <span
                  key={t.id}
                  className="cp-tech-chip"
                  style={{ background: t.bg, color: t.color }}
                  title={`${t.name}${t.version ? ` v${t.version}` : ""}`}
                >
                  <span className="cp-tech-chip__abbr">{t.icon}</span>
                  {t.name}
                  {t.version && (
                    <span style={{ opacity: 0.6, fontSize: 10 }}>
                      v{t.version}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Site Card (in detail panel) ───────────────────────────────────────────────
const SiteDetailCard: React.FC<{ site: ClientSite; defaultOpen?: boolean }> = ({
  site,
  defaultOpen = false
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const sCfg = siteStatusConfig[site.status];
  const dCfg = deployStatusConfig[site.deployStatus];

  const totalIssues = site.openIssues;

  return (
    <div className={`cp-site-card ${open ? "open" : ""}`}>
      <div className="cp-site-card__header" onClick={() => setOpen((o) => !o)}>
        <div className="cp-site-status-dot" style={{ background: sCfg.dot }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cp-site-card__name">{site.name}</div>
          <div className="cp-site-card__url">{site.url}</div>
        </div>
        <div className="cp-site-card__header-right">
          <span
            className="cp-badge"
            style={{ background: sCfg.bg, color: sCfg.color }}
          >
            {sCfg.label}
          </span>
          <span
            className="cp-badge"
            style={{ background: dCfg.bg, color: dCfg.color }}
          >
            <span className={site.deployStatus === "building" ? "cp-spin" : ""}>
              {dCfg.icon}
            </span>
            {dCfg.label}
          </span>
          {totalIssues > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#DC2626",
                background: "#FEE2E2",
                padding: "2px 7px",
                borderRadius: 5
              }}
            >
              ⚠ {totalIssues}
            </span>
          )}
          <span className="cp-site-card__chevron">▼</span>
        </div>
      </div>

      <div className="cp-site-card__body">
        <p
          style={{
            fontSize: 12.5,
            color: "#6B7280",
            lineHeight: 1.5,
            marginBottom: 16
          }}
        >
          {site.description}
        </p>

        {/* Stats */}
        <div className="cp-site-stats">
          <div className="cp-site-stat">
            <div
              className="cp-site-stat__val"
              style={{ color: uptimeColor(site.uptime) }}
            >
              {site.uptime}%
            </div>
            <div className="cp-site-stat__label">Uptime</div>
          </div>
          <div className="cp-site-stat">
            <div
              className="cp-site-stat__val"
              style={{ color: perfColor(site.performance) }}
            >
              {site.performance}
            </div>
            <div className="cp-site-stat__label">Perf</div>
          </div>
          <div className="cp-site-stat">
            <div
              className="cp-site-stat__val"
              style={{
                color:
                  site.openIssues > 5
                    ? "#DC2626"
                    : site.openIssues > 0
                    ? "#D97706"
                    : "#059669"
              }}
            >
              {site.openIssues}
            </div>
            <div className="cp-site-stat__label">Issues</div>
          </div>
          <div className="cp-site-stat">
            <div
              className="cp-site-stat__val"
              style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}
            >
              {site.region}
            </div>
            <div className="cp-site-stat__label">Region</div>
          </div>
        </div>

        {/* Performance bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16
          }}
        >
          <div className="cp-perf-row">
            <span className="cp-perf-label">Uptime</span>
            <div className="cp-perf-bar">
              <div
                className="cp-perf-fill"
                style={{
                  width: `${site.uptime}%`,
                  background: uptimeColor(site.uptime)
                }}
              />
            </div>
            <span className="cp-perf-val">{site.uptime}%</span>
          </div>
          <div className="cp-perf-row">
            <span className="cp-perf-label">Performance</span>
            <div className="cp-perf-bar">
              <div
                className="cp-perf-fill"
                style={{
                  width: `${site.performance}%`,
                  background: perfColor(site.performance)
                }}
              />
            </div>
            <span className="cp-perf-val">{site.performance}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: 16 }}>
          <div
            className="cp-section-title"
            style={{ fontSize: 10, marginBottom: 10 }}
          >
            Tech Stack ({site.techStack.length} tools)
          </div>
          <TechStack site={site} />
        </div>

        {/* Deployments */}
        {site.recentDeployments.length > 0 && (
          <div>
            <div
              className="cp-section-title"
              style={{ fontSize: 10, marginBottom: 10 }}
            >
              Recent Deployments
            </div>
            <div className="cp-deploys">
              {site.recentDeployments.map((dep) => {
                const dCfgDep = deployStatusConfig[dep.status];
                return (
                  <div key={dep.id} className="cp-deploy-row">
                    <div
                      className="cp-deploy-status-icon"
                      style={{ background: dCfgDep.bg, color: dCfgDep.color }}
                    >
                      <span
                        className={dep.status === "building" ? "cp-spin" : ""}
                      >
                        {dCfgDep.icon}
                      </span>
                    </div>
                    <span className="cp-deploy-commit">{dep.commit}</span>
                    <span className="cp-deploy-msg" title={dep.commitMsg}>
                      {dep.commitMsg}
                    </span>
                    <span className={`cp-deploy-env ${dep.env}`}>
                      {dep.env}
                    </span>
                    <span className="cp-deploy-meta">
                      {fmtRelative(dep.deployedAt)} · {dep.deployedBy}
                    </span>
                    {(dep.duration ?? 0) > 0 && (
                      <span className="cp-deploy-duration">
                        {dep.duration}s
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Project Detail Panel ──────────────────────────────────────────────────────
const ProjectDetailPanel: React.FC<{
  project: ClientProject;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const psCfg = projectStatusConfig[project.status];
  const prCfg = priorityConfig[project.priority];
  const budgetPct = Math.min(100, (project.spent / project.budget) * 100);

  const allIssues = project.sites.reduce((s, site) => s + site.openIssues, 0);
  const liveSites = project.sites.filter((s) => s.status === "live").length;
  const failedDeploys = project.sites.filter(
    (s) => s.deployStatus === "failed"
  ).length;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="cp-detail-overlay" onClick={handleBackdrop}>
      <div className="cp-detail-panel">
        {/* Header */}
        <div className="cp-detail__header">
          <div className="cp-detail__header-left">
            <div
              className="cp-detail__client-logo"
              style={{ background: project.clientColor }}
            >
              {project.clientLogo}
            </div>
            <div>
              <div className="cp-detail__client-name">{project.clientName}</div>
              <div className="cp-detail__client-sub">
                {project.industry} · {project.country}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <span
                  className="cp-badge"
                  style={{ background: psCfg.bg, color: psCfg.color }}
                >
                  {psCfg.label}
                </span>
                <span
                  className="cp-badge"
                  style={{ background: prCfg.bg, color: prCfg.color }}
                >
                  {prCfg.label} Priority
                </span>
              </div>
            </div>
          </div>
          <div className="cp-detail__header-right">
            <button className="cp-btn cp-btn--sm">✎ Edit</button>
            <button className="cp-detail__close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="cp-detail__body">
          {/* Description */}
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 1.6,
              marginBottom: 24
            }}
          >
            {project.description}
          </p>

          {/* Overview */}
          <div className="cp-detail__section">
            <div className="cp-section-title">Overview</div>
            <div className="cp-overview-grid">
              <div className="cp-overview-item">
                <div className="cp-overview-item__label">Start Date</div>
                <div className="cp-overview-item__val">
                  {fmtDate(project.startDate)}
                </div>
              </div>
              <div className="cp-overview-item">
                <div className="cp-overview-item__label">End Date</div>
                <div className="cp-overview-item__val">
                  {project.endDate ? fmtDate(project.endDate) : "—"}
                </div>
              </div>
              <div className="cp-overview-item">
                <div className="cp-overview-item__label">Budget</div>
                <div className="cp-overview-item__val">
                  {fmtCurrency(project.budget)}
                </div>
              </div>
              <div className="cp-overview-item">
                <div className="cp-overview-item__label">Spent</div>
                <div
                  className="cp-overview-item__val"
                  style={{ color: budgetPct > 90 ? "#DC2626" : "#111827" }}
                >
                  {fmtCurrency(project.spent)}
                </div>
              </div>
            </div>

            {/* Budget bar */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "#9CA3AF",
                  marginBottom: 4
                }}
              >
                <span>Budget utilization</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: budgetPct > 90 ? "#DC2626" : "#111827"
                  }}
                >
                  {budgetPct.toFixed(0)}%
                </span>
              </div>
              <div className="cp-progress-track">
                <div
                  className="cp-progress-fill"
                  style={{
                    width: `${budgetPct}%`,
                    background:
                      budgetPct > 90
                        ? "#DC2626"
                        : budgetPct > 70
                        ? "#D97706"
                        : "#059669"
                  }}
                />
              </div>
            </div>

            {/* Overview stats */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Sites", val: project.sites.length, color: "#2563EB" },
                { label: "Live", val: liveSites, color: "#059669" },
                {
                  label: "Open Issues",
                  val: allIssues,
                  color: allIssues > 5 ? "#DC2626" : "#D97706"
                },
                {
                  label: "Failed Deploys",
                  val: failedDeploys,
                  color: failedDeploys > 0 ? "#DC2626" : "#059669"
                },
                {
                  label: "Progress",
                  val: `${project.progress}%`,
                  color: "#111827"
                }
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    textAlign: "center",
                    padding: "8px 16px",
                    background: "#F9FAFB",
                    borderRadius: 8,
                    minWidth: 80
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: s.color,
                      fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    {s.val}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#9CA3AF" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="cp-detail__section">
            <div className="cp-section-title">Team</div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  padding: "6px 12px",
                  background: "#111827",
                  borderRadius: 8
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background:
                      teamAvatarColors[
                        project.teamLead
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                      ] ?? "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#fff"
                  }}
                >
                  {project.teamLead
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
                  {project.teamLead}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.1)",
                    padding: "1px 6px",
                    borderRadius: 4
                  }}
                >
                  Lead
                </span>
              </div>
              {project.teamMembers
                .filter(
                  (m) =>
                    m !==
                    project.teamLead
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                )
                .map((m) => (
                  <div
                    key={m}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: teamAvatarColors[m] ?? "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#fff"
                    }}
                    title={m}
                  >
                    {m}
                  </div>
                ))}
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 28
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="cp-tag"
                  style={{ fontSize: 11, padding: "3px 9px" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Sites */}
          <div className="cp-detail__section">
            <div className="cp-section-title">
              Sites &amp; Tech Stacks ({project.sites.length})
            </div>
            <div className="cp-detail-sites">
              {project.sites.map((site, i) => (
                <SiteDetailCard
                  key={site.id}
                  site={site}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>

          {/* Contacts */}
          {project.contacts.length > 0 && (
            <div className="cp-detail__section">
              <div className="cp-section-title">Client Contacts</div>
              <div className="cp-contacts">
                {project.contacts.map((c) => (
                  <div key={c.email} className="cp-contact-card">
                    <div className="cp-contact-avatar">{c.avatar}</div>
                    <div>
                      <div className="cp-contact-name">{c.name}</div>
                      <div className="cp-contact-role">{c.role}</div>
                      <div className="cp-contact-email">{c.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Project Card (grid view) ──────────────────────────────────────────────────
const ProjectCard: React.FC<{
  project: ClientProject;
  onClick: () => void;
  delay: number;
}> = ({ project, onClick, delay }) => {
  const psCfg = projectStatusConfig[project.status];
  const prCfg = priorityConfig[project.priority];
  const allIssues = project.sites.reduce((s, site) => s + site.openIssues, 0);

  return (
    <div
      className="cp-project-card"
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      <div
        className="cp-project-card__accent"
        style={{ background: project.clientColor }}
      />
      <div className="cp-project-card__body">
        {/* Top */}
        <div className="cp-card__top">
          <div
            className="cp-client-logo"
            style={{ background: project.clientColor }}
          >
            {project.clientLogo}
          </div>
          <div className="cp-card__meta">
            <div className="cp-client-name">{project.clientName}</div>
            <div className="cp-client-industry">
              {project.industry} · {project.country}
            </div>
          </div>
          <div
            className="cp-card__badges"
            style={{ flexDirection: "column", alignItems: "flex-end" }}
          >
            <span
              className="cp-badge"
              style={{ background: psCfg.bg, color: psCfg.color }}
            >
              {psCfg.label}
            </span>
            <span
              className="cp-badge"
              style={{ background: prCfg.bg, color: prCfg.color, marginTop: 4 }}
            >
              {prCfg.label}
            </span>
          </div>
        </div>

        {/* Desc */}
        <p className="cp-card__desc">{project.description}</p>

        {/* Progress */}
        <div className="cp-card__progress">
          <div className="cp-progress-header">
            <span>Project Progress</span>
            <span className="cp-progress-pct">{project.progress}%</span>
          </div>
          <div className="cp-progress-track">
            <div
              className="cp-progress-fill"
              style={{
                width: `${project.progress}%`,
                background: project.clientColor
              }}
            />
          </div>
          <div className="cp-budget-line">
            <span>Budget: {fmtCurrency(project.budget)}</span>
            <span className="cp-budget-spent">
              Spent: {fmtCurrency(project.spent)}
            </span>
          </div>
        </div>

        {/* Sites */}
        <div className="cp-card__sites">
          {project.sites.map((site) => {
            const sCfg = siteStatusConfig[site.status];
            const dCfg = deployStatusConfig[site.deployStatus];
            return (
              <div
                key={site.id}
                className="cp-site-mini"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <div
                  className="cp-site-mini__status-dot"
                  style={{ background: sCfg.dot }}
                />
                <span className="cp-site-mini__name">{site.name}</span>
                <TechStack site={site} limit={3} />
                <span
                  className="cp-site-mini__deploy"
                  style={{ background: dCfg.bg, color: dCfg.color }}
                >
                  <span
                    className={
                      site.deployStatus === "building" ? "cp-spin" : ""
                    }
                  >
                    {dCfg.icon}
                  </span>{" "}
                  {dCfg.label}
                </span>
                <span
                  className={`cp-site-mini__issues ${
                    site.openIssues > 0 ? "has-issues" : ""
                  }`}
                >
                  {site.openIssues > 0 ? `⚠ ${site.openIssues}` : "✓"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="cp-card__footer">
          <div className="cp-team-avatars">
            {project.teamMembers.slice(0, 4).map((m) => (
              <div
                key={m}
                className="cp-team-avatar"
                style={{ background: teamAvatarColors[m] ?? "#6B7280" }}
                title={m}
              >
                {m}
              </div>
            ))}
          </div>
          <div className="cp-card__footer-right">
            {allIssues > 0 && (
              <span style={{ color: "#DC2626", fontWeight: 600, fontSize: 12 }}>
                ⚠ {allIssues} issues
              </span>
            )}
            <span>{fmtRelative(project.lastActivity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Add Project Modal ─────────────────────────────────────────────────────────
const AddProjectModal: React.FC<{
  onClose: () => void;
  onAdd: (p: ClientProject) => void;
}> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    clientName: "",
    industry: "",
    country: "",
    description: "",
    budget: "",
    teamLead: ""
  });
  const valid = form.clientName && form.industry && form.budget;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    if (!valid) return;
    const initials = form.clientName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const colors = [
      "#2563EB",
      "#059669",
      "#DC2626",
      "#D97706",
      "#7C3AED",
      "#0891B2"
    ];
    const newProject: ClientProject = {
      id: `CP${Date.now()}`,
      clientName: form.clientName,
      clientLogo: initials,
      clientColor: colors[Math.floor(Math.random() * colors.length)],
      industry: form.industry,
      country: form.country || "—",
      status: "active",
      priority: "medium",
      startDate: new Date().toISOString().split("T")[0],
      budget: parseFloat(form.budget) * 1000,
      spent: 0,
      progress: 0,
      teamLead: form.teamLead || "Unassigned",
      teamMembers: [],
      sites: [],
      contacts: [],
      description: form.description,
      tags: [],
      lastActivity: new Date().toISOString().split("T")[0]
    };
    onAdd(newProject);
  };

  return (
    <div className="cp-modal-backdrop" onClick={handleBackdrop}>
      <div className="cp-modal">
        <div className="cp-modal__header">
          <h2 className="cp-modal__title">New Client Project</h2>
          <button className="cp-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="cp-modal__body">
          <div className="cp-form-row">
            <label className="cp-label">Client Name *</label>
            <input
              className="cp-input"
              placeholder="e.g. Acme Corporation"
              value={form.clientName}
              onChange={(e) =>
                setForm((f) => ({ ...f, clientName: e.target.value }))
              }
            />
          </div>
          <div className="cp-form-row cp-form-row--2">
            <div>
              <label className="cp-label">Industry *</label>
              <input
                className="cp-input"
                placeholder="e.g. E-Commerce"
                value={form.industry}
                onChange={(e) =>
                  setForm((f) => ({ ...f, industry: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="cp-label">Country</label>
              <input
                className="cp-input"
                placeholder="e.g. Thailand"
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="cp-form-row cp-form-row--2">
            <div>
              <label className="cp-label">Budget (฿ thousands) *</label>
              <input
                className="cp-input"
                type="number"
                placeholder="e.g. 1500"
                value={form.budget}
                onChange={(e) =>
                  setForm((f) => ({ ...f, budget: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="cp-label">Team Lead</label>
              <input
                className="cp-input"
                placeholder="e.g. James Decker"
                value={form.teamLead}
                onChange={(e) =>
                  setForm((f) => ({ ...f, teamLead: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="cp-form-row">
            <label className="cp-label">Description</label>
            <textarea
              className="cp-textarea"
              placeholder="Project scope and key deliverables..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="cp-modal__footer">
            <button className="cp-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="cp-btn cp-btn--primary"
              onClick={handleSubmit}
              disabled={!valid}
              style={{ opacity: valid ? 1 : 0.5 }}
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ClientProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ClientProject[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAdd, setShowAdd] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null
  );

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const allSites = projects.flatMap((p) => p.sites);
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "active").length,
      totalSites: allSites.length,
      liveSites: allSites.filter((s) => s.status === "live").length,
      totalBudget: projects.reduce((s, p) => s + p.budget, 0),
      atRisk: projects.filter((p) => p.status === "at_risk").length,
      openIssues: allSites.reduce((s, site) => s + site.openIssues, 0),
      failedDeploys: allSites.filter((s) => s.deployStatus === "failed").length
    };
  }, [projects]);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !searchQ ||
        p.clientName.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.industry.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.tags.some((t) => t.includes(searchQ.toLowerCase()));
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchIndustry =
        filterIndustry === "all" || p.industry === filterIndustry;
      return matchSearch && matchStatus && matchIndustry;
    });
  }, [projects, searchQ, filterStatus, filterIndustry]);

  const industries = useMemo(
    () => [...new Set(projects.map((p) => p.industry))],
    [projects]
  );

  const handleAdd = (p: ClientProject) => {
    setProjects((prev) => [p, ...prev]);
    setShowAdd(false);
    showToast(`✓ ${p.clientName} project created`, "success");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="cp-page">
      {/* Header */}
      <div className="cp-header">
        <div className="cp-header__left">
          <h1 className="cp-title">
            Client Projects
            {kpis.atRisk > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: "#FEE2E2",
                  color: "#DC2626"
                }}
              >
                ⚠ {kpis.atRisk} at risk
              </span>
            )}
          </h1>
          <p className="cp-subtitle">
            Multi-site project management · {kpis.totalProjects} clients ·{" "}
            {kpis.totalSites} sites · {kpis.liveSites} live
          </p>
        </div>
        <div className="cp-header__actions">
          <button className="cp-btn">⬇ Export</button>
          <button
            className="cp-btn cp-btn--primary"
            onClick={() => setShowAdd(true)}
          >
            + New Project
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="cp-kpis">
        {[
          {
            icon: "⬡",
            label: "Active Projects",
            val: kpis.activeProjects,
            sub: `of ${kpis.totalProjects} total`,
            color: "#2563EB",
            bg: "#DBEAFE"
          },
          {
            icon: "☁",
            label: "Total Sites",
            val: kpis.totalSites,
            sub: `${kpis.liveSites} live`,
            color: "#059669",
            bg: "#D1FAE5"
          },
          {
            icon: "⚠",
            label: "Open Issues",
            val: kpis.openIssues,
            sub: `${kpis.failedDeploys} failed deploys`,
            color: kpis.openIssues > 10 ? "#DC2626" : "#D97706",
            bg: kpis.openIssues > 10 ? "#FEE2E2" : "#FEF3C7"
          },
          {
            icon: "◈",
            label: "Total Budget",
            val: fmtCurrency(kpis.totalBudget),
            sub: "all clients",
            color: "#7C3AED",
            bg: "#EDE9FE"
          },
          {
            icon: "✕",
            label: "At Risk",
            val: kpis.atRisk,
            sub: "needs attention",
            color: "#DC2626",
            bg: "#FEE2E2"
          }
        ].map((k, i) => (
          <div
            key={k.label}
            className="cp-kpi"
            style={{ animationDelay: `${0.04 + i * 0.04}s` }}
          >
            <div className="cp-kpi__top">
              <div
                className="cp-kpi__icon"
                style={{ background: k.bg, color: k.color }}
              >
                {k.icon}
              </div>
            </div>
            <div className="cp-kpi__val">{k.val}</div>
            <div className="cp-kpi__label">{k.label}</div>
            <div className="cp-kpi__sub" style={{ color: "#9CA3AF" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="cp-toolbar">
        <div className="cp-search">
          <span className="cp-search__icon">⌕</span>
          <input
            type="text"
            placeholder="Search clients, industry, tags…"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
        </div>
        <select
          className="cp-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="at_risk">At Risk</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="cp-filter-select"
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
        >
          <option value="all">All Industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        {(searchQ || filterStatus !== "all" || filterIndustry !== "all") && (
          <button
            className="cp-btn cp-btn--sm"
            style={{ color: "#DC2626", borderColor: "#FECACA" }}
            onClick={() => {
              setSearchQ("");
              setFilterStatus("all");
              setFilterIndustry("all");
            }}
          >
            ✕ Clear
          </button>
        )}
        <div className="cp-toolbar__right">
          <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="cp-view-toggle">
            <button
              className={`cp-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              ⊞ Grid
            </button>
            <button
              className={`cp-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="cp-grid">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              delay={0.04 + i * 0.05}
              onClick={() => setSelectedProject(p)}
            />
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "60px 0",
                color: "#9CA3AF"
              }}
            >
              <div style={{ fontSize: 40, opacity: 0.3, marginBottom: 12 }}>
                ⬡
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>
                No projects found
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Try adjusting your filters
              </div>
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="cp-list">
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              gap: 16,
              background: "#FAFAFA",
              border: "1.5px solid #E5E7EB",
              borderRadius: "13px 13px 0 0",
              borderBottom: "none"
            }}
          >
            {["Client", "Sites", "Progress", "Budget", ""].map((h, i) => (
              <div
                key={i}
                style={{
                  flex:
                    i === 0
                      ? 1
                      : i === 1
                      ? "0 0 140px"
                      : i === 2
                      ? "0 0 160px"
                      : i === 3
                      ? "0 0 100px"
                      : "0 0 80px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em"
                }}
              >
                {h}
              </div>
            ))}
          </div>
          {filtered.map((p, i) => {
            const psCfg = projectStatusConfig[p.status];
            return (
              <div
                key={p.id}
                className="cp-list-card"
                style={{ animationDelay: `${0.03 + i * 0.04}s` }}
              >
                <div className="cp-list-card__row">
                  <div className="cp-list-card__left" style={{ flex: 1 }}>
                    <div
                      className="cp-client-logo"
                      style={{
                        background: p.clientColor,
                        width: 36,
                        height: 36,
                        fontSize: 11,
                        borderRadius: 8
                      }}
                    >
                      {p.clientLogo}
                    </div>
                    <div>
                      <div className="cp-list-name">{p.clientName}</div>
                      <div className="cp-list-industry">
                        {p.industry} · {p.country}
                      </div>
                    </div>
                    <span
                      className="cp-badge"
                      style={{ background: psCfg.bg, color: psCfg.color }}
                    >
                      {psCfg.label}
                    </span>
                  </div>
                  {/* Sites */}
                  <div
                    style={{
                      flex: "0 0 140px",
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap"
                    }}
                  >
                    {p.sites.map((s) => {
                      const sCfg = siteStatusConfig[s.status];
                      return (
                        <span
                          key={s.id}
                          title={s.name}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: sCfg.dot,
                            display: "inline-block"
                          }}
                        />
                      );
                    })}
                    <span
                      style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}
                    >
                      {p.sites.length} site{p.sites.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {/* Progress */}
                  <div style={{ flex: "0 0 160px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        marginBottom: 3
                      }}
                    >
                      <span style={{ color: "#9CA3AF" }}>Progress</span>
                      <span style={{ fontWeight: 600, color: "#111827" }}>
                        {p.progress}%
                      </span>
                    </div>
                    <div className="cp-progress-track">
                      <div
                        className="cp-progress-fill"
                        style={{
                          width: `${p.progress}%`,
                          background: p.clientColor
                        }}
                      />
                    </div>
                  </div>
                  {/* Budget */}
                  <div style={{ flex: "0 0 100px", textAlign: "right" }}>
                    <div className="cp-list-budget-val">
                      {fmtCurrency(p.budget)}
                    </div>
                    <div className="cp-list-budget-sub">
                      {Math.round((p.spent / p.budget) * 100)}% used
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ flex: "0 0 80px", display: "flex", gap: 4 }}>
                    <button
                      className="cp-btn cp-btn--sm"
                      style={{ color: "#2563EB", borderColor: "#BFDBFE" }}
                      onClick={() => setSelectedProject(p)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#9CA3AF",
                border: "1.5px solid #E5E7EB",
                borderTop: "none",
                borderRadius: "0 0 13px 13px",
                background: "#fff"
              }}
            >
              No projects match your filters
            </div>
          )}
          {filtered.length > 0 && (
            <div
              style={{
                border: "1.5px solid #E5E7EB",
                borderTop: "none",
                borderRadius: "0 0 13px 13px",
                height: 0
              }}
            />
          )}
        </div>
      )}

      {/* Detail panel */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Add modal */}
      {showAdd && (
        <AddProjectModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}

      {/* Toast */}
      {toast && <div className={`cp-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default ClientProjectsPage;
