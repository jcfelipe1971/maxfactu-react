import { Plus, Download, Upload } from 'lucide-react';

interface FamiliasToolbarProps {
  onNuevo: () => void;
  totalRegistros: number;
}

export function FamiliasToolbar({ onNuevo, totalRegistros }: FamiliasToolbarProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onNuevo}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nueva Familia
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded hover:bg-slate-50 text-sm transition-colors">
          <Download size={16} />
          Exportar
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded hover:bg-slate-50 text-sm transition-colors">
          <Upload size={16} />
          Importar
        </button>
      </div>

      <div className="text-sm text-slate-600">
        Total registros: <span className="font-semibold">{totalRegistros}</span>
      </div>
    </div>
  );
}