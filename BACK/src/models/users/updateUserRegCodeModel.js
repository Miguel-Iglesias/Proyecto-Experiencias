// Importamos la función que devuelve una conexión con la base de datos.
import getPool from "../../database/getPool.js";

// Importamos los errores.
import { pendingActivationError } from "../../services/errorService.js";

// Función que realiza una consulta a la base de datos para activar un usuario.
const updateUserRegCodeModel = async (registrationCode) => {
  const pool = await getPool();

  // Comprobamos si existe un usuario con ese código de registro.
  const [users] = await pool.query(
    `SELECT id FROM users WHERE registrationCode = ?`,
    [registrationCode]
  );

  // Si no existe ningún usuario con ese código de registro lanzamos un error.
  if (!users.length) pendingActivationError("Usuario");

  // Actualizamos el usuario.
  await pool.query(
    `UPDATE users SET active = true, registrationCode = null WHERE registrationCode = ?`,
    [registrationCode]
  );
};

export default updateUserRegCodeModel;
