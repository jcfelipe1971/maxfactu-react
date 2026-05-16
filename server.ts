// server.ts - VERSIÓN CORREGIDA
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 🔹 Importar routes PRIMERO
import familiasRouter from "./src/routes/familias";
import tiposIvaRouter from "./src/routes/tipos-iva";
import entornoRoutes from './src/routes/entorno';

// 🔹 Importar closeDB para shutdown
import { closeDB } from './src/lib/firebird';

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  
  // 🔹 Middleware para logs (útil para debug)
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // 🔹 Registrar rutas de entorno ANTES que otras
  app.use('/api/entorno', entornoRoutes);
  app.use("/api/familias", familiasRouter);
  app.use("/api/tipos-iva", tiposIvaRouter);

  // ==================== VITE MIDDLEWARE ====================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor MaxFactu en http://localhost:${PORT}`);
    console.log(`🔥 Firebird DB: ${process.env.FIREBIRD_DATABASE}`);
  });
}

// 🔹 Handlers de cierre de conexión (AHORA con imports arriba)
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor (SIGINT)...');
  closeDB();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor (SIGTERM)...');
  closeDB();
  process.exit(0);
});

// 🔹 Iniciar servidor
startServer().catch((error) => {
  console.error("❌ Error iniciando servidor:", error);
  process.exit(1);
});