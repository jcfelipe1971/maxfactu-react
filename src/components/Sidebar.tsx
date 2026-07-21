import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronRight, CreditCard, Package, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import { MenuCategory } from "@/src/types";

interface SidebarProps {
  activeCategory: MenuCategory | null;
  onCategoryClick: (category: MenuCategory) => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const MENU_STRUCTURE: Array<{
  id: MenuCategory;
  icon: ReactNode;
  items: string[];
}> = [
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
];

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
                  activeCategory === section.id ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-200",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("transition-colors", activeCategory === section.id ? "text-blue-700" : "text-slate-400")}>
                    {section.icon}
                  </span>
                  <span className="text-sm font-semibold">{section.id}</span>
                </div>
                <AnimatePresence mode="wait">
                  {activeCategory === section.id ? (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform" />
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {activeCategory === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-8 py-1 space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => onItemClick(item)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded text-sm transition-all duration-150",
                            activeItem === item
                              ? "bg-blue-500 text-white font-medium shadow-sm"
                              : "text-slate-600 hover:bg-slate-200",
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}