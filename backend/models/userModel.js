// userModel.js

const client = require('../db'); // Ajusta según la configuración de tu cliente de PostgreSQL
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Número de rondas de sal

// Crear un nuevo usuario
const registerUser = async (email, first_name, last_name, password, role, telefono) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return await client.one(
            `INSERT INTO users (email, first_name, last_name, password, role, telefono) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [email, first_name, last_name, hashedPassword, role, telefono]
        );
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
};

// Función para obtener un usuario por correo electrónico
const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.any(query, [email]);
        console.log('Resultado de la consulta:', result); // Agrega este log
        return result; // Retorna el primer usuario encontrado o null si no hay ninguno
    } catch (error) {
        console.error('Error al obtener el usuario por correo electrónico:', error);
        throw error; // Propaga el error para que pueda ser manejado por el controlador
    }
};

module.exports = { registerUser, getUserByEmail };
