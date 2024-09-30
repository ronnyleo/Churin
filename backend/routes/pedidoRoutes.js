const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/pedido', pedidoController.enviarPedido);
router.post('/pedido/detalle-pedido', pedidoController.enviarDetallePedido);

module.exports = router;

