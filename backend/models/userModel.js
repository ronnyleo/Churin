//userModel.js

const client = require('../db'); // Ajusta según la configuración de tu cliente de PostgreSQL

// Crear un nuevo usuario
const registerUser = async (email, first_name, last_name, password, role) => {
    return client.one(
        `INSERT INTO users (email, first_name, last_name, password, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
        [email, first_name, last_name, password, role]
    );
};

// Función para obtener un usuario por correo electrónico
const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);
        console.log('Resultado de la consulta:', result); // Agrega este log
        // Asegúrate de que result.rows esté definido y sea un arreglo
        return result; // Retorna el primer usuario encontrado o undefined si no hay ninguno
    } catch (error) {
        console.error('Error al obtener el usuario por correo electrónico:', error);
        throw error; // Propaga el error para que pueda ser manejado por el controlador
    }
};

module.exports = { registerUser, getUserByEmail };
