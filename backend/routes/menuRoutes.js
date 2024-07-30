// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const { getMenu } = require('../controllers/menuController'); // Importa el controlador

// Ruta para obtener todos los platos
router.get('/menu', getMenu);

module.exports = router;
