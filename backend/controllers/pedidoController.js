const { enviarPedido } = require('../models/pedidoModel');


const pedidoController = {
    enviarPedido: async (req, res) => {
        const { cliente, total, delivery, lugar_envio } = req.body;
        try {
            const pedido = await enviarPedido(cliente, total, delivery, lugar_envio);
            res.json(pedido);
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
        }
    }
};

module.exports = pedidoController;