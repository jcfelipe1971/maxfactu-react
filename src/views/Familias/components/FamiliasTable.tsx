import { Edit, Trash2 } from 'lucide-react';

interface Familia {
  familia: string;
  titulo: string;
  tipo_iva?: string;
  stock_negativo?: number;
}

interface FamiliasTableProps {
  familias: Familia[];
  onEditar: (familia: Familia) => void;
  onEliminar: (familia: Familia) => void;
}

export function FamiliasTable({ familias, onEditar, onEliminar }: FamiliasTableProps) {
  if (familias.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500">No hay familias registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Código</th>
            <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Descripción</th>
            <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Tipo IVA</th>
            <th className="text-left py-3 px-4 font-medium text-slate-700 text-sm">Stock Negativo</th>
            <th className="text-right py-3 px-4 font-medium text-slate-700 text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {familias.map((fam, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="py-3 px-4 text-sm font-medium text-slate-900">{fam.familia}</td>
              <td className="py-3 px-4 text-sm text-slate-700">{fam.titulo}</td>
              <td className="py-3 px-4 text-sm text-slate-600">{fam.tipo_iva || '-'}</td>
              <td className="py-3 px-4 text-sm">
                {fam.stock_negativo === 1 ? (
                  <span className="text-green-600 font-medium">Permitido</span>
                ) : (
                  <span className="text-slate-400">No permitido</span>
                )}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEditar(fam)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onEliminar(fam)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}