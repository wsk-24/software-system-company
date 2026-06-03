import React from "react";
import type { DashboardLayoutProps } from "../types";
import "./Layout.css";

const Layout: React.FC<DashboardLayoutProps & { collapsed?: boolean }> = ({
  children,
  sidebarOpen: _sidebarOpen,
  collapsed = false,
}) => {
  return (
    <div className="layout">
      <main
        className={[
          "layout__main",
          collapsed ? "sidebar-collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="layout__content">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
