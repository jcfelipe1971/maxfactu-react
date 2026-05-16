import { Router } from "express";
import { executeQuery } from "../lib/firebird";

const router = Router();

// GET tipos de IVA
router.get("/", async (req, res) => {
  try {
    const rows = await executeQuery(
      "SELECT MODO as id, TITULO FROM SYS_MODO_IVA ORDER BY MODO"
    );

    const tiposIva = rows.map((row: any) => ({
      id: row.MODO,
      titulo: row.TITULO,
    }));

    console.log(`✅ Se encontraron ${tiposIva.length} tipos de IVA`);
    res.json(tiposIva);
  } catch (error) {
    console.error("❌ Error fetching tipos iva:", error);
    
    // Fallback a datos por defecto si hay error
    const tiposIvaDefault = [
      { id: 0, titulo: "Exento" },
      { id: 1, titulo: "Normal" },
      { id: 2, titulo: "Reducido" },
      { id: 3, titulo: "Super-Reducido" },
      { id: 4, titulo: "Agr., Gan. y P." },
      { id: 5, titulo: "Aduana" },
      { id: 6, titulo: "NO DEDUCIBLE" },
      { id: 7, titulo: "LEASING" },
    ];
    
    res.json(tiposIvaDefault);
  }
});

export default router;
