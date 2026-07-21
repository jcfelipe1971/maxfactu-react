import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilFolder, cilSettings } from '@coreui/icons'

export default function Sidebar() {
  return (
    <CSidebar
      unfoldable
      visible
      style={{
        width: "220px",
        backgroundColor: "#1e1e2f",
        color: "white",
        borderRight: "1px solid #2c2c3b"
      }}
    >
      <CSidebarBrand
        style={{
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#151521",
          color: "white"
        }}
      >
        MAXFACTU
      </CSidebarBrand>

      <CSidebarNav style={{ padding: "10px" }}>

        <CNavItem href="#" style={{ padding: "10px 15px" }}>
          <CIcon icon={cilSpeedometer} className="me-2" />
          Dashboard
        </CNavItem>

        <CNavGroup toggler="Usuarios" style={{ padding: "10px 15px" }}>
          <CNavItem href="#" style={{ padding: "10px 15px" }}>
            <CIcon icon={cilUser} className="me-2" />
            Perfil
          </CNavItem>

          <CNavItem href="#" style={{ padding: "10px 15px" }}>
            <CIcon icon={cilFolder} className="me-2" />
            Documentos
          </CNavItem>
        </CNavGroup>

        <CNavItem href="#" style={{ padding: "10px 15px" }}>
          <CIcon icon={cilSettings} className="me-2" />
          Configuración
        </CNavItem>

      </CSidebarNav>
    </CSidebar>
  )
}
