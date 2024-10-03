const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/pedido', pedidoController.getPedidos);
router.get('/detalle-pedido/:id', pedidoController.getDetallePedidos);
router.post('/pedido', pedidoController.enviarPedido);
router.post('/pedido/detalle-pedido', pedidoController.enviarDetallePedido);

module.exports = router;

