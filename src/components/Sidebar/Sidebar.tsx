import { useState } from "react";
import {
  Warehouse,
  ShoppingCart,
  FolderOpen, // Icono para Familias
  ChevronDown,
} from "lucide-react";
import "./Sidebar.css";

// ... (interfaces igual que antes)

const menuItems: MenuItem[] = [
  {
    id: "almacenes",
    label: "Almacenes",
    icon: <Warehouse size={20} />,
    children: [
      { id: "familias", label: "Familias" }, // Este ahora abre la vista
      { id: "articulos", label: "Artículos" },
      { id: "tarifas", label: "Tarifas" },
      { id: "tipos-calculos", label: "Tipos cálculos" },
    ],
  },
  {
    id: "ventas",
    label: "Ventas",
    icon: <ShoppingCart size={20} />,
    children: [
      { id: "nueva-venta", label: "Nueva venta" },
      { id: "historial", label: "Historial" },
      { id: "reportes", label: "Reportes" },
    ],
  },
];

// ... (resto del componente igual)
