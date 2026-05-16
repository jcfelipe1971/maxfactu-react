import { Router } from "express";
import { executeQuery, executeUpdate } from "../lib/firebird";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// GET todas las familias
router.get("/", async (req, res) => {
  try {
    const rows = await executeQuery(
      `SELECT 
        FAMILIA as id,
        TITULO,
        TIPO_IVA,
        EMPRESA,
        EJERCICIO,
        CANAL,
        CTA_COMPRAS,
        CTA_VENTAS,
        PAIS,
        VENTA,
        PTO_VERDE,
        MARGEN,
        TIPO_REDONDEO,
        ACT_TAR_AUTOM,
        TITULO_WEB,
        WEB,
        ORDEN,
        TIPO_PRECIO_BASE,
        ULT_MODIFICACION
       FROM VER_FAMILIAS_CUENTAS
       ORDER BY ULT_MODIFICACION DESC`
    );

    const familias = rows.map((row: any) => ({
      id: row.FAMILIA,
      titulo: row.TITULO,
      tipoIva: row.TIPO_IVA,
      empresa: row.EMPRESA,
      ejercicio: row.EJERCICIO,
      canal: row.CANAL,
      ctaCompras: row.CTA_COMPRAS,
      ctaVentas: row.CTA_VENTAS,
      pais: row.PAIS,
      venta: row.VENTA,
      ptoVerde: row.PTO_VERDE,
      margen: row.MARGEN,
      tipoRedondeo: row.TIPO_REDONDEO,
      actTarAutom: row.ACT_TAR_AUTOM,
      tituloWeb: row.TITULO_WEB,
      web: row.WEB,
      orden: row.ORDEN,
      tipoPrecioBase: row.TIPO_PRECIO_BASE,
      ultModificacion: row.ULT_MODIFICACION,
    }));

    console.log(`✅ Se encontraron ${familias.length} familias`);
    res.json(familias);
  } catch (error) {
    console.error("❌ Error fetching familias:", error);
    res.status(500).json({ error: "Error al obtener familias" });
  }
});

// GET familia por ID
router.get("/:id", async (req, res) => {
  try {
    const rows = await executeQuery(
      `SELECT 
        FAMILIA as id,
        TITULO,
        TIPO_IVA,
        EMPRESA,
        EJERCICIO,
        CANAL,
        CTA_COMPRAS,
        CTA_VENTAS,
        PAIS,
        VENTA,
        PTO_VERDE,
        MARGEN,
        TIPO_REDONDEO,
        ACT_TAR_AUTOM,
        TITULO_WEB,
        WEB,
        ORDEN,
        TIPO_PRECIO_BASE,
        ULT_MODIFICACION
       FROM VER_FAMILIAS_CUENTAS
       WHERE FAMILIA = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Familia no encontrada" });
    }

    const row = rows[0];
    const familia = {
      id: row.FAMILIA,
      titulo: row.TITULO,
      tipoIva: row.TIPO_IVA,
      empresa: row.EMPRESA,
      ejercicio: row.EJERCICIO,
      canal: row.CANAL,
      ctaCompras: row.CTA_COMPRAS,
      ctaVentas: row.CTA_VENTAS,
      pais: row.PAIS,
      venta: row.VENTA,
      ptoVerde: row.PTO_VERDE,
      margen: row.MARGEN,
      tipoRedondeo: row.TIPO_REDONDEO,
      actTarAutom: row.ACT_TAR_AUTOM,
      tituloWeb: row.TITULO_WEB,
      web: row.WEB,
      orden: row.ORDEN,
      tipoPrecioBase: row.TIPO_PRECIO_BASE,
      ultModificacion: row.ULT_MODIFICACION,
    };

    res.json(familia);
  } catch (error) {
    console.error("❌ Error fetching familia:", error);
    res.status(500).json({ error: "Error al obtener familia" });
  }
});

// POST crear nueva familia
router.post("/", async (req, res) => {
  try {
    const {
      empresa,
      ejercicio,
      canal,
      familia,
      titulo,
      tipoIva,
      ctaCompras,
      ctaVentas,
      pais,
      venta,
      ptoVerde,
      margen,
      tipoRedondeo,
      actTarAutom,
      tituloWeb,
      web,
      orden,
      tipoPrecioBase,
    } = req.body;

    // Validación básica
    if (!familia || !titulo) {
      return res
        .status(400)
        .json({ error: "Familia y título son requeridos" });
    }

    // INSERT en VER_FAMILIAS_CUENTAS (inserta en las tablas subyacentes automáticamente)
    await executeUpdate(
      `INSERT INTO VER_FAMILIAS_CUENTAS (
        EMPRESA, EJERCICIO, CANAL, FAMILIA, TITULO, TIPO_IVA,
        CTA_COMPRAS, CTA_VENTAS, PAIS, VENTA, PTO_VERDE,
        MARGEN, TIPO_REDONDEO, ACT_TAR_AUTOM, TITULO_WEB, WEB,
        ORDEN, TIPO_PRECIO_BASE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empresa || 1,
        ejercicio || 2026,
        canal || "NORMAL",
        familia.toUpperCase(),
        titulo,
        tipoIva || 1,
        ctaCompras || "0",
        ctaVentas || "0",
        pais || "ES",
        venta || 1,
        ptoVerde || 0,
        margen || 0,
        tipoRedondeo || 0,
        actTarAutom || 0,
        tituloWeb || titulo,
        web || 0,
        orden || 0,
        tipoPrecioBase || 0,
      ]
    );

    const nuevaFamilia = {
      id: familia.toUpperCase(),
      titulo,
      tipoIva,
      empresa,
      ejercicio,
      canal,
      ctaCompras,
      ctaVentas,
      pais,
      venta,
      ptoVerde,
      margen,
      tipoRedondeo,
      actTarAutom,
      tituloWeb,
      web,
      orden,
      tipoPrecioBase,
    };

    res.status(201).json(nuevaFamilia);
  } catch (error: any) {
    console.error("❌ Error creating familia:", error);
    if (error.message?.includes("UNIQUE")) {
      return res
        .status(400)
        .json({ error: "La familia ya existe" });
    }
    res.status(500).json({ error: "Error al crear familia" });
  }
});

