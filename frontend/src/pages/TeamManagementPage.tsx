import React, { useState, useMemo, useCallback } from "react";
import type {
  Employee,
  AddEmployeeForm,
  EmployeeRole,
  ContractType
} from "../types/team";
import {
  employees as initialEmployees,
  departments,
  statusConfig,
  roleConfig,
  contractConfig,
  skillLevelLabel,
  skillCategoryColor
} from "../data/teamData";
import "./TeamPage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
const tenure = (iso: string) => {
  const months = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12),
    m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
};
const perfColor = (s: number) =>
  s >= 90 ? "#059669" : s >= 75 ? "#2563EB" : s >= 60 ? "#D97706" : "#DC2626";
const perfLabel = (s: number) =>
  s >= 90
    ? "Exceptional"
    : s >= 80
    ? "Strong"
    : s >= 70
    ? "Good"
    : s >= 60
    ? "Developing"
    : "Needs Support";
const fmtSalary = (n: number) => `฿${(n / 1000).toFixed(0)}k/mo`;

// ── Performance Ring ──────────────────────────────────────────────────────────
const PerfRing: React.FC<{ score: number; size?: number }> = ({
  score,
  size = 60
}) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const color = perfColor(score);
  return (
    <div className="tm-perf-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="tm-perf-ring__text" style={{ color }}>
        {score}
      </div>
    </div>
  );
};

