// src/routes/entorno.ts
import { Router } from 'express';
import { getDB } from '../lib/firebird';

const router = Router();

// 🔹 Obtener empresas (ABIERTA = 1)
router.get('/empresas', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.query(`
      SELECT EMPRESA, TITULO 
      FROM SYS_EMPRESAS 
      WHERE ABIERTA = 1
      ORDER BY TITULO
    `);
    res.json(result.map((r: any) => ({
      value: r.EMPRESA,
      label: r.TITULO
    })));
  } catch (error) {
    console.error('Error cargando empresas:', error);
    res.status(500).json({ error: 'Error al cargar empresas' });
  }
});

// 🔹 Obtener ejercicios de una empresa
router.get('/ejercicios', async (req, res) => {
  try {
    const { empresa } = req.query;
    if (!empresa) return res.status(400).json({ error: 'Falta parámetro: empresa' });
    
    const db = getDB();
    const result = await db.query(`
      SELECT EJERCICIO, APERTURA, CIERRE 
      FROM EMP_EJERCICIOS 
      WHERE EMPRESA = ? AND ACTIVO = 1
      ORDER BY EJERCICIO DESC
    `, [empresa]);
    
    res.json(result.map((r: any) => ({
      value: r.EJERCICIO,
      label: `${r.EJERCICIO} (${new Date(r.APERTURA).toLocaleDateString('es-ES')} - ${new Date(r.CIERRE).toLocaleDateString('es-ES')})`
    })));
  } catch (error) {
    console.error('Error cargando ejercicios:', error);
    res.status(500).json({ error: 'Error al cargar ejercicios' });
  }
});

// 🔹 Obtener canales de empresa/ejercicio
router.get('/canales', async (req, res) => {
  try {
    const { empresa, ejercicio } = req.query;
    if (!empresa || !ejercicio) return res.status(400).json({ error: 'Faltan parámetros: empresa, ejercicio' });
    
    const db = getDB();
    const result = await db.query(`
      SELECT CANAL 
      FROM EMP_CANALES 
      WHERE EMPRESA = ? AND EJERCICIO = ? AND ACTIVO = 1
      ORDER BY CANAL
    `, [empresa, ejercicio]);
    
    res.json(result.map((r: any) => ({
      value: r.CANAL,
      label: `Canal ${r.CANAL}`
    })));
  } catch (error) {
    console.error('Error cargando canales:', error);
    res.status(500).json({ error: 'Error al cargar canales' });
  }
});

// 🔹 Obtener series de empresa/ejercicio/canal (usa la vista VER_CANALES_SERIES)
router.get('/series', async (req, res) => {
  try {
    const { empresa, ejercicio, canal } = req.query;
    if (!empresa || !ejercicio || !canal) return res.status(400).json({ error: 'Faltan parámetros: empresa, ejercicio, canal' });
    
    const db = getDB();
    const result = await db.query(`
      SELECT SERIE, TITULO 
      FROM VER_CANALES_SERIES 
      WHERE EMPRESA = ? AND EJERCICIO = ? AND CANAL = ?
      ORDER BY SERIE
    `, [empresa, ejercicio, canal]);
    
    res.json(result.map((r: any) => ({
      value: r.SERIE,
      label: `${r.SERIE} - ${r.TITULO}`
    })));
  } catch (error) {
    console.error('Error cargando series:', error);
    res.status(500).json({ error: 'Error al cargar series' });
  }
});

export default router;