// backend/db.js
const { Client } = require('pg');
const pgp = require('pg-promise')();
require('dotenv').config(); // Asegúrate de tener esta línea al principio para cargar las variables de entorno

<<<<<<< HEAD
/*
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Utiliza esto para conexiones SSL. Modifica según sea necesario.
  }
});
*/

//const db = pgp(process.env.DATABASE_URL);

const db = new pgp({
=======
const client = new Client({
>>>>>>> 4112dcdfde667af92dda0e37474f0594c875c606
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configura según la configuración de tu base de datos
  },
});

<<<<<<< HEAD
db.connect()
  .then(() => console.log('Connected to PostgreSQL database on Render'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

module.exports = db;
=======
module.exports = client;
>>>>>>> 4112dcdfde667af92dda0e37474f0594c875c606


