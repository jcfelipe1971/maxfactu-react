import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSpeedometer, cilUser, cilFolder, cilSettings } from "@coreui/icons";

export default function Sidebar({ visible = true }) {
  return (
    <CSidebar
      unfoldable={!visible}
      visible={true}
      style={{
        width: visible ? "220px" : "0px",
        backgroundColor: "#1e1e2f",
        color: "white",
        borderRight: "1px solid #2c2c3b",
        transition: "width 0.3s ease",
      }}
    >
      <CSidebarBrand
        style={{
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#151521",
          color: "white",
          whiteSpace: "nowrap",
        }}
      >
        {visible ? "MAXFACTU" : "M"}
      </CSidebarBrand>

      <CSidebarNav style={{ padding: "10px" }}>
        <CNavItem href="#" style={{ padding: "10px 15px", whiteSpace: "nowrap" }}>
          <CIcon icon={cilSpeedometer} className="me-2" />
          {visible && "Dashboard"}
        </CNavItem>

        <CNavGroup toggler="Usuarios" style={{ padding: "10px 15px", whiteSpace: "nowrap" }}>
          <CNavItem href="#" style={{ padding: "10px 15px" }}>
            <CIcon icon={cilUser} className="me-2" />
            {visible && "Perfil"}
          </CNavItem>
          <CNavItem href="#" style={{ padding: "10px 15px" }}>
            <CIcon icon={cilFolder} className="me-2" />
            {visible && "Documentos"}
          </CNavItem>
        </CNavGroup>

        <CNavItem href="#" style={{ padding: "10px 15px", whiteSpace: "nowrap" }}>
          <CIcon icon={cilSettings} className="me-2" />
          {visible && "Configuración"}
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
}