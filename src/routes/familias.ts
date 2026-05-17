// src/routes/familias.ts
import { Router } from "express";
import { executeQuery, executeUpdate } from "../lib/firebird";

const router = Router();

// 🔹 POST /api/familias - Obtener familias filtradas por entorno (compatible con Delphi)
router.post('/', async (req, res) => {
  try {
    let { empresa, ejercicio, canal } = req.body;

    console.log('📡 [FAMILIAS] Payload recibido:', { empresa, ejercicio, canal });

    empresa = Number(empresa) || 1;
    ejercicio = Number(ejercicio) || 2026;
    canal = String(canal || '').trim();

    console.log(`🔧 Consultando -> Empresa: ${empresa}, Ejercicio: ${ejercicio}, Canal: "${canal}"`);

    // Consulta optimizada y compatible con la vista que usa Delphi
    const result = await executeQuery(`
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
    `, [empresa, ejercicio, canal]);

    let familias: any[] = [];

    if (result?.length > 0) {
      if (Array.isArray(result[0])) {
        // Firebird devuelve array de arrays
        familias = result.map((row: any[]) => ({
          familia: row[0],
          titulo: row[1],
          tipo_iva: row[2],
          permite_negativo: Number(row[3]) ?? 0
        }));
      } else {
        // Firebird devuelve objetos
        familias = result.map((row: any) => ({
          familia: row.FAMILIA,
          titulo: row.TITULO,
          tipo_iva: row.TIPO_IVA,
          permite_negativo: Number(row.PERMITE_NEGATIVO ?? row.VENTA) ?? 0
        }));
      }
    }

    console.log(`✅ ${familias.length} familias cargadas correctamente`);
    res.json(familias);

  } catch (error: any) {
    console.error("❌ ERROR en /api/familias:", error.message);
    res.status(500).json({ 
      error: 'Error interno al cargar familias desde Firebird',
      detalle: error.message 
    });
  }
});

// 🔹 GET todas las familias (para usos generales)
router.get("/", async (req, res) => {
  try {
    const rows = await executeQuery(`
      SELECT * FROM VER_FAMILIAS_CUENTAS 
      ORDER BY ULT_MODIFICACION DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching familias:", error);
    res.status(500).json({ error: "Error al obtener familias" });
  }
});

// 🔹 GET familia por ID
router.get("/:id", async (req, res) => {
  try {
    const rows = await executeQuery(
      `SELECT * FROM VER_FAMILIAS_CUENTAS WHERE FAMILIA = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Familia no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching familia:", error);
    res.status(500).json({ error: "Error al obtener familia" });
  }
});

// 🔹 PUT actualizar familia
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tipoIva, venta, ...resto } = req.body; // venta = permite_negativo

    const updates: string[] = [];
    const params: any[] = [];

    if (titulo !== undefined) { updates.push("TITULO = ?"); params.push(titulo); }
    if (tipoIva !== undefined) { updates.push("TIPO_IVA = ?"); params.push(tipoIva); }
    if (venta !== undefined) { updates.push("VENTA = ?"); params.push(venta); }

    // Agrega aquí otros campos según necesites...

    if (updates.length === 0) {
      return res.status(400).json({ error: "No hay datos para actualizar" });
    }

    params.push(id);
    await executeUpdate(`UPDATE VER_FAMILIAS_CUENTAS SET ${updates.join(", ")} WHERE FAMILIA = ?`, params);

    res.json({ id, message: "Actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error updating familia:", error);
    res.status(500).json({ error: "Error al actualizar familia" });
  }
});

// 🔹 DELETE familia
router.delete("/:id", async (req, res) => {
  try {
    await executeUpdate("DELETE FROM VER_FAMILIAS_CUENTAS WHERE FAMILIA = ?", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error deleting familia:", error);
    res.status(500).json({ error: "Error al eliminar familia" });
  }
});

export default router;