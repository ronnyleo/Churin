// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const client = require('./db'); // Asegúrate de que el cliente de PostgreSQL esté exportado correctamente

// Define a route for the root URL (/)
app.get('/', (req, res) => {
  res.send('El amor de mi vida esta leyendo esto');
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