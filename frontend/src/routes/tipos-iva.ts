import { Router } from "express";

import { executeQuery } from "../lib/firebird";

type RawRow = Record<string, unknown> | unknown[];

const field = <TValue,>(row: RawRow, index: number, key: string): TValue => {
  if (Array.isArray(row)) {
    return row[index] as TValue;
  }
  return row[key.toLowerCase()] as TValue;
};

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await executeQuery("SELECT MODO as id, TITULO FROM SYS_MODO_IVA ORDER BY MODO");

    const tiposIva = (rows as RawRow[]).map((row) => ({
      id: Number(field(row, 0, "id")),
      titulo: String(field(row, 1, "titulo") ?? ""),
    }));

    console.log(`Se encontraron ${tiposIva.length} tipos de IVA`);
    res.json(tiposIva);
  } catch (error) {
    console.error("Error fetching tipos iva:", error);

    res.json([
      { id: 0, titulo: "Exento" },
      { id: 1, titulo: "Normal" },
      { id: 2, titulo: "Reducido" },
      { id: 3, titulo: "Super-Reducido" },
      { id: 4, titulo: "Agr., Gan. y P." },
      { id: 5, titulo: "Aduana" },
      { id: 6, titulo: "NO DEDUCIBLE" },
      { id: 7, titulo: "LEASING" },
    ]);
  }
});

export default router;
