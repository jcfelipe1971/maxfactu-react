import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

let closeDB = () => {};

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);
  const [{ default: familiasRouter }, { default: tiposIvaRouter }, { default: entornoRoutes }, firebird] =
    await Promise.all([
      import("./src/routes/familias"),
      import("./src/routes/tipos-iva"),
      import("./src/routes/entorno"),
      import("./src/lib/firebird"),
    ]);

  closeDB = firebird.closeDB;

  app.use(express.json());

  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  app.use("/api/entorno", entornoRoutes);
  app.use("/api/familias", familiasRouter);
  app.use("/api/tipos-iva", tiposIvaRouter);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor MaxFactu en http://localhost:${port}`);
    console.log(`Firebird DB: ${process.env.FIREBIRD_DATABASE || "sin configurar"}`);
  });
}

process.on("SIGINT", () => {
  console.log("\nCerrando servidor (SIGINT)...");
  closeDB();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nCerrando servidor (SIGTERM)...");
  closeDB();
  process.exit(0);
});

startServer().catch((error) => {
  console.error("Error iniciando servidor:", error);
  process.exit(1);
});
