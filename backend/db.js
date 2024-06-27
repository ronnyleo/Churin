// backend/db.js
const { Client } = require('pg');
const pgp = require('pg-promise')();
require('dotenv').config(); // Asegúrate de tener esta línea al principio para cargar las variables de entorno

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configura según la configuración de tu base de datos
  },
});

module.exports = client;


