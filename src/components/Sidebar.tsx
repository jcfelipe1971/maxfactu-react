import React from "react";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { MenuCategory } from "@/src/types";

interface SidebarProps {
  activeCategory: MenuCategory | null;
  onCategoryClick: (category: MenuCategory) => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const MENU_STRUCTURE = [
  {
    id: "Almacenes",
    icon: <Package className="w-5 h-5" />,
    items: ["Familias", "Artículos", "Tarifas", "Tipos cálculos"],
  },
  {
    id: "Terceros",
    icon: <Users className="w-5 h-5" />,
    items: ["Clientes", "Proveedores", "Agentes"],
  },
  {
    id: "Ventas",
    icon: <ShoppingCart className="w-5 h-5" />,
    items: ["Presupuestos", "Albaranes", "Facturas"],
  },
  {
    id: "Compras",
    icon: <CreditCard className="w-5 h-5" />,
    items: ["Pedidos", "Albaranes", "Facturas"],
  },
  {
    id: "VeriFactu",
    icon: <ShieldCheck className="w-5 h-5" />,
    items: ["Configuración", "Registros"],
  },
] as const;

export function Sidebar({ activeCategory, onCategoryClick, activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-100 text-slate-800 flex flex-col h-full border-r border-slate-200">
      <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
        <div className="w-8 h-8 bg-blue-700 text-white rounded flex items-center justify-center font-bold shadow-sm">D</div>
        <h1 className="font-semibold text-lg tracking-tight text-slate-800 underline decoration-blue-500 decoration-2 underline-offset-4">
          MaxFactu
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto pt-4">
        <div className="mb-4">
          <p className="mb-2 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Menú Principal</p>
          {MENU_STRUCTURE.map((section) => (
            <div key={section.id} className="mb-1 px-3">
              <button
                onClick={() => onCategoryClick(section.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200",
                  activeCategory === section.id 
                    ? "bg-blue-100 text-blue-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "transition-colors",
                    activeCategory === section.id ? "text-blue-700" : "text-slate-400"
                  )}>
                    {section.icon}
                  </span>
                  <span className="text-sm font-semibold">{section.id}</span>
                </div>
                {activeCategory === section.id ? (
                  <ChevronDown className="w-4 h-4 opacity-50" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-50" />
                )}
              </button>

              <AnimatePresence>
                {activeCategory === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {section.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => onItemClick(item)}
                        className={cn(
                          "w-full text-left pl-11 pr-4 py-2 text-xs transition-colors rounded-md mt-1",
                          activeItem === item 
                            ? "text-blue-600 font-bold bg-blue-50/50" 
                            : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="px-6 mt-8">
           <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-blue-800">Estado de API</p>
            <p className="mt-1 text-[11px] text-blue-600">REST Service: Conectado</p>
            <div className="mt-2 h-1 w-full rounded-full bg-blue-200 overflow-hidden">
              <div className="h-full w-3/4 bg-blue-600"></div>
            </div>
            <p className="mt-2 text-[10px] text-blue-400 italic font-medium">Sincronización activa</p>
          </div>
        </div>
      </nav>

      <div className="p-4 text-[10px] text-slate-400 border-t border-slate-200 text-center font-medium bg-white/50">
        BUILD v2.4.0 PROFESSIONAL
      </div>
    </aside>
  );
}
