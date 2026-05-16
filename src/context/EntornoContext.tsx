// src/context/EntornoContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export interface EntornoData {
  empresa: number | null;
  ejercicio: number | null;
  canal: number | null;
  serie: string;
  fechaTrab: string;
  usuario: string | null;
}

export interface OptionItem {
  value: number | string;
  label: string;
}

interface EntornoContextType {
  entorno: EntornoData;
  setEntorno: (data: Partial<EntornoData>) => void;
  
  // Listas de opciones
  empresas: OptionItem[];
  ejercicios: OptionItem[];
  canales: OptionItem[];
  series: OptionItem[];
  
  // Estados de carga
  loadingEmpresas: boolean;
  loadingEjercicios: boolean;
  loadingCanales: boolean;
  loadingSeries: boolean;
  
  // Métodos de carga
  cargarEmpresas: () => Promise<void>;
  cargarEjercicios: (empresa: number) => Promise<void>;
  cargarCanales: (empresa: number, ejercicio: number) => Promise<void>;
  cargarSeries: (empresa: number, ejercicio: number, canal: number) => Promise<void>;
  cargarTodo: () => Promise<void>;
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

  const [empresas, setEmpresas] = useState<OptionItem[]>([]);
  const [ejercicios, setEjercicios] = useState<OptionItem[]>([]);
  const [canales, setCanales] = useState<OptionItem[]>([]);
  const [series, setSeries] = useState<OptionItem[]>([]);

  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);
  const [loadingCanales, setLoadingCanales] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);

  // ✅ Función setEntorno corregida - usa useCallback
  const setEntorno = useCallback((data: Partial<EntornoData>) => {
    setEntornoState(prev => {
      const nuevoEntorno = { ...prev, ...data };
      // Guardar inmediatamente en localStorage
      localStorage.setItem('entorno', JSON.stringify(nuevoEntorno));
      return nuevoEntorno;
    });
  }, []);

  const cargarEmpresas = async () => {
    setLoadingEmpresas(true);
    try {
      const res = await fetch('/api/entorno/empresas');
      const data = await res.json();
      console.log('Empresas cargadas:', data); // 🔍 Debug
      setEmpresas(data);

      // Si hay empresa guardada en localStorage, restaurarla
      const guardado = localStorage.getItem('entorno');
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed.empresa && data.find((e: OptionItem) => e.value === parsed.empresa)) {
          setEntornoState(prev => ({ ...prev, empresa: parsed.empresa }));
        }
      }
    } catch (error) {
      console.error('Error cargando empresas:', error);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const cargarEjercicios = async (empresa: number) => {
    setLoadingEjercicios(true);
    try {
      console.log('Cargando ejercicios para empresa:', empresa); // 🔍 Debug
      const res = await fetch(`/api/entorno/ejercicios?empresa=${empresa}`);
      const data = await res.json();
      console.log('Ejercicios cargados:', data); // 🔍 Debug
      setEjercicios(data);

      // Restaurar ejercicio si es válido para esta empresa
      const guardado = localStorage.getItem('entorno');
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed.empresa === empresa && parsed.ejercicio &&
            data.find((e: OptionItem) => e.value === parsed.ejercicio)) {
          setEntornoState(prev => ({ ...prev, ejercicio: parsed.ejercicio }));
        }
      }
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
    } finally {
      setLoadingEjercicios(false);
    }
  };

  const cargarCanales = async (empresa: number, ejercicio: number) => {
    setLoadingCanales(true);
    try {
      console.log('Cargando canales - Empresa:', empresa, 'Ejercicio:', ejercicio); // 🔍 Debug
      const res = await fetch(`/api/entorno/canales?empresa=${empresa}&ejercicio=${ejercicio}`);
      const data = await res.json();
      console.log('Canales cargados:', data); // 🔍 Debug
      setCanales(data);

      // Restaurar canal si es válido
      const guardado = localStorage.getItem('entorno');
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed.empresa === empresa && parsed.ejercicio === ejercicio &&
            parsed.canal && data.find((c: OptionItem) => c.value === parsed.canal)) {
          setEntornoState(prev => ({ ...prev, canal: parsed.canal }));
        }
      }
    } catch (error) {
      console.error('Error cargando canales:', error);
    } finally {
      setLoadingCanales(false);
    }
  };

  const cargarSeries = async (empresa: number, ejercicio: number, canal: number) => {
    setLoadingSeries(true);
    try {
      const res = await fetch(`/api/entorno/series?empresa=${empresa}&ejercicio=${ejercicio}&canal=${canal}`);
      const data = await res.json();
      setSeries(data);

      // Restaurar serie si es válida
      const guardado = localStorage.getItem('entorno');
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed.empresa === empresa && parsed.ejercicio === ejercicio &&
            parsed.canal === canal && parsed.serie &&
            data.find((s: OptionItem) => s.value === parsed.serie)) {
          setEntornoState(prev => ({ ...prev, serie: parsed.serie }));
        }
      }
    } catch (error) {
      console.error('Error cargando series:', error);
    } finally {
      setLoadingSeries(false);
    }
  };

  const cargarTodo = async () => {
    await cargarEmpresas();
  };

  // ✅ Efectos en cascada corregidos - ahora usan setEntornoState directamente
  useEffect(() => {
    if (entorno.empresa) {
      console.log('🔄 Empresa cambiada:', entorno.empresa); // 🔍 Debug
      cargarEjercicios(entorno.empresa);
    } else {
      setEjercicios([]);
      setCanales([]);
      setSeries([]);
      setEntornoState(prev => ({ ...prev, ejercicio: null, canal: null, serie: '' }));
    }
  }, [entorno.empresa]);

  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio) {
      console.log('🔄 Ejercicio cambiado:', entorno.ejercicio); // 🔍 Debug
      cargarCanales(entorno.empresa, entorno.ejercicio);
    } else {
      setCanales([]);
      setSeries([]);
      setEntornoState(prev => ({ ...prev, canal: null, serie: '' }));
    }
  }, [entorno.ejercicio]);

  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio && entorno.canal) {
      console.log('🔄 Canal cambiado:', entorno.canal); // 🔍 Debug
      cargarSeries(entorno.empresa, entorno.ejercicio, entorno.canal);
    } else {
      setSeries([]);
      setEntornoState(prev => ({ ...prev, serie: '' }));
    }
  }, [entorno.canal]);

  return (
    <EntornoContext.Provider value={{
      entorno,
      setEntorno,
      empresas,
      ejercicios,
      canales,
      series,
      loadingEmpresas,
      loadingEjercicios,
      loadingCanales,
      loadingSeries,
      cargarEmpresas,
      cargarEjercicios,
      cargarCanales,
      cargarSeries,
      cargarTodo,
    }}>
      {children}
    </EntornoContext.Provider>
  );
}

export function useEntorno() {
  const context = useContext(EntornoContext);
  if (context === undefined) {
    throw new Error('useEntorno debe usarse dentro de EntornoProvider');
  }
  return context;
}