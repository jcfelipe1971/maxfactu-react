// src/components/FamiliasView.tsx
import { useState, useEffect } from 'react';
import { useEntorno } from '../context/EntornoContext';
import { 
  Plus, Edit, Search, AlertCircle, RefreshCw 
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

  const cargarFamilias = async () => {
    if (!entorno.empresa || !entorno.ejercicio || !entorno.canal) {
      setError('⚠️ Configure primero Empresa, Ejercicio y Canal en el menú de entorno superior y guarde.');
      setFamilias([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Consultando familias para el entorno:', entorno);
      
      // 🔹 FORZAMOS EL ORIGEN RELATIVO CORRECTO O ABSOLUTO DETECTANDO EL PUERTO DEL BACKEND
      const API_URL = window.location.origin.includes('5173') 
        ? 'http://localhost:3000/api/familias' 
        : '/api/familias';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          empresa: entorno.empresa,
          ejercicio: entorno.ejercicio,
          canal: entorno.canal
        })
      });

      // Si Express o Vite devuelven HTML por error, lo interceptamos antes de que rompa el JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no respondió con JSON válido. Revisa las rutas de Express.");
      }

      if (!response.ok) {
        throw new Error(`Error en el servidor: Estado ${response.status}`);
      }

      const data = await response.json();
      setFamilias(data);
    } catch (err: any) {
      console.error('❌ Error cargando familias:', err);
      setError(err.message || 'Error de conexión con el backend.');
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta automáticamente al cargar el componente o cuando cambie el entorno guardado
  useEffect(() => {
    cargarFamilias();
  }, [entorno.empresa, entorno.ejercicio, entorno.canal]);

  return (
    <div className="p-6 space-y-4 bg-slate-50 min-h-screen text-slate-800">
      
      {/* Barra de título e información de entorno */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Familias de Artículos</h2>
          <p className="text-xs text-slate-500 mt-1">
            Entorno activo: Empresa <span className="font-mono text-blue-600 font-bold">{entorno.empresa || '-'}</span> | 
            Ejercicio <span className="font-mono text-blue-600 font-bold">{entorno.ejercicio || '-'}</span> | 
            Canal <span className="font-mono text-blue-600 font-bold">{entorno.canal || '-'}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={cargarFamilias}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Recargar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
            <Plus size={14} />
            Nueva Familia
          </button>
        </div>
      </div>

      {/* Manejo de Estados visuales (Carga, Error o Vacío) */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 text-sm shadow-inner">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <RefreshCw className="animate-spin text-blue-600" size={32} />
          <p className="text-sm text-slate-500 font-medium">Buscando datos en Firebird...</p>
        </div>
      ) : familias.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm max-w-md mx-auto mt-8">
          <Search className="mx-auto text-slate-300 mb-3" size={44} />
          <h4 className="text-slate-700 font-semibold text-sm">No se encontraron registros</h4>
          <p className="text-xs text-slate-400 mt-1 px-6">
            Asegúrate de que la combinación seleccionada de empresa, ejercicio y canal posea registros válidos cargados en tu base de datos.
          </p>
        </div>
      ) : (
        /* Tabla Principal estructurada */
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Código</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Descripción / Título</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center w-24">Tipo IVA</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center w-36">Stock Negativo</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right w-24">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {familias.map((fam, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono font-bold text-slate-800">{fam.familia}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-700">{fam.titulo}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 text-center">{fam.tipo_iva || '-'}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      {fam.permite_negativo === 1 ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">Sí</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500>">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors inline-flex"
                        title="Editar Familia"
                      >
                        <Edit size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-right">
            <span className="text-xs text-slate-500 font-semibold">Familias Cargadas: {familias.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}