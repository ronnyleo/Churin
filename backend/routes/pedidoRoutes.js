const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/pedido', pedidoController.enviarPedido);

module.exports = router;

