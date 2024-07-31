// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Ruta para obtener todos los platos
router.get('/menu', menuController.getMenu);

// Ruta para obtener el plato según el ID
router.get("/menu/:id", menuController.getPlateById);

module.exports = router;
