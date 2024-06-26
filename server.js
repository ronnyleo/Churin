// server.js

//const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurante';

//mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Pool } = require('pg');
const express = require('express');
const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Utiliza esto para conexiones SSL. Modifica según sea necesario.
  }
})
const port = process.env.PORT || 3000;

// Define a route for the root URL (/)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define a route for the root URL (/)
app.get('/ping', async (req, res) => {
  await pool.query('SELECT NOW()')
  return res.json(result.rows[0]);
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database on Render'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

module.exports = client;