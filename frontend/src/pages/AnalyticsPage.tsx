import React, { useState, useMemo, useRef, useCallback } from "react";
import type { DateRange } from "../types/analytics";
import {
  metricCards,
  revenueChartSeries,
  usersChartSeries,
  labels12m,
  deviceData,
  sourceData,
  funnelSteps,
  topPages,
  topCountries,
  heatmapData,
  cohortData,
  realtimeEvents,
  goals,
  revenueBreakdown
} from "../data/analyticsData";
import "./AnalyticsPage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtNum = (n: number, compact = false): string => {
  if (compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  }
  return n.toLocaleString();
};
const fmtCur = (n: number): string =>
  n >= 1_000_000 ? `฿${(n / 1_000_000).toFixed(2)}M` : `฿${n.toLocaleString()}`;

// ── SVG Sparkline ─────────────────────────────────────────────────────────────
const Sparkline: React.FC<{
  data: number[];
  color: string;
  width?: number;
  height?: number;
}> = ({ data, color, width = 80, height = 32 }) => {
  const min = Math.min(...data),
    max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * (height - 4) - 2
  ]);
  const d = pts
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`
    )
    .join(" ");
  const area = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} className="an-sparkline">
      <defs>
        <linearGradient
          id={`spark-${color.slice(1)}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.slice(1)})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ── SVG Line/Area Chart ───────────────────────────────────────────────────────
