const { createUser, getUserByEmail } = require('../models/userModel');
const bcrypt = require('bcrypt');

const authController = {
    registerUser: async (req, res) => {
        const { email, first_name, last_name, password, role } = req.body;

        try {
            // Verificar si el usuario ya existe
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            await createUser(email, first_name, last_name, hashedPassword, role);
            res.status(201).json({ message: 'Usuario registrado con éxito' });
        } catch (error) {
            console.error('Error registrando usuario:', error);
            res.status(500).json({ message: 'Error registrando usuario', error });
        }
    }
};

module.exports = authController;
