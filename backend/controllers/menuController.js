// controllers/menuController.js
const db = require('../db'); // Asegúrate de que la ruta al archivo sea correcta

// Obtener todos los platos
const getMenu = async (req, res) => {
  try {
    const result = await db.any('SELECT * FROM menu');
    res.json(result);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).send('Error al obtener el menú');
  }
};

module.exports = {
  getMenu,
};
