// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurante';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const pedidoSchema = new mongoose.Schema({
  nombreCliente: String,
  items: [String],
  total: Number,
  fecha: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

app.use(bodyParser.json());

app.post('/api/pedidos', async (req, res) => {
  const nuevoPedido = new Pedido(req.body);
  try {
    await nuevoPedido.save();
    res.status(201).send(nuevoPedido);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).send(pedidos);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
