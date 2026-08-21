import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, Save } from "lucide-react";

import { useEntorno } from "../context/EntornoContext";

const todayIso = () => new Date().toISOString().split("T")[0];

export function EntornoConfig() {
  const {
    entorno,
    setEntorno,
    empresas,
    ejercicios,
    canales,
    series,
    loadingEmpresas,
    loadingEjercicios,
    loadingCanales,
    loadingSeries,
    errorEmpresas,
    errorEjercicios,
    errorCanales,
    errorSeries,
    cargarTodo,
  } = useEntorno();

  const [expanded, setExpanded] = useState(true);
  const entornoError = errorEmpresas || errorEjercicios || errorCanales || errorSeries;

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const handleGuardar = () => {
    if (!entorno.empresa || !entorno.ejercicio || entorno.canal === null) {
      alert("Debe seleccionar Empresa, Ejercicio y Canal");
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
              {empresaLabel} | Ej. {entorno.ejercicio} | Canal {entorno.canal}
              {entorno.serie && ` | Serie ${entorno.serie}`}
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
        <div className="p-4 space-y-4 border-t border-slate-700">
          {entornoError && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <p className="font-semibold">No se pudieron cargar los datos del entorno.</p>
              <p className="mt-1">{entornoError}</p>
              <p className="mt-1 text-xs">
                Revisa que Firebird esté arrancado y que las variables FIREBIRD_* del archivo .env apunten a la base correcta.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Empresa *</label>
            <select
              value={entorno.empresa?.toString() || ""}
              onChange={(event) => {
                const valor = event.target.value ? Number(event.target.value) : null;
                setEntorno({
                  empresa: valor,
                  ejercicio: null,
                  canal: null,
                  serie: "",
                });
              }}
              disabled={loadingEmpresas}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{loadingEmpresas ? "Cargando empresas..." : "Seleccione empresa"}</option>
              {empresas.map((empresa) => (
                <option key={empresa.value} value={empresa.value}>
                  {empresa.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ejercicio *</label>
            <select
              value={entorno.ejercicio?.toString() || ""}
              onChange={(event) => {
                const valor = event.target.value ? Number(event.target.value) : null;
                setEntorno({
                  ejercicio: valor,
                  canal: null,
                  serie: "",
                });
              }}
              disabled={!entorno.empresa || loadingEjercicios}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!entorno.empresa ? "Seleccione empresa primero" : loadingEjercicios ? "Cargando..." : "Seleccione ejercicio"}
              </option>
              {ejercicios.map((ejercicio) => (
                <option key={ejercicio.value} value={ejercicio.value}>
                  {ejercicio.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Canal *</label>
            <select
              value={entorno.canal?.toString() || ""}
              onChange={(event) => {
                const valor = event.target.value ? Number(event.target.value) : null;
                setEntorno({
                  canal: valor,
                  serie: "",
                });
              }}
              disabled={!entorno.ejercicio || loadingCanales}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!entorno.ejercicio ? "Seleccione ejercicio primero" : loadingCanales ? "Cargando..." : "Seleccione canal"}
              </option>
              {canales.map((canal) => (
                <option key={canal.value} value={canal.value}>
                  {canal.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Serie</label>
            <select
              value={entorno.serie || ""}
              onChange={(event) => setEntorno({ serie: event.target.value })}
              disabled={entorno.canal === null || loadingSeries}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todas</option>
              {series.map((serie) => (
                <option key={serie.value} value={serie.value}>
                  {serie.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Trabajo</label>
            <input
              type="date"
              value={entorno.fechaTrab || ""}
              onChange={(event) => setEntorno({ fechaTrab: event.target.value })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <button
              onClick={handleLimpiar}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              Limpiar
            </button>

            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Entorno
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
