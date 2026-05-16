// src/components/EntornoConfig.tsx
import { useState, useEffect } from 'react';
import { useEntorno } from '../context/EntornoContext';

export function EntornoConfig() {
  const { entorno, setEntorno, empresas, ejercicios, canales, series, cargarEntorno } = useEntorno();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    cargarEntorno();
  }, []);

  // Cuando cambia la empresa, recargar ejercicios
  useEffect(() => {
    if (entorno.empresa) {
      cargarEntorno();
    }
  }, [entorno.empresa]);

  // Cuando cambia el ejercicio, recargar canales
  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio) {
      cargarEntorno();
    }
  }, [entorno.ejercicio]);

  // Cuando cambia el canal, recargar series
  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio && entorno.canal) {
      cargarEntorno();
    }
  }, [entorno.canal]);

  return (
    <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left font-semibold mb-2"
      >
        {expanded ? '▼' : '▶'} Configuración del Entorno
      </button>
      
      {expanded && (
        <div className="space-y-3">
          {/* Empresa */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Empresa</label>
            <select
              value={entorno.empresa || ''}
              onChange={(e) => setEntorno({ empresa: Number(e.target.value) })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
            >
              <option value="">Seleccione...</option>
              {empresas.map(emp => (
                <option key={emp.value} value={emp.value}>{emp.label}</option>
              ))}
            </select>
          </div>

          {/* Ejercicio */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Ejercicio</label>
            <select
              value={entorno.ejercicio || ''}
              onChange={(e) => setEntorno({ ejercicio: Number(e.target.value) })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              disabled={!entorno.empresa}
            >
              <option value="">Seleccione...</option>
              {ejercicios.map(eje => (
                <option key={eje.value} value={eje.value}>{eje.label}</option>
              ))}
            </select>
          </div>

          {/* Canal */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Canal</label>
            <select
              value={entorno.canal || ''}
              onChange={(e) => setEntorno({ canal: Number(e.target.value) })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              disabled={!entorno.ejercicio}
            >
              <option value="">Seleccione...</option>
              {canales.map(can => (
                <option key={can.value} value={can.value}>{can.label}</option>
              ))}
            </select>
          </div>

          {/* Serie */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Serie</label>
            <select
              value={entorno.serie}
              onChange={(e) => setEntorno({ serie: e.target.value })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              disabled={!entorno.canal}
            >
              <option value="">Seleccione...</option>
              {series.map(ser => (
                <option key={ser.value} value={ser.value}>{ser.label}</option>
              ))}
            </select>
          </div>

          {/* Fecha de Trabajo */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Fecha Trabajo</label>
            <input
              type="date"
              value={entorno.fechaTrab}
              onChange={(e) => setEntorno({ fechaTrab: e.target.value })}
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
            />
          </div>

          {/* Botón Guardar */}
          <button
            onClick={() => {
              localStorage.setItem('entorno', JSON.stringify(entorno));
              alert('Entorno guardado');
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-2"
          >
            Modificar Entorno
          </button>
        </div>
      )}
    </div>
  );
}