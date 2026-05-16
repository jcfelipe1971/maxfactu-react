// src/lib/firebird.ts
import firebird from 'node-firebird';

// 🔧 Configuración de conexión (puedes mover esto a variables de entorno)
const options: firebird.Options = {
  host: process.env.FIREBIRD_HOST || 'localhost',
  port: parseInt(process.env.FIREBIRD_PORT || '3050'),
  database: process.env.FIREBIRD_DATABASE || 'C:/path/to/tu/base.fdb', // ← CAMBIA ESTO
  user: process.env.FIREBIRD_USER || 'SYSDBA',
  password: process.env.FIREBIRD_PASSWORD || 'masterkey', // ← CAMBIA ESTO
  lowercase_keys: true,
  role: process.env.FIREBIRD_ROLE,
  pageSize: 4096,
  // Para Firebird 4+ con autenticación SRP:
  // authPlugin: 'Srp',
};

// 🔁 Cache de conexión para reutilizar
let dbConnection: firebird.Database | null = null;

/**
 * Obtiene una instancia de conexión a Firebird con métodos promesificados
 */
export async function getDB(): Promise<{
  query: (sql: string, params?: any[]) => Promise<any[]>;
  close: () => void;
  transaction: () => Promise<firebird.Transaction>;
}> {
  return new Promise((resolve, reject) => {
    // Si ya hay conexión, la reutilizamos
    if (dbConnection) {
      resolve(createDBInterface(dbConnection));
      return;
    }

    // Creamos nueva conexión
    firebird.attach(options, (err: any, db: firebird.Database) => {
      if (err) {
        console.error('❌ Error conectando a Firebird:', err);
        reject(new Error(`Firebird connection failed: ${err.message || err}`));
        return;
      }

      dbConnection = db;
      console.log('✅ Conectado a Firebird');
      resolve(createDBInterface(db));
    });
  });
}

/**
 * Crea una interfaz promesificada para la conexión
 */
function createDBInterface(db: firebird.Database) {
  return {
    /**
     * Ejecuta una query y devuelve los resultados como array de objetos
     */
    query: async (sql: string, params: any[] = []): Promise<any[]> => {
      return new Promise((res, rej) => {
        db.query(sql, params, (err: any, result: any[]) => {
          if (err) {
            console.error('❌ Error en query:', sql, params, err);
            rej(err);
          } else {
            res(result || []);
          }
        });
      });
    },

    /**
     * Cierra la conexión (útil para shutdown del servidor)
     */
    close: () => {
      if (dbConnection) {
        dbConnection.detach();
        dbConnection = null;
        console.log('🔌 Conexión Firebird cerrada');
      }
    },

    /**
     * Obtiene una transacción para operaciones atómicas
     */
    transaction: async (): Promise<firebird.Transaction> => {
      return new Promise((res, rej) => {
        db.transaction(firebird.ISOLATION_READ_COMMITTED, (err: any, trx: firebird.Transaction) => {
          if (err) rej(err);
          else res(trx);
        });
      });
    }
  };
}

/**
 * Función útil para queries rápidas sin mantener estado
 */
export async function runQuery(sql: string, params: any[] = []): Promise<any[]> {
  const db = await getDB();
  return db.query(sql, params);
}

/**
 * Cierra explícitamente la conexión (para shutdown del servidor)
 */
export function closeDB(): void {
  if (dbConnection) {
    dbConnection.detach();
    dbConnection = null;
  }
}