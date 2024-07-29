// Importamos la función que devuelve una conexión con la base de datos.
import getPool from "../../database/getPool.js";

// Función que realiza una consulta a la base de datos para seleccionar a un usuario con un id dado.
const selectUserByIdModel = async (userId) => {
  const pool = await getPool();

  // Comprobamos si hay algún usuario con el email proporcionado.
  const [users] = await pool.query(
    `SELECT id, username, email, firstname, lastname, avatar, createdAt, role, password FROM users WHERE id = ?`,
    [userId]
  );

  // El array de usuarios solo podrá contener un único usuario dado que el email
  // no puede repetirse. Retornamos al usuario que se encuentra en la posición 0,
  // es decir, retornamos el objeto en lugar de retornar un array con un elemento.
  return users[0];
};

export default selectUserByIdModel;
