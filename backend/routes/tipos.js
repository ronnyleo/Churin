const express = require('express');
const router = express.Router();
const client = require('../db');

// Ruta para obtener todos los tipos
router.get('/tipos', async (req, res) => {
    console.log('Solicitud recibida en /api/tipos'); // Añadir este log para depurar
    try {
      const result = await client.query('SELECT * FROM tipos');
      console.log('Resultado de la consulta:', result); // Añadir este log para depurar
      console.log('Datos obtenidos en el baackend:', result.rows); // Añadir este log para depurar
      res.json(result); // Debería ser un array
    } catch (error) {
      console.error('Error al obtener los tipos:', error);
      res.status(500).json({ error: 'Error al obtener los tipos' });
    }
});

module.exports = router;