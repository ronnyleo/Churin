// server.js
const express = require('express');
const menuRouter = require('./routes/menu');
const { Client } = require('pg');
const app = express();
const port = process.env.PORT || 3001;
const client = require('./db'); // Asegúrate de que el cliente de PostgreSQL esté exportado correctamente
const cors = require('cors')

// Define a route for the root URL (/)
app.get('/', (req, res) => {
  res.send('El amor de mi vida esta leyendo esto');
});

// Middleware para permitir solicitudes CORS (permite el acceso desde el frontend en otro dominio)
app.use(cors());
app.use('/api', menuRouter); // Monta el enrutador del menú bajo /api/menu
app.use(express.json());

// Ruta API para obtener el menú del restaurante
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

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