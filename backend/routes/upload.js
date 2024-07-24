const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary');
const client = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Multer configurado para guardar archivos temporalmente

// Ruta para subir una imagen
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;

    // Guardar la URL de la imagen en la base de datos
    await client.query('INSERT INTO menu_images (image_url) VALUES ($1)', [imageUrl]);

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Ruta para obtener todas las imágenes
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT image_url FROM menu_images');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    res.status(500).json({ error: 'Error al obtener las imágenes' });
  }
});

module.exports = router;
