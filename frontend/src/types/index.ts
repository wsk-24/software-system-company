export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface StatCard {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaType: "up" | "down" | "neutral";
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
  type: "create" | "update" | "delete" | "login";
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: "active" | "paused" | "done";
  team: string[];
  deadline: string;
  color: string;
}

export interface SidebarProps {
  isOpen: boolean;
  activeNav: string;
  onNavChange: (id: string) => void;
  onToggle: () => void;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
}

export interface TopbarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  currentPage: string;
  // setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Props = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};
