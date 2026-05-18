// src/lib/firebird.ts
import firebird from 'node-firebird';

// 🔧 Configuración de conexión
const options: firebird.Options = {
  host: process.env.FIREBIRD_HOST || 'localhost',
  port: parseInt(process.env.FIREBIRD_PORT || '3050'),
  database: process.env.FIREBIRD_DATABASE || "D:\\DELFOS\\Virtual\\datos\\LONPER.FDB", 
  user: process.env.FIREBIRD_USER || 'SYSDBA',
  password: process.env.FIREBIRD_PASSWORD || 'masterkey', 
  lowercase_keys: true,
};

let dbConnection: firebird.Database | null = null;

/**
 * Obtiene una instancia de conexión con métodos promesificados
 */
export async function getDB(): Promise<{
  query: (sql: string, params?: any[]) => Promise<any[]>;
  close: () => void;
}> {
  return new Promise((resolve, reject) => {
    if (dbConnection) {
      resolve(createDBInterface(dbConnection));
      return;
    }

    firebird.attach(options, (err: any, db: firebird.Database) => {
      if (err) {
        console.error('❌ Error conectando a Firebird:', err.message);
        reject(new Error(`Firebird connection failed: ${err.message}`));
        return;
      }
      dbConnection = db;
      console.log('✅ Conectado a Firebird');
      resolve(createDBInterface(db));
    });
  });
}

function createDBInterface(db: firebird.Database) {
  return {
    query: async (sql: string, params: any[] = []): Promise<any[]> => {
      return new Promise((res, rej) => {
        db.query(sql, params, (err: any, result: any[]) => {
          if (err) rej(err);
          else res(result || []);
        });
      });
    },
    close: () => {
      if (dbConnection) {
        dbConnection.detach();
        dbConnection = null;
        console.log(' Conexión Firebird cerrada');
      }
    }
  };
}

// 🔹 EXPORTS COMPATIBLES CON TUS RUTAS
/**
 * Ejecuta una consulta SELECT y devuelve los registros
 */
export async function executeQuery(sql: string, params: any[] = []): Promise<any[]> {
  const db = await getDB();
  return db.query(sql, params);
}

/**
 * Ejecuta consultas INSERT/UPDATE/DELETE
 * (En node-firebird, db.query maneja también actualizaciones si la conexión tiene auto-commit)
 */
export async function executeUpdate(sql: string, params: any[] = []): Promise<any[]> {
  const db = await getDB();
  return db.query(sql, params);
}

/**
 * Cierra la conexión manualmente (útil para shutdown)
 */
export function closeDB(): void {
  if (dbConnection) {
    dbConnection.detach();
    dbConnection = null;
  }
}