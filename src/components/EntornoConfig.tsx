// src/components/EntornoConfig.tsx
import { useState, useEffect } from 'react';
import { useEntorno } from '../context/EntornoContext';
import { ChevronDown, ChevronUp, Save, RefreshCw, AlertCircle } from 'lucide-react';

export function EntornoConfig() {
  const { 
    entorno, setEntorno, 
    empresas, ejercicios, canales, series,
    loadingEmpresas, loadingEjercicios, loadingCanales, loadingSeries,
    cargarTodo 
  } = useEntorno();
  
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarInicial = async () => {
      try {
        await cargarTodo();
      } catch (err) {
        console.error('Error cargando entorno:', err);
        setError('Error al cargar datos del entorno');
      }
    };
    cargarInicial();
  }, []);

  const handleGuardar = () => {
    if (!entorno.empresa || !entorno.ejercicio || !entorno.canal) {
      alert('⚠️ Debe seleccionar Empresa, Ejercicio y Canal');
      return;
    }
    
    localStorage.setItem('entorno', JSON.stringify(entorno));
    alert('✅ Entorno guardado correctamente');
  };

  const handleRecargar = async () => {
    try {
      setError(null);
      await cargarTodo();
    } catch (err) {
      setError('Error al recargar datos');
    }
  };

  return (
    <div className="bg-slate-800 text-white rounded-lg shadow-lg border border-slate-700">
      {/* Header colapsable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg">⚙️ Configuración del Entorno</span>
          {entorno.empresa && (
            <span className="text-sm text-slate-300 hidden md:inline">
              {empresas.find(e => e.value === entorno.empresa)?.label || '...'} | 
              Ej. {entorno.ejercicio || '-'} | 
              Canal {entorno.canal || '-'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleRecargar(); }}
            className="p-1 hover:bg-slate-600 rounded transition-colors"
            title="Recargar datos"
          >
            <RefreshCw size={16} className={loadingEmpresas ? 'animate-spin' : ''} />
          </button>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {/* Panel expandido */}
      {expanded && (
        <div className="p-4 border-t border-slate-700 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 🏢 Empresa */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Empresa <span className="text-red-400">*</span>
              </label>
              <select
                value={entorno.empresa ?? ''}
                onChange={(e) => {
                  setError(null);
                  setEntorno({ 
                    empresa: e.target.value ? Number(e.target.value) : null,
                    ejercicio: null, canal: null, serie: ''
                  });
                }}
                disabled={loadingEmpresas}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white 
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Cargando...</option>
                {empresas.map(emp => (
                  <option key={emp.value} value={emp.value}>{emp.label}</option>
                ))}
              </select>
              {empresas.length === 0 && !loadingEmpresas && (
                <p className="text-xs text-amber-400 mt-1">⚠️ No hay empresas disponibles</p>
              )}
            </div>

            {/* 📅 Ejercicio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Ejercicio <span className="text-red-400">*</span>
              </label>
              <select
                value={entorno.ejercicio ?? ''}
                onChange={(e) => setEntorno({ 
                  ejercicio: e.target.value ? Number(e.target.value) : null,
                  canal: null, serie: ''
                })}
                disabled={!entorno.empresa || loadingEjercicios}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white 
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!entorno.empresa ? 'Seleccione empresa primero' : 
                   loadingEjercicios ? 'Cargando...' : 'Sin ejercicios'}
                </option>
                {ejercicios.map(eje => (
                  <option key={eje.value} value={eje.value}>{eje.label}</option>
                ))}
              </select>
            </div>

            {/* 🔗 Canal */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Canal <span className="text-red-400">*</span>
              </label>
              <select
                value={entorno.canal ?? ''}
                onChange={(e) => setEntorno({ 
                  canal: e.target.value ? Number(e.target.value) : null,
                  serie: ''
                })}
                disabled={!entorno.ejercicio || loadingCanales}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white 
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!entorno.ejercicio ? 'Seleccione ejercicio primero' : 
                   loadingCanales ? 'Cargando...' : 'Sin canales'}
                </option>
                {canales.map(can => (
                  <option key={can.value} value={can.value}>{can.label}</option>
                ))}
              </select>
            </div>

            {/* 📄 Serie */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Serie
              </label>
              <select
                value={entorno.serie}
                onChange={(e) => setEntorno({ serie: e.target.value })}
                disabled={!entorno.canal || loadingSeries}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white 
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Todas</option>
                {series.map(ser => (
                  <option key={ser.value} value={ser.value}>{ser.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 🗓️ Fecha de Trabajo */}
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Fecha de Trabajo
            </label>
            <input
              type="date"
              value={entorno.fechaTrab}
              onChange={(e) => setEntorno({ fechaTrab: e.target.value })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white 
                       focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
            <button
              onClick={() => {
                setEntorno({ 
                  empresa: null, ejercicio: null, canal: null, serie: '' 
                });
                setError(null);
              }}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleGuardar}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white 
                       px-4 py-2 rounded-md transition-colors font-medium"
            >
              <Save size={18} />
              Guardar Entorno
            </button>
          </div>
        </div>
      )}
    </div>
  );
}