import fb from "node-firebird";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const dbPath = path.resolve(__dirname, "../BD/LONPER.FDB");

const config: fb.Options = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3050,
  database: dbPath,
  user: process.env.DB_USER || "SYSDBA",
  password: process.env.DB_PASSWORD || "masterkey",
  lowercase_keys: true,
  role: process.env.DB_ROLE,
  pageSize: 4096,
  wireCrypt: (process.env.DB_WIRECRYPT as any) || "Enabled",
};

console.log("🔍 Intentando conectar a:", dbPath);
console.log("📋 Configuración:", {
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
});

fb.attach(config, (err, db) => {
  if (err) {
    console.error("❌ ERROR DE CONEXIÓN:", err);
    return;
  }

  console.log("✅ ¡CONEXIÓN EXITOSA A FIREBIRD!");

  // Probar consulta simple
  db.query("SELECT COUNT(*) as total FROM usuarios", [], (err, result) => {
    if (err) {
      console.error("❌ ERROR EN CONSULTA:", err);
    } else {
      console.log("✅ CONSULTA EXITOSA:", result);
    }

    db.detach();
    console.log("🔌 Conexión cerrada");
  });
});
