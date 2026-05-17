// src/components/EntornoConfig.tsx
import { useState, useEffect } from 'react';
import { useEntorno } from '../context/EntornoContext';
import { ChevronDown, ChevronUp, Save, RefreshCw } from 'lucide-react';

export function EntornoConfig() {
  const {
    entorno, setEntorno,
    empresas, ejercicios, canales, series,
    loadingEmpresas, loadingEjercicios, loadingCanales, loadingSeries,
    cargarTodo
  } = useEntorno();

  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const handleGuardar = () => {
    if (!entorno.empresa || !entorno.ejercicio || !entorno.canal) {
      alert('Debe seleccionar Empresa, Ejercicio y Canal');
      return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('entorno', JSON.stringify(entorno));
    
    // Disparar evento personalizado para notificar que el entorno fue guardado
    window.dispatchEvent(new CustomEvent('entornoGuardado', { detail: entorno }));
    
    alert('✅ Entorno guardado correctamente');
  };

  const handleRecargar = () => {
    cargarTodo();
  };

  const handleLimpiar = () => {
    setEntorno({
      empresa: null,
      ejercicio: null,
      canal: null,
      serie: '',
      fechaTrab: new Date().toISOString().split('T')[0] // fecha actual por defecto
    });
    localStorage.removeItem('entorno');
  };

  // ✅ Etiqueta de empresa seleccionada (mapeo seguro)
  const empresaLabel = entorno.empresa
    ? empresas.find(e => {
        // Comparar tanto el value como el numero directo
        return e.value === entorno.empresa || 
               e.empresa === entorno.empresa ||
               Number(e.value) === Number(entorno.empresa);
      })?.label || `Empresa ${entorno.empresa}`
    : null;

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header colapsable */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
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
            onClick={(e) => { e.stopPropagation(); handleRecargar(); }}
            className="p-2 hover:bg-slate-600 rounded transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="p-2 hover:bg-slate-600 rounded transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Panel expandido */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-slate-700">

          {/* 🏢 Empresa */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Empresa *
            </label>
            <select
              value={entorno.empresa?.toString() || ''}
              onChange={(e) => {
                const valor = e.target.value ? Number(e.target.value) : null;
                console.log('🔄 Empresa seleccionada:', valor);
                setEntorno({
                  empresa: valor,
                  ejercicio: null,
                  canal: null,
                  serie: ''
                });
              }}
              disabled={loadingEmpresas}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingEmpresas ? 'Cargando empresas...' : 'Seleccione empresa'}
              </option>
              {empresas.map(emp => (
                <option key={emp.value || emp.empresa} value={emp.value || emp.empresa}>
                  {emp.label || emp.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* 📅 Ejercicio */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Ejercicio *
            </label>
            <select
              value={entorno.ejercicio?.toString() || ''}
              onChange={(e) => {
                const valor = e.target.value ? Number(e.target.value) : null;
                setEntorno({
                  ejercicio: valor,
                  canal: null,
                  serie: ''
                });
              }}
              disabled={!entorno.empresa || loadingEjercicios}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!entorno.empresa ? 'Seleccione empresa primero' :
                  loadingEjercicios ? 'Cargando...' : 'Seleccione ejercicio'}
              </option>
              {ejercicios.map(eje => (
                <option key={eje.value || eje.ejercicio} value={eje.value || eje.ejercicio}>
                  {eje.label || eje.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* 🔗 Canal */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Canal *
            </label>
            <select
              value={entorno.canal?.toString() || ''}
              onChange={(e) => {
                const valor = e.target.value ? Number(e.target.value) : null;
                setEntorno({
                  canal: valor,
                  serie: ''
                });
              }}
              disabled={!entorno.ejercicio || loadingCanales}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!entorno.ejercicio ? 'Seleccione ejercicio primero' :
                  loadingCanales ? 'Cargando...' : 'Seleccione canal'}
              </option>
              {canales.map(can => (
                <option key={can.value || can.canal} value={can.value || can.canal}>
                  {can.label || can.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* 📄 Serie */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Serie
            </label>
            <select
              value={entorno.serie || ''}
              onChange={(e) => setEntorno({ serie: e.target.value })}
              disabled={!entorno.canal || loadingSeries}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Todas">Todas</option>
              {series.map(ser => (
                <option key={ser.value || ser.serie} value={ser.value || ser.serie}>
                  {ser.label || ser.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* 🗓️ Fecha de Trabajo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Fecha de Trabajo
            </label>
            <input
              type="date"
              value={entorno.fechaTrab || ''}
              onChange={(e) => setEntorno({ fechaTrab: e.target.value })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Botones de acción */}
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
