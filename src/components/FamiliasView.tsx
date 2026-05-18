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
    const ejercicio = Number(entorno.ejercicio);
    const canal = entorno.canal === null ? null : Number(entorno.canal);

    if (!empresa || !ejercicio || canal === null || Number.isNaN(canal)) {
      setError("Configure Empresa, Ejercicio y Canal en el panel superior y guarde el entorno.");
      setFamilias([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = { empresa, ejercicio, canal };
      console.log("Enviando payload:", payload);

      const response = await fetch("/api/familias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          <button onClick={cargarFamilias} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm hover:bg-slate-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Recargar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Plus size={16} />
            Nueva Familia
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <RefreshCw className="animate-spin text-blue-600" size={40} />
          <p className="mt-4 text-slate-500">Cargando familias...</p>
        </div>
      ) : familias.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <Search className="mx-auto text-slate-300 mb-4" size={48} />
          <h4 className="text-slate-700 font-semibold">No se encontraron familias</h4>
          <p className="text-slate-500 mt-2">
            Empresa {entorno.empresa} - Ejercicio {entorno.ejercicio} - Canal {entorno.canal ?? "-"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left">Código</th>
                  <th className="py-3 px-4 text-left">Descripción</th>
                  <th className="py-3 px-4 text-center">Tipo IVA</th>
                  <th className="py-3 px-4 text-center">Stock Negativo</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {familias.map((fam, index) => (
                  <tr key={`${fam.familia}-${index}`} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold">{fam.familia}</td>
                    <td className="py-3 px-4">{fam.titulo}</td>
                    <td className="py-3 px-4 text-center">{fam.tipo_iva || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      {fam.permite_negativo === 1 ? (
                        <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded text-xs">Sí</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-3 py-0.5 rounded text-xs">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Edit size={16} className="inline text-blue-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 p-3 text-right text-sm text-slate-600">{familias.length} familias encontradas</div>
        </div>
      )}
    </div>
  );
}