// ── Employee Detail Panel ─────────────────────────────────────────────────────
const EmployeePanel: React.FC<{
  emp: Employee;
  onClose: () => void;
  onEdit: () => void;
}> = ({ emp, onClose, onEdit }) => {
  const sCfg = statusConfig[emp.status];
  const rCfg = roleConfig[emp.role];
  const dpt = departments.find((d) => d.id === emp.departmentId);
  const manager = initialEmployees.find((e) => e.id === emp.reportsTo);
  const reports = initialEmployees.filter((e) =>
    emp.directReports.includes(e.id)
  );

  const activityColors: Record<string, string> = {
    joined: "#059669",
    promoted: "#2563EB",
    left: "#DC2626",
    project: "#7C3AED",
    leave: "#D97706",
    review: "#0891B2"
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="tm-detail-overlay" onClick={handleBackdrop}>
      <div className="tm-detail-panel">
        {/* Header with cover */}
        <div className="tm-panel__header">
          <div
            className="tm-panel__cover"
            style={{
              background: `linear-gradient(135deg, ${emp.avatarColor}33, ${emp.avatarColor}11)`
            }}
          />
          <div className="tm-panel__avatar-row">
            <div
              className="tm-panel__avatar"
              style={{ background: emp.avatarColor }}
            >
              {emp.avatar}
            </div>
            <div className="tm-panel__actions">
              <button className="tm-btn tm-btn--sm" onClick={onEdit}>
                ✎ Edit
              </button>
              <button className="tm-btn tm-btn--sm">✉ Message</button>
              <button className="tm-modal__close" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>
          <div className="tm-panel__info">
            <div className="tm-panel__name">
              {emp.firstName} {emp.lastName}
            </div>
            <div className="tm-panel__position">
              {emp.position} · {emp.department}
            </div>
            <div className="tm-panel__badges">
              <span
                className="tm-badge"
                style={{ background: sCfg.bg, color: sCfg.color }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: sCfg.dot,
                    display: "inline-block"
                  }}
                />
                {sCfg.label}
              </span>
              <span
                className="tm-badge"
                style={{ background: rCfg.bg, color: rCfg.color }}
              >
                {rCfg.label}
              </span>
              <span
                className="tm-badge"
                style={{ background: "#F3F4F6", color: "#374151" }}
              >
                {contractConfig[emp.contractType].label}
              </span>
              <span
                className="tm-badge"
                style={{ background: "#F3F4F6", color: "#374151" }}
              >
                📍 {emp.location}
              </span>
            </div>
          </div>
        </div>

        <div className="tm-panel__body">
          {/* Bio */}
          {emp.bio && (
            <div className="tm-section">
              <div className="tm-section-title">About</div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>
                {emp.bio}
              </p>
            </div>
          )}

          {/* Performance */}
          <div className="tm-section">
            <div className="tm-section-title">Performance</div>
            <div className="tm-perf-score">
              <PerfRing score={emp.stats.performanceScore} />
              <div>
                <div className="tm-perf-score__title">
                  {perfLabel(emp.stats.performanceScore)}
                </div>
                <div
                  className="tm-perf-score__label"
                  style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}
                >
                  {emp.stats.tasksCompleted}/{emp.stats.tasksTotal} tasks ·{" "}
                  {emp.stats.attendanceRate}% attendance
                </div>
              </div>
            </div>
            <div className="tm-stat-grid">
              {[
                {
                  label: "Tasks Done",
                  val: emp.stats.tasksCompleted,
                  color: "#2563EB"
                },
                {
                  label: "OT Hours",
                  val: `${emp.stats.overtimeHours}h`,
                  color: emp.stats.overtimeHours > 10 ? "#DC2626" : "#374151"
                },
                {
                  label: "Leave Bal.",
                  val: `${emp.stats.leaveBalance}d`,
                  color: "#059669"
                },
                {
                  label: "Projects",
                  val: emp.stats.projectCount,
                  color: "#7C3AED"
                },
                {
                  label: "Attendance",
                  val: `${emp.stats.attendanceRate}%`,
                  color: "#059669"
                },
                {
                  label: "Score",
                  val: emp.stats.performanceScore,
                  color: perfColor(emp.stats.performanceScore)
                }
              ].map((s) => (
                <div key={s.label} className="tm-stat-box">
                  <div className="tm-stat-box__val" style={{ color: s.color }}>
                    {s.val}
                  </div>
                  <div className="tm-stat-box__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="tm-section">
            <div className="tm-section-title">Skills ({emp.skills.length})</div>
            <div className="tm-skills-list">
              {emp.skills.map((sk, i) => (
                <div key={sk.name} className="tm-skill-row">
                  <span
                    className="tm-skill-cat"
                    style={{
                      background: `${skillCategoryColor[sk.category]}22`,
                      color: skillCategoryColor[sk.category]
                    }}
                  >
                    {sk.category}
                  </span>
                  <span className="tm-skill-name">{sk.name}</span>
                  <div className="tm-skill-bar">
                    <div
                      className="tm-skill-fill"
                      style={{
                        width: `${(sk.level / 5) * 100}%`,
                        background: skillCategoryColor[sk.category],
                        animationDelay: `${0.05 + i * 0.06}s`
                      }}
                    />
                  </div>
                  <span className="tm-skill-level">
                    {skillLevelLabel[sk.level]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Employment Info */}
          <div className="tm-section">
            <div className="tm-section-title">Contact & Employment</div>
            <div>
              {[
                { icon: "✉", label: "Email", val: emp.email },
                { icon: "📱", label: "Phone", val: emp.phone },
                { icon: "📍", label: "Location", val: emp.location },
                { icon: "🕐", label: "Timezone", val: emp.timezone },
                {
                  icon: "📅",
                  label: "Start Date",
                  val: fmtDate(emp.startDate)
                },
                { icon: "⏱", label: "Tenure", val: tenure(emp.startDate) },
                { icon: "💰", label: "Salary", val: fmtSalary(emp.salary) },
                { icon: "◉", label: "Dept", val: dpt?.name ?? emp.department }
              ].map((row) => (
                <div key={row.label} className="tm-contact-row">
                  <div className="tm-contact-icon">{row.icon}</div>
                  <span className="tm-contact-label">{row.label}</span>
                  <span className="tm-contact-val">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reporting */}
          {(manager || reports.length > 0) && (
            <div className="tm-section">
              <div className="tm-section-title">Reporting Structure</div>
              {manager && (
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontWeight: 700
                    }}
                  >
                    Reports to
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      background: "#F9FAFB",
                      borderRadius: 9
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: manager.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff"
                      }}
                    >
                      {manager.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827"
                        }}
                      >
                        {manager.firstName} {manager.lastName}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {manager.position}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {reports.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontWeight: 700
                    }}
                  >
                    Direct Reports ({reports.length})
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {reports.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "7px 12px",
                          background: "#F9FAFB",
                          borderRadius: 9
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: r.avatarColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#fff"
                          }}
                        >
                          {r.avatar}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: "#111827"
                            }}
                          >
                            {r.firstName} {r.lastName}
                          </div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                            {r.position}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {emp.projects.length > 0 && (
            <div className="tm-section">
              <div className="tm-section-title">Active Projects</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {emp.projects.map((p) => (
                  <span key={p} className="tm-project-tag">
                    ⬡ {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity log */}
          {emp.activityLog.length > 0 && (
            <div className="tm-section">
              <div className="tm-section-title">Activity History</div>
              <div className="tm-activity">
                {emp.activityLog.map((log) => (
                  <div key={log.id} className="tm-activity-item">
                    <div
                      className="tm-activity-dot"
                      style={{
                        background: activityColors[log.type] ?? "#9CA3AF"
                      }}
                    />
                    <div className="tm-activity-body">
                      <div className="tm-activity-desc">{log.description}</div>
                      <div className="tm-activity-date">
                        {fmtDate(log.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {emp.tags.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {emp.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    padding: "3px 9px",
                    borderRadius: 6,
                    background: "#F3F4F6",
                    color: "#6B7280",
                    fontWeight: 500
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Add/Edit Modal ────────────────────────────────────────────────────────────
const EmployeeModal: React.FC<{
  emp?: Employee;
  onClose: () => void;
  onSave: (form: AddEmployeeForm) => void;
}> = ({ emp, onClose, onSave }) => {
  const [form, setForm] = useState<AddEmployeeForm>({
    firstName: emp?.firstName ?? "",
    lastName: emp?.lastName ?? "",
    email: emp?.email ?? "",
    phone: emp?.phone ?? "",
    position: emp?.position ?? "",
    departmentId: emp?.departmentId ?? "D01",
    role: emp?.role ?? "mid",
    contractType: emp?.contractType ?? "full_time",
    location: emp?.location ?? "",
    startDate: emp?.startDate ?? new Date().toISOString().split("T")[0],
    salary: emp ? String(emp.salary) : "",
    reportsTo: emp?.reportsTo ?? "",
    bio: emp?.bio ?? ""
  });

  const isEdit = !!emp;
  const valid = form.firstName && form.lastName && form.email && form.position;
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const roles: EmployeeRole[] = [
    "admin",
    "manager",
    "senior",
    "mid",
    "junior",
    "intern",
    "contractor"
  ];
  const contracts: ContractType[] = [
    "full_time",
    "part_time",
    "contractor",
    "intern"
  ];

  return (
    <div className="tm-modal-backdrop" onClick={handleBackdrop}>
      <div className="tm-modal">
        <div className="tm-modal__header">
          <h2 className="tm-modal__title">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button className="tm-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="tm-modal__sub">
          {isEdit
            ? `Editing ${emp!.firstName}'s profile`
            : "Fill in the details to add a team member"}
        </p>

        <div className="tm-modal__body">
          {/* Personal */}
          <div className="tm-form-section-label">Personal Information</div>
          <div className="tm-form-row tm-form-row--2">
            <div>
              <label className="tm-label">First Name *</label>
              <input
                className="tm-input"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="tm-label">Last Name *</label>
              <input
                className="tm-input"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="tm-form-row tm-form-row--2">
            <div>
              <label className="tm-label">Email *</label>
              <input
                className="tm-input"
                type="email"
                placeholder="name@company.dev"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="tm-label">Phone</label>
              <input
                className="tm-input"
                placeholder="+66 8x xxx xxxx"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Role */}
          <div className="tm-form-section-label">Role & Department</div>
          <div className="tm-form-row">
            <label className="tm-label">Position / Title *</label>
            <input
              className="tm-input"
              placeholder="e.g. Senior Frontend Engineer"
              value={form.position}
              onChange={(e) =>
                setForm((f) => ({ ...f, position: e.target.value }))
              }
            />
          </div>
          <div className="tm-form-row tm-form-row--3">
            <div>
              <label className="tm-label">Department</label>
              <select
                className="tm-select"
                value={form.departmentId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, departmentId: e.target.value }))
                }
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tm-label">Seniority</label>
              <select
                className="tm-select"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value as EmployeeRole
                  }))
                }
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {roleConfig[r].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tm-label">Contract Type</label>
              <select
                className="tm-select"
                value={form.contractType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    contractType: e.target.value as ContractType
                  }))
                }
              >
                {contracts.map((c) => (
                  <option key={c} value={c}>
                    {contractConfig[c].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="tm-form-row">
            <label className="tm-label">Reports To</label>
            <select
              className="tm-select"
              value={form.reportsTo}
              onChange={(e) =>
                setForm((f) => ({ ...f, reportsTo: e.target.value }))
              }
            >
              <option value="">No direct manager</option>
              {initialEmployees
                .filter((e) => e.id !== emp?.id)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} — {e.position}
                  </option>
                ))}
            </select>
          </div>

          {/* Employment */}
          <div className="tm-form-section-label">Employment Details</div>
          <div className="tm-form-row tm-form-row--2">
            <div>
              <label className="tm-label">Location</label>
              <input
                className="tm-input"
                placeholder="City, Country"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="tm-label">Start Date</label>
              <input
                className="tm-input"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="tm-form-row">
            <label className="tm-label">Monthly Salary (฿)</label>
            <input
              className="tm-input"
              type="number"
              placeholder="e.g. 180000"
              value={form.salary}
              onChange={(e) =>
                setForm((f) => ({ ...f, salary: e.target.value }))
              }
            />
          </div>

          {/* Bio */}
          <div className="tm-form-section-label">About</div>
          <div className="tm-form-row">
            <label className="tm-label">Bio / Notes</label>
            <textarea
              className="tm-textarea"
              placeholder="Background, expertise, personal notes..."
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>

          <div className="tm-modal__footer">
            <button className="tm-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="tm-btn tm-btn--primary"
              onClick={() => onSave(form)}
              disabled={!valid}
              style={{ opacity: valid ? 1 : 0.5 }}
            >
              {isEdit ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Org Chart ─────────────────────────────────────────────────────────────────
const OrgChart: React.FC<{
  employees: Employee[];
  onSelect: (e: Employee) => void;
}> = ({ employees, onSelect }) => {
  const ceo = employees.find((e) => !e.reportsTo);
  const directs = (managerId: string) =>
    employees.filter((e) => e.reportsTo === managerId);

  const OrgNode: React.FC<{
    emp: Employee;
    isRoot?: boolean;
    delay?: number;
  }> = ({ emp, isRoot, delay = 0 }) => {
    const dpt = departments.find((d) => d.id === emp.departmentId);
    return (
      <div
        className={`tm-org-node ${isRoot ? "root" : ""}`}
        style={{ animationDelay: `${delay}s` }}
        onClick={() => onSelect(emp)}
      >
        <div
          className="tm-org-node__avatar"
          style={{ background: emp.avatarColor }}
        >
          {emp.avatar}
        </div>
        <div className="tm-org-node__name">
          {emp.firstName} {emp.lastName}
        </div>
        <div className="tm-org-node__pos">{emp.position}</div>
        {dpt && (
          <div
            className="tm-org-node__dept"
            style={{ background: dpt.color + "22", color: dpt.color }}
          >
            {dpt.name}
          </div>
        )}
      </div>
    );
  };

  if (!ceo)
    return (
      <div style={{ textAlign: "center", color: "#9CA3AF", padding: 40 }}>
        No org chart data
      </div>
    );

  const lvl1 = directs(ceo.id);

  return (
    <div className="tm-org-wrap">
      <div className="tm-org-chart">
        {/* CEO */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <OrgNode emp={ceo} isRoot delay={0.05} />
        </div>
        {/* Connector */}
        {lvl1.length > 0 && <div className="tm-org-connector" />}
        {/* Level 1 */}
        {lvl1.length > 0 && (
          <>
            <div
              style={{
                width: "100%",
                borderTop: "2px solid #E5E7EB",
                margin: "0 auto",
                maxWidth: `${lvl1.length * 190}px`
              }}
            />
            <div className="tm-org-level" style={{ marginTop: 0 }}>
              {lvl1.map((emp, i) => (
                <div
                  key={emp.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{ height: 20, width: 2, background: "#E5E7EB" }}
                  />
                  <OrgNode emp={emp} delay={0.1 + i * 0.06} />
                  {/* Level 2 */}
                  {directs(emp.id).length > 0 && (
                    <>
                      <div
                        style={{ height: 20, width: 2, background: "#E5E7EB" }}
                      />
                      <div style={{ display: "flex", gap: 10 }}>
                        {directs(emp.id).map((r, j) => (
                          <div
                            key={r.id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center"
                            }}
                          >
                            <OrgNode emp={r} delay={0.18 + j * 0.06} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
type ActiveTab = "members" | "departments" | "org";

const TeamPageComponent: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [editEmp, setEditEmp] = useState<Employee | null | "new">(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "dept" | "perf" | "tenure">(
    "name"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null
  );

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((e) => e.status === "active").length,
      remote: employees.filter((e) =>
        e.location.toLowerCase().includes("remote")
      ).length,
      onLeave: employees.filter((e) => e.status === "on_leave").length,
      avgPerf: Math.round(
        employees.reduce((s, e) => s + e.stats.performanceScore, 0) /
          employees.length
      ),
      newHires: employees.filter((e) => {
        const months =
          (Date.now() - new Date(e.startDate).getTime()) /
          (1000 * 60 * 60 * 24 * 30);
        return months <= 6;
      }).length
    }),
    [employees]
  );

  // ── Filter & sort ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...employees];
    if (searchQ)
      list = list.filter(
        (e) =>
          `${e.firstName} ${e.lastName}`
            .toLowerCase()
            .includes(searchQ.toLowerCase()) ||
          e.position.toLowerCase().includes(searchQ.toLowerCase()) ||
          e.department.toLowerCase().includes(searchQ.toLowerCase()) ||
          e.email.toLowerCase().includes(searchQ.toLowerCase()) ||
          e.tags.some((t) => t.includes(searchQ.toLowerCase()))
      );
    if (filterDept !== "all")
      list = list.filter((e) => e.departmentId === filterDept);
    if (filterStatus !== "all")
      list = list.filter((e) => e.status === filterStatus);
    if (filterRole !== "all") list = list.filter((e) => e.role === filterRole);
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === "name")
        diff = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      if (sortKey === "dept") diff = a.department.localeCompare(b.department);
      if (sortKey === "perf")
        diff = a.stats.performanceScore - b.stats.performanceScore;
      if (sortKey === "tenure")
        diff =
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
    return list;
  }, [
    employees,
    searchQ,
    filterDept,
    filterStatus,
    filterRole,
    sortKey,
    sortDir
  ]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSave = useCallback(
    (form: AddEmployeeForm) => {
      if (editEmp && editEmp !== "new") {
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === (editEmp as Employee).id
              ? {
                  ...e,
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  phone: form.phone,
                  position: form.position,
                  departmentId: form.departmentId,
                  department:
                    departments.find((d) => d.id === form.departmentId)?.name ??
                    e.department,
                  role: form.role,
                  contractType: form.contractType,
                  location: form.location,
                  startDate: form.startDate,
                  salary: parseFloat(form.salary) || e.salary,
                  reportsTo: form.reportsTo || undefined,
                  bio: form.bio
                }
              : e
          )
        );
        showToast(`✓ ${form.firstName}'s profile updated`, "success");
      } else {
        const initials = (form.firstName[0] + form.lastName[0]).toUpperCase();
        const colors = [
          "#2563EB",
          "#059669",
          "#DC2626",
          "#D97706",
          "#7C3AED",
          "#0891B2",
          "#DB2777"
        ];
        const newEmp: Employee = {
          id: `E${Date.now()}`,
          firstName: form.firstName,
          lastName: form.lastName,
          avatar: initials,
          avatarColor: colors[Math.floor(Math.random() * colors.length)],
          email: form.email,
          phone: form.phone,
          position: form.position,
          department:
            departments.find((d) => d.id === form.departmentId)?.name ??
            "Engineering",
          departmentId: form.departmentId,
          role: form.role,
          status: "probation",
          contractType: form.contractType,
          gender: "other",
          location: form.location,
          timezone: "ICT (UTC+7)",
          startDate: form.startDate,
          salary: parseFloat(form.salary) || 0,
          reportsTo: form.reportsTo || undefined,
          directReports: [],
          skills: [],
          stats: {
            tasksCompleted: 0,
            tasksTotal: 0,
            overtimeHours: 0,
            leaveBalance: 20,
            attendanceRate: 100,
            performanceScore: 70,
            projectCount: 0
          },
          projects: [],
          bio: form.bio,
          activityLog: [
            {
              id: `a${Date.now()}`,
              type: "joined",
              description: `Joined as ${form.position}`,
              date: form.startDate
            }
          ],
          tags: ["new-hire"]
        };
        setEmployees((prev) => [newEmp, ...prev]);
        showToast(
          `✓ ${form.firstName} ${form.lastName} added to the team`,
          "success"
        );
      }
      setEditEmp(null);
    },
    [editEmp, showToast]
  );

  const handleDelete = useCallback(
    (emp: Employee) => {
      setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
      setSelectedEmp(null);
      showToast(`${emp.firstName} ${emp.lastName} removed from team`, "error");
    },
    [showToast]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="tm-page">
      {/* ── Header ── */}
      <div className="tm-header">
        <div className="tm-header__left">
          <h1 className="tm-title">Team &amp; Employees</h1>
          <p className="tm-subtitle">
            {kpis.total} members · {departments.length} departments ·{" "}
            {kpis.remote} remote · {kpis.newHires} new hires
          </p>
        </div>
        <div className="tm-header__actions">
          <button className="tm-btn">⬇ Export</button>
          <button className="tm-btn">📊 Reports</button>
          <button
            className="tm-btn tm-btn--primary"
            onClick={() => setEditEmp("new")}
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="tm-kpis">
        {[
          {
            icon: "👥",
            label: "Total Members",
            val: kpis.total,
            sub: "all employees",
            color: "#2563EB",
            bg: "#DBEAFE"
          },
          {
            icon: "◉",
            label: "Active",
            val: kpis.active,
            sub: `${Math.round((kpis.active / kpis.total) * 100)}% of team`,
            color: "#059669",
            bg: "#D1FAE5"
          },
          {
            icon: "🌐",
            label: "Remote",
            val: kpis.remote,
            sub: "across timezones",
            color: "#7C3AED",
            bg: "#EDE9FE"
          },
          {
            icon: "🌴",
            label: "On Leave",
            val: kpis.onLeave,
            sub: "currently away",
            color: "#D97706",
            bg: "#FEF3C7"
          },
          {
            icon: "⭐",
            label: "Avg Performance",
            val: kpis.avgPerf,
            sub: perfLabel(kpis.avgPerf),
            color: perfColor(kpis.avgPerf),
            bg: "#F3F4F6"
          }
        ].map((k, i) => (
          <div
            key={k.label}
            className="tm-kpi"
            style={{ animationDelay: `${0.04 + i * 0.04}s` }}
          >
            <div
              className="tm-kpi__icon"
              style={{ background: k.bg, color: k.color }}
            >
              {k.icon}
            </div>
            <div className="tm-kpi__val">{k.val}</div>
            <div className="tm-kpi__label">{k.label}</div>
            <div className="tm-kpi__sub" style={{ color: "#9CA3AF" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="tm-tabs">
        <button
          className={`tm-tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          👥 Members
        </button>
        <button
          className={`tm-tab ${activeTab === "departments" ? "active" : ""}`}
          onClick={() => setActiveTab("departments")}
        >
          ◉ Departments
        </button>
        <button
          className={`tm-tab ${activeTab === "org" ? "active" : ""}`}
          onClick={() => setActiveTab("org")}
        >
          ⬡ Org Chart
        </button>
      </div>

      {/* ══ MEMBERS TAB ══ */}
      {activeTab === "members" && (
        <>
          {/* Toolbar */}
          <div className="tm-toolbar">
            <div className="tm-search">
              <span className="tm-search__icon">⌕</span>
              <input
                type="text"
                placeholder="Search by name, role, skill…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <select
              className="tm-filter"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              className="tm-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="remote">Remote</option>
              <option value="probation">Probation</option>
            </select>
            <select
              className="tm-filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="senior">Senior</option>
              <option value="mid">Mid-level</option>
              <option value="junior">Junior</option>
            </select>
            {(searchQ ||
              filterDept !== "all" ||
              filterStatus !== "all" ||
              filterRole !== "all") && (
              <button
                className="tm-btn tm-btn--sm"
                style={{ color: "#DC2626", borderColor: "#FECACA" }}
                onClick={() => {
                  setSearchQ("");
                  setFilterDept("all");
                  setFilterStatus("all");
                  setFilterRole("all");
                }}
              >
                ✕ Clear
              </button>
            )}
            <div className="tm-toolbar__right">
              <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>
                {filtered.length} member{filtered.length !== 1 ? "s" : ""}
              </span>
              <div className="tm-view-toggle">
                <button
                  className={`tm-view-btn ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  ⊞ Grid
                </button>
                <button
                  className={`tm-view-btn ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="tm-grid">
              {filtered.map((emp, i) => {
                const sCfg = statusConfig[emp.status];
                const rCfg = roleConfig[emp.role];
                const dpt = departments.find((d) => d.id === emp.departmentId);
                return (
                  <div
                    key={emp.id}
                    className="tm-emp-card"
                    style={{ animationDelay: `${0.03 + i * 0.04}s` }}
                    onClick={() => setSelectedEmp(emp)}
                  >
                    {/* Cover */}
                    <div className="tm-emp-card__top">
                      <div
                        className="tm-emp-card__cover"
                        style={{
                          background: `linear-gradient(135deg, ${emp.avatarColor}40, ${emp.avatarColor}15)`
                        }}
                      />
                      <div className="tm-emp-card__avatar-wrap">
                        <div
                          className="tm-emp-card__avatar"
                          style={{ background: emp.avatarColor }}
                        >
                          {emp.avatar}
                        </div>
                        <div
                          className="tm-emp-card__status-dot"
                          style={{ background: sCfg.dot }}
                        />
                      </div>
                    </div>
                    <div className="tm-emp-card__body">
                      <div className="tm-emp-card__name">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="tm-emp-card__position">
                        {emp.position}
                      </div>
                      <div className="tm-emp-card__badges">
                        <span
                          className="tm-badge"
                          style={{ background: rCfg.bg, color: rCfg.color }}
                        >
                          {rCfg.label}
                        </span>
                        {dpt && (
                          <span
                            className="tm-badge"
                            style={{
                              background: dpt.color + "20",
                              color: dpt.color
                            }}
                          >
                            {dpt.name}
                          </span>
                        )}
                        <span
                          className="tm-badge"
                          style={{ background: sCfg.bg, color: sCfg.color }}
                        >
                          {sCfg.label}
                        </span>
                      </div>
                      {/* Mini stats */}
                      <div className="tm-card-stats">
                        <div className="tm-card-stat">
                          <div className="tm-card-stat__val">
                            {emp.stats.tasksCompleted}
                          </div>
                          <div className="tm-card-stat__label">Tasks</div>
                        </div>
                        <div className="tm-card-stat">
                          <div className="tm-card-stat__val">
                            {emp.stats.projectCount}
                          </div>
                          <div className="tm-card-stat__label">Projects</div>
                        </div>
                        <div className="tm-card-stat">
                          <div
                            className="tm-card-stat__val"
                            style={{
                              color:
                                emp.stats.overtimeHours > 10
                                  ? "#DC2626"
                                  : "#374151"
                            }}
                          >
                            {emp.stats.overtimeHours}h
                          </div>
                          <div className="tm-card-stat__label">OT</div>
                        </div>
                      </div>
                      {/* Performance bar */}
                      <div className="tm-perf-bar-wrap">
                        <div className="tm-perf-bar-label">
                          <span>Performance</span>
                          <span
                            style={{
                              color: perfColor(emp.stats.performanceScore)
                            }}
                          >
                            {emp.stats.performanceScore}
                          </span>
                        </div>
                        <div className="tm-perf-track">
                          <div
                            className="tm-perf-fill"
                            style={{
                              width: `${emp.stats.performanceScore}%`,
                              background: perfColor(emp.stats.performanceScore)
                            }}
                          />
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="tm-card-footer">
                        <span className="tm-card-footer__location">
                          📍 {emp.location.split("—")[0].trim() || emp.location}
                        </span>
                        <div
                          className="tm-card-footer__actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="tm-btn tm-btn--sm"
                            style={{ color: "#2563EB", borderColor: "#BFDBFE" }}
                            onClick={() => setSelectedEmp(emp)}
                          >
                            View
                          </button>
                          <button
                            className="tm-btn tm-btn--sm"
                            onClick={() => setEditEmp(emp)}
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    👥
                  </div>
                  <div
                    style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}
                  >
                    No members match your filters
                  </div>
                </div>
              )}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="tm-list-wrap">
              <table className="tm-table">
                <thead>
                  <tr>
                    <th
                      className={`sortable ${
                        sortKey === "name" ? "sorted" : ""
                      }`}
                      onClick={() => toggleSort("name")}
                    >
                      Employee{" "}
                      {sortKey === "name"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      className={`sortable ${
                        sortKey === "dept" ? "sorted" : ""
                      }`}
                      onClick={() => toggleSort("dept")}
                    >
                      Department{" "}
                      {sortKey === "dept"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th>Status</th>
                    <th>Role</th>
                    <th
                      className={`sortable ${
                        sortKey === "perf" ? "sorted" : ""
                      }`}
                      onClick={() => toggleSort("perf")}
                    >
                      Performance{" "}
                      {sortKey === "perf"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      className={`sortable ${
                        sortKey === "tenure" ? "sorted" : ""
                      }`}
                      onClick={() => toggleSort("tenure")}
                    >
                      Tenure{" "}
                      {sortKey === "tenure"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, i) => {
                    const sCfg = statusConfig[emp.status];
                    const rCfg = roleConfig[emp.role];
                    const dpt = departments.find(
                      (d) => d.id === emp.departmentId
                    );
                    return (
                      <tr
                        key={emp.id}
                        style={{ animationDelay: `${0.03 + i * 0.03}s` }}
                        onClick={() => setSelectedEmp(emp)}
                      >
                        <td>
                          <div className="tm-emp-cell">
                            <div
                              className="tm-emp-cell__avatar"
                              style={{ background: emp.avatarColor }}
                            >
                              {emp.avatar}
                            </div>
                            <div>
                              <div className="tm-emp-cell__name">
                                {emp.firstName} {emp.lastName}
                              </div>
                              <div className="tm-emp-cell__email">
                                {emp.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {dpt && (
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: dpt.color + "18",
                                color: dpt.color
                              }}
                            >
                              {dpt.name}
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className="tm-badge"
                            style={{ background: sCfg.bg, color: sCfg.color }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: sCfg.dot,
                                display: "inline-block"
                              }}
                            />
                            {sCfg.label}
                          </span>
                        </td>
                        <td>
                          <span
                            className="tm-badge"
                            style={{ background: rCfg.bg, color: rCfg.color }}
                          >
                            {rCfg.label}
                          </span>
                        </td>
                        <td style={{ minWidth: 130 }}>
                          <div className="tm-inline-bar">
                            <div className="tm-inline-track">
                              <div
                                className="tm-inline-fill"
                                style={{
                                  width: `${emp.stats.performanceScore}%`,
                                  background: perfColor(
                                    emp.stats.performanceScore
                                  )
                                }}
                              />
                            </div>
                            <span
                              className="tm-inline-val"
                              style={{
                                color: perfColor(emp.stats.performanceScore)
                              }}
                            >
                              {emp.stats.performanceScore}
                            </span>
                          </div>
                        </td>
                        <td style={{ color: "#6B7280", fontSize: 12.5 }}>
                          {tenure(emp.startDate)}
                        </td>
                        <td
                          style={{
                            color: "#6B7280",
                            fontSize: 12,
                            maxWidth: 140
                          }}
                        >
                          <span
                            title={emp.location}
                            style={{
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 140
                            }}
                          >
                            {emp.location}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              className="tm-btn tm-btn--sm"
                              style={{
                                color: "#2563EB",
                                borderColor: "#BFDBFE"
                              }}
                              onClick={() => setSelectedEmp(emp)}
                            >
                              View
                            </button>
                            <button
                              className="tm-btn tm-btn--sm"
                              onClick={() => setEditEmp(emp)}
                            >
                              ✎
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          color: "#9CA3AF",
                          padding: "48px 0"
                        }}
                      >
                        No members match your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ══ DEPARTMENTS TAB ══ */}
      {activeTab === "departments" && (
        <div className="tm-dept-grid">
          {departments.map((dept, i) => {
            const head = employees.find((e) => e.id === dept.headId);
            const members = employees.filter((e) => e.departmentId === dept.id);
            const avgPerf = members.length
              ? Math.round(
                  members.reduce((s, e) => s + e.stats.performanceScore, 0) /
                    members.length
                )
              : 0;
            return (
              <div
                key={dept.id}
                className="tm-dept-card"
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
                <div
                  className="tm-dept-card__accent"
                  style={{ background: dept.color }}
                />
                <div className="tm-dept-card__body">
                  <div className="tm-dept-card__top">
                    <div>
                      <div className="tm-dept-name">{dept.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: dept.color,
                          fontWeight: 600,
                          marginTop: 2
                        }}
                      >
                        {members.filter((m) => m.status === "active").length}{" "}
                        active
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="tm-dept-headcount"
                        style={{ color: dept.color }}
                      >
                        {members.length}
                      </div>
                      <div className="tm-dept-headcount-label">members</div>
                    </div>
                  </div>
                  <div className="tm-dept-desc">{dept.description}</div>

                  {/* Member avatars */}
                  <div className="tm-dept-members">
                    {members.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        className="tm-dept-member-av"
                        style={{ background: m.avatarColor }}
                        title={`${m.firstName} ${m.lastName}`}
                      >
                        {m.avatar}
                      </div>
                    ))}
                    {members.length > 5 && (
                      <div className="tm-dept-member-more">
                        +{members.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Stats row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                      marginBottom: 12
                    }}
                  >
                    {[
                      {
                        label: "Budget",
                        val: `฿${(dept.budget / 1000000).toFixed(1)}M`
                      },
                      { label: "Avg Perf", val: avgPerf, isPerf: true },
                      { label: "Headcount", val: members.length }
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          background: "#F9FAFB",
                          borderRadius: 8
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: s.isPerf ? perfColor(avgPerf) : "#111827",
                            fontFamily: "'DM Sans', sans-serif"
                          }}
                        >
                          {s.val}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            marginTop: 2
                          }}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dept head */}
                  {head && (
                    <div className="tm-dept-head">
                      <div
                        className="tm-dept-head-av"
                        style={{ background: head.avatarColor }}
                      >
                        {head.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="tm-dept-head-name">
                          {head.firstName} {head.lastName}
                        </div>
                        <div className="tm-dept-head-label">
                          {head.position}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 5,
                          background: dept.color + "18",
                          color: dept.color
                        }}
                      >
                        Lead
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ ORG CHART TAB ══ */}
      {activeTab === "org" && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #E5E7EB",
            borderRadius: 14,
            padding: 28,
            overflowX: "auto",
            animation: "tmUp 0.4s ease 0.1s both"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                Organization Chart
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                Click any node to view employee details
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                fontSize: 12,
                color: "#6B7280"
              }}
            >
              {departments.map((d) => (
                <span
                  key={d.id}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: d.color,
                      display: "inline-block"
                    }}
                  />
                  {d.name}
                </span>
              ))}
            </div>
          </div>
          <OrgChart employees={employees} onSelect={setSelectedEmp} />
        </div>
      )}

      {/* ── Panels & Modals ── */}
      {selectedEmp && (
        <EmployeePanel
          emp={selectedEmp}
          onClose={() => setSelectedEmp(null)}
          onEdit={() => {
            setEditEmp(selectedEmp);
            setSelectedEmp(null);
          }}
        />
      )}
      {editEmp && (
        <EmployeeModal
          emp={editEmp === "new" ? undefined : editEmp}
          onClose={() => setEditEmp(null)}
          onSave={handleSave}
        />
      )}
      {toast && <div className={`tm-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default TeamPageComponent;
