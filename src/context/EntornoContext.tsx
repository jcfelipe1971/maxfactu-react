// src/context/EntornoContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface EntornoData {
  empresa: number | null;
  ejercicio: number | null;
  canal: number | null;
  serie: string;
  fechaTrab: string;
  usuario: string | null;
}

interface EntornoContextType {
  entorno: EntornoData;
  setEntorno: (data: Partial<EntornoData>) => void;
  empresas: Array<{ value: number; label: string }>;
  ejercicios: Array<{ value: number; label: string }>;
  canales: Array<{ value: number; label: string }>;
  series: Array<{ value: string; label: string }>;
  cargarEntorno: () => Promise<void>;
}

const EntornoContext = createContext<EntornoContextType | undefined>(undefined);

export function EntornoProvider({ children }: { children: ReactNode }) {
  const [entorno, setEntornoState] = useState<EntornoData>({
    empresa: null,
    ejercicio: null,
    canal: null,
    serie: '',
    fechaTrab: new Date().toISOString().split('T')[0],
    usuario: null,
  });

  const [empresas, setEmpresas] = useState<Array<{ value: number; label: string }>>([]);
  const [ejercicios, setEjercicios] = useState<Array<{ value: number; label: string }>>([]);
  const [canales, setCanales] = useState<Array<{ value: number; label: string }>>([]);
  const [series, setSeries] = useState<Array<{ value: string; label: string }>>([]);

  const setEntorno = (data: Partial<EntornoData>) => {
    setEntornoState(prev => ({ ...prev, ...data }));
  };

  const cargarEntorno = async () => {
    try {
      // Cargar empresas
      const resEmpresas = await fetch('/api/empresas');
      const dataEmpresas = await resEmpresas.json();
      setEmpresas(dataEmpresas.map((e: any) => ({
        value: e.EMPRESA,
        label: e.TITULO
      })));

      // Cargar ejercicios (depende de la empresa seleccionada)
      if (entorno.empresa) {
        const resEjercicios = await fetch(`/api/ejercicios?empresa=${entorno.empresa}`);
        const dataEjercicios = await resEjercicios.json();
        setEjercicios(dataEjercicios.map((e: any) => ({
          value: e.EJERCICIO,
          label: `${e.EJERCICIO} (${e.APERTURA} - ${e.CIERRE})`
        })));
      }

      // Cargar canales (depende de empresa y ejercicio)
      if (entorno.empresa && entorno.ejercicio) {
        const resCanales = await fetch(
          `/api/canales?empresa=${entorno.empresa}&ejercicio=${entorno.ejercicio}`
        );
        const dataCanales = await resCanales.json();
        setCanales(dataCanales.map((c: any) => ({
          value: c.CANAL,
          label: `Canal ${c.CANAL}`
        })));
      }

      // Cargar series (depende de empresa, ejercicio y canal)
      if (entorno.empresa && entorno.ejercicio && entorno.canal) {
        const resSeries = await fetch(
          `/api/series?empresa=${entorno.empresa}&ejercicio=${entorno.ejercicio}&canal=${entorno.canal}`
        );
        const dataSeries = await resSeries.json();
        setSeries(dataSeries.map((s: any) => ({
          value: s.SERIE,
          label: `${s.SERIE} ${s.TITULO}`
        })));
      }
    } catch (error) {
      console.error('Error cargando entorno:', error);
    }
  };

  return (
    <EntornoContext.Provider value={{
      entorno,
      setEntorno,
      empresas,
      ejercicios,
      canales,
      series,
      cargarEntorno
    }}>
      {children}
    </EntornoContext.Provider>
  );
}

export function useEntorno() {
  const context = useContext(EntornoContext);
  if (context === undefined) {
    throw new Error('useEntorno debe ser usado dentro de un EntornoProvider');
  }
  return context;
}