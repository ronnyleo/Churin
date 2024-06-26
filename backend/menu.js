const express=require('express');
const router = express.Router();
const db = require ('../db');

// Ruta para obtener el menú
router.get('/menu', async (req, res) => {
    try {
      const result = await db.any('SELECT * FROM menu');
      res.json(result);
    } catch (error) {
      console.error('Error al obtener el menú:', error);
      res.status(500).json({ error: 'Error al obtener el menú' });
    }
  });

  module.exports = router;