import { Router } from "express";

import { executeQuery, executeUpdate } from "../lib/firebird";

type RawRow = Record<string, unknown> | unknown[];

const router = Router();

const field = <TValue,>(row: RawRow, index: number, key: string): TValue => {
  if (Array.isArray(row)) {
    return row[index] as TValue;
  }
  return row[key.toLowerCase()] as TValue;
};

router.post("/", async (req, res) => {
  try {
    const empresa = Number(req.body.empresa) || 1;
    const ejercicio = Number(req.body.ejercicio) || 2026;
    const canal = req.body.canal === undefined || req.body.canal === null ? 0 : Number(req.body.canal);

    const result = await executeQuery(
      `
      SELECT
        F.FAMILIA,
        F.TITULO,
        F.TIPO_IVA,
        F.VENTA as PERMITE_NEGATIVO
      FROM VER_FAMILIAS_CUENTAS F
      WHERE F.EMPRESA = ?
        AND F.EJERCICIO = ?
        AND F.CANAL = ?
      ORDER BY F.FAMILIA
    `,
      [empresa, ejercicio, canal],
    );

    const familias = (result as RawRow[]).map((row) => ({
      familia: String(field(row, 0, "familia") ?? ""),
      titulo: String(field(row, 1, "titulo") ?? ""),
      tipo_iva: field<number | string | null>(row, 2, "tipo_iva") ?? null,
      permite_negativo: Number(field(row, 3, "permite_negativo") ?? 0),
    }));

    console.log(`${familias.length} familias cargadas correctamente`);
    res.json(familias);
  } catch (error) {
    console.error("ERROR en /api/familias:", error);
    res.status(500).json({
      error: "Error interno al cargar familias desde Firebird",
      detalle: error instanceof Error ? error.message : String(error),
    });
  }
});

router.get("/", async (_req, res) => {
  try {
    const rows = await executeQuery(`
      SELECT *
      FROM VER_FAMILIAS_CUENTAS
      ORDER BY ULT_MODIFICACION DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching familias:", error);
    res.status(500).json({ error: "Error al obtener familias" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await executeQuery("SELECT * FROM VER_FAMILIAS_CUENTAS WHERE FAMILIA = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Familia no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching familia:", error);
    res.status(500).json({ error: "Error al obtener familia" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tipoIva, venta } = req.body;

    const updates: string[] = [];
    const params: unknown[] = [];

    if (titulo !== undefined) {
      updates.push("TITULO = ?");
      params.push(titulo);
    }
    if (tipoIva !== undefined) {
      updates.push("TIPO_IVA = ?");
      params.push(tipoIva);
    }
    if (venta !== undefined) {
      updates.push("VENTA = ?");
      params.push(venta);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No hay datos para actualizar" });
    }

    params.push(id);
    await executeUpdate(`UPDATE VER_FAMILIAS_CUENTAS SET ${updates.join(", ")} WHERE FAMILIA = ?`, params);

    res.json({ id, message: "Actualizado correctamente" });
  } catch (error) {
    console.error("Error updating familia:", error);
    res.status(500).json({ error: "Error al actualizar familia" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await executeUpdate("DELETE FROM VER_FAMILIAS_CUENTAS WHERE FAMILIA = ?", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting familia:", error);
    res.status(500).json({ error: "Error al eliminar familia" });
  }
});

export default router;
