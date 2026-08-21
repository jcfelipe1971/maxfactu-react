import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface EntornoData {
  empresa: number | null;
  ejercicio: number | null;
  canal: number | null;
  serie: string;
  fechaTrab: string;
  usuario: string | null;
}

export interface SelectOption<TValue extends number | string = number | string> {
  value: TValue;
  label: string;
}

interface EntornoContextType {
  entorno: EntornoData;
  setEntorno: (data: Partial<EntornoData>) => void;

  empresas: SelectOption<number>[];
  ejercicios: SelectOption<number>[];
  canales: SelectOption<number>[];
  series: SelectOption<string>[];

  loadingEmpresas: boolean;
  loadingEjercicios: boolean;
  loadingCanales: boolean;
  loadingSeries: boolean;
  errorEmpresas: string | null;
  errorEjercicios: string | null;
  errorCanales: string | null;
  errorSeries: string | null;

  cargarEmpresas: () => Promise<void>;
  cargarEjercicios: (empresa: number) => Promise<void>;
  cargarCanales: (empresa: number, ejercicio: number) => Promise<void>;
  cargarSeries: (empresa: number, ejercicio: number, canal: number) => Promise<void>;
  cargarTodo: () => Promise<void>;
}

const EntornoContext = createContext<EntornoContextType | undefined>(undefined);

const todayIso = () => new Date().toISOString().split("T")[0];

const readJson = async <TData,>(res: Response): Promise<TData> => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.details || data?.detalle || data?.error || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data as TData;
};

const initializeEntorno = (): EntornoData => {
  const guardado = localStorage.getItem("entorno");
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      console.log("Entorno restaurado de localStorage:", parsed);
      return {
        empresa: parsed.empresa ?? null,
        ejercicio: parsed.ejercicio ?? null,
        canal: parsed.canal ?? null,
        serie: parsed.serie ?? "",
        fechaTrab: parsed.fechaTrab || todayIso(),
        usuario: parsed.usuario ?? null,
      };
    } catch (error) {
      console.error("Error parseando localStorage:", error);
    }
  }

  return {
    empresa: null,
    ejercicio: null,
    canal: null,
    serie: "",
    fechaTrab: todayIso(),
    usuario: null,
  };
};

export function EntornoProvider({ children }: { children: ReactNode }) {
  const [entorno, setEntornoState] = useState<EntornoData>(initializeEntorno());

  const [empresas, setEmpresas] = useState<SelectOption<number>[]>([]);
  const [ejercicios, setEjercicios] = useState<SelectOption<number>[]>([]);
  const [canales, setCanales] = useState<SelectOption<number>[]>([]);
  const [series, setSeries] = useState<SelectOption<string>[]>([]);

  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);
  const [loadingCanales, setLoadingCanales] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [errorEmpresas, setErrorEmpresas] = useState<string | null>(null);
  const [errorEjercicios, setErrorEjercicios] = useState<string | null>(null);
  const [errorCanales, setErrorCanales] = useState<string | null>(null);
  const [errorSeries, setErrorSeries] = useState<string | null>(null);

  const setEntorno = useCallback((data: Partial<EntornoData>) => {
    setEntornoState((prev) => {
      const nuevo = { ...prev, ...data };
      console.log("Guardando entorno en localStorage:", nuevo);
      localStorage.setItem("entorno", JSON.stringify(nuevo));
      return nuevo;
    });
  }, []);

  const cargarEmpresas = useCallback(async () => {
    setLoadingEmpresas(true);
    setErrorEmpresas(null);
    try {
      const res = await fetch("/api/entorno/empresas");
      const data = await readJson<SelectOption<number>[]>(res);
      console.log("Empresas cargadas:", data);
      setEmpresas(data);
    } catch (error) {
      console.error("Error cargando empresas:", error);
      setErrorEmpresas(error instanceof Error ? error.message : "Error cargando empresas");
      setEmpresas([]);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

  const cargarEjercicios = useCallback(async (empresa: number) => {
    setLoadingEjercicios(true);
    setErrorEjercicios(null);
    try {
      console.log("Cargando ejercicios para empresa:", empresa);
      const res = await fetch(`/api/entorno/ejercicios?empresa=${empresa}`);
      const data = await readJson<SelectOption<number>[]>(res);
      console.log("Ejercicios cargados:", data);
      setEjercicios(data);
    } catch (error) {
      console.error("Error cargando ejercicios:", error);
      setErrorEjercicios(error instanceof Error ? error.message : "Error cargando ejercicios");
      setEjercicios([]);
    } finally {
      setLoadingEjercicios(false);
    }
  }, []);

  const cargarCanales = useCallback(async (empresa: number, ejercicio: number) => {
    setLoadingCanales(true);
    setErrorCanales(null);
    try {
      console.log("Cargando canales - Empresa:", empresa, "Ejercicio:", ejercicio);
      const res = await fetch(`/api/entorno/canales?empresa=${empresa}&ejercicio=${ejercicio}`);
      const data = await readJson<SelectOption<number>[]>(res);
      console.log("Canales cargados:", data);
      setCanales(data);
    } catch (error) {
      console.error("Error cargando canales:", error);
      setErrorCanales(error instanceof Error ? error.message : "Error cargando canales");
      setCanales([]);
    } finally {
      setLoadingCanales(false);
    }
  }, []);

  const cargarSeries = useCallback(async (empresa: number, ejercicio: number, canal: number) => {
    setLoadingSeries(true);
    setErrorSeries(null);
    try {
      const res = await fetch(`/api/entorno/series?empresa=${empresa}&ejercicio=${ejercicio}&canal=${canal}`);
      const data = await readJson<SelectOption<string>[]>(res);
      console.log("Series cargadas:", data);
      setSeries(data);
    } catch (error) {
      console.error("Error cargando series:", error);
      setErrorSeries(error instanceof Error ? error.message : "Error cargando series");
      setSeries([]);
    } finally {
      setLoadingSeries(false);
    }
  }, []);

  const cargarTodo = useCallback(async () => {
    await cargarEmpresas();
  }, [cargarEmpresas]);

  useEffect(() => {
    if (entorno.empresa) {
      console.log("Empresa cambiada:", entorno.empresa);
      cargarEjercicios(entorno.empresa);
      setCanales([]);
      setSeries([]);
    }
  }, [entorno.empresa, cargarEjercicios]);

  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio) {
      console.log("Ejercicio cambiado:", entorno.ejercicio);
      cargarCanales(entorno.empresa, entorno.ejercicio);
      setSeries([]);
    }
  }, [entorno.ejercicio, entorno.empresa, cargarCanales]);

  useEffect(() => {
    if (entorno.empresa && entorno.ejercicio && entorno.canal !== null) {
      console.log("Canal cambiado:", entorno.canal);
      cargarSeries(entorno.empresa, entorno.ejercicio, entorno.canal);
    }
  }, [entorno.canal, entorno.empresa, entorno.ejercicio, cargarSeries]);

  return (
    <EntornoContext.Provider
      value={{
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
        errorEmpresas,
        errorEjercicios,
        errorCanales,
        errorSeries,
        cargarEmpresas,
        cargarEjercicios,
        cargarCanales,
        cargarSeries,
        cargarTodo,
      }}
    >
      {children}
    </EntornoContext.Provider>
  );
}

export function useEntorno() {
  const context = useContext(EntornoContext);
  if (context === undefined) {
    throw new Error("useEntorno debe usarse dentro de EntornoProvider");
  }
  return context;
}
