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
  
  empresas: OptionItem[];
  ejercicios: OptionItem[];
  canales: OptionItem[];
  series: OptionItem[];
  
  loadingEmpresas: boolean;
  loadingEjercicios: boolean;
  loadingCanales: boolean;
  loadingSeries: boolean;
  
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

  const setEntorno = useCallback((data: Partial<EntornoData>) => {
    setEntornoState(prev => {
      const nuevo = { ...prev, ...data };
      // Solo guardar si hay cambios reales
      const guardado = localStorage.getItem('entorno');
      if (guardado !== JSON.stringify(nuevo)) {
        localStorage.setItem('entorno', JSON.stringify(nuevo));
      }
      return nuevo;
    });
  }, []);

  const cargarEmpresas = useCallback(async () => {
    setLoadingEmpresas(true);
    try {
      const res = await fetch('/api/entorno/empresas');
      const data = await res.json();
      console.log('✅ Empresas cargadas:', data);
      setEmpresas(data);

      // Restaurar del localStorage solo la primera vez
      const guardado = localStorage.getItem('entorno');
      if (guardado && !entorno.empresa) {
        const parsed = JSON.parse(guardado);
        if (parsed.empresa && data.find((e: OptionItem) => e.value === parsed.empresa)) {
          setEntornoState(prev => ({ ...prev, empresa: parsed.empresa }));
        }
      }
    } catch (error) {
      console.error('❌ Error cargando empresas:', error);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []); // ✅ Sin dependencias que causen bucles

  const cargarEjercicios = useCallback(async (empresa: number) => {
    setLoadingEjercicios(true);
    try {
      console.log('📅 Cargando ejercicios para empresa:', empresa);
      const res = await fetch(`/api/entorno/ejercicios?empresa=${empresa}`);
      const data = await res.json();
      console.log('✅ Ejercicios cargados:', data);
      setEjercicios(data);
    } catch (error) {
      console.error('❌ Error cargando ejercicios:', error);
    } finally {
      setLoadingEjercicios(false);
    }
  }, []);

  const cargarCanales = useCallback(async (empresa: number, ejercicio: number) => {
    setLoadingCanales(true);
    try {
      console.log('🔗 Cargando canales - Empresa:', empresa, 'Ejercicio:', ejercicio);
      const res = await fetch(`/api/entorno/canales?empresa=${empresa}&ejercicio=${ejercicio}`);
      const data = await res.json();
      console.log('✅ Canales cargados:', data);
      setCanales(data);
    } catch (error) {
      console.error('❌ Error cargando canales:', error);
    } finally {
      setLoadingCanales(false);
    }
  }, []);

  const cargarSeries = useCallback(async (empresa: number, ejercicio: number, canal: number) => {
    setLoadingSeries(true);
    try {
      const res = await fetch(`/api/entorno/series?empresa=${empresa}&ejercicio=${ejercicio}&canal=${canal}`);
      const data = await res.json();
      console.log('✅ Series cargadas:', data);
      setSeries(data);
    } catch (error) {
      console.error('❌ Error cargando series:', error);
    } finally {
      setLoadingSeries(false);
    }
  }, []);

  const cargarTodo = useCallback(async () => {
    await cargarEmpresas();
  }, [cargarEmpresas]);

  // ✅ Efectos en cascada con dependencias correctas
  useEffect(() => {
    if (entorno.empresa) {
      console.log('🔄 Empresa cambiada:', entorno.empresa);
      cargarEjercicios(entorno.empresa);
      // Resetear dependientes
      setEjercicios([]);
      setCanales([]);
      setSeries([]);
      setEntornoState(prev => ({ ...prev, ejercicio: null, canal: null, serie: '' }));
    }
  }, [entorno.empresa, cargarEjercicios]);

  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio) {
      console.log('🔄 Ejercicio cambiado:', entorno.ejercicio);
      cargarCanales(entorno.empresa, entorno.ejercicio);
      // Resetear dependientes
      setCanales([]);
      setSeries([]);
      setEntornoState(prev => ({ ...prev, canal: null, serie: '' }));
    }
  }, [entorno.ejercicio, entorno.empresa, cargarCanales]);

  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio && entorno.canal) {
      console.log('🔄 Canal cambiado:', entorno.canal);
      cargarSeries(entorno.empresa, entorno.ejercicio, entorno.canal);
      setSeries([]);
      setEntornoState(prev => ({ ...prev, serie: '' }));
    }
  }, [entorno.canal, entorno.empresa, entorno.ejercicio, cargarSeries]);

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