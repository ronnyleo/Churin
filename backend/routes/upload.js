// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Multer configurado para guardar archivos temporalmente
const client = require('../db');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;
    const query = 'INSERT INTO menu_images (menu_id, image_url) VALUES ($1, $2) RETURNING *';
    const values = [req.body.menu_item_id, imageUrl];

    const dbRes = await client.query(query, values);

    res.json({ imageUrl: result.secure_url });


  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

module.exports = router;