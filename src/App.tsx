import { useState } from "react";
import "./App.css";

// 1. Definimos las interfaces para TypeScript
interface SubMenuItem {
  id: number;
  label: string;
}

interface MenuItem {
  id: number;
  label: string;
  icon: string;
  children: SubMenuItem[];
}

// 2. Datos del menú tipados
const menuItems: MenuItem[] = [
  {
    id: 1,
    label: "Dashboard",
    icon: "🏠",
    children: [],
  },
  {
    id: 2,
    label: "Usuarios",
    icon: "👥",
    children: [
      { id: 21, label: "Lista de usuarios" },
      { id: 22, label: "Crear usuario" },
      { id: 23, label: "Roles y permisos" },
    ],
  },
  {
    id: 3,
    label: "Productos",
    icon: "📦",
    children: [
      { id: 31, label: "Catálogo" },
      { id: 32, label: "Inventario" },
      { id: 33, label: "Categorías" },
    ],
  },
  {
    id: 4,
    label: "Ventas",
    icon: "💰",
    children: [
      { id: 41, label: "Nueva venta" },
      { id: 42, label: "Historial" },
      { id: 43, label: "Reportes" },
    ],
  },
  {
    id: 5,
    label: "Configuración",
    icon: "⚙️",
    children: [
      { id: 51, label: "Perfil" },
      { id: 52, label: "Seguridad" },
      { id: 53, label: "Preferencias" },
    ],
  },
];

function App() {
  // 3. Tipamos el estado como un objeto donde las claves son números y los valores booleanos
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">⚡ MiApp</h2>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const isOpen = openMenus[item.id] || false;
              const hasChildren = item.children.length > 0;

              return (
                <li key={item.id} className="menu-item">
                  <button
                    className={`menu-button ${isOpen ? "active" : ""}`}
                    onClick={() => hasChildren && toggleMenu(item.id)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                    {hasChildren && (
                      <span className={`menu-arrow ${isOpen ? "open" : ""}`}>
                        ▾
                      </span>
                    )}
                  </button>

                  {hasChildren && (
                    <ul className={`submenu ${isOpen ? "open" : ""}`}>
                      {item.children.map((child) => (
                        <li key={child.id} className="submenu-item">
                          <a href="#" className="submenu-link">
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p>v1.0.0</p>
        </div>
      </aside>

      <main className="main-content">
        <h1>Bienvenido 👋</h1>
        <p>Selecciona una opción del menú lateral.</p>
      </main>
    </div>
  );
}

export default App;
