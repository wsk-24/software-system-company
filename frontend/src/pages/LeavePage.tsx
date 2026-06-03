import React, { useState, useCallback } from "react";
import type { LeaveRequest, NewLeaveForm } from "../types/leave";
import {
  leaveBalances,
  myLeaveRequests as initialMyRequests,
  teamLeaveRequests as initialTeamRequests,
  avatarColors,
  leaveTypeConfig,
  statusConfig,
} from "../data/leaveData";
import { ApplyModal, MiniCal, formatDate, calcDays } from "./LeaveHelpers";
import "./LeavePage.css";

// ── Toast ─────────────────────────────────────────────────────────────────────
interface Toast { msg: string; type: "success" | "error" | "info" }

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal: React.FC<{ req: LeaveRequest; onClose: () => void }> = ({ req, onClose }) => {
  const tCfg = leaveTypeConfig[req.type];
  const sCfg = statusConfig[req.status];
  const handleBackdrop = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };
  return (
    <div className="lv-modal-backdrop" onClick={handleBackdrop}>
      <div className="lv-detail-modal">
        <div className="lv-detail-modal__top" style={{ background: tCfg.bg }}>
          <div>
            <div style={{ fontSize: 28 }}>{tCfg.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: tCfg.color, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
              {tCfg.label}
            </div>
            <div style={{ fontSize: 12, color: tCfg.color, opacity: 0.8, marginTop: 2 }}>
              {req.days} day{req.days !== 1 ? "s" : ""} · Applied {formatDate(req.appliedOn)}
            </div>
          </div>
          <button className="lv-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="lv-detail-modal__body">
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Employee</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: avatarColors[req.employeeAvatar] ?? "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff" }}>
                {req.employeeAvatar}
              </div>
              <span className="lv-detail-row__val">{req.employeeName}</span>
            </div>
          </div>
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Department</span>
            <span className="lv-detail-row__val">{req.employeeDept}</span>
          </div>
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Date Range</span>
            <span className="lv-detail-row__val">{formatDate(req.startDate)} – {formatDate(req.endDate)}</span>
          </div>
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Period</span>
            <span className="lv-detail-row__val" style={{ textTransform: "capitalize" }}>{req.period === "full" ? "Full Day" : req.period === "morning" ? "Morning" : "Afternoon"}</span>
          </div>
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Duration</span>
            <span className="lv-detail-row__val">{req.days} working day{req.days !== 1 ? "s" : ""}</span>
          </div>
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Status</span>
            <span className="lv-status" style={{ color: sCfg.color, background: sCfg.bg }}>{sCfg.label}</span>
          </div>
          <div className="lv-detail-row">
            <span className="lv-detail-row__label">Reason</span>
            <span className="lv-detail-row__val" style={{ maxWidth: "60%", textAlign: "right" }}>{req.reason}</span>
          </div>
          {req.coverBy && (
            <div className="lv-detail-row">
              <span className="lv-detail-row__label">Covered By</span>
              <span className="lv-detail-row__val">{req.coverBy}</span>
            </div>
          )}
          {req.approvedBy && (
            <div className="lv-detail-row">
              <span className="lv-detail-row__label">{req.status === "rejected" ? "Reviewed By" : "Approved By"}</span>
              <span className="lv-detail-row__val">{req.approvedBy}</span>
            </div>
          )}
          {req.rejectedReason && (
            <div className="lv-detail-row">
              <span className="lv-detail-row__label">Rejection Note</span>
              <span className="lv-detail-row__val" style={{ color: "#DC2626", maxWidth: "60%", textAlign: "right" }}>{req.rejectedReason}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Leave Table Row ────────────────────────────────────────────────────────────
interface RowProps {
  req: LeaveRequest;
  showEmployee?: boolean;
  isAdmin?: boolean;
  onView: (r: LeaveRequest) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const LeaveRow: React.FC<RowProps> = ({ req, showEmployee, isAdmin, onView, onApprove, onReject, onCancel }) => {
  const tCfg = leaveTypeConfig[req.type];
  const sCfg = statusConfig[req.status];
  return (
    <tr>
      {showEmployee && (
        <td>
          <div className="lv-emp">
            <div className="lv-emp__avatar" style={{ background: avatarColors[req.employeeAvatar] ?? "#6B7280" }}>
              {req.employeeAvatar}
            </div>
            <div>
              <div className="lv-emp__name">{req.employeeName}</div>
              <div className="lv-emp__dept">{req.employeeDept}</div>
            </div>
          </div>
        </td>
      )}
      <td>
        <span className="lv-type-badge" style={{ background: tCfg.bg, color: tCfg.color }}>
          {tCfg.icon} {tCfg.label}
        </span>
      </td>
      <td>
        <div className="lv-dates__range">
          {formatDate(req.startDate)}
          {req.startDate !== req.endDate && ` – ${formatDate(req.endDate)}`}
        </div>
        <div className="lv-dates__days">{req.days} day{req.days !== 1 ? "s" : ""}</div>
      </td>
      <td>
        <span className="lv-period">
          {req.period === "full" ? "Full" : req.period === "morning" ? "AM" : "PM"}
        </span>
      </td>
      <td>
        <span className="lv-status" style={{ color: sCfg.color, background: sCfg.bg }}>
          {sCfg.label}
        </span>
      </td>
      <td>
        <div className="lv-actions">
          <button className="lv-action-btn lv-action-btn--view" onClick={() => onView(req)}>View</button>
          {isAdmin && req.status === "pending" && (
            <>
              <button className="lv-action-btn lv-action-btn--approve" onClick={() => onApprove?.(req.id)}>✓ Approve</button>
              <button className="lv-action-btn lv-action-btn--reject" onClick={() => onReject?.(req.id)}>✕ Reject</button>
            </>
          )}
          {!isAdmin && req.status === "pending" && (
            <button className="lv-action-btn lv-action-btn--cancel" onClick={() => onCancel?.(req.id)}>Cancel</button>
          )}
        </div>
      </td>
    </tr>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const LeavePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"my" | "team" | "admin">("my");
  const [showApply, setShowApply] = useState(false);
  const [detailReq, setDetailReq] = useState<LeaveRequest | null>(null);
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>(initialMyRequests);
  const [teamRequests, setTeamRequests] = useState<LeaveRequest[]>(initialTeamRequests);
  const [toast, setToast] = useState<Toast | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQ, setSearchQ] = useState("");

  // Toast helper
  const showToast = useCallback((msg: string, type: Toast["type"] = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleApplySubmit = useCallback((form: NewLeaveForm) => {
    const newReq: LeaveRequest = {
      id: `lr${Date.now()}`,
      employeeId: "E001",
      employeeName: "James Decker",
      employeeAvatar: "JD",
      employeeDept: "Engineering",
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: calcDays(form.startDate, form.endDate, form.period),
      period: form.period,
      reason: form.reason,
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
      coverBy: form.coverBy || undefined,
    };
    setMyRequests((prev) => [newReq, ...prev]);
    setShowApply(false);
    showToast("✓ Leave request submitted successfully", "success");
  }, [showToast]);

  const handleCancel = useCallback((id: string) => {
    setMyRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "cancelled" } : r)
    );
    showToast("Leave request cancelled", "info");
  }, [showToast]);

  const handleApprove = useCallback((id: string) => {
    setTeamRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved", approvedBy: "Sarah Kim", approvedOn: new Date().toISOString().split("T")[0] } : r
      )
    );
    showToast("✓ Leave request approved", "success");
  }, [showToast]);

  const handleReject = useCallback((id: string) => {
    setTeamRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected", approvedBy: "Sarah Kim", rejectedReason: "Please reschedule" } : r
      )
    );
    showToast("Leave request rejected", "error");
  }, [showToast]);

  // ── Filtered requests ────────────────────────────────────────────────────────
  const filteredMy = myRequests.filter((r) => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchType = filterType === "all" || r.type === filterType;
    return matchStatus && matchType;
  });

  const filteredTeam = teamRequests.filter((r) => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchType = filterType === "all" || r.type === filterType;
    const matchSearch = !searchQ || r.employeeName.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const pendingCount = teamRequests.filter((r) => r.status === "pending").length;
  const myPendingCount = myRequests.filter((r) => r.status === "pending").length;

  // ── Team stats ───────────────────────────────────────────────────────────────
  const onLeaveToday = teamRequests.filter((r) => {
    const today = new Date().toISOString().split("T")[0];
    return r.status === "approved" && r.startDate <= today && r.endDate >= today;
  }).length;

  return (
    <div className="leave-page">
      {/* ── Header ── */}
      <div className="lv-header">
        <div className="lv-header__left">
          <h1 className="lv-title">Leave Management</h1>
          <p className="lv-subtitle">Manage time off requests, balances, and team availability</p>
        </div>
        <div className="lv-header__actions">
          <button className="lv-btn">📅 Team Calendar</button>
          <button className="lv-btn lv-btn--primary" onClick={() => setShowApply(true)}>
            + Apply for Leave
          </button>
        </div>
      </div>

      {/* ── Balance Cards ── */}
      <div className="lv-balances">
        {leaveBalances.map((bal) => {
          const usedPct = (bal.used / bal.total) * 100;
          const pendingPct = ((bal.used + bal.pending) / bal.total) * 100;
          const remaining = bal.total - bal.used - bal.pending;
          return (
            <div key={bal.type} className="lv-balance-card">
              <div className="lv-bal__top">
                <div className="lv-bal__icon" style={{ background: `${bal.color}18` }}>
                  {bal.icon}
                </div>
                <div className="lv-bal__remaining">
                  <div className="lv-bal__days" style={{ color: bal.color }}>{remaining}</div>
                  <div className="lv-bal__of">of {bal.total} days left</div>
                </div>
              </div>
              <div className="lv-bal__label">{bal.label}</div>
              <div className="lv-bal__bar-wrap">
                <div className="lv-bal__track">
                  {bal.pending > 0 && (
                    <div
                      className="lv-bal__fill pending-overlay"
                      style={{ width: `${pendingPct}%`, background: bal.color, position: "absolute", top: 0 }}
                    />
                  )}
                  <div
                    className="lv-bal__fill"
                    style={{ width: `${usedPct}%`, background: bal.color }}
                  />
                </div>
              </div>
              <div className="lv-bal__stats">
                <span className="lv-bal__stat">
                  <span className="lv-bal__stat-dot" style={{ background: bal.color }} />
                  {bal.used} used
                </span>
                {bal.pending > 0 && (
                  <span className="lv-bal__stat">
                    <span className="lv-bal__stat-dot" style={{ background: `${bal.color}60` }} />
                    {bal.pending} pending
                  </span>
                )}
                <span className="lv-bal__stat">
                  <span className="lv-bal__stat-dot" style={{ background: "#E5E7EB" }} />
                  {remaining} left
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabs ── */}
      <div className="lv-tabs">
        <button
          className={`lv-tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Leaves
          {myPendingCount > 0 && <span className="lv-tab__badge">{myPendingCount}</span>}
        </button>
        <button
          className={`lv-tab ${activeTab === "team" ? "active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Team Overview
        </button>
        <button
          className={`lv-tab ${activeTab === "admin" ? "active" : ""}`}
          onClick={() => setActiveTab("admin")}
        >
          Approvals
          {pendingCount > 0 && <span className="lv-tab__badge">{pendingCount}</span>}
        </button>
      </div>

      {/* ══════ MY LEAVES TAB ══════ */}
      {activeTab === "my" && (
        <div className="lv-split">
          <div className="lv-card">
            <div className="lv-card__header">
              <div>
                <div className="lv-card__title">My Leave Requests</div>
                <div className="lv-card__subtitle">{filteredMy.length} requests</div>
              </div>
              <button className="lv-btn lv-btn--primary" onClick={() => setShowApply(true)}>
                + New Request
              </button>
            </div>

            {/* Filter bar */}
            <div className="lv-filter-bar">
              <select
                className="lv-filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="lv-filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="annual">Annual</option>
                <option value="sick">Sick</option>
                <option value="personal">Personal</option>
                <option value="wfh">WFH</option>
              </select>
            </div>

            <div className="lv-table-wrap">
              <table className="lv-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMy.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 0" }}>
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    filteredMy.map((req) => (
                      <LeaveRow
                        key={req.id}
                        req={req}
                        onView={setDetailReq}
                        onCancel={handleCancel}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calendar */}
          <MiniCal requests={myRequests} />
        </div>
      )}

      {/* ══════ TEAM TAB ══════ */}
      {activeTab === "team" && (
        <>
          {/* Quick stats */}
          <div className="lv-stats-row">
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#DBEAFE" }}>🌴</div>
              <div>
                <div className="lv-stat-mini__val" style={{ color: "#2563EB" }}>{onLeaveToday}</div>
                <div className="lv-stat-mini__lbl">On Leave Today</div>
              </div>
            </div>
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#FEF3C7" }}>⏳</div>
              <div>
                <div className="lv-stat-mini__val" style={{ color: "#D97706" }}>
                  {teamRequests.filter((r) => r.status === "pending").length}
                </div>
                <div className="lv-stat-mini__lbl">Pending Requests</div>
              </div>
            </div>
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#D1FAE5" }}>✓</div>
              <div>
                <div className="lv-stat-mini__val" style={{ color: "#059669" }}>
                  {teamRequests.filter((r) => r.status === "approved").length}
                </div>
                <div className="lv-stat-mini__lbl">Approved This Month</div>
              </div>
            </div>
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#F3F4F6" }}>👥</div>
              <div>
                <div className="lv-stat-mini__val">6</div>
                <div className="lv-stat-mini__lbl">Team Members</div>
              </div>
            </div>
          </div>

          <div className="lv-split">
            <div className="lv-card">
              <div className="lv-card__header">
                <div>
                  <div className="lv-card__title">Team Leave Schedule</div>
                  <div className="lv-card__subtitle">{filteredTeam.length} requests</div>
                </div>
              </div>
              <div className="lv-filter-bar">
                <div className="lv-search">
                  <span className="lv-search__icon">⌕</span>
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                </div>
                <select
                  className="lv-filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  className="lv-filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="annual">Annual</option>
                  <option value="sick">Sick</option>
                  <option value="wfh">WFH</option>
                  <option value="maternity">Maternity</option>
                </select>
              </div>
              <div className="lv-table-wrap">
                <table className="lv-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeam.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 0" }}>
                          No records found
                        </td>
                      </tr>
                    ) : (
                      filteredTeam.map((req) => (
                        <LeaveRow
                          key={req.id}
                          req={req}
                          showEmployee
                          onView={setDetailReq}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <MiniCal requests={teamRequests} />
          </div>
        </>
      )}

      {/* ══════ ADMIN / APPROVALS TAB ══════ */}
      {activeTab === "admin" && (
        <>
          <div className="lv-stats-row">
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#FEF3C7" }}>⏳</div>
              <div>
                <div className="lv-stat-mini__val" style={{ color: "#D97706" }}>
                  {teamRequests.filter((r) => r.status === "pending").length}
                </div>
                <div className="lv-stat-mini__lbl">Awaiting Approval</div>
              </div>
            </div>
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#D1FAE5" }}>✓</div>
              <div>
                <div className="lv-stat-mini__val" style={{ color: "#059669" }}>
                  {teamRequests.filter((r) => r.status === "approved").length}
                </div>
                <div className="lv-stat-mini__lbl">Approved</div>
              </div>
            </div>
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#FEE2E2" }}>✕</div>
              <div>
                <div className="lv-stat-mini__val" style={{ color: "#DC2626" }}>
                  {teamRequests.filter((r) => r.status === "rejected").length}
                </div>
                <div className="lv-stat-mini__lbl">Rejected</div>
              </div>
            </div>
            <div className="lv-stat-mini">
              <div className="lv-stat-mini__icon" style={{ background: "#EDE9FE" }}>📋</div>
              <div>
                <div className="lv-stat-mini__val">{teamRequests.length}</div>
                <div className="lv-stat-mini__lbl">Total This Month</div>
              </div>
            </div>
          </div>

          {/* Pending approvals */}
          {teamRequests.filter((r) => r.status === "pending").length > 0 && (
            <div className="lv-card" style={{ marginBottom: 16 }}>
              <div className="lv-card__header">
                <div>
                  <div className="lv-card__title">🔔 Pending Approvals</div>
                  <div className="lv-card__subtitle">Requires your action</div>
                </div>
                <button
                  className="lv-btn lv-btn--success"
                  onClick={() => {
                    teamRequests.filter((r) => r.status === "pending").forEach((r) => handleApprove(r.id));
                  }}
                >
                  ✓ Approve All
                </button>
              </div>
              <div className="lv-table-wrap">
                <table className="lv-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamRequests
                      .filter((r) => r.status === "pending")
                      .map((req) => (
                        <LeaveRow
                          key={req.id}
                          req={req}
                          showEmployee
                          isAdmin
                          onView={setDetailReq}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All requests */}
          <div className="lv-card">
            <div className="lv-card__header">
              <div>
                <div className="lv-card__title">All Requests</div>
                <div className="lv-card__subtitle">Full history</div>
              </div>
            </div>
            <div className="lv-filter-bar">
              <div className="lv-search">
                <span className="lv-search__icon">⌕</span>
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
              <select
                className="lv-filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="lv-table-wrap">
              <table className="lv-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...teamRequests, ...myRequests]
                    .filter((r) => {
                      const matchStatus = filterStatus === "all" || r.status === filterStatus;
                      const matchSearch = !searchQ || r.employeeName.toLowerCase().includes(searchQ.toLowerCase());
                      return matchStatus && matchSearch;
                    })
                    .map((req) => (
                      <LeaveRow
                        key={req.id}
                        req={req}
                        showEmployee
                        isAdmin
                        onView={setDetailReq}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Modals ── */}
      {showApply && (
        <ApplyModal onClose={() => setShowApply(false)} onSubmit={handleApplySubmit} />
      )}
      {detailReq && (
        <DetailModal req={detailReq} onClose={() => setDetailReq(null)} />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`lv-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
};

export default LeavePage;
