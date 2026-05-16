import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Trash2,
  Save,
  X,
  RefreshCw,
  Search,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Familia, TipoIva } from "@/src/types";
import { cn } from "@/src/lib/utils";

export function FamiliasView() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [tiposIva, setTiposIva] = useState<TipoIva[]>([]);
  const [activeTab, setActiveTab] = useState<"tabla" | "ficha">("tabla");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedFamilia = familias[selectedIndex] || null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resFamilias, resIva] = await Promise.all([
        axios.get("/api/familias"),
        axios.get("/api/tipos-iva"),
      ]);
      setFamilias(resFamilias.data);
      setTiposIva(resIva.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar datos de la API");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (field: keyof Familia, value: any) => {
    if (!selectedFamilia) return;

    const updated = { ...selectedFamilia, [field]: value };
    try {
      await axios.put(`/api/familias/${selectedFamilia.id}`, updated);
      const newFamilias = [...familias];
      newFamilias[selectedIndex] = updated;
      setFamilias(newFamilias);
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      {/* ERP Toolbar */}
      <div className="bg-white p-2 border-b border-slate-200 flex items-center justify-between shadow-sm px-4">
        <div className="flex items-center gap-1">
          <div className="flex border-r border-slate-200 pr-2 mr-1">
            <ToolbarButton icon={<ChevronsLeft size={16} />} onClick={() => setSelectedIndex(0)} disabled={selectedIndex <= 0} />
            <ToolbarButton icon={<ChevronLeft size={16} />} onClick={() => setSelectedIndex(s => s - 1)} disabled={selectedIndex <= 0} />
            <ToolbarButton icon={<ChevronRight size={16} />} onClick={() => setSelectedIndex(s => s + 1)} disabled={selectedIndex >= familias.length - 1} />
            <ToolbarButton icon={<ChevronsRight size={16} />} onClick={() => setSelectedIndex(familias.length - 1)} disabled={selectedIndex >= familias.length - 1} />
          </div>
          <ToolbarButton icon={<Plus size={16} />} className="text-blue-600 hover:bg-blue-50" label="NUEVA" onClick={() => setActiveTab("ficha")} />
          <ToolbarButton icon={<Trash2 size={16} />} className="text-red-500 hover:bg-red-50" label="ELIMINAR" />
          <div className="w-[1px] h-6 bg-slate-200 mx-1" />
          <ToolbarButton icon={<Save size={16} />} className="text-blue-600 hover:bg-blue-50" label="GUARDAR" />
          <ToolbarButton icon={<RefreshCw size={16} />} className="text-slate-600 hover:bg-slate-100" onClick={fetchData} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filtrar:</span>
          <select className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold outline-none focus:border-blue-500 transition-colors">
            <option>Todas las familias</option>
            <option>Con stock negativo</option>
            <option>Sin imagen</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-slate-200 bg-white shadow-sm z-0">
        <TabButton
          active={activeTab === "tabla"}
          onClick={() => setActiveTab("tabla")}
          label="Vista de Tabla"
        />
        <TabButton
          active={activeTab === "ficha"}
          onClick={() => setActiveTab("ficha")}
          label="Ficha de Familia"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === "tabla" ? (
            <motion.div
              key="tabla"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
            >
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">ID</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Descripción de Familia</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Tipo IVA</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Permite Negativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {familias.map((f, idx) => (
                    <tr
                      key={f.id}
                      className={cn(
                        "hover:bg-blue-50 transition-colors duration-150",
                        selectedIndex === idx && "bg-blue-50/70"
                      )}
                    >
                      <td className="p-4 font-mono text-xs text-slate-500">{f.id}</td>

                      {/* TITULO - EDITABLE */}
                      <td
                        onClick={() => !selectedIndex || setSelectedIndex(idx)}
                        className="p-4 cursor-pointer hover:bg-blue-50/50 rounded font-semibold text-slate-700"
                      >
                        <input
                          type="text"
                          value={f.titulo}
                          onChange={(e) => {
                            const newFamilias = [...familias];
                            newFamilias[idx].titulo = e.target.value;
                            setFamilias(newFamilias);
                          }}
                          onBlur={(e) => handleUpdate('titulo', e.target.value)}
                          className="w-full bg-transparent border-0 outline-none font-semibold focus:bg-white focus:border border-blue-500 p-1 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>

                      {/* TIPO IVA - EDITABLE */}
                      <td className="p-4 text-center">
                        <select
                          value={f.tipoIva}
                          onChange={(e) => {
                            const newFamilias = [...familias];
                            newFamilias[idx].tipoIva = parseInt(e.target.value);
                            setFamilias(newFamilias);
                          }}
                          onBlur={(e) => handleUpdate('tipoIva', parseInt(e.target.value))}
                          className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-xs font-medium text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tiposIva.map(t => (
                            <option key={t.id} value={t.id}>{t.titulo}</option>
                          ))}
                        </select>
                      </td>

                      {/* PERMITE NEGATIVO - EDITABLE */}
                      <td className="p-4 text-right">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={f.permiteStockNegativo}
                            onChange={(e) => {
                              const newFamilias = [...familias];
                              newFamilias[idx].permiteStockNegativo = e.target.checked;
                              setFamilias(newFamilias);
                              handleUpdate('permiteStockNegativo', e.target.checked);
                            }}
                            className="rounded accent-green-600"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className={cn(
                            "ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            f.permiteStockNegativo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            {f.permiteStockNegativo ? "SÍ" : "NO"}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="ficha"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {selectedFamilia ? (
                <>
                  <div className="lg:col-span-2 space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                    <div className="pb-4 border-b border-slate-100 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">Detalles de la Familia</h3>
                      <p className="text-sm text-slate-400">Información administrativa y lógica de negocio</p>
                    </div>

                    <FormField label="Identificación y Nombre">
                      <div className="flex gap-4">
                        <div className="w-24">
                          <input
                            type="text"
                            readOnly
                            value={selectedFamilia.id}
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-slate-500 font-mono text-center"
                          />
                        </div>
                        <input
                          type="text"
                          value={selectedFamilia.titulo}
                          onChange={(e) => handleUpdate('titulo', e.target.value)}
                          className="flex-1 bg-white border border-slate-200 p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        />
                      </div>
                    </FormField>

                    <FormField label="Tipo de IVA Aplicable">
                      <div className="flex gap-4 items-center">
                        <div className="w-24">
                          <input
                            type="text"
                            readOnly
                            value={selectedFamilia.tipoIva}
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-center text-blue-700 font-bold"
                          />
                        </div>
                        <select
                          value={selectedFamilia.tipoIva}
                          onChange={(e) => handleUpdate('tipoIva', parseInt(e.target.value))}
                          className="flex-1 bg-white border border-slate-200 p-2 rounded outline-none shadow-sm focus:border-blue-500 transition-all font-medium"
                        >
                          {tiposIva.map(t => (
                            <option key={t.id} value={t.id}>{t.titulo}</option>
                          ))}
                        </select>
                      </div>
                    </FormField>

                    <div className="pt-4">
                      <label className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 cursor-pointer hover:bg-slate-100 transition-colors group">
                        <div className={cn(
                          "w-12 h-6 rounded-full relative transition-colors duration-300",
                          selectedFamilia.permiteStockNegativo ? "bg-blue-600" : "bg-slate-300"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                            selectedFamilia.permiteStockNegativo ? "left-7" : "left-1"
                          )} />
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedFamilia.permiteStockNegativo}
                          onChange={() => handleUpdate('permiteStockNegativo', !selectedFamilia.permiteStockNegativo)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">Permitir Stock Negativo</span>
                          <span className="text-xs text-slate-400">Si se activa, el sistema permitirá ventas sin existencias físicas verificadas</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="relative w-full aspect-square bg-slate-100 rounded-lg overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=600"
                          alt="Product"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                      <div className="p-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vista Previa de Categoría</span>
                      </div>
                    </div>

                    <div className="bg-blue-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative group">
                      <div className="relative z-10">
                        <h4 className="font-bold text-lg mb-1">Módulo Fiscal</h4>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Las configuraciones de esta ficha afectan directamente al cálculo de impuestos en facturación mensual.
                        </p>
                      </div>
                      <ShieldCheck className="absolute -bottom-2 -right-2 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="lg:col-span-3 text-center py-32 bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 italic">Seleccione una familia de la tabla para visualizar sus propiedades comerciales</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-full shadow-xl border border-slate-100 flex flex-col items-center">
            <RefreshCw className="animate-spin text-blue-600 mb-2" size={32} />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Cargando datos...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ icon, onClick, disabled, className, label }: { icon: React.ReactNode, onClick?: () => void, disabled?: boolean, className?: string, label?: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 px-3 flex items-center gap-2 rounded-md transition-all duration-200 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group",
        !label && "px-1.5",
        className || "hover:bg-slate-100 text-slate-600"
      )}
    >
      {icon}
      {label && <span className="text-[10px] font-bold tracking-tight">{label}</span>}
    </button>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-8 py-3 text-xs font-bold uppercase tracking-widest border-b-[3px] transition-all relative",
        active
          ? "border-blue-600 text-blue-700 bg-blue-50/30"
          : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      )}
    >
      {label}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-blue-600/5 -z-10"
        />
      )}
    </button>
  );
}

function FormField({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1">{label}</label>
      {children}
    </div>
  );
}
