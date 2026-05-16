import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for "Familias"
  let familias = [
    { id: "001", titulo: "PERFILES", tipoIva: 1, permiteStockNegativo: true },
    { id: "002", titulo: "RECAMBIOS EMBRAGUE", tipoIva: 1, permiteStockNegativo: false },
    { id: "003", titulo: "ACCESORIOS", tipoIva: 2, permiteStockNegativo: true },
    { id: "004", titulo: "HERRAMIENTAS", tipoIva: 1, permiteStockNegativo: false },
  ];

  const tiposIva = [
    { id: 0, titulo: "Exento" },
    { id: 1, titulo: "Normal" },
    { id: 2, titulo: "Reducido" },
    { id: 3, titulo: "Super-Reducido" },
    { id: 4, titulo: "Agr., Gan. y P." },
    { id: 5, titulo: "Aduana" },
    { id: 6, titulo: "NO DEDUCIBLE" },
    { id: 7, titulo: "LEASING" },
  ];

  // API Routes
  app.get("/api/familias", (req, res) => {
    res.json(familias);
  });

  app.get("/api/tipos-iva", (req, res) => {
    res.json(tiposIva);
  });

  app.post("/api/familias", (req, res) => {
    const newFamilia = req.body;
    familias.push(newFamilia);
    res.status(201).json(newFamilia);
  });

  app.put("/api/familias/:id", (req, res) => {
    const { id } = req.params;
    const index = familias.findIndex((f) => f.id === id);
    if (index !== -1) {
      familias[index] = { ...familias[index], ...req.body };
      res.json(familias[index]);
    } else {
      res.status(404).json({ message: "Familia no encontrada" });
    }
  });

  app.delete("/api/familias/:id", (req, res) => {
    const { id } = req.params;
    familias = familias.filter((f) => f.id !== id);
    res.status(204).send();
  });

  // Vite middleware for development
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
    console.log(`Servidor de MaxFactu corriendo en http://localhost:${PORT}`);
  });
}

startServer();
