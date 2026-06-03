import React from "react";

interface PlaceholderPageProps {
  title: string;
  icon: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon, description }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 140px)",
        textAlign: "center",
        animation: "slideUp 0.5s ease",
      }}
    >
      <div
        style={{
          fontSize: 56,
          marginBottom: 20,
          opacity: 0.3,
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#111827",
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 300 }}>
        {description}
      </p>
    </div>
  );
};

export const AnalyticsPage: React.FC = () => (
  <PlaceholderPage
    title="Analytics"
    icon="◈"
    description="Deep-dive charts and metrics for your platform will appear here."
  />
);

export const ProjectsPage: React.FC = () => (
  <PlaceholderPage
    title="Projects"
    icon="◻"
    description="Manage all your projects and tasks in one place."
  />
);

export const TeamPage: React.FC = () => (
  <PlaceholderPage
    title="Team"
    icon="◎"
    description="Manage your team members, roles and permissions."
  />
);

export const MessagesPage: React.FC = () => (
  <PlaceholderPage
    title="Messages"
    icon="◷"
    description="All your team communications in one unified inbox."
  />
);

export const CalendarPage: React.FC = () => (
  <PlaceholderPage
    title="Calendar"
    icon="▦"
    description="Schedule meetings, set deadlines and view your agenda."
  />
);

export const FilesPage: React.FC = () => (
  <PlaceholderPage
    title="Files"
    icon="◱"
    description="Browse and manage all documents and assets."
  />
);

export const SettingsPage: React.FC = () => (
  <PlaceholderPage
    title="Settings"
    icon="⊙"
    description="Customize your workspace preferences and account details."
  />
);