// PUT actualizar familia
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      tipoIva,
      ctaCompras,
      ctaVentas,
      pais,
      venta,
      ptoVerde,
      margen,
      tipoRedondeo,
      actTarAutom,
      tituloWeb,
      web,
      orden,
      tipoPrecioBase,
    } = req.body;

    // Construir UPDATE dinámico
    const updates = [];
    const params: any[] = [];

    if (titulo) {
      updates.push("TITULO = ?");
      params.push(titulo);
    }
    if (tipoIva !== undefined) {
      updates.push("TIPO_IVA = ?");
      params.push(tipoIva);
    }
    if (ctaCompras !== undefined) {
      updates.push("CTA_COMPRAS = ?");
      params.push(ctaCompras);
    }
    if (ctaVentas !== undefined) {
      updates.push("CTA_VENTAS = ?");
      params.push(ctaVentas);
    }
    if (pais !== undefined) {
      updates.push("PAIS = ?");
      params.push(pais);
    }
    if (venta !== undefined) {
      updates.push("VENTA = ?");
      params.push(venta);
    }
    if (ptoVerde !== undefined) {
      updates.push("PTO_VERDE = ?");
      params.push(ptoVerde);
    }
    if (margen !== undefined) {
      updates.push("MARGEN = ?");
      params.push(margen);
    }
    if (tipoRedondeo !== undefined) {
      updates.push("TIPO_REDONDEO = ?");
      params.push(tipoRedondeo);
    }
    if (actTarAutom !== undefined) {
      updates.push("ACT_TAR_AUTOM = ?");
      params.push(actTarAutom);
    }
    if (tituloWeb !== undefined) {
      updates.push("TITULO_WEB = ?");
      params.push(tituloWeb);
    }
    if (web !== undefined) {
      updates.push("WEB = ?");
      params.push(web);
    }
    if (orden !== undefined) {
      updates.push("ORDEN = ?");
      params.push(orden);
    }
    if (tipoPrecioBase !== undefined) {
      updates.push("TIPO_PRECIO_BASE = ?");
      params.push(tipoPrecioBase);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ error: "No hay datos para actualizar" });
    }

    params.push(id);

    await executeUpdate(
      `UPDATE VER_FAMILIAS_CUENTAS SET ${updates.join(", ")} WHERE FAMILIA = ?`,
      params
    );

    // Retornar familia actualizada
    const rows = await executeQuery(
      `SELECT 
        FAMILIA as id,
        TITULO,
        TIPO_IVA,
        EMPRESA,
        EJERCICIO,
        CANAL,
        CTA_COMPRAS,
        CTA_VENTAS,
        PAIS,
        VENTA,
        PTO_VERDE,
        MARGEN,
        TIPO_REDONDEO,
        ACT_TAR_AUTOM,
        TITULO_WEB,
        WEB,
        ORDEN,
        TIPO_PRECIO_BASE,
        ULT_MODIFICACION
       FROM VER_FAMILIAS_CUENTAS
       WHERE FAMILIA = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Familia no encontrada" });
    }

    const row = rows[0];
    const familia = {
      id: row.FAMILIA,
      titulo: row.TITULO,
      tipoIva: row.TIPO_IVA,
      empresa: row.EMPRESA,
      ejercicio: row.EJERCICIO,
      canal: row.CANAL,
      ctaCompras: row.CTA_COMPRAS,
      ctaVentas: row.CTA_VENTAS,
      pais: row.PAIS,
      venta: row.VENTA,
      ptoVerde: row.PTO_VERDE,
      margen: row.MARGEN,
      tipoRedondeo: row.TIPO_REDONDEO,
      actTarAutom: row.ACT_TAR_AUTOM,
      tituloWeb: row.TITULO_WEB,
      web: row.WEB,
      orden: row.ORDEN,
      tipoPrecioBase: row.TIPO_PRECIO_BASE,
      ultModificacion: row.ULT_MODIFICACION,
    };

    res.json(familia);
  } catch (error) {
    console.error("❌ Error updating familia:", error);
    res.status(500).json({ error: "Error al actualizar familia" });
  }
});

// DELETE familia
router.delete("/:id", async (req, res) => {
  try {
    await executeUpdate("DELETE FROM VER_FAMILIAS_CUENTAS WHERE FAMILIA = ?", [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error deleting familia:", error);
    res.status(500).json({ error: "Error al eliminar familia" });
  }
});

export default router;
