import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Import routes
import familiasRouter from "./src/routes/familias";
import tiposIvaRouter from "./src/routes/tipos-iva";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Middleware para logs
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // ==================== RUTAS ====================
  
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

startServer().catch((error) => {
  console.error("❌ Error iniciando servidor:", error);
  process.exit(1);
});
