import { Search, Bell, Settings } from "lucide-react";
import "./Header.css";

function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-icon">D</div>
          <span className="logo-text">MaxFactu</span>
        </div>
      </div>

      <div className="header-center">
        <h1 className="header-title">
          ERP Gestión Comercial <span className="header-version">| v2.4.0</span>
        </h1>
      </div>

      <div className="header-right">
        <button className="header-btn">
          <Settings size={16} />
          <span>Entorno</span>
        </button>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Buscar en el sistema..." />
        </div>

        <button className="header-btn icon-btn">
          <Bell size={18} />
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Admin Sistema</span>
            <span className="user-env">CONECTADO: API_MAIN_PROD</span>
          </div>
          <div className="user-avatar">AS</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
