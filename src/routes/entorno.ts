import { Router, type Response } from "express";

import { executeQuery } from "../lib/firebird";

type RawRow = Record<string, unknown> | unknown[];

const router = Router();

const field = <TValue,>(row: RawRow, index: number, key: string): TValue => {
  if (Array.isArray(row)) {
    return row[index] as TValue;
  }
  return row[key.toLowerCase()] as TValue;
};

const sendError = (res: Response, message: string, error: unknown) => {
  console.error(message, error);
  res.status(500).json({
    error: message,
    details: error instanceof Error ? error.message : String(error),
  });
};

router.get("/empresas", async (_req, res) => {
  try {
    const result = await executeQuery(`
      SELECT EMPRESA, TITULO
      FROM SYS_EMPRESAS
      WHERE ABIERTA = 1
      ORDER BY TITULO
    `);

    const empresas = (result as RawRow[]).map((row) => ({
      value: Number(field(row, 0, "empresa")),
      label: String(field(row, 1, "titulo") ?? ""),
    }));

    res.json(empresas);
  } catch (error) {
    sendError(res, "Error al cargar empresas", error);
  }
});

router.get("/ejercicios", async (req, res) => {
  try {
    const { empresa } = req.query;

    if (!empresa) {
      return res.status(400).json({ error: "Parámetro requerido: empresa" });
    }

    const result = await executeQuery(
      `
      SELECT EJERCICIO, APERTURA, CIERRE
      FROM EMP_EJERCICIOS
      WHERE EMPRESA = ? AND ACTIVO = 1
      ORDER BY EJERCICIO DESC
    `,
      [empresa],
    );

    const ejercicios = (result as RawRow[]).map((row) => {
      const ejercicio = Number(field(row, 0, "ejercicio"));
      const aperturaRaw = field<string | Date | null>(row, 1, "apertura");
      const cierreRaw = field<string | Date | null>(row, 2, "cierre");
      const apertura = aperturaRaw ? new Date(aperturaRaw).toLocaleDateString("es-ES") : "";
      const cierre = cierreRaw ? new Date(cierreRaw).toLocaleDateString("es-ES") : "";

      return {
        value: ejercicio,
        label: `${ejercicio} (${apertura} - ${cierre})`,
      };
    });

    res.json(ejercicios);
  } catch (error) {
    sendError(res, "Error al cargar ejercicios", error);
  }
});

router.get("/canales", async (req, res) => {
  try {
    const { empresa, ejercicio } = req.query;

    if (!empresa || !ejercicio) {
      return res.status(400).json({ error: "Parámetros requeridos: empresa, ejercicio" });
    }

    const result = await executeQuery(
      `
      SELECT CANAL
      FROM EMP_CANALES
      WHERE EMPRESA = ? AND EJERCICIO = ? AND ACTIVO = 1
      ORDER BY CANAL
    `,
      [empresa, ejercicio],
    );

    const canales = (result as RawRow[]).map((row) => {
      const canal = Number(field(row, 0, "canal"));
      return {
        value: canal,
        label: `Canal ${canal}`,
      };
    });

    res.json(canales);
  } catch (error) {
    sendError(res, "Error al cargar canales", error);
  }
});

router.get("/series", async (req, res) => {
  try {
    const { empresa, ejercicio, canal } = req.query;

    if (!empresa || !ejercicio || canal === undefined) {
      return res.status(400).json({ error: "Parámetros requeridos: empresa, ejercicio, canal" });
    }

    const result = await executeQuery(
      `
      SELECT SERIE, TITULO
      FROM VER_CANALES_SERIES
      WHERE EMPRESA = ? AND EJERCICIO = ? AND CANAL = ?
      ORDER BY SERIE
    `,
      [empresa, ejercicio, canal],
    );

    const series = (result as RawRow[]).map((row) => {
      const serie = String(field(row, 0, "serie") ?? "");
      const titulo = String(field(row, 1, "titulo") ?? "");
      return {
        value: serie,
        label: `${serie} - ${titulo}`,
      };
    });

    res.json(series);
  } catch (error) {
    sendError(res, "Error al cargar series", error);
  }
});

export default router;
