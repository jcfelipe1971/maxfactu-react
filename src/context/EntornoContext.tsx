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

export interface Empresa {
  empresa: number;
  titulo: string;
}

export interface Ejercicio {
  ejercicio: number;
  titulo: string;
}

export interface Canal {
  canal: number;
  titulo: string;
}

export interface Serie {
  serie: string;
  titulo: string;
}

interface EntornoContextType {
  entorno: EntornoData;
  setEntorno: (data: Partial<EntornoData>) => void;
  
  empresas: Empresa[];
  ejercicios: Ejercicio[];
  canales: Canal[];
  series: Serie[];
  
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

// 🔹 Función para inicializar estado desde localStorage
const initializeEntorno = (): EntornoData => {
  const guardado = localStorage.getItem('entorno');
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      console.log('✅ Entorno restaurado de localStorage:', parsed);
      return {
        empresa: parsed.empresa ?? null,
        ejercicio: parsed.ejercicio ?? null,
        canal: parsed.canal ?? null,
        serie: parsed.serie ?? '',
        fechaTrab: parsed.fechaTrab || new Date().toISOString().split('T')[0],
        usuario: parsed.usuario ?? null,
      };
    } catch (error) {
      console.error('❌ Error parseando localStorage:', error);
    }
  }
  return {
    empresa: null,
    ejercicio: null,
    canal: null,
    serie: '',
    fechaTrab: new Date().toISOString().split('T')[0],
    usuario: null,
  };
};

export function EntornoProvider({ children }: { children: ReactNode }) {
  const [entorno, setEntornoState] = useState<EntornoData>(initializeEntorno());

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [canales, setCanales] = useState<Canal[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);

  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);
  const [loadingCanales, setLoadingCanales] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);

  const setEntorno = useCallback((data: Partial<EntornoData>) => {
    setEntornoState(prev => {
      const nuevo = { ...prev, ...data };
      console.log('💾 Guardando entorno en localStorage:', nuevo);
      localStorage.setItem('entorno', JSON.stringify(nuevo));
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
    } catch (error) {
      console.error('❌ Error cargando empresas:', error);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

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
