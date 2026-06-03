import React, { useState, useMemo, useCallback } from "react";
import type { OTRecord, OTFormData, OTType, OTCompensation } from "../types/overtime";
import {
  otRecords as initialRecords,
  otSummaries as initialSummaries,
  deptStats,
  weeklyHours,
  avatarColors,
  deptColors,
  otTypeConfig,
  statusConfig,
  compensationConfig,
  employees,
} from "../data/overtimeData";
import "./OvertimePage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
const fmtCurrency = (n: number) => n === 0 ? "—" : `฿${n.toLocaleString()}`;
const calcHours = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return parseFloat((mins / 60).toFixed(1));
};
const calcPay = (hours: number, rate: number, basePH: number) => Math.round(hours * rate * basePH);

// ── Log OT Modal ──────────────────────────────────────────────────────────────
interface LogModalProps { onClose: () => void; onSubmit: (r: OTRecord) => void; }

const defaultForm: OTFormData = {
  employeeId: "E001", date: "", otType: "weekday",
  startTime: "", endTime: "", project: "", task: "", reason: "", compensation: "cash",
};

const LogModal: React.FC<LogModalProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<OTFormData>(defaultForm);
  const emp = employees.find(e => e.id === form.employeeId)!;
  const typeCfg = otTypeConfig[form.otType];
  const hours = calcHours(form.startTime, form.endTime);
  const totalPay = form.compensation === "comp_off" ? 0 : calcPay(hours, typeCfg.rate, emp.basePH);
  const valid = form.date && form.startTime && form.endTime && form.project && form.reason && hours > 0;

  const handleBackdrop = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };

  const handleSubmit = () => {
    if (!valid) return;
    const empData = employees.find(e => e.id === form.employeeId)!;
    const rec: OTRecord = {
      id: `OT${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: empData.name,
      employeeAvatar: empData.avatar,
      department: empData.dept,
      position: empData.position,
      date: form.date,
      dayOfWeek: new Date(form.date).toLocaleDateString("en-US", { weekday: "short" }),
      otType: form.otType,
      startTime: form.startTime,
      endTime: form.endTime,
      hours,
      project: form.project,
      task: form.task,
      reason: form.reason,
      status: "pending",
      compensation: form.compensation,
      rate: typeCfg.rate,
      baseSalaryPerHour: empData.basePH,
      totalPay,
      submittedOn: new Date().toISOString().split("T")[0],
    };
    onSubmit(rec);
  };

  const otTypes: OTType[] = ["weekday", "weekend", "holiday", "night"];
  const compTypes: OTCompensation[] = ["cash", "comp_off"];

  return (
    <div className="ot-modal-backdrop" onClick={handleBackdrop}>
      <div className="ot-modal">
        <div className="ot-modal__header">
          <h2 className="ot-modal__title">Log Overtime</h2>
          <button className="ot-modal__close" onClick={onClose}>✕</button>
        </div>
        <p className="ot-modal__sub">Record overtime hours for approval and payroll processing</p>
        <div className="ot-modal__body">

          {/* Employee */}
          <div className="ot-form-row">
            <label className="ot-label">Employee</label>
            <select className="ot-select-full" value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}
            </select>
          </div>

          {/* OT Type */}
          <div className="ot-form-row">
            <label className="ot-label">Overtime Type</label>
            <div className="ot-type-selector">
              {otTypes.map(t => {
                const cfg = otTypeConfig[t];
                return (
                  <div key={t}
                    className={`ot-type-opt ${form.otType === t ? "selected" : ""}`}
                    style={form.otType === t ? { borderColor: cfg.color, background: cfg.bg } : {}}
                    onClick={() => setForm(f => ({ ...f, otType: t }))}
                  >
                    <span className="ot-type-opt__icon">{cfg.icon}</span>
                    <span className="ot-type-opt__label" style={{ color: form.otType === t ? cfg.color : undefined }}>{cfg.label}</span>
                    <span className="ot-type-opt__rate">×{cfg.rate}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="ot-form-row ot-form-row--3">
            <div>
              <label className="ot-label">Date</label>
              <input type="date" className="ot-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="ot-label">Start Time</label>
              <input type="time" className="ot-input" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div>
              <label className="ot-label">End Time</label>
              <input type="time" className="ot-input" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>

          {/* Live calculation */}
          {hours > 0 && (
            <div className="ot-calc-box">
              <div>
                <div className="ot-calc-item__label">Hours</div>
                <div className="ot-calc-item__val">{hours}h</div>
              </div>
              <div>
                <div className="ot-calc-item__label">Rate</div>
                <div className="ot-calc-item__val">×{typeCfg.rate}</div>
              </div>
              <div>
                <div className="ot-calc-item__label">Est. Pay</div>
                <div className={`ot-calc-item__val ${form.compensation !== "comp_off" ? "highlight" : ""}`}>
                  {form.compensation === "comp_off" ? "Comp Off" : fmtCurrency(totalPay)}
                </div>
              </div>
            </div>
          )}

          {/* Project / Task */}
          <div className="ot-form-row ot-form-row--2">
            <div>
              <label className="ot-label">Project</label>
              <input type="text" className="ot-input" placeholder="Project name" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} />
            </div>
            <div>
              <label className="ot-label">Task</label>
              <input type="text" className="ot-input" placeholder="Specific task" value={form.task} onChange={e => setForm(f => ({ ...f, task: e.target.value }))} />
            </div>
          </div>

          {/* Reason */}
          <div className="ot-form-row">
            <label className="ot-label">Reason for Overtime</label>
            <textarea className="ot-textarea" placeholder="Explain why overtime was necessary..." value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          </div>

          {/* Compensation */}
          <div className="ot-form-row">
            <label className="ot-label">Compensation Method</label>
            <div className="ot-comp-selector">
              {compTypes.map(c => {
                const cfg = compensationConfig[c];
                return (
                  <div key={c} className={`ot-comp-opt ${form.compensation === c ? "selected" : ""}`}
                    onClick={() => setForm(f => ({ ...f, compensation: c }))}>
                    <span className="ot-comp-opt__icon">{cfg.icon}</span>
                    <span className="ot-comp-opt__label">{cfg.label}</span>
                    <span className="ot-comp-opt__sub">
                      {c === "cash" ? "Cash payment" : "Day off in lieu"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ot-modal__footer">
            <button className="ot-btn" onClick={onClose}>Cancel</button>
            <button className="ot-btn ot-btn--primary" onClick={handleSubmit}
              disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}>
              Submit OT Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal: React.FC<{ rec: OTRecord; onClose: () => void; onApprove: (id: string) => void; onReject: (id: string) => void; onPay: (id: string) => void }> =
  ({ rec, onClose, onApprove, onReject, onPay }) => {
    const tCfg = otTypeConfig[rec.otType];
    const sCfg = statusConfig[rec.status];
    const cCfg = compensationConfig[rec.compensation];
    const handleBackdrop = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };
    return (
      <div className="ot-modal-backdrop" onClick={handleBackdrop}>
        <div className="ot-detail-modal">
          <div className="ot-detail__banner">
            <div className="ot-detail__avatar" style={{ background: avatarColors[rec.employeeAvatar] }}>{rec.employeeAvatar}</div>
            <div style={{ flex: 1 }}>
              <div className="ot-detail__emp-name">{rec.employeeName}</div>
              <div className="ot-detail__emp-sub">{rec.position} · {rec.department}</div>
              <div className="ot-detail__id">{rec.id}</div>
            </div>
            <button className="ot-modal__close" onClick={onClose}>✕</button>
          </div>
          <div className="ot-detail__body">
            {/* Status banner */}
            <div style={{ display: "flex", gap: 8, padding: "14px 0", borderBottom: "1px solid #F3F4F6", alignItems: "center", flexWrap: "wrap" }}>
              <span className="ot-type-badge" style={{ background: tCfg.bg, color: tCfg.color }}>{tCfg.icon} {tCfg.label}</span>
              <span className="ot-status" style={{ background: sCfg.bg, color: sCfg.color }}>{sCfg.label}</span>
              <span style={{ fontSize: 12, color: cCfg.color }}>{cCfg.icon} {cCfg.label}</span>
            </div>

            {[ 
              ["Date", `${fmt(rec.date)} (${rec.dayOfWeek})`],
              ["Time", `${rec.startTime} – ${rec.endTime}`],
              ["Duration", `${rec.hours} hours`],
              ["OT Rate", `×${rec.rate} (${Math.round((rec.rate - 1) * 100)}% premium)`],
              ["Est. Pay", rec.compensation === "comp_off" ? "Comp Off Day" : fmtCurrency(rec.totalPay)],
              ["Project", rec.project],
              ["Task", rec.task || "—"],
              ["Submitted", fmt(rec.submittedOn)],
              ...(rec.approvedBy ? [["Reviewed By", rec.approvedBy]] : []),
              ...(rec.approvedOn ? [["Reviewed On", fmt(rec.approvedOn)]] : []),
              ...(rec.notes ? [["Notes", rec.notes]] : []),
            ].map(([label, val]) => (
              <div key={label} className="ot-detail-row">
                <span className="ot-detail-row__label">{label}</span>
                <span className="ot-detail-row__val">{val}</span>
              </div>
            ))}

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Reason</div>
              <div className="ot-detail__reason">{rec.reason}</div>
            </div>

            {rec.rejectedReason && (
              <div style={{ background: "#FEE2E2", border: "1.5px solid #FECACA", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#DC2626", marginTop: 8 }}>
                ✕ Rejection: {rec.rejectedReason}
              </div>
            )}
          </div>

          <div className="ot-detail__actions">
            {rec.status === "pending" && <>
              <button className="ot-btn ot-btn--sm ot-btn--approve" onClick={() => { onApprove(rec.id); onClose(); }}>✓ Approve</button>
              <button className="ot-btn ot-btn--sm ot-btn--reject" onClick={() => { onReject(rec.id); onClose(); }}>✕ Reject</button>
            </>}
            {rec.status === "approved" && rec.compensation !== "comp_off" && (
              <button className="ot-btn ot-btn--sm ot-btn--pay" onClick={() => { onPay(rec.id); onClose(); }}>💵 Mark as Paid</button>
            )}
            <button className="ot-btn ot-btn--sm" style={{ marginLeft: "auto" }} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

// ── Main Page ─────────────────────────────────────────────────────────────────
const OvertimePage: React.FC = () => {
  const [records, setRecords] = useState<OTRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<"records" | "summary" | "pending">("records");
  const [showLog, setShowLog] = useState(false);
  const [detailRec, setDetailRec] = useState<OTRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [sortKey, setSortKey] = useState<"date" | "hours" | "totalPay">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = useCallback((msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── KPI calculations ─────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const approved = records.filter(r => r.status === "approved" || r.status === "paid");
    const pending = records.filter(r => r.status === "pending");
    const totalHours = approved.reduce((s, r) => s + r.hours, 0);
    const totalPay = approved.filter(r => r.compensation === "cash").reduce((s, r) => s + r.totalPay, 0);
    const paidAmt = records.filter(r => r.status === "paid").reduce((s, r) => s + r.totalPay, 0);
    const unpaidAmt = records.filter(r => r.status === "approved" && r.compensation === "cash").reduce((s, r) => s + r.totalPay, 0);
    return { totalHours, totalPay, pendingCount: pending.length, paidAmt, unpaidAmt };
  }, [records]);

  // ── Filter & sort ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = [...records];
    if (filterStatus !== "all") r = r.filter(x => x.status === filterStatus);
    if (filterType !== "all") r = r.filter(x => x.otType === filterType);
    if (filterDept !== "all") r = r.filter(x => x.department === filterDept);
    if (searchQ) r = r.filter(x =>
      x.employeeName.toLowerCase().includes(searchQ.toLowerCase()) ||
      x.project.toLowerCase().includes(searchQ.toLowerCase()) ||
      x.id.toLowerCase().includes(searchQ.toLowerCase())
    );
    if (filterPeriod === "this_month") {
      const now = new Date();
      r = r.filter(x => {
        const d = new Date(x.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    }
    r.sort((a, b) => {
      let diff = 0;
      if (sortKey === "date") diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortKey === "hours") diff = a.hours - b.hours;
      if (sortKey === "totalPay") diff = a.totalPay - b.totalPay;
      return sortDir === "desc" ? -diff : diff;
    });
    return r;
  }, [records, filterStatus, filterType, filterDept, filterPeriod, searchQ, sortKey, sortDir]);

  const pendingRecords = useMemo(() => records.filter(r => r.status === "pending"), [records]);

  // ── Actions ───────────────────────────────────────────────────────────────────
  const handleApprove = useCallback((id: string) => {
    setRecords(prev => prev.map(r => r.id === id
      ? { ...r, status: "approved", approvedBy: "Sarah Kim", approvedOn: new Date().toISOString().split("T")[0] }
      : r));
    showToast("✓ OT record approved", "success");
  }, [showToast]);

  const handleReject = useCallback((id: string) => {
    setRecords(prev => prev.map(r => r.id === id
      ? { ...r, status: "rejected", approvedBy: "Sarah Kim", rejectedReason: "Insufficient justification", approvedOn: new Date().toISOString().split("T")[0] }
      : r));
    showToast("OT record rejected", "error");
  }, [showToast]);

  const handlePay = useCallback((id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "paid" } : r));
    showToast("💵 Marked as paid", "info");
  }, [showToast]);

  const handleLogSubmit = useCallback((rec: OTRecord) => {
    setRecords(prev => [rec, ...prev]);
    setShowLog(false);
    showToast("✓ Overtime record submitted", "success");
  }, [showToast]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const maxWeekHours = Math.max(...weeklyHours.map(w => w.hours));
  const maxDeptHours = Math.max(...deptStats.map(d => d.hours));

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="ot-page">

      {/* ── Header ── */}
      <div className="ot-header">
        <div className="ot-header__left">
          <h1 className="ot-title">
            Overtime Records
            {kpis.pendingCount > 0 && (
              <span className="ot-title__badge">⏳ {kpis.pendingCount} pending</span>
            )}
          </h1>
          <p className="ot-subtitle">Track, approve and process employee overtime hours &amp; compensation</p>
        </div>
        <div className="ot-header__actions">
          <button className="ot-btn ot-btn--export">⬇ Export CSV</button>
          <button className="ot-btn">📊 Payroll Summary</button>
          <button className="ot-btn ot-btn--primary" onClick={() => setShowLog(true)}>+ Log Overtime</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="ot-kpi-strip">
        {[
          { icon: "⏱", label: "Total OT Hours",     val: `${kpis.totalHours}h`,           color: "#2563EB", bg: "#DBEAFE", delta: "+8%",  dir: "up" },
          { icon: "💰", label: "Total OT Cost",      val: fmtCurrency(kpis.totalPay),       color: "#D97706", bg: "#FEF3C7", delta: "+12%", dir: "up" },
          { icon: "⏳", label: "Pending Approval",   val: `${kpis.pendingCount}`,            color: "#DC2626", bg: "#FEE2E2", delta: "-",    dir: "flat" },
          { icon: "✓",  label: "Paid This Month",    val: fmtCurrency(kpis.paidAmt),        color: "#059669", bg: "#D1FAE5", delta: "+5%",  dir: "up" },
          { icon: "📋", label: "Unpaid (Approved)",  val: fmtCurrency(kpis.unpaidAmt),      color: "#7C3AED", bg: "#EDE9FE", delta: "-3%",  dir: "down" },
        ].map((k) => (
          <div key={k.label} className="ot-kpi">
            <div className="ot-kpi__top">
              <div className="ot-kpi__icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
              <span className={`ot-kpi__delta ${k.dir}`}>{k.delta}</span>
            </div>
            <div className="ot-kpi__val">{k.val}</div>
            <div className="ot-kpi__label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="ot-charts-row">
        {/* Weekly bar */}
        <div className="ot-card">
          <div className="ot-card__header">
            <div>
              <div className="ot-card__title">Weekly OT Hours Trend</div>
              <div className="ot-card__sub">Last 6 weeks · all employees</div>
            </div>
          </div>
          <div className="ot-bar-chart">
            {weeklyHours.map((w, i) => (
              <div key={w.week} className="ot-bar-group">
                <div className="ot-bar-wrap">
                  <div
                    className="ot-bar"
                    style={{
                      height: `${(w.hours / maxWeekHours) * 100}%`,
                      background: i === weeklyHours.length - 1 ? "#111827" : "#E5E7EB",
                      animationDelay: `${0.05 + i * 0.08}s`,
                    }}
                    title={`${w.hours}h`}
                  >
                    <span className="ot-bar-val">{w.hours}h</span>
                  </div>
                </div>
                <span className="ot-bar-label">{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dept breakdown */}
        <div className="ot-card">
          <div className="ot-card__header">
            <div>
              <div className="ot-card__title">By Department</div>
              <div className="ot-card__sub">Hours distribution</div>
            </div>
          </div>
          <div className="ot-dept-list">
            {deptStats.map(d => (
              <div key={d.dept} className="ot-dept-row">
                <div className="ot-dept-row__top">
                  <span className="ot-dept-name">
                    <span className="ot-dept-dot" style={{ background: d.color }} />
                    {d.dept}
                  </span>
                  <span className="ot-dept-stat">{d.hours}h · {fmtCurrency(d.amount)}</span>
                </div>
                <div className="ot-dept-bar">
                  <div className="ot-dept-fill" style={{ width: `${(d.hours / maxDeptHours) * 100}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="ot-tabs">
        <button className={`ot-tab ${activeTab === "records" ? "active" : ""}`} onClick={() => setActiveTab("records")}>
          All Records
        </button>
        <button className={`ot-tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>
          Pending Approval
          {kpis.pendingCount > 0 && <span className="ot-tab__badge">{kpis.pendingCount}</span>}
        </button>
        <button className={`ot-tab ${activeTab === "summary" ? "active" : ""}`} onClick={() => setActiveTab("summary")}>
          Employee Summary
        </button>
      </div>

      {/* ══ ALL RECORDS TAB ══ */}
      {(activeTab === "records") && (
        <div className="ot-card">
          <div className="ot-card__header">
            <div>
              <div className="ot-card__title">Overtime Log</div>
              <div className="ot-card__sub">{filtered.length} records</div>
            </div>
            <div className="ot-card__actions">
              <div className="ot-period-chips">
                {[["all","All Time"],["this_month","This Month"]].map(([v,l]) => (
                  <button key={v} className={`ot-period-chip ${filterPeriod === v ? "active" : ""}`}
                    onClick={() => setFilterPeriod(v)}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="ot-filter-bar">
            <div className="ot-search">
              <span className="ot-search__icon">⌕</span>
              <input type="text" placeholder="Search name, project, ID…" value={searchQ}
                onChange={e => setSearchQ(e.target.value)} />
            </div>
            <select className="ot-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
            <select className="ot-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="weekday">Weekday</option>
              <option value="weekend">Weekend</option>
              <option value="holiday">Holiday</option>
              <option value="night">Night Shift</option>
            </select>
            <select className="ot-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="all">All Depts</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Backend">Backend</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product</option>
            </select>
            {(filterStatus !== "all" || filterType !== "all" || filterDept !== "all" || searchQ) && (
              <button className="ot-btn ot-btn--sm" style={{ color: "#DC2626", borderColor: "#FECACA" }}
                onClick={() => { setFilterStatus("all"); setFilterType("all"); setFilterDept("all"); setSearchQ(""); }}>
                ✕ Clear
              </button>
            )}
          </div>

          <div className="ot-table-wrap">
            <table className="ot-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th className={`sortable ${sortKey === "date" ? "sorted" : ""}`} onClick={() => toggleSort("date")}>
                    Date {sortKey === "date" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th>Type</th>
                  <th className={`sortable ${sortKey === "hours" ? "sorted" : ""}`} onClick={() => toggleSort("hours")}>
                    Hours {sortKey === "hours" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th>Project / Task</th>
                  <th className={`sortable ${sortKey === "totalPay" ? "sorted" : ""}`} onClick={() => toggleSort("totalPay")}>
                    Pay {sortKey === "totalPay" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}>
                    <div className="ot-empty">
                      <div className="ot-empty__icon">📋</div>
                      No records match your filters
                    </div>
                  </td></tr>
                ) : filtered.map(rec => {
                  const tCfg = otTypeConfig[rec.otType];
                  const sCfg = statusConfig[rec.status];
                  return (
                    <tr key={rec.id}>
                      <td>
                        <div className="ot-emp">
                          <div className="ot-emp__avatar" style={{ background: avatarColors[rec.employeeAvatar] }}>{rec.employeeAvatar}</div>
                          <div>
                            <div className="ot-emp__name">{rec.employeeName}</div>
                            <div className="ot-emp__dept">{rec.department}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ot-date__main">{fmt(rec.date)}</div>
                        <div className="ot-date__day">{rec.dayOfWeek}</div>
                      </td>
                      <td>
                        <span className="ot-type-badge" style={{ background: tCfg.bg, color: tCfg.color }}>
                          {tCfg.icon} {tCfg.label}
                        </span>
                      </td>
                      <td>
                        <div className="ot-time__hours">{rec.hours}h</div>
                        <div className="ot-time__range">{rec.startTime}–{rec.endTime}</div>
                      </td>
                      <td>
                        <div className="ot-project__name">{rec.project}</div>
                        <div className="ot-project__task">{rec.task || "—"}</div>
                      </td>
                      <td>
                        <div className="ot-pay__rate">×{rec.rate}</div>
                        <div className="ot-pay__amount">
                          {rec.compensation === "comp_off" ? <span style={{ color: "#7C3AED", fontSize: 12 }}>📆 Comp Off</span> : fmtCurrency(rec.totalPay)}
                        </div>
                      </td>
                      <td>
                        <span className="ot-status" style={{ background: sCfg.bg, color: sCfg.color }}>{sCfg.label}</span>
                      </td>
                      <td>
                        <div className="ot-row-actions">
                          <button className="ot-btn ot-btn--sm" style={{ color: "#2563EB", borderColor: "#BFDBFE" }}
                            onClick={() => setDetailRec(rec)}>View</button>
                          {rec.status === "pending" && <>
                            <button className="ot-btn ot-btn--sm ot-btn--approve" onClick={() => handleApprove(rec.id)}>✓</button>
                            <button className="ot-btn ot-btn--sm ot-btn--reject" onClick={() => handleReject(rec.id)}>✕</button>
                          </>}
                          {rec.status === "approved" && rec.compensation !== "comp_off" && (
                            <button className="ot-btn ot-btn--sm ot-btn--pay" onClick={() => handlePay(rec.id)}>Pay</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ PENDING TAB ══ */}
      {activeTab === "pending" && (
        <div className="ot-card">
          <div className="ot-card__header">
            <div>
              <div className="ot-card__title">🔔 Pending Approval</div>
              <div className="ot-card__sub">{pendingRecords.length} records awaiting review</div>
            </div>
            {pendingRecords.length > 0 && (
              <button className="ot-btn ot-btn--approve"
                onClick={() => { pendingRecords.forEach(r => handleApprove(r.id)); showToast("✓ All approved", "success"); }}>
                ✓ Approve All
              </button>
            )}
          </div>
          <div className="ot-table-wrap">
            <table className="ot-table">
              <thead>
                <tr>
                  <th>Employee</th><th>Date</th><th>Type</th>
                  <th>Hours</th><th>Project / Task</th><th>Est. Pay</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRecords.length === 0 ? (
                  <tr><td colSpan={7}>
                    <div className="ot-empty">
                      <div className="ot-empty__icon">✓</div>
                      All caught up — no pending records
                    </div>
                  </td></tr>
                ) : pendingRecords.map(rec => {
                  const tCfg = otTypeConfig[rec.otType];
                  return (
                    <tr key={rec.id}>
                      <td>
                        <div className="ot-emp">
                          <div className="ot-emp__avatar" style={{ background: avatarColors[rec.employeeAvatar] }}>{rec.employeeAvatar}</div>
                          <div>
                            <div className="ot-emp__name">{rec.employeeName}</div>
                            <div className="ot-emp__dept">{rec.department}</div>
                          </div>
                        </div>
                      </td>
                      <td><div className="ot-date__main">{fmt(rec.date)}</div><div className="ot-date__day">{rec.dayOfWeek}</div></td>
                      <td><span className="ot-type-badge" style={{ background: tCfg.bg, color: tCfg.color }}>{tCfg.icon} {tCfg.label}</span></td>
                      <td><div className="ot-time__hours">{rec.hours}h</div><div className="ot-time__range">{rec.startTime}–{rec.endTime}</div></td>
                      <td><div className="ot-project__name">{rec.project}</div><div className="ot-project__task">{rec.task}</div></td>
                      <td><div className="ot-pay__amount">{rec.compensation === "comp_off" ? "Comp Off" : fmtCurrency(rec.totalPay)}</div></td>
                      <td>
                        <div className="ot-row-actions">
                          <button className="ot-btn ot-btn--sm" style={{ color: "#2563EB", borderColor: "#BFDBFE" }} onClick={() => setDetailRec(rec)}>View</button>
                          <button className="ot-btn ot-btn--sm ot-btn--approve" onClick={() => handleApprove(rec.id)}>✓ Approve</button>
                          <button className="ot-btn ot-btn--sm ot-btn--reject" onClick={() => handleReject(rec.id)}>✕ Reject</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ SUMMARY TAB ══ */}
      {activeTab === "summary" && (
        <div className="ot-card">
          <div className="ot-card__header">
            <div>
              <div className="ot-card__title">Employee OT Summary</div>
              <div className="ot-card__sub">Cumulative overtime by employee · June 2026</div>
            </div>
          </div>
          <div className="ot-table-wrap">
            <table className="ot-summary-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Total Hours</th>
                  <th>Approved</th>
                  <th>Pending</th>
                  <th>Cash Pay</th>
                  <th>Paid</th>
                  <th>Unpaid</th>
                  <th>Records</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {initialSummaries.map(s => {
                  const maxH = Math.max(...initialSummaries.map(x => x.totalHours));
                  return (
                    <tr key={s.employeeId}>
                      <td>
                        <div className="ot-emp">
                          <div className="ot-emp__avatar" style={{ background: avatarColors[s.employeeAvatar] }}>{s.employeeAvatar}</div>
                          <div>
                            <div className="ot-emp__name">{s.employeeName}</div>
                            <div className="ot-emp__dept" style={{ color: deptColors[s.department] ?? "#6B7280" }}>{s.department}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ot-inline-bar">
                          <div className="ot-inline-bar__track">
                            <div className="ot-inline-bar__fill" style={{ width: `${(s.totalHours / maxH) * 100}%`, background: deptColors[s.department] ?? "#2563EB" }} />
                          </div>
                          <span className="ot-inline-bar__label">{s.totalHours}h</span>
                        </div>
                      </td>
                      <td style={{ color: "#059669", fontWeight: 600 }}>{s.approvedHours}h</td>
                      <td style={{ color: s.pendingHours > 0 ? "#D97706" : "#9CA3AF", fontWeight: 600 }}>{s.pendingHours}h</td>
                      <td style={{ fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{fmtCurrency(s.totalPay)}</td>
                      <td style={{ color: "#059669" }}>{fmtCurrency(s.paidAmount)}</td>
                      <td style={{ color: s.unpaidAmount > 0 ? "#D97706" : "#9CA3AF" }}>{fmtCurrency(s.unpaidAmount)}</td>
                      <td style={{ color: "#6B7280" }}>{s.recordCount}</td>
                      <td>
                        <div className={`ot-trend ${s.trend}`}>
                          {s.trend === "up" ? "↑" : s.trend === "down" ? "↓" : "→"}
                          {s.trendPct > 0 && ` ${s.trendPct}%`}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showLog && <LogModal onClose={() => setShowLog(false)} onSubmit={handleLogSubmit} />}
      {detailRec && (
        <DetailModal rec={detailRec} onClose={() => setDetailRec(null)}
          onApprove={handleApprove} onReject={handleReject} onPay={handlePay} />
      )}

      {/* ── Toast ── */}
      {toast && <div className={`ot-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default OvertimePage;
