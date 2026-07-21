import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface Familia {
  familia: string;
  titulo: string;
  tipo_iva?: string;
  stock_negativo?: number;
}

interface FamiliasFormProps {
  familia: Familia | null;
  onClose: () => void;
  onSave: (familia: Familia) => void;
  tiposIva: Array<{ value: string; label: string }>;
}

export function FamiliasForm({ familia, onClose, onSave, tiposIva }: FamiliasFormProps) {
  const [formData, setFormData] = useState<Familia>({
    familia: '',
    titulo: '',
    tipo_iva: '',
    stock_negativo: 0
  });

  useEffect(() => {
    if (familia) {
      setFormData(familia);
    }
  }, [familia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">
            {familia?.familia ? `Editar Familia ${familia.familia}` : 'Nueva Familia'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Código de Familia *
              </label>
              <input
                type="text"
                value={formData.familia}
                onChange={(e) => setFormData({ ...formData, familia: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!!familia?.familia}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo IVA
              </label>
              <select
                value={formData.tipo_iva}
                onChange={(e) => setFormData({ ...formData, tipo_iva: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione...</option>
                {tiposIva.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.stock_negativo === 1}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  stock_negativo: e.target.checked ? 1 : 0 
                })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Permitir stock negativo
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              <Save size={16} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}