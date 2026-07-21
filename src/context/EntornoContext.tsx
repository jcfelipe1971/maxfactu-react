import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Entorno {
  empresa: number | null;
  ejercicio: number | null;
  canal: number | null;
  serie: string;
  fechaTrab: string;
}

interface EntornoContextType {
  entorno: Entorno;
  setEntorno: (entorno: Entorno) => void;
  empresas: Array<{ value: number; label: string }>;
  ejercicios: Array<{ value: number; label: string }>;
  canales: Array<{ value: number; label: string }>;
  series: Array<{ value: string; label: string }>;
  loadingEmpresas: boolean;
  loadingEjercicios: boolean;
  loadingCanales: boolean;
  loadingSeries: boolean;
  errorEmpresas: string | null;
  errorEjercicios: string | null;
  errorCanales: string | null;
  errorSeries: string | null;
  cargarTodo: () => Promise<void>;
}

const EntornoContext = createContext<EntornoContextType | undefined>(undefined);

export function EntornoProvider({ children }: { children: ReactNode }) {
  const [entorno, setEntorno] = useState<Entorno>({
    empresa: null,
    ejercicio: null,
    canal: null,
    serie: "",
    fechaTrab: new Date().toISOString().split("T")[0],
  });

  const [empresas, setEmpresas] = useState<Array<{ value: number; label: string }>>([]);
  const [ejercicios, setEjercicios] = useState<Array<{ value: number; label: string }>>([]);
  const [canales, setCanales] = useState<Array<{ value: number; label: string }>>([]);
  const [series, setSeries] = useState<Array<{ value: string; label: string }>>([]);

  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);
  const [loadingCanales, setLoadingCanales] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);

  const [errorEmpresas, setErrorEmpresas] = useState<string | null>(null);
  const [errorEjercicios, setErrorEjercicios] = useState<string | null>(null);
  const [errorCanales, setErrorCanales] = useState<string | null>(null);
  const [errorSeries, setErrorSeries] = useState<string | null>(null);

  const cargarTodo = useCallback(async () => {
    setLoadingEmpresas(true);
    setErrorEmpresas(null);

    try {
      const response = await fetch("/api/entorno/empresas");
      if (!response.ok) throw new Error("Error loading empresas");
      setEmpresas(await response.json());
    } catch (error) {
      setErrorEmpresas(error instanceof Error ? error.message : "Error desconocido");
      setEmpresas([]);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

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
        cargarTodo,
      }}
    >
      {children}
    </EntornoContext.Provider>
  );
}

export function useEntorno() {
  const context = useContext(EntornoContext);
  if (!context) {
    throw new Error("useEntorno debe usarse dentro de EntornoProvider");
  }
  return context;
}