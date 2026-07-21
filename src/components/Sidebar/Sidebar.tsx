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

// Props del componente (👈 Añadimos isOpen)
interface SidebarProps {
  selectedItem: string;
  onSelectItem: (id: string) => void;
  isOpen: boolean;
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

function Sidebar({ selectedItem, onSelectItem, isOpen }: SidebarProps) {
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
    // 👈 Aplicamos la clase 'open' o 'closed' condicionalmente
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-section-title">MENÚ PRINCIPAL</div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item">
              <button
                className={`menu-button ${selectedItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id, item.children.length > 0)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {item.children.length > 0 && (
                  <ChevronDown 
                    size={16} 
                    className={`menu-arrow ${openMenus[item.id] ? 'open' : ''}`} 
                  />
                )}
              </button>

              {item.children.length > 0 && (
                <ul className={`submenu ${openMenus[item.id] ? 'open' : ''}`}>
                  {item.children.map((subItem) => (
                    <li key={subItem.id} className="submenu-item">
                      <button
                        className={`submenu-link ${selectedItem === subItem.id ? 'active' : ''}`}
                        onClick={() => handleSubItemClick(subItem.id)}
                      >
                        {subItem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer-card">
        <div className="footer-card-title">Estado del Sistema</div>
        <div className="footer-card-status">
          <span className="status-dot"></span>
          Operativo
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <div className="footer-card-sub">v1.0.0 - MaxFactu React</div>
      </div>
    </aside>
  );
}

export default Sidebar;