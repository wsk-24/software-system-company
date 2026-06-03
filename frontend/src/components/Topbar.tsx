import React from "react";
import { useNavigate } from "react-router-dom";
import type { TopbarProps } from "../types";
import "./Topbar.css";

const Topbar: React.FC<TopbarProps> = ({
  onMenuToggle,
  sidebarOpen,
  currentPage
}) => {
  const navigate = useNavigate();

  const [language, setLanguage] = React.useState<"EN" | "TH">("EN");
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    // setIsLoggedIn(false);
    // setIsLoggedIn(false);
    // navigate("/login");
    setTimeout(() => navigate("/login"), 800);
  };

  // =========================================
  // DATE FORMAT
  // =========================================

  const today = new Date().toLocaleDateString(
    language === "TH" ? "th-TH" : "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  const sidebarEl = document.querySelector(".sidebar.collapsed");
  const isCollapsed = !!sidebarEl;

  const text = {
    searchPlaceholder:
      language === "TH" ? "ค้นหาข้อมูล..." : "Search anything...",
    notifications: language === "TH" ? "การแจ้งเตือน" : "Notifications",
    messages: language === "TH" ? "ข้อความ" : "Messages",
    profile: language === "TH" ? "โปรไฟล์" : "Profile",
    logout: language === "TH" ? "ออกจากระบบ" : "Logout"
  };

  return (
    <header className={`topbar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* LEFT */}
      <div className="topbar__left">
        <button
          className="topbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
        <div className="topbar__breadcrumb">
          <span className="topbar__breadcrumb-home">Nexus</span>
          <span className="topbar__breadcrumb-sep">›</span>
          <span className="topbar__breadcrumb-current">{currentPage}</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="topbar__search">
        <span className="topbar__search-icon">⌕</span>
        <input type="text" placeholder={text.searchPlaceholder} />
        <span className="topbar__search-kbd">⌘K</span>
      </div>

      {/* RIGHT */}
      <div className="topbar__right">
        <div className="topbar__language">
          <button
            className={`lang-btn ${language === "EN" ? "active" : ""}`}
            onClick={() => setLanguage("EN")}
          >
            EN
          </button>
          <button
            className={`lang-btn ${language === "TH" ? "active" : ""}`}
            onClick={() => setLanguage("TH")}
          >
            TH
          </button>
        </div>

        <span className="topbar__date">{today}</span>

        <button className="topbar__action-btn" title={text.notifications}>
          🔔
          <span className="dot" />
        </button>
        <button className="topbar__action-btn" title={text.messages}>
          ✉<span className="dot" />
        </button>

        <div className="topbar__divider" />

        {/* PROFILE DROPDOWN */}
        <div className="topbar__profile" style={{ position: "relative" }}>
          <div
            className="topbar__avatar"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            style={{ cursor: "pointer" }}
            title={text.profile}
          >
            JD
          </div>

          {showProfileMenu && (
            <>
              {/* Backdrop — คลิกนอก dropdown ปิด */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setShowProfileMenu(false)}
              />

              {/* Dropdown */}
              <div className="profile-dropdown">
                <div className="profile-dropdown__header">
                  <strong>John Doe</strong>
                  <span>john@company.com</span>
                </div>
                <hr className="profile-dropdown__divider" />
                <button
                  className="profile-dropdown__item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/settings");
                  }}
                >
                  ⚙ {language === "TH" ? "ตั้งค่า" : "Settings"}
                </button>
                <hr className="profile-dropdown__divider" />
                <button
                  className="profile-dropdown__item profile-dropdown__item--danger"
                  onClick={handleLogout}
                >
                  ⎋ {text.logout}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
