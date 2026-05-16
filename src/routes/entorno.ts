// src/routes/entorno.ts
import { Router, Request, Response } from 'express';
import { executeQuery } from '../lib/firebird';

const router = Router();

// 🔹 GET /api/entorno/empresas
router.get('/empresas', async (req: Request, res: Response) => {
  try {
    console.log('📡 Request: GET /api/entorno/empresas');
    
    const result = await executeQuery(
      `SELECT EMPRESA, TITULO 
       FROM SYS_EMPRESAS 
       WHERE ABIERTA = 1 
       ORDER BY TITULO`
    );
    
    console.log(`✅ Empresas encontradas: ${result.length}`);
    
    const empresas = result.map((row: any) => ({
      value: row.EMPRESA,
      label: row.TITULO
    }));
    
    res.json(empresas);
  } catch (error) {
    console.error('❌ Error en /api/entorno/empresas:', error);
    res.status(500).json({ 
      error: 'Error al cargar empresas', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 🔹 GET /api/entorno/ejercicios?empresa=1
router.get('/ejercicios', async (req: Request, res: Response) => {
  try {
    const { empresa } = req.query;
    console.log(`📡 Request: GET /api/entorno/ejercicios?empresa=${empresa}`);
    
    if (!empresa) {
      return res.status(400).json({ error: 'Parámetro requerido: empresa' });
    }
    
    const result = await executeQuery(
      `SELECT EJERCICIO, APERTURA, CIERRE 
       FROM EMP_EJERCICIOS 
       WHERE EMPRESA = ? AND ACTIVO = 1 
       ORDER BY EJERCICIO DESC`,
      [empresa]
    );
    
    console.log(`✅ Ejercicios encontrados: ${result.length}`);
    
    const ejercicios = result.map((row: any) => {
      const apertura = row.APERTURA ? new Date(row.APERTURA).toLocaleDateString('es-ES') : '';
      const cierre = row.CIERRE ? new Date(row.CIERRE).toLocaleDateString('es-ES') : '';
      return {
        value: row.EJERCICIO,
        label: `${row.EJERCICIO} (${apertura} - ${cierre})`
      };
    });
    
    res.json(ejercicios);
  } catch (error) {
    console.error('❌ Error en /api/entorno/ejercicios:', error);
    res.status(500).json({ 
      error: 'Error al cargar ejercicios',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 🔹 GET /api/entorno/canales?empresa=1&ejercicio=2024
router.get('/canales', async (req: Request, res: Response) => {
  try {
    const { empresa, ejercicio } = req.query;
    console.log(`📡 Request: GET /api/entorno/canales?empresa=${empresa}&ejercicio=${ejercicio}`);
    
    if (!empresa || !ejercicio) {
      return res.status(400).json({ error: 'Parámetros requeridos: empresa, ejercicio' });
    }
    
    const result = await executeQuery(
      `SELECT CANAL 
       FROM EMP_CANALES 
       WHERE EMPRESA = ? AND EJERCICIO = ? AND ACTIVO = 1 
       ORDER BY CANAL`,
      [empresa, ejercicio]
    );
    
    console.log(`✅ Canales encontrados: ${result.length}`);
    
    const canales = result.map((row: any) => ({
      value: row.CANAL,
      label: `Canal ${row.CANAL}`
    }));
    
    res.json(canales);
  } catch (error) {
    console.error('❌ Error en /api/entorno/canales:', error);
    res.status(500).json({ 
      error: 'Error al cargar canales',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 🔹 GET /api/entorno/series?empresa=1&ejercicio=2024&canal=1
router.get('/series', async (req: Request, res: Response) => {
  try {
    const { empresa, ejercicio, canal } = req.query;
    console.log(`📡 Request: GET /api/entorno/series?empresa=${empresa}&ejercicio=${ejercicio}&canal=${canal}`);
    
    if (!empresa || !ejercicio || !canal) {
      return res.status(400).json({ error: 'Parámetros requeridos: empresa, ejercicio, canal' });
    }
    
    const result = await executeQuery(
      `SELECT SERIE, TITULO 
       FROM VER_CANALES_SERIES 
       WHERE EMPRESA = ? AND EJERCICIO = ? AND CANAL = ? 
       ORDER BY SERIE`,
      [empresa, ejercicio, canal]
    );
    
    console.log(`✅ Series encontradas: ${result.length}`);
    
    const series = result.map((row: any) => ({
      value: row.SERIE,
      label: `${row.SERIE} - ${row.TITULO}`
    }));
    
    res.json(series);
  } catch (error) {
    console.error('❌ Error en /api/entorno/series:', error);
    res.status(500).json({ 
      error: 'Error al cargar series',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;