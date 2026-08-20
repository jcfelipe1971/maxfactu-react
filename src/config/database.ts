import fb from "firebird.sql";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Resuelve la ruta absoluta a la carpeta BD/LONPER.FDB
const dbPath = path.resolve(__dirname, "../../BD/LONPER.FDB");

const dbConfig: fb.Options = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: dbPath,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  lowercase_keys: true, // Devuelve las columnas en minúsculas (más fácil de manejar en JS/TS)
  wireCrypt:
    (process.env.DB_WIRECRYPT as "Enabled" | "Disabled" | "Required") ||
    "Enabled",
};

export const getDatabaseConnection = (): Promise<fb.Database> => {
  return new Promise((resolve, reject) => {
    fb.attach(dbConfig, (err, db) => {
      if (err) {
        console.error("❌ Error al conectar con Firebird:", err.message);
        reject(err);
      } else {
        console.log("✅ Conexión exitosa a LONPER.FDB (Firebird 5)");
        resolve(db);
      }
    });
  });
};
