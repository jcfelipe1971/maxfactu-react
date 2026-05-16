import Firebird from "node-firebird";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Configuración de conexión
const fbConfig = {
  host: process.env.FIREBIRD_HOST || "localhost",
  port: parseInt(process.env.FIREBIRD_PORT || "3050"),
  database: process.env.FIREBIRD_DATABASE || "C:\\Program Files\\Firebird\\MAXFACTU.fdb",
  user: process.env.FIREBIRD_USER || "SYSDBA",
  password: process.env.FIREBIRD_PASSWORD || "masterkey",
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

console.log("🔥 Firebird Config:", {
  host: fbConfig.host,
  port: fbConfig.port,
  database: fbConfig.database,
  user: fbConfig.user,
});

// Helper para ejecutar queries (SELECT)
export function executeQuery(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Firebird.attach(fbConfig, (err: any, db: any) => {
      if (err) {
        console.error("❌ Connection error:", err);
        return reject(err);
      }

      db.query(sql, params, (err: any, result: any) => {
        db.detach();
        if (err) {
          console.error("❌ Query error:", err);
          return reject(err);
        }
        resolve(result || []);
      });
    });
  });
}

// Helper para ejecutar INSERT/UPDATE/DELETE
export function executeUpdate(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    Firebird.attach(fbConfig, (err: any, db: any) => {
      if (err) {
        console.error("❌ Connection error:", err);
        return reject(err);
      }

      db.query(sql, params, (err: any, result: any) => {
        if (err) {
          db.detach();
          console.error("❌ Update error:", err);
          return reject(err);
        }

        // Hacer commit de la transacción
        db.commit((commitErr: any) => {
          db.detach();
          if (commitErr) {
            console.error("❌ Commit error:", commitErr);
            return reject(commitErr);
          }
          console.log("✅ Update successful");
          resolve(result);
        });
      });
    });
  });
}

export default { executeQuery, executeUpdate };