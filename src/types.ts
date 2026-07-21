export interface Familia {
  id: string;
  titulo: string;
  tipoIva: number;
  permiteStockNegativo: boolean;
}

export interface TipoIva {
  id: number;
  titulo: string;
}

export type MenuCategory = "Almacenes" | "Terceros" | "Ventas" | "Compras" | "VeriFactu";