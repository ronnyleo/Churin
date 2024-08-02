//authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario 
router.post('/auth/register', authController.registerUser);


router.post('/auth/getUserRole', authController.getUserRole);

module.exports = router;
