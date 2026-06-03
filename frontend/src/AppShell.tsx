import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import KanbanBoard from "./pages/KanbanBoard";
import LeavePage from "./pages/LeavePage";
import OvertimePage from "./pages/OvertimePage";
import ClientProjectsPage from "./pages/ClientProjectsPage";
import TeamManagementPage from "./pages/TeamManagementPage";
import MessagesPage from "./pages/MessagesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import {
  CalendarPage,
  FilesPage,
  SettingsPage
} from "./pages/PlaceholderPages";
import { navItems } from "./data/mockData";

const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  // หา label จาก path ปัจจุบัน เช่น /dashboard → "Dashboard"
  const currentPath = location.pathname.replace("/", "");
  const currentNavItem = navItems.find((n) => n.id === currentPath);
  const currentPageLabel = currentNavItem?.label ?? "Dashboard";

  const handleNavChange = (id: string) => {
    // if (window.innerWidth <= 768) setSidebarOpen(false);

    navigate(`/${id}`);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        activeNav={currentPath}
        onNavChange={handleNavChange}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <Topbar
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
        currentPage={currentPageLabel}
      />
      <Layout sidebarOpen={sidebarOpen}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="projects" element={<ClientProjectsPage />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="overtime" element={<OvertimePage />} />
          <Route path="team" element={<TeamManagementPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* redirect / → /dashboard */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Layout>
    </>
  );
};

export default AppShell;