const LineChart: React.FC<{
  series: { id: string; label: string; color: string; data: number[] }[];
  labels: string[];
  height?: number;
  area?: boolean;
  formatY?: (n: number) => string;
}> = ({ series, labels, height = 200, area = true, formatY = fmtNum }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    values: string[];
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 560,
    H = height,
    padL = 48,
    padR = 12,
    padT = 10,
    padB = 26;
  const allVals = series.flatMap((s) => s.data);
  const maxV = Math.max(...allVals) * 1.1 || 1;
  const minV = 0;
  const range = maxV - minV;

  const toX = (i: number) =>
    padL + (i / (labels.length - 1)) * (W - padL - padR);
  const toY = (v: number) =>
    padT + (1 - (v - minV) / range) * (H - padT - padB);

  const path = (data: number[]) =>
    data
      .map(
        (v, i) =>
          `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`
      )
      .join(" ");

  const areaPath = (data: number[]) => {
    const last = data.length - 1;
    return `${path(data)} L${toX(last).toFixed(1)},${(H - padB).toFixed(
      1
    )} L${toX(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;
  };

  // grid lines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const v = minV + (range * i) / gridCount;
    return { y: toY(v), label: formatY(Math.round(v), true) };
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const svgX = (px / rect.width) * W;
      const idx = Math.round(
        ((svgX - padL) / (W - padL - padR)) * (labels.length - 1)
      );
      const clamped = Math.max(0, Math.min(labels.length - 1, idx));
      setTooltip({
        x: (toX(clamped) / W) * 100,
        y: Math.min(...series.map((s) => toY(s.data[clamped]))),
        label: labels[clamped],
        values: series.map((s) => `${s.label}: ${formatY(s.data[clamped])}`)
      });
    },
    [labels, series]
  );

  return (
    <div className="an-chart-wrap" onMouseLeave={() => setTooltip(null)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="an-chart-svg"
        onMouseMove={handleMouseMove}
        style={{ cursor: "crosshair" }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.id}
              id={`area-${s.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={padL}
              y1={g.y}
              x2={W - padR}
              y2={g.y}
              stroke="#F3F4F6"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={g.y + 3.5}
              className="an-grid-label"
              textAnchor="end"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {area &&
          series.map((s, si) => (
            <path
              key={`area-${si}`}
              d={areaPath(s.data)}
              fill={s.color === "#E5E7EB" ? "none" : `url(#area-${s.id})`}
            />
          ))}

        {/* Lines */}
        {series.map((s, si) => (
          <path
            key={`line-${si}`}
            d={path(s.data)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.color === "#E5E7EB" ? 1.5 : 2}
            strokeDasharray={s.color === "#E5E7EB" ? "5,4" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* X labels */}
        {labels.map((lbl, i) => {
          if (i % Math.ceil(labels.length / 8) !== 0 && i !== labels.length - 1)
            return null;
          return (
            <text
              key={i}
              x={toX(i)}
              y={H - padB + 14}
              className="an-axis-label"
            >
              {lbl}
            </text>
          );
        })}

        {/* Hover vertical line */}
        {tooltip &&
          (() => {
            const xi = labels.indexOf(tooltip.label);
            if (xi < 0) return null;
            return (
              <line
                x1={toX(xi)}
                y1={padT}
                x2={toX(xi)}
                y2={H - padB}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            );
          })()}
      </svg>

      {tooltip && (
        <div
          className="an-tooltip"
          style={{ left: `${tooltip.x}%`, top: `${tooltip.y}px` }}
        >
          <div className="an-tooltip__title">{tooltip.label}</div>
          {tooltip.values.map((v, i) => (
            <div key={i}>{v}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart: React.FC<{
  data: { label: string; value: number }[];
  colors: string[];
  size?: number;
  centerLabel?: string;
}> = ({ data, colors, size = 130, centerLabel = "Total" }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - 20) / 2;
  const cx = size / 2,
    cy = size / 2;
  const circum = 2 * Math.PI * r;
  let offset = 0;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const dash = pct * circum;
    const gap = circum - dash;
    const slice = { offset, dash, gap, color: colors[i], label: d.label, pct };
    offset += dash;
    return slice;
  });

  return (
    <div className="an-donut-wrap">
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size} className="an-donut-svg">
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={12}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          ))}
          <circle cx={cx} cy={cy} r={r - 8} fill="#fff" />
        </svg>
        <div className="an-donut-center">
          <div className="an-donut-val">
            {total >= 1000 ? fmtNum(total, true) : total}
          </div>
          <div className="an-donut-lbl">{centerLabel}</div>
        </div>
      </div>
      <div className="an-donut-legend">
        {data.map((d, i) => (
          <div key={d.label} className="an-donut-legend-item">
            <div className="an-donut-legend-left">
              <div
                className="an-donut-legend-dot"
                style={{ background: colors[i] }}
              />
              <span className="an-donut-legend-label">{d.label}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="an-donut-legend-val">{d.value.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Heatmap ───────────────────────────────────────────────────────────────────
const Heatmap: React.FC = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxVal = Math.max(...heatmapData.map((c) => c.value));
  const getColor = (v: number) => {
    const intensity = v / maxVal;
    if (intensity < 0.1) return "#F3F4F6";
    if (intensity < 0.3) return "#DBEAFE";
    if (intensity < 0.55) return "#93C5FD";
    if (intensity < 0.75) return "#3B82F6";
    return "#1D4ED8";
  };
  const [tip, setTip] = useState<{
    day: string;
    hour: string;
    val: number;
  } | null>(null);

  return (
    <div>
      <div className="an-heatmap-wrap">
        <div className="an-heatmap">
          {/* Header row */}
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="an-heatmap-header-cell">
              {h === 0
                ? "12a"
                : h < 12
                ? `${h}a`
                : h === 12
                ? "12p"
                : `${h - 12}p`}
            </div>
          ))}
          {/* Rows */}
          {days.map((day, di) => (
            <React.Fragment key={day}>
              <div className="an-heatmap-day-label">{day}</div>
              {Array.from({ length: 24 }, (_, h) => {
                const cell = heatmapData.find(
                  (c) => c.day === di && c.hour === h
                );
                const val = cell?.value ?? 0;
                return (
                  <div
                    key={h}
                    className="an-heatmap-cell"
                    style={{ background: getColor(val) }}
                    onMouseEnter={() => setTip({ day, hour: `${h}:00`, val })}
                    onMouseLeave={() => setTip(null)}
                    title={`${day} ${h}:00 — ${fmtNum(val)} sessions`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="an-heatmap-legend">
        <span>Less</span>
        <div className="an-heatmap-legend-scale">
          {["#F3F4F6", "#DBEAFE", "#93C5FD", "#3B82F6", "#1D4ED8"].map((c) => (
            <div
              key={c}
              className="an-heatmap-legend-swatch"
              style={{ background: c }}
            />
          ))}
        </div>
        <span>More</span>
        {tip && (
          <span style={{ marginLeft: 12, color: "#374151", fontWeight: 500 }}>
            {tip.day} {tip.hour} — {fmtNum(tip.val)} sessions
          </span>
        )}
      </div>
    </div>
  );
};

// ── Cohort Table ──────────────────────────────────────────────────────────────
const CohortTable: React.FC = () => {
  const getCell = (v: number) => {
    if (v === 0) return { bg: "#F9FAFB", color: "#D1D5DB" };
    if (v === 100) return { bg: "#111827", color: "#fff" };
    if (v >= 70) return { bg: "#1D4ED8", color: "#fff" };
    if (v >= 50) return { bg: "#3B82F6", color: "#fff" };
    if (v >= 35) return { bg: "#93C5FD", color: "#1E3A8A" };
    if (v >= 20) return { bg: "#DBEAFE", color: "#1E40AF" };
    return { bg: "#EFF6FF", color: "#2563EB" };
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="an-cohort">
        <thead>
          <tr>
            <th>Cohort</th>
            {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => (
              <th key={m}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohortData.map((row) => (
            <tr key={row.cohort}>
              <td>{row.cohort}</td>
              {row.periods.map((v, i) => {
                const { bg, color } = getCell(v);
                return (
                  <td
                    key={i}
                    style={{ background: bg, color, borderRadius: 5 }}
                  >
                    {v > 0 ? `${v}%` : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AnalyticsPageComponent: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [revenueTab, setRevenueTab] = useState<"trend" | "breakdown">("trend");
  const [usersTab, setUsersTab] = useState<"trend" | "devices">("trend");
  const [topTab, setTopTab] = useState<"pages" | "countries">("pages");

  const dateRanges: { id: DateRange; label: string }[] = [
    { id: "7d", label: "7D" },
    { id: "30d", label: "30D" },
    { id: "90d", label: "90D" },
    { id: "12m", label: "12M" },
    { id: "ytd", label: "YTD" }
  ];

  const donutColors = {
    device: ["#2563EB", "#E5E7EB", "#93C5FD"],
    source: ["#2563EB", "#059669", "#7C3AED", "#D97706", "#0891B2"],
    revenue: ["#2563EB", "#059669", "#7C3AED", "#D97706"]
  };

  return (
    <div className="an-page">
      {/* ── Header ── */}
      <div className="an-header">
        <div className="an-header__left">
          <h1 className="an-title">Analytics</h1>
          <div className="an-subtitle">
            <div className="an-live-dot" />
            Live · Last updated just now · All data in THB unless noted
          </div>
        </div>
        <div className="an-header__right">
          <div className="an-date-group">
            {dateRanges.map((r) => (
              <button
                key={r.id}
                className={`an-date-btn ${dateRange === r.id ? "active" : ""}`}
                onClick={() => setDateRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="an-btn">⬇ Export</button>
          <button className="an-btn an-btn--primary">⚙ Configure</button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="an-kpi-grid">
        {metricCards.map((card) => {
          const isDown = card.delta < 0;
          const isGoodDown = card.id === "bounce"; // lower bounce = good
          const deltaClass = isDown
            ? isGoodDown
              ? "down-good"
              : "down"
            : "up";
          const sign = isDown ? "" : "+";
          return (
            <div key={card.id} className="an-kpi">
              <div className="an-kpi__top">
                <div
                  className="an-kpi__icon"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div className={`an-kpi__delta ${deltaClass}`}>
                  {sign}
                  {card.delta}%
                </div>
              </div>
              <div className="an-kpi__val" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="an-kpi__label">{card.title}</div>
              <Sparkline data={card.sparkline} color={card.color} />
            </div>
          );
        })}
      </div>

      {/* ── Row 1: Revenue + Realtime ── */}
      <div className="an-row an-row--3-2">
        {/* Revenue chart */}
        <div className="an-card" style={{ animationDelay: "0.12s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Revenue</div>
              <div className="an-card__sub">
                Monthly trend vs target · {dateRange.toUpperCase()}
              </div>
            </div>
            <div className="an-card__actions">
              <div className="an-seg-tabs" style={{ marginBottom: 0 }}>
                <button
                  className={`an-seg-tab ${
                    revenueTab === "trend" ? "active" : ""
                  }`}
                  onClick={() => setRevenueTab("trend")}
                >
                  Trend
                </button>
                <button
                  className={`an-seg-tab ${
                    revenueTab === "breakdown" ? "active" : ""
                  }`}
                  onClick={() => setRevenueTab("breakdown")}
                >
                  Breakdown
                </button>
              </div>
            </div>
          </div>
          <div className="an-card__body">
            {revenueTab === "trend" ? (
              <>
                <div className="an-legend" style={{ marginBottom: 12 }}>
                  {revenueChartSeries.map((s) => (
                    <div key={s.id} className="an-legend-item">
                      <div
                        className="an-legend-dot"
                        style={{ background: s.color }}
                      />
                      {s.label}
                    </div>
                  ))}
                </div>
                <LineChart
                  series={revenueChartSeries}
                  labels={labels12m}
                  height={200}
                  formatY={(n) => fmtCur(n)}
                />
              </>
            ) : (
              <DonutChart
                data={revenueBreakdown}
                colors={donutColors.revenue}
                size={150}
                centerLabel="฿8.47M"
              />
            )}
          </div>
        </div>

        {/* Realtime feed */}
        <div className="an-card" style={{ animationDelay: "0.16s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Real-time Events</div>
              <div className="an-card__sub">Live activity stream</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "#059669",
                fontWeight: 600
              }}
            >
              <div className="an-live-dot" />
              Live
            </div>
          </div>
          <div className="an-card__body" style={{ padding: "12px 20px" }}>
            <div className="an-summary-stats">
              <div className="an-stat-box">
                <div className="an-stat-box__val" style={{ color: "#059669" }}>
                  1,284
                </div>
                <div className="an-stat-box__label">Active now</div>
              </div>
              <div className="an-stat-box">
                <div className="an-stat-box__val" style={{ color: "#2563EB" }}>
                  ฿42K
                </div>
                <div className="an-stat-box__label">Revenue/hr</div>
              </div>
              <div className="an-stat-box">
                <div className="an-stat-box__val">18</div>
                <div className="an-stat-box__label">Signups/hr</div>
              </div>
            </div>
            <div className="an-realtime">
              {realtimeEvents.map((ev, i) => (
                <div
                  key={i}
                  className="an-realtime-item"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div
                    className="an-realtime-icon"
                    style={{ background: ev.color + "18", color: ev.color }}
                  >
                    {ev.icon}
                  </div>
                  <div className="an-realtime-body">
                    <div className="an-realtime-label">{ev.label}</div>
                    <div className="an-realtime-sub">{ev.sub}</div>
                  </div>
                  <div className="an-realtime-time">{ev.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Users + Traffic ── */}
      <div className="an-row an-row--3-2">
        {/* Users chart */}
        <div className="an-card" style={{ animationDelay: "0.14s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Users</div>
              <div className="an-card__sub">
                New vs returning · {dateRange.toUpperCase()}
              </div>
            </div>
            <div className="an-seg-tabs" style={{ marginBottom: 0 }}>
              <button
                className={`an-seg-tab ${usersTab === "trend" ? "active" : ""}`}
                onClick={() => setUsersTab("trend")}
              >
                Trend
              </button>
              <button
                className={`an-seg-tab ${
                  usersTab === "devices" ? "active" : ""
                }`}
                onClick={() => setUsersTab("devices")}
              >
                Devices
              </button>
            </div>
          </div>
          <div className="an-card__body">
            {usersTab === "trend" ? (
              <>
                <div className="an-legend" style={{ marginBottom: 12 }}>
                  {usersChartSeries.map((s) => (
                    <div key={s.id} className="an-legend-item">
                      <div
                        className="an-legend-dot"
                        style={{ background: s.color }}
                      />
                      {s.label}
                    </div>
                  ))}
                </div>
                <LineChart
                  series={usersChartSeries}
                  labels={labels12m}
                  height={200}
                  formatY={(n) => fmtNum(n, true)}
                />
              </>
            ) : (
              <DonutChart
                data={deviceData}
                colors={donutColors.device}
                size={150}
                centerLabel="Devices"
              />
            )}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="an-card" style={{ animationDelay: "0.18s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Traffic Sources</div>
              <div className="an-card__sub">Where visitors come from</div>
            </div>
          </div>
          <div className="an-card__body">
            <DonutChart
              data={sourceData}
              colors={donutColors.source}
              size={130}
              centerLabel="Sources"
            />
          </div>
        </div>
      </div>

      {/* ── Row 3: Funnel + Goals ── */}
      <div className="an-row an-row--2-1">
        {/* Conversion funnel */}
        <div className="an-card" style={{ animationDelay: "0.16s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Conversion Funnel</div>
              <div className="an-card__sub">
                Visitor → paying customer pipeline
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#7C3AED",
                background: "#EDE9FE",
                padding: "3px 9px",
                borderRadius: 20
              }}
            >
              {funnelSteps[funnelSteps.length - 1].pct}% overall
            </span>
          </div>
          <div className="an-card__body">
            <div className="an-funnel">
              {funnelSteps.map((step, i) => {
                const prev = i > 0 ? funnelSteps[i - 1] : null;
                const dropPct = prev
                  ? (((prev.value - step.value) / prev.value) * 100).toFixed(0)
                  : null;
                return (
                  <React.Fragment key={step.label}>
                    <div className="an-funnel-step">
                      <span className="an-funnel-label">{step.label}</span>
                      <div className="an-funnel-bar-wrap">
                        <div className="an-funnel-track">
                          <div
                            className="an-funnel-fill"
                            style={{
                              width: `${step.pct}%`,
                              background: step.color,
                              animationDelay: `${i * 0.1}s`
                            }}
                          >
                            {step.pct >= 5 && `${step.pct}%`}
                          </div>
                        </div>
                      </div>
                      <span className="an-funnel-val">
                        {fmtNum(step.value, true)}
                      </span>
                      <span className="an-funnel-pct">{step.pct}%</span>
                    </div>
                    {dropPct && i < funnelSteps.length - 1 && (
                      <div className="an-funnel-drop">↓ {dropPct}% drop</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="an-card" style={{ animationDelay: "0.20s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Goals</div>
              <div className="an-card__sub">Quarterly targets progress</div>
            </div>
          </div>
          <div className="an-card__body">
            <div className="an-goal-list">
              {goals.map((g, i) => {
                const pct = Math.min(100, (g.current / g.target) * 100);
                const isReverse = g.id === "g4"; // churn — lower is better
                const isGood = isReverse ? g.current <= g.target : pct >= 80;
                return (
                  <div key={g.id} className="an-goal-item">
                    <div className="an-goal-header">
                      <span className="an-goal-label">{g.label}</span>
                      <span className="an-goal-deadline">Due {g.deadline}</span>
                    </div>
                    <div className="an-goal-bar">
                      <div
                        className="an-goal-fill"
                        style={{
                          width: `${pct}%`,
                          background: isGood ? g.color : "#DC2626",
                          animationDelay: `${0.2 + i * 0.1}s`
                        }}
                      />
                    </div>
                    <div className="an-goal-meta">
                      <span>
                        {g.unit}
                        {typeof g.current === "number" && g.current > 10000
                          ? fmtNum(g.current, true)
                          : g.current}
                        {g.unit === "%" ? "" : ""}
                        {" / "}
                        {g.unit}
                        {typeof g.target === "number" && g.target > 10000
                          ? fmtNum(g.target, true)
                          : g.target}
                      </span>
                      <span
                        className="an-goal-pct"
                        style={{ color: isGood ? g.color : "#DC2626" }}
                      >
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Top pages/countries ── */}
      <div className="an-row an-row--2">
        {/* Top pages / countries */}
        <div className="an-card" style={{ animationDelay: "0.18s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">
                {topTab === "pages" ? "Top Pages" : "Top Countries"}
              </div>
              <div className="an-card__sub">
                By session volume · {dateRange.toUpperCase()}
              </div>
            </div>
            <div className="an-seg-tabs" style={{ marginBottom: 0 }}>
              <button
                className={`an-seg-tab ${topTab === "pages" ? "active" : ""}`}
                onClick={() => setTopTab("pages")}
              >
                Pages
              </button>
              <button
                className={`an-seg-tab ${
                  topTab === "countries" ? "active" : ""
                }`}
                onClick={() => setTopTab("countries")}
              >
                Countries
              </button>
            </div>
          </div>
          <div className="an-card__body">
            {(topTab === "pages" ? topPages : topCountries).map((item, i) => {
              const isDown = (item.delta ?? 0) < 0;
              const maxVal =
                topTab === "pages" ? topPages[0].value : topCountries[0].value;
              return (
                <div
                  key={item.rank}
                  className="an-top-row"
                  style={{ animationDelay: `${0.05 + i * 0.04}s` }}
                >
                  <div
                    className={`an-top-rank ${
                      i === 0
                        ? "gold"
                        : i === 1
                        ? "silver"
                        : i === 2
                        ? "bronze"
                        : ""
                    }`}
                  >
                    {item.rank}
                  </div>
                  {topTab === "countries" && item.flag && (
                    <span className="an-top-flag">{item.flag}</span>
                  )}
                  <div className="an-top-label">
                    <div className="an-top-label__main">{item.label}</div>
                    {item.sub && (
                      <div className="an-top-label__sub">{item.sub}</div>
                    )}
                  </div>
                  <div className="an-top-bar-wrap">
                    <div className="an-top-bar">
                      <div
                        className="an-top-bar-fill"
                        style={{
                          width: `${(item.value / maxVal) * 100}%`,
                          background: "#2563EB",
                          animationDelay: `${0.1 + i * 0.04}s`
                        }}
                      />
                    </div>
                  </div>
                  <span className="an-top-val">{fmtNum(item.value, true)}</span>
                  {item.delta !== undefined && (
                    <span className={`an-top-delta ${isDown ? "down" : "up"}`}>
                      {isDown ? "▼" : "▲"}
                      {Math.abs(item.delta).toFixed(1)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cohort retention */}
        <div className="an-card" style={{ animationDelay: "0.22s" }}>
          <div className="an-card__header">
            <div>
              <div className="an-card__title">Retention Cohorts</div>
              <div className="an-card__sub">
                Monthly user retention by signup cohort
              </div>
            </div>
          </div>
          <div className="an-card__body">
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 12,
                fontSize: 11,
                color: "#6B7280"
              }}
            >
              {["100%", "≥70%", "≥50%", "≥35%", "≥20%", "<20%"].map((l, i) => (
                <div
                  key={l}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: [
                        "#111827",
                        "#1D4ED8",
                        "#3B82F6",
                        "#93C5FD",
                        "#DBEAFE",
                        "#EFF6FF"
                      ][i]
                    }}
                  />
                  {l}
                </div>
              ))}
            </div>
            <CohortTable />
          </div>
        </div>
      </div>

      {/* ── Row 5: Session heatmap ── */}
      <div
        className="an-card"
        style={{ animationDelay: "0.24s", marginBottom: 0 }}
      >
        <div className="an-card__header">
          <div>
            <div className="an-card__title">Session Heatmap</div>
            <div className="an-card__sub">
              Hourly traffic intensity by day of week
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>
            Peak: Tue–Thu · 9–11am
          </div>
        </div>
        <div className="an-card__body">
          <Heatmap />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageComponent;
