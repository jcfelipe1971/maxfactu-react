import { useState } from "react";
import { Bell, LayoutDashboard, Search, Settings } from "lucide-react";

import { Sidebar } from "./components/Sidebar";
import { EntornoConfig } from "./components/EntornoConfig";
import { FamiliasView } from "./components/FamiliasView";
import { EntornoProvider, useEntorno } from "./context/EntornoContext";
import type { MenuCategory } from "./types";

function AppContent() {
  const { entorno } = useEntorno();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>("Almacenes");
  const [activeItem, setActiveItem] = useState("Familias");
  const [showEntorno, setShowEntorno] = useState(
    () => !entorno.empresa || !entorno.ejercicio || entorno.canal === null,
  );

  const renderContent = () => {
    if (activeItem === "Familias") {
      return <FamiliasView />;
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1b2f42] text-white p-10">
        <div className="w-20 h-20 bg-[#243b59] rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-[#2d4b6b]">
          <LayoutDashboard size={40} className="text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Vista en construcción</h2>
        <p className="text-gray-400 max-w-sm text-center">
          La pantalla de <strong>{activeItem}</strong> ({activeCategory}) estará disponible próximamente en esta migración.
        </p>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 selection:bg-blue-500/10 text-sm">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryClick={(category) => setActiveCategory(activeCategory === category ? null : category)}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold tracking-tight text-slate-800">
              ERP Gestión Comercial <span className="text-slate-400 font-normal ml-2">| v2.4.0</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowEntorno(!showEntorno)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
                showEntorno
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border-slate-200"
              }`}
              title="Configurar Entorno (Empresa, Ejercicio, Canal, Serie)"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Entorno</span>
            </button>

            <div className="relative group">
              <button className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600 hover:text-slate-900">
                <Search size={18} />
              </button>
            </div>

            <div className="relative group">
              <button className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600 hover:text-slate-900">
                <Bell size={18} />
              </button>
            </div>
          </div>
        </header>

        {showEntorno && (
          <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
            <EntornoConfig />
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EntornoProvider>
      <AppContent />
    </EntornoProvider>
  );
}