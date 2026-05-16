// src/components/FamiliasView.tsx
import { useState, useEffect, useCallback } from 'react';
import { useEntorno } from '../context/EntornoContext';
import { 
  Edit, Search, AlertCircle, RefreshCw 
} from 'lucide-react';

interface Familia {
  familia: string;
  titulo: string;
  tipo_iva?: string;
  permite_negativo?: number;
}

export function FamiliasView() {
  const { entorno } = useEntorno();
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modularizado con useCallback para poder invocarlo manualmente (botón refrescar) o vía useEffect
  const cargarFamilias = useCallback(async () => {
    // Si falta alguno de los tres pilares del entorno, cancelamos la petición limpiando el estado
    if (!entorno.empresa || !entorno.ejercicio || !entorno.canal) {
      setFamilias([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Enviando parámetros de entorno al Servidor:', entorno);
      
      const response = await fetch('/api/familias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: entorno.empresa,
          ejercicio: entorno.ejercicio,
          canal: entorno.canal,
          familia: '0' // Indica que devuelva todas las familias del entorno
        })
      });

      if (!response.ok) {
        throw new Error(`Error de servidor! Código de Estado: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Familias del entorno recibidas con éxito:', data);
      
      setFamilias(data);
    } catch (err) {
      console.error('❌ Error capturado en el frontend cargando familias:', err);
      setError(`Error al cargar familias: ${err instanceof Error ? err.message : 'Error de red'}`);
      setFamilias([]);
    } finally {
      setLoading(false);
    }
  }, [entorno.empresa, entorno.ejercicio, entorno.canal]);

  // Ejecución en cascada cada vez que el usuario presione "Guardar Entorno" (cambia el contexto global)
  useEffect(() => {
    cargarFamilias();
  }, [cargarFamilias]);

  // 1️⃣ Estado: El usuario no ha rellenado los datos del Entorno todavía
  if (!entorno.empresa || !entorno.ejercicio || !entorno.canal) {
    return (
      <div className="p-6">
        <div className="bg-slate-800 text-white rounded-lg p-8 border border-slate-700 text-center max-w-xl mx-auto mt-12 shadow-md">
          <AlertCircle className="mx-auto text-yellow-500 mb-4" size={44} />
          <h3 className="text-xl font-semibold mb-2">Configuración de Entorno Requerida</h3>
          <p className="text-slate-400 text-sm mb-4">
            Para listar las familias de artículos, primero debes abrir el menú superior de <strong>Entorno</strong>, seleccionar una Empresa, Ejercicio y Canal activos, y hacer clic en <strong>Guardar Entorno</strong>.
          </p>
        </div>
      </div>
    );
  }

  // 2️⃣ Estado: Spinner de Carga Activo
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <RefreshCw className="animate-spin text-blue-500" size={36} />
        <span className="text-sm font-medium text-slate-400">Consultando base de datos Firebird...</span>
      </div>
    );
  }

  // 3️⃣ Estado: Se produjo un error controlado en la consulta HTTP
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 max-w-2xl mx-auto">
          <AlertCircle className="text-amber-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-amber-900">Error de Sincronización</h3>
            <p className="text-amber-700 text-sm mt-1">{error}</p>
            <button 
              onClick={cargarFamilias}
              className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-xs font-medium transition-colors"
            >
              Intentar de Nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4️⃣ Vista de Datos Renderizada Correctamente
  return (
    <div className="p-6 space-y-4 h-full overflow-y-auto">
      {/* Cabecera Informativa */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gestión de Familias</h2>
          <p className="text-xs text-slate-500 mt-1">
            Filtro activo en Base de Datos: Empresa <span className="font-mono text-blue-600 font-semibold">{entorno.empresa}</span> | Ejercicio <span className="font-mono text-blue-600 font-semibold">{entorno.ejercicio}</span> | Canal <span className="font-mono text-blue-600 font-semibold">{entorno.canal}</span>
          </p>
        </div>
        <button 
          onClick={cargarFamilias}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold border border-slate-300 transition-colors"
          title="Forzar actualización de datos"
        >
          <RefreshCw size={14} />
          Actualizar Vista
        </button>
      </div>

      {/* Condicional si el entorno no tiene familias cargadas */}
      {familias.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm max-w-xl mx-auto">
          <Search className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-600 font-medium">Sin registros disponibles</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            No se han encontrado familias guardadas en Firebird que correspondan a los filtros exactos de este entorno.
          </p>
        </div>
      ) : (
        /* Estructura de tabla limpia y sincronizada con los campos de la BD */
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Código Familia</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Descripción / Título</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wider text-center">Tipo IVA</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wider text-center">Permite Stock Negativo</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {familias.map((fam, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono font-bold text-slate-700">{fam.familia}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{fam.titulo}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 text-center">{fam.tipo_iva || '-'}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    {fam.permite_negativo === 1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">Sí</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar familia"
                    >
                      <Edit size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-right">
            <span className="text-xs text-slate-500 font-medium">Total de Familias: {familias.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}