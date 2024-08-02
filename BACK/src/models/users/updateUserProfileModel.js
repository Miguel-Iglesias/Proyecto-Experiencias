import getPool from "../../database/getPool.js";
import bcrypt from "bcrypt";

const updateUserProfileModel = async (userId, data) => {
  if (!userId || !data || Object.keys(data).length === 0) {
    throw new Error("Invalid input: No data provided for update.");
  }

  const { username, firstname, lastname, email, role, password, avatar } = data; // Incluye el campo avatar
  const pool = await getPool();

  const setFragments = [];
  const values = [];

  if (username) {
    setFragments.push(`username = ?`);
    values.push(username);
  }
  if (firstname) {
    setFragments.push(`firstname = ?`);
    values.push(firstname);
  }
  if (lastname) {
    setFragments.push(`lastname = ?`);
    values.push(lastname);
  }
  if (email) {
    setFragments.push(`email = ?`);
    values.push(email);
  }
  if (role) {
    setFragments.push(`role = ?`);
    values.push(role);
  }
  if (password !== undefined) {
    setFragments.push(`password = ?`);
    values.push(password);
  }
  if (avatar) {
    setFragments.push(`avatar = ?`); // Añade la actualización del campo avatar
    values.push(avatar);
  }

  if (setFragments.length === 0) {
    throw new Error("No fields to update.");
  }

  values.push(userId);

  const setClause = setFragments.join(", ");
  const query = `
    UPDATE users
    SET ${setClause}
    WHERE id = ?
  `;

  // Log the query and values to the console for debugging
  console.log("Generated SQL Query:", query);
  console.log("Values:", values);

  // Execute the query
  await pool.query(query, values);

  // Devolver los datos actualizados del usuario
  const [rows] = await pool.query(
    `SELECT id, username, firstname, lastname, email, role, avatar FROM users WHERE id = ?`, // Incluye avatar en la selección
    [userId]
  );

  return rows[0]; // Retorna el usuario actualizado
};

export default updateUserProfileModel;
