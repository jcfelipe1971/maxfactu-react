import { Request, Response } from "express";
import { getDatabaseConnection } from "../config/database";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res
      .status(400)
      .json({ error: "Usuario y contraseña son requeridos" });
  }

  try {
    const db = await getDatabaseConnection();

    // Asumiendo que tu tabla tiene columnas: id, nombre, usuario, password (hash)
    const query = `
            SELECT id, nombre, usuario, password 
            FROM usuarios 
            WHERE usuario = ?
        `;

    db.query(query, [usuario], (err, result) => {
      // Siempre liberar la conexión después de usarla
      db.detach();

      if (err) {
        console.error("Error en la consulta:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (!result || result.length === 0) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const user = result[0];

      // Verificar la contraseña (asumiendo que está hasheada con bcrypt)
      // Si aún no usas hashes, puedes cambiar esto a: if (password !== user.password)
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Éxito: Devolver datos del usuario (sin la contraseña)
      // En un caso real, aquí generarías un JWT (JSON Web Token)
      res.json({
        message: "Login exitoso",
        user: {
          id: user.id,
          nombre: user.nombre,
          usuario: user.usuario,
        },
      });
    });
  } catch (error) {
    console.error("Error en el proceso de login:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};
