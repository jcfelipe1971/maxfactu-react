// src/components/FamiliasView.tsx
import { useState, useEffect } from 'react';
import { useEntorno } from '../context/EntornoContext';
import { 
  ChevronRight, ChevronsLeft, ChevronsRight, Plus, Trash2, 
  Edit, Save, X, Search, AlertCircle, RefreshCw 
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Familia>>({});

  const cargarFamilias = async () => {
    if (!entorno.empresa || !entorno.ejercicio || !entorno.canal) {
      setError('⚠️ Configure primero Empresa, Ejercicio y Canal');
      setFamilias([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Cargando familias con entorno:', entorno);
      
      const response = await fetch('/api/familias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: entorno.empresa,
          ejercicio: entorno.ejercicio,
          canal: entorno.canal,
          familia: '0' // Para mostrar todas
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Familias recibidas:', data);
      
      setFamilias(data);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error cargando familias:', err);
      setError(`Error al cargar familias: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setFamilias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFamilias();
  }, [entorno.empresa, entorno.ejercicio, entorno.canal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-slate-600">Cargando familias...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-amber-900">Atención</h3>
            <p className="text-amber-700 text-sm mt-1">{error}</p>
            <button 
              onClick={cargarFamilias}
              className="mt-3 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header con info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Gestión de Familias</h2>
          <p className="text-sm text-slate-500">
            {entorno.empresa && `Empresa: ${entorno.empresa} | Ejercicio: ${entorno.ejercicio} | Canal: ${entorno.canal}`}
          </p>
        </div>
        <button 
          onClick={cargarFamilias}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Tabla de familias */}
      {familias.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <Search className="mx-auto text-slate-400 mb-3" size={48} />
          <p className="text-slate-500">No hay familias registradas</p>
          <p className="text-sm text-slate-400 mt-1">Verifique la configuración del entorno</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Tipo IVA</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Permite Negativo</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {familias.map((fam, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-900">{fam.familia}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{fam.titulo}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{fam.tipo_iva || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    {fam.permite_negativo === 1 ? (
                      <span className="text-green-600 font-medium">Sí</span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
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