import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AppContent from "../components/AppContent";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";

export default function DefaultLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Botón hamburguesa - arriba a la izquierda */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "15px",
          left: sidebarVisible ? "235px" : "15px",
          zIndex: 1000,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          transition: "left 0.3s ease",
          color: "#1e1e2f",
        }}
        aria-label="Toggle menu"
      >
        <CIcon icon={cilMenu} size="xl" />
      </button>

      {/* Sidebar con transición */}
      <div
        style={{
          width: sidebarVisible ? "220px" : "0px",
          overflow: "hidden",
          transition: "width 0.3s ease",
          flexShrink: 0,
        }}
      >
        <Sidebar visible={sidebarVisible} />
      </div>

      {/* Contenido principal */}
      <div
        className="flex-grow-1 p-4"
        style={{
          backgroundColor: "#f5f6fa",
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarVisible ? "40px" : "0px",
        }}
      >
        <div style={{ marginTop: "50px" }}>
          <AppContent />
        </div>
      </div>
    </div>
  );
}