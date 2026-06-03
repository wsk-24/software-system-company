import React from "react";
import type { SidebarProps } from "../types";
import { navItems } from "../data/mockData";
import "./Sidebar.css";

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeNav,
  onNavChange,
  onToggle
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const sidebarClass = [
    "sidebar",
    collapsed && !isMobile ? "collapsed" : "",
    !isOpen && isMobile ? "mobile-hidden" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const mainNav = navItems.slice(0, 5);
  const secondaryNav = navItems.slice(5);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen && isMobile ? "visible" : ""}`}
        onClick={onToggle}
      />

      <aside className={sidebarClass}>
        {/* Collapse toggle (desktop only) */}
        <button
          className="sidebar__toggle"
          onClick={handleCollapse}
          title="Toggle sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>

        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">N</div>
          <span className="sidebar__brand-name">Nexus Admin</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <span className="nav-section-label">Main</span>
          {mainNav.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => onNavChange(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onNavChange(item.id)}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span className="nav-item__label">{item.label}</span>
              {item.badge && (
                <span className="nav-item__badge">{item.badge}</span>
              )}
            </div>
          ))}

          <span className="nav-section-label">More</span>
          {secondaryNav.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => onNavChange(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onNavChange(item.id)}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span className="nav-item__label">{item.label}</span>
              {item.badge && (
                <span className="nav-item__badge">{item.badge}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Footer / User */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">JD</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">James Decker</div>
              <div className="sidebar__user-role">Admin · Pro</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
