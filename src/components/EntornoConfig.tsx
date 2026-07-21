import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, Save } from "lucide-react";

import { useEntorno } from "../context/EntornoContext";

const todayIso = () => new Date().toISOString().split("T")[0];

export function EntornoConfig() {
  const {
    entorno,
    setEntorno,
    empresas,
    loadingEmpresas,
    errorEmpresas,
    cargarTodo,
  } = useEntorno();

  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const handleGuardar = () => {
    if (!entorno.empresa) {
      alert("Debe seleccionar Empresa");
      return;
    }

    localStorage.setItem("entorno", JSON.stringify(entorno));
    window.dispatchEvent(new CustomEvent("entornoGuardado", { detail: entorno }));
    alert("Entorno guardado correctamente");
  };

  const handleLimpiar = () => {
    setEntorno({
      empresa: null,
      ejercicio: null,
      canal: null,
      serie: "",
      fechaTrab: todayIso(),
    });
    localStorage.removeItem("entorno");
  };

  const empresaLabel = entorno.empresa
    ? empresas.find((empresa) => Number(empresa.value) === Number(entorno.empresa))?.label || `Empresa ${entorno.empresa}`
    : null;

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            ⚙
          </span>
          <h2 className="text-lg font-semibold text-white">Configuración del Entorno</h2>

          {empresaLabel && (
            <span className="text-sm text-slate-400 ml-4">
              {empresaLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              cargarTodo();
            }}
            className="p-2 hover:bg-slate-600 rounded transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-2 hover:bg-slate-600 rounded transition-colors"
            title={expanded ? "Contraer" : "Expandir"}
          >
            {expanded ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 bg-slate-700 border-t border-slate-600 space-y-4">
          {errorEmpresas && <div className="text-red-400 text-sm">{errorEmpresas}</div>}

          <div>
            <label className="block text-sm text-slate-300 mb-2">Empresa</label>
            <select
              value={entorno.empresa || ""}
              onChange={(e) => setEntorno({ ...entorno, empresa: e.target.value ? Number(e.target.value) : null })}
              disabled={loadingEmpresas}
              className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 disabled:opacity-50"
            >
              <option value="">Seleccione empresa...</option>
              {empresas.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGuardar}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              Guardar
            </button>
            <button
              onClick={handleLimpiar}
              className="flex-1 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}