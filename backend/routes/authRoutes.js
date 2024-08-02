
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario 

router.post('/register', authController.registerUser);

module.exports = router;