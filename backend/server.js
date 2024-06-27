// server.js
const express = require('express');
const cors = require('cors')
const client = require('./db'); // Asegúrate de que el cliente de PostgreSQL esté exportado correctamente
const menuRouter = require('./routes/menu');
const uploadRouter = require('./routes/upload');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directorio temporal para guardar archivos

const app = express();
const port = process.env.PORT || 3001;

// Middleware para permitir solicitudes CORS (permite el acceso desde el frontend en otro dominio)
app.use(cors());

// Middleware para manejar JSON en las solicitudes
app.use(express.json());

// Rutas principales

//Ruta de bienvenida para el root URL (/)
app.get('/', (req, res) => {
  res.send('BACKEND DESARROLLO');
});

// Rutas para el menú del restaurante
app.use('/api', menuRouter); // Monta el enrutador del menú bajo /api/menu

// Ruta API para obtener el menú del restaurante
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Ruta para subir imágenes
app.use('/api/upload',uploadRouter);
//app.use('/api/upload', upload.single('image'), require('./routes/upload'));

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()');
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error connecting to database');
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;