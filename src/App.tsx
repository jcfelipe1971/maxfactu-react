import { Bell, LayoutDashboard, Search, Settings } from "lucide-react";
import { useState } from "react";

import { EntornoConfig } from "./components/EntornoConfig";
import { FamiliasView } from "./components/FamiliasView";
import { Sidebar } from "./components/Sidebar";
import { EntornoProvider, useEntorno } from "./context/EntornoContext";
import { MenuCategory } from "./types";

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
              <input
                type="text"
                placeholder="Buscar en el sistema..."
                className="w-64 rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-10 text-xs focus:border-blue-500 focus:outline-none transition-all shadow-inner"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <button className="relative p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight tracking-tight">Admin Sistema</p>
                <p className="text-[10px] text-slate-400 leading-tight uppercase font-bold">Conectado: API_Main_Prod</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 shadow-sm overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center text-slate-500 font-bold">
                  AS
                </div>
              </div>
            </div>
          </div>
        </header>

        {showEntorno && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 shadow-inner animate-in slide-in-from-top-2 duration-200">
            <EntornoConfig />
          </div>
        )}

        <main className="flex-1 relative overflow-hidden bg-slate-50">{renderContent()}</main>

        <footer className="h-8 bg-slate-100 border-t border-slate-200 flex items-center px-4 justify-between space-x-10 text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex items-center border-r border-slate-300 pr-4">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500 shadow-sm" /> Online: Server Principal
            </div>
            <div className="flex items-center border-r border-slate-300 px-4">
              Base de Datos: <span className="ml-1 text-slate-800 font-mono">Firebird / Node-API</span>
            </div>
          </div>
          <div className="ml-auto font-medium hidden md:block text-slate-400">
            {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })} |{" "}
            {new Date().toLocaleTimeString("es-ES")}
          </div>
        </footer>
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
