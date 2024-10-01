// server.js
const express = require('express');
const cors = require('cors')
const client = require('./db'); // Asegúrate de que el cliente de PostgreSQL esté exportado correctamente
const authRouter = require ('./routes/authRoutes');
const menuRouter = require('./routes/menuRoutes');
const uploadRouter = require('./routes/upload');
const tiposRouter =  require('./routes/tipos');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pedidosRouter = require('./routes/pedidoRoutes');
const ingredientRouter = require('./routes/ingredientRoutes');
const direccionesRouter = require('./routes/direccionesRoutes');
const multer = require('multer');


const app = express();
const port = process.env.PORT || 10000;

// Middleware para permitir solicitudes CORS (permite el acceso desde el frontend en otro dominio)
// Configurar CORS
// Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000', // Desarrollo en localhost
  'https://churin-fun-flais.onrender.com' // Producción
];


app.use(cors({
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware para manejar JSON en las solicitudes
app.use(express.json());

// Rutas principales

app.use(express.urlencoded({ extended: true }));

//Ruta de bienvenida para el root URL (/)
app.get('/', (req, res) => {
  res.send('BACKEND DESARROLLO');
});

//Rutas para el registro
app.use('/api', authRouter);
// Rutas para el menú del restaurante
app.use('/api', menuRouter);
app.use('/api', tiposRouter);
app.use('/api', pedidosRouter);
app.use('/api', direccionesRouter);
app.use(categoriaRoutes);
// Ruta para subir imágenes
app.use('/api/upload', uploadRouter);
//app.use('/api/upload', upload.single('image'), require('./routes/upload'));
app.use('/api', ingredientRouter);
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
