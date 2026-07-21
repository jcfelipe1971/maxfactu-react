import { useState } from 'react';
import {
  Warehouse,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';
import './Sidebar.css';

// Interfaces
interface SubMenuItem {
  id: string;
  label: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: SubMenuItem[];
}

// Props del componente
interface SidebarProps {
  selectedItem: string;
  onSelectItem: (id: string) => void;
}

// Datos del menú
const menuItems: MenuItem[] = [
  {
    id: 'almacenes',
    label: 'Almacenes',
    icon: <Warehouse size={20} />,
    children: [
      { id: 'familias', label: 'Familias' },
      { id: 'articulos', label: 'Artículos' },
      { id: 'tarifas', label: 'Tarifas' },
      { id: 'tipos-calculos', label: 'Tipos cálculos' },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: <ShoppingCart size={20} />,
    children: [
      { id: 'nueva-venta', label: 'Nueva venta' },
      { id: 'historial', label: 'Historial' },
      { id: 'reportes', label: 'Reportes' },
    ],
  },
];

function Sidebar({ selectedItem, onSelectItem }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    almacenes: true, // Abierto por defecto
  });

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleMenu(id);
    } else {
      onSelectItem(id);
    }
  };

  const handleSubItemClick = (id: string) => {
    onSelectItem(id);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">MENÚ PRINCIPAL</div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const isOpen = openMenus[item.id] || false;
            const hasChildren = item.children.length > 0;
            const isParentSelected = selectedItem === item.id;
            const isChildSelected = item.children.some(
              (child) => child.id === selectedItem
            );

            return (
              <li key={item.id} className="menu-item">
                <button
                  className={`menu-button ${
                    isParentSelected || isChildSelected ? 'active' : ''
                  }`}
                  onClick={() => handleItemClick(item.id, hasChildren)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      size={16}
                      className={`menu-arrow ${isOpen ? 'open' : ''}`}
                    />
                  )}
                </button>

                {hasChildren && (
                  <ul className={`submenu ${isOpen ? 'open' : ''}`}>
                    {item.children.map((child) => (
                      <li key={child.id} className="submenu-item">
                        <button
                          className={`submenu-link ${
                            selectedItem === child.id ? 'active' : ''
                          }`}
                          onClick={() => handleSubItemClick(child.id)}
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="sidebar-footer-card">
        <div className="footer-card-title">Estado de API</div>
        <div className="footer-card-status">
          <span className="status-dot"></span>
          REST Service: Conectado
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <div className="footer-card-sub">Sincronización activa</div>
      </div>
    </aside>
  );
}

export default Sidebar;