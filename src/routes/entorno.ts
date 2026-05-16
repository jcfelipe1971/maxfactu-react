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
    
    console.log('📦 Resultado raw:', JSON.stringify(result, null, 2));
    console.log(`✅ Empresas encontradas: ${result.length}`);
    
    // Verificar el formato del primer registro
    if (result.length > 0) {
      console.log('📋 Primer registro:', result[0]);
      console.log('📋 Tipo:', Array.isArray(result[0]) ? 'ARRAY' : 'OBJECT');
    }
    
    let empresas;
    
    // Si es array (formato [EMPRESA, TITULO])
    if (result.length > 0 && Array.isArray(result[0])) {
      empresas = result.map((row: any[]) => ({
        value: row[0], // EMPRESA está en la posición 0
        label: row[1]  // TITULO está en la posición 1
      }));
    } 
    // Si es objeto (formato {EMPRESA: 1, TITULO: "..."})
    else {
      empresas = result.map((row: any) => ({
        value: row.empresa,
        label: row.titulo
      }));
    }
    
    console.log('✅ Empresas procesadas:', empresas);
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
    
    console.log('📦 Resultado raw:', JSON.stringify(result, null, 2));
    
    let ejercicios;
    
    if (result.length > 0 && Array.isArray(result[0])) {
      ejercicios = result.map((row: any[]) => {
        const apertura = row[1] ? new Date(row[1]).toLocaleDateString('es-ES') : '';
        const cierre = row[2] ? new Date(row[2]).toLocaleDateString('es-ES') : '';
        return {
          value: row[0],
          label: `${row[0]} (${apertura} - ${cierre})`
        };
      });
    } else {
      ejercicios = result.map((row: any) => {
        const apertura = row.apertura ? new Date(row.apertura).toLocaleDateString('es-ES') : '';
        const cierre = row.cierre ? new Date(row.cierre).toLocaleDateString('es-ES') : '';
        return {
          value: row.ejercicio,
          label: `${row.EJERCICIO} (${apertura} - ${cierre})`
        };
      });
    }
    
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
    
    console.log('📦 Resultado raw:', JSON.stringify(result, null, 2));
    
    let canales;
    
    if (result.length > 0 && Array.isArray(result[0])) {
      canales = result.map((row: any[]) => ({
        value: row[0],
        label: `Canal ${row[0]}`
      }));
    } else {
      canales = result.map((row: any) => ({
        value: row.canal,
        label: `Canal ${row.canal}`
      }));
    }
    
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
    
    console.log('📦 Resultado raw:', JSON.stringify(result, null, 2));
    
    let series;
    
    if (result.length > 0 && Array.isArray(result[0])) {
      series = result.map((row: any[]) => ({
        value: row[0],
        label: `${row[0]} - ${row[1]}`
      }));
    } else {
      series = result.map((row: any) => ({
        value: row.serie,
        label: `${row.serie} - ${row.titulo}`
      }));
    }
    
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