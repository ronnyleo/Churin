//authController.js
const client = require('../db'); // Ajusta según la configuración de tu cliente de PostgreSQL
const { registerUser, getUserByEmail } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const authController = {

    registerUser: async (req, res) => {
        const { email, first_name, last_name, password, role } = req.body;

        try {
            const existingUser = await getUserByEmail(email);
            //const existingUser = await client.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            const newUser = registerUser(email, first_name, last_name, password, role);

            
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error durante el registro:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },

    getUserRole: async (req, res) => {
        const { email } = req.body; // Verifica que el email esté en el cuerpo de la solicitud
        console.log('Recibiendo solicitud para obtener el rol del usuario con email:', email);

        try {
            // Obtener el usuario por email
            const user = await getUserByEmail(email);
            console.log('Usuario obtenido:', user); // Agrega este log para ver el usuario

            if (!user || user.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Devolver el rol del usuario
            res.status(200).json({ role: user[0].role }); // Ajusta según la estructura del usuario obtenido
        } catch (error) {
            console.error('Error obteniendo el rol del usuario:', error);
            res.status(500).json({ message: 'Error obteniendo el rol del usuario', error });
        }
    }
};

module.exports = authController;
