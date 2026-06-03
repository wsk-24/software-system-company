import React, { useState } from "react";
import {
  statCards,
  activityItems,
  projects,
  chartData
} from "../data/mockData";
import "./Dashboard.css";

const avatarColors = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#D97706",
  "#0891B2",
  "#DB2777"
];

const activityTypeColors: Record<string, string> = {
  create: "#059669",
  update: "#2563EB",
  delete: "#DC2626",
  login: "#D97706"
};

const Dashboard: React.FC = () => {
  const [activeChip, setActiveChip] = useState("6M");

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash__header">
        <h1 className="dash__greeting">
          {greeting}, <span>James</span> 👋
        </h1>
        <p className="dash__subtitle">
          Here's what's happening with your workspace today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div
            className="stat-card"
            key={card.id}
            style={{ ["--card-color" as string]: card.color }}
          >
            <div className="stat-card__top">
              <div
                className="stat-card__icon"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                {card.icon}
              </div>
              <span className={`stat-card__delta ${card.deltaType}`}>
                {card.deltaType === "up"
                  ? "↑"
                  : card.deltaType === "down"
                  ? "↓"
                  : "→"}{" "}
                {card.delta}
              </span>
            </div>
            <div className="stat-card__value">{card.value}</div>
            <div className="stat-card__title">{card.title}</div>
            <div
              className="stat-card__bg"
              style={{
                position: "absolute",
                right: -20,
                bottom: -20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: card.color,
                opacity: 0.06,
                pointerEvents: "none"
              }}
            />
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="dash__middle">
        {/* Bar Chart */}
        <div className="chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue Overview</div>
              <div className="card-subtitle">
                Monthly performance comparison
              </div>
            </div>
            <div className="card-actions">
              {["3M", "6M", "1Y"].map((period) => (
                <button
                  key={period}
                  className={`chip ${activeChip === period ? "active" : ""}`}
                  onClick={() => setActiveChip(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="bar-chart">
            {chartData.map((d, i) => (
              <div className="bar-group" key={d.month}>
                <div className="bar-wrap">
                  <div
                    className="bar revenue"
                    style={{
                      height: `${(d.revenue / maxRevenue) * 100}%`,
                      animationDelay: `${0.1 + i * 0.07}s`
                    }}
                    title={`$${(d.revenue / 1000).toFixed(0)}k`}
                  />
                  <div
                    className="bar users"
                    style={{
                      height: `${(d.users / maxRevenue) * 100}%`,
                      animationDelay: `${0.13 + i * 0.07}s`
                    }}
                    title={`${d.users.toLocaleString()} users`}
                  />
                </div>
                <span className="bar-label">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#111827" }} />
              Revenue
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#E5E7EB" }} />
              Users
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="activity-card">
          <div className="card-header">
            <div>
              <div className="card-title">Activity Feed</div>
              <div className="card-subtitle">Latest team actions</div>
            </div>
            <button className="chip">View all</button>
          </div>

          <div className="activity-list">
            {activityItems.map((item, i) => (
              <div className="activity-item" key={item.id}>
                <div
                  className="activity-avatar"
                  style={{ background: avatarColors[i % avatarColors.length] }}
                >
                  {item.avatar}
                </div>
                <div className="activity-body">
                  <div className="activity-text">
                    <strong>{item.user}</strong> {item.action}{" "}
                    <em>{item.target}</em>
                  </div>
                  <div className="activity-time">{item.time}</div>
                </div>
                <div
                  className="activity-type-dot"
                  style={{ background: activityTypeColors[item.type] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="projects-card">
        <div className="card-header">
          <div>
            <div className="card-title">Active Projects</div>
            <div className="card-subtitle">Track your team's progress</div>
          </div>
          <button className="chip active">+ New Project</button>
        </div>

        <table className="projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Team</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj.id}>
                <td>
                  <span
                    className="project-color-dot"
                    style={{ background: proj.color }}
                  />
                  <span className="project-name">{proj.name}</span>
                </td>
                <td style={{ minWidth: 160 }}>
                  <div className="progress-wrap">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${proj.progress}%`,
                          background: proj.color
                        }}
                      />
                    </div>
                    <span className="progress-label">{proj.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${proj.status}`}>
                    {proj.status.charAt(0).toUpperCase() + proj.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="team-avatars">
                    {proj.team.map((initials, idx) => (
                      <div
                        key={idx}
                        className="team-avatar"
                        style={{
                          background: avatarColors[idx % avatarColors.length]
                        }}
                        title={initials}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ color: "#6B7280", fontSize: 13 }}>
                  {proj.deadline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
