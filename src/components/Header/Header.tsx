import { Search, Bell, Settings, Menu } from "lucide-react"; // 👈 Importamos el ícono Menu
import "./Header.css";

// 👈 Definimos las propiedades que recibirá el componente
interface HeaderProps {
  onToggleSidebar: () => void;
}

function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="top-header">
      <div className="header-left">
        {/* 👈 Botón de hamburguesa para ocultar/mostrar menú */}
        <button 
          className="header-btn menu-toggle-btn" 
          onClick={onToggleSidebar} 
          title="Mostrar/Ocultar menú"
          style={{ 
            marginRight: '15px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            color: '#475569'
          }}
        >
          <Menu size={22} />
        </button>
        
        <div className="logo-container">
          <div className="logo-icon">D</div>
          <span className="logo-text">MaxFactu</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="search-input" 
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" title="Notificaciones">
          <Bell size={20} />
        </button>
        <button className="header-btn" title="Configuración">
          <Settings size={20} />
        </button>
        <div className="user-avatar">
          <span>U</span>
        </div>
      </div>
    </header>
  );
}

export default Header;