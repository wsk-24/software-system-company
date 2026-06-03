import React, { useState, useMemo } from "react";
import type { LeaveRequest, NewLeaveForm, LeaveType, LeavePeriod } from "../types/leave";
import {
  leaveBalances,
  publicHolidays,
  leaveTypeConfig,
} from "../data/leaveData";
import "./LeavePage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const calcDays = (start: string, end: string, period: LeavePeriod): number => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (s > e) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return period === "full" ? count : 0.5;
};

// ── Mini Calendar ──────────────────────────────────────────────────────────────
interface MiniCalProps {
  requests: LeaveRequest[];
}

const MiniCal: React.FC<MiniCalProps> = ({ requests }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const leaveMap: Record<number, string[]> = {};
  requests.forEach((req) => {
    if (req.status === "approved" || req.status === "pending") {
      const s = new Date(req.startDate);
      const e = new Date(req.endDate);
      const cur = new Date(s);
      while (cur <= e) {
        if (cur.getFullYear() === viewYear && cur.getMonth() === viewMonth) {
          const d = cur.getDate();
          if (!leaveMap[d]) leaveMap[d] = [];
          leaveMap[d].push(leaveTypeConfig[req.type]?.color ?? "#6B7280");
        }
        cur.setDate(cur.getDate() + 1);
      }
    }
  });

  const holidayDays = new Set(
    publicHolidays
      .filter((h) => {
        const parts = h.date.split(" ");
        const m = new Date(Date.parse(`${parts[0]} 1 2026`)).getMonth();
        return m === viewMonth;
      })
      .map((h) => parseInt(h.date.split(" ")[1]))
  );

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <div className="lv-mini-cal">
      <div className="lv-mini-cal__header">
        <span className="lv-mini-cal__title">{monthName}</span>
        <div className="lv-mini-cal__nav">
          <button onClick={prev}>‹</button>
          <button onClick={next}>›</button>
        </div>
      </div>
      <div className="lv-cal-grid">
        <div className="lv-cal-days-header">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="lv-cal-cells">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="lv-cal-cell other-month" />;
            const isToday =
              day === today.getDate() &&
              viewMonth === today.getMonth() &&
              viewYear === today.getFullYear();
            const isWeekend = (i % 7 === 0) || (i % 7 === 6);
            const isHoliday = holidayDays.has(day);
            const dots = leaveMap[day] ?? [];
            return (
              <div
                key={i}
                className={[
                  "lv-cal-cell",
                  isToday ? "today" : "",
                  isHoliday && !isToday ? "holiday" : "",
                  isWeekend && !isToday && !isHoliday ? "weekend" : "",
                ].filter(Boolean).join(" ")}
              >
                <span>{day}</span>
                {dots.length > 0 && !isToday && (
                  <div className="lv-cal-dots">
                    {dots.slice(0, 3).map((c, ci) => (
                      <span key={ci} className="lv-cal-dot" style={{ background: c }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Holidays */}
      <div style={{ padding: "0 14px 6px", borderTop: "1.5px solid #F3F4F6" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", padding: "10px 4px 4px" }}>
          Upcoming Holidays
        </div>
        <div className="lv-holidays">
          {publicHolidays.slice(0, 4).map((h) => (
            <div key={h.date} className="lv-holiday-item">
              <div className="lv-holiday-date">
                <div>{h.date.split(" ")[0]}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{h.date.split(" ")[1]}</div>
              </div>
              <div>
                <div className="lv-holiday-name">{h.name}</div>
                <div className="lv-holiday-day">{h.day}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Apply Leave Modal ──────────────────────────────────────────────────────────
interface ApplyModalProps {
  onClose: () => void;
  onSubmit: (form: NewLeaveForm) => void;
}

const defaultForm: NewLeaveForm = {
  type: "annual",
  startDate: "",
  endDate: "",
  period: "full",
  reason: "",
  coverBy: "",
};

const ApplyModal: React.FC<ApplyModalProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<NewLeaveForm>(defaultForm);

  const days = useMemo(
    () => calcDays(form.startDate, form.endDate, form.period),
    [form.startDate, form.endDate, form.period]
  );

  const balanceInfo = leaveBalances.find((b) => b.type === form.type);
  const remaining = balanceInfo ? balanceInfo.total - balanceInfo.used - balanceInfo.pending : 0;
  const overBalance = days > remaining;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    if (!form.startDate || !form.endDate || !form.reason.trim()) return;
    onSubmit(form);
  };

  const leaveTypes: LeaveType[] = ["annual", "sick", "personal", "wfh", "maternity", "paternity"];

  return (
    <div className="lv-modal-backdrop" onClick={handleBackdrop}>
      <div className="lv-modal">
        <div className="lv-modal__header">
          <h2 className="lv-modal__title">Apply for Leave</h2>
          <button className="lv-modal__close" onClick={onClose}>✕</button>
        </div>
        <p className="lv-modal__subtitle">Submit a new leave request for manager approval</p>

        <div className="lv-modal__body">
          {/* Leave type selector */}
          <div className="lv-form-row">
            <label className="lv-label">Leave Type</label>
            <div className="lv-type-selector">
              {leaveTypes.map((t) => {
                const cfg = leaveTypeConfig[t];
                return (
                  <div
                    key={t}
                    className={`lv-type-option ${form.type === t ? "selected" : ""}`}
                    style={form.type === t ? { borderColor: cfg.color, background: cfg.bg } : {}}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                  >
                    <span className="lv-type-option__icon">{cfg.icon}</span>
                    <span
                      className="lv-type-option__label"
                      style={{ color: form.type === t ? cfg.color : "#374151" }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="lv-form-row lv-form-row--2col">
            <div>
              <label className="lv-label">Start Date</label>
              <input
                type="date"
                className="lv-input"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    startDate: e.target.value,
                    endDate: f.endDate < e.target.value ? e.target.value : f.endDate,
                  }))
                }
              />
            </div>
            <div>
              <label className="lv-label">End Date</label>
              <input
                type="date"
                className="lv-input"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Period */}
          <div className="lv-form-row">
            <label className="lv-label">Period</label>
            <div className="lv-period-selector">
              {(["full", "morning", "afternoon"] as LeavePeriod[]).map((p) => (
                <div
                  key={p}
                  className={`lv-period-option ${form.period === p ? "selected" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, period: p }))}
                >
                  {p === "full" ? "Full Day" : p === "morning" ? "Morning" : "Afternoon"}
                </div>
              ))}
            </div>
          </div>

          {/* Duration box */}
          {days > 0 && (
            <div className="lv-form-row">
              <div className="lv-duration-box">
                <span className="lv-duration-box__label">
                  {days} day{days !== 1 ? "s" : ""} leave duration · {remaining - days} remaining after
                </span>
                <span className="lv-duration-box__days">{days}d</span>
              </div>
            </div>
          )}

          {/* Over balance warning */}
          {overBalance && (
            <div className="lv-form-row">
              <div className="lv-warn-box">
                ⚠️ This request exceeds your remaining {leaveTypeConfig[form.type]?.label} balance ({remaining} days). It may require special approval.
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="lv-form-row">
            <label className="lv-label">Reason</label>
            <textarea
              className="lv-textarea"
              placeholder="Please describe the reason for your leave..."
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            />
          </div>

          {/* Cover by */}
          <div className="lv-form-row">
            <label className="lv-label">Coverage (optional)</label>
            <input
              type="text"
              className="lv-input"
              placeholder="Who will cover your responsibilities?"
              value={form.coverBy}
              onChange={(e) => setForm((f) => ({ ...f, coverBy: e.target.value }))}
            />
          </div>

          <div className="lv-modal__footer">
            <button className="lv-btn" onClick={onClose}>Cancel</button>
            <button
              className="lv-btn lv-btn--primary"
              onClick={handleSubmit}
              disabled={!form.startDate || !form.endDate || !form.reason.trim()}
              style={{ opacity: (!form.startDate || !form.endDate || !form.reason.trim()) ? 0.5 : 1 }}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ApplyModal, MiniCal, formatDate, calcDays };
