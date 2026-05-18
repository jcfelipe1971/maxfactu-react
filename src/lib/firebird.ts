import firebird, { type Database, type Options } from "node-firebird";

const firebirdPort = Number(process.env.FIREBIRD_PORT || 3050);

const options: Options = {
  host: process.env.FIREBIRD_HOST || "localhost",
  port: Number.isNaN(firebirdPort) ? 3050 : firebirdPort,
  database: process.env.FIREBIRD_DATABASE || "",
  user: process.env.FIREBIRD_USER || "SYSDBA",
  password: process.env.FIREBIRD_PASSWORD || "",
  lowercase_keys: true,
};

let dbConnection: Database | null = null;

function ensureConfigured() {
  if (!options.database) {
    throw new Error("FIREBIRD_DATABASE no está configurado");
  }
  if (!options.password) {
    throw new Error("FIREBIRD_PASSWORD no está configurado");
  }
}

export async function getDB(): Promise<{
  query: (sql: string, params?: unknown[]) => Promise<unknown[]>;
  close: () => void;
}> {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    if (dbConnection) {
      resolve(createDBInterface(dbConnection));
      return;
    }

    firebird.attach(options, (err: Error | null, db?: Database) => {
      if (err || !db) {
        const message = err instanceof Error ? err.message : "No se recibió conexión";
        console.error("Error conectando a Firebird:", message);
        reject(new Error(`Firebird connection failed: ${message}`));
        return;
      }

      dbConnection = db;
      console.log("Conectado a Firebird");
      resolve(createDBInterface(db));
    });
  });
}

function createDBInterface(db: Database) {
  return {
    query: async (sql: string, params: unknown[] = []): Promise<unknown[]> =>
      new Promise((resolve, reject) => {
        db.query(sql, params, (err: Error | null, result: unknown[]) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result || []);
        });
      }),
    close: () => {
      if (dbConnection) {
        dbConnection.detach();
        dbConnection = null;
        console.log("Conexión Firebird cerrada");
      }
    },
  };
}

export async function executeQuery(sql: string, params: unknown[] = []): Promise<unknown[]> {
  const db = await getDB();
  return db.query(sql, params);
}

export async function executeUpdate(sql: string, params: unknown[] = []): Promise<unknown[]> {
  const db = await getDB();
  return db.query(sql, params);
}

export function closeDB(): void {
  if (dbConnection) {
    dbConnection.detach();
    dbConnection = null;
  }
}
