import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Edit, Plus, RefreshCw, Search } from "lucide-react";

import { useEntorno } from "../context/EntornoContext";

interface Familia {
  familia: string;
  titulo: string;
  tipo_iva?: string | number;
  permite_negativo?: number;
}

export function FamiliasView() {
  const { entorno } = useEntorno();
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarFamilias = useCallback(async () => {
    console.log("Entorno actual:", entorno);

    const empresa = Number(entorno.empresa);

    if (!empresa) {
      setError("Configure Empresa en el panel superior y guarde el entorno.");
      setFamilias([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/familias", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      console.log(`Recibidas ${data.length} familias`);

      setFamilias(data || []);
    } catch (err) {
      console.error("Error cargando familias:", err);
      setError(err instanceof Error ? err.message : "Error al cargar familias");
      setFamilias([]);
    } finally {
      setLoading(false);
    }
  }, [entorno]);

  useEffect(() => {
    cargarFamilias();
  }, [cargarFamilias]);

  useEffect(() => {
    const handle = () => {
      console.log("Evento entornoGuardado recibido");
      cargarFamilias();
    };
    window.addEventListener("entornoGuardado", handle);
    return () => window.removeEventListener("entornoGuardado", handle);
  }, [cargarFamilias]);

  return (
    <div className="p-6 space-y-4 bg-slate-50 min-h-screen text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Familias de Artículos</h2>
          <p className="text-xs text-slate-500 mt-1">
            Entorno activo:
            <span className="font-mono font-bold text-blue-600 ml-1">
              Empresa {entorno.empresa} | Ejercicio {entorno.ejercicio} | Canal {entorno.canal ?? "-"}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => cargarFamilias()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors disabled:opacity-50"
            title="Recargar"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            <Plus size={16} />
            Nueva
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <RefreshCw size={32} className="text-blue-600" />
            </div>
            <p className="text-slate-600">Cargando familias...</p>
          </div>
        </div>
      ) : familias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600">No hay familias</h3>
          <p className="text-slate-500 max-w-sm mt-2">Configura el entorno y carga los datos para ver las familias de artículos</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Código</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Título</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Tipo IVA</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {familias.map((familia) => (
                <tr key={familia.familia} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{familia.familia}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{familia.titulo}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{familia.tipo_iva || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="inline-flex items-center justify-center p-2 hover:bg-slate-100 text-slate-600 rounded transition-colors">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}