const client = require('../db'); // Ajusta según la configuración de tu cliente de PostgreSQL

const createUser = async (email, first_name, last_name, password, role) => {
    const query = `
        INSERT INTO users (email, first_name, last_name, password, role)
        VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [email, first_name, last_name, password, role];
    await client.query(query, values);
};

// Función para obtener un usuario por correo electrónico
const getUserByEmail = async (email) => {
  try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const values = [email];
      const result = await client.query(query, values);
      // Asegúrate de que result.rows esté definido y sea un arreglo
      return result.rows; // Retorna el primer usuario encontrado o undefined si no hay ninguno
  } catch (error) {
      console.error('Error al obtener el usuario por correo electrónico:', error);
      throw error; // Propaga el error para que pueda ser manejado por el controlador
  }
};

module.exports = { createUser, getUserByEmail };
