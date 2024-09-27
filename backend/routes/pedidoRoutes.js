const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/pedido', pedidoController.crearPedido);

module.exports = router;