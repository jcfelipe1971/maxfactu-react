// src/routes/entorno.ts
import { Router } from 'express';
import { getDB } from '../lib/firebird';

const router = Router();

// Obtener empresas
router.get('/empresas', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.query(`
      SELECT EMPRESA, TITULO 
      FROM SYS_EMPRESAS 
      WHERE ABIERTA = 1
      ORDER BY EMPRESA
    `);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar empresas' });
  }
});

// Obtener ejercicios
router.get('/ejercicios', async (req, res) => {
  try {
    const { empresa } = req.query;
    const db = getDB();
    const result = await db.query(`
      SELECT EJERCICIO, APERTURA, CIERRE 
      FROM EMP_EJERCICIOS 
      WHERE EMPRESA = ?
      ORDER BY EJERCICIO DESC
    `, [empresa]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar ejercicios' });
  }
});

// Obtener canales
router.get('/canales', async (req, res) => {
  try {
    const { empresa, ejercicio } = req.query;
    const db = getDB();
    const result = await db.query(`
      SELECT CANAL 
      FROM EMP_CANALES 
      WHERE EMPRESA = ? AND EJERCICIO = ? AND ACTIVO = 1
      ORDER BY CANAL
    `, [empresa, ejercicio]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar canales' });
  }
});

// Obtener series
router.get('/series', async (req, res) => {
  try {
    const { empresa, ejercicio, canal } = req.query;
    const db = getDB();
    const result = await db.query(`
      SELECT SERIE, TITULO 
      FROM VER_CANALES_SERIES 
      WHERE EMPRESA = ? AND EJERCICIO = ? AND CANAL = ?
      ORDER BY SERIE
    `, [empresa, ejercicio, canal]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar series' });
  }
});

export default router;