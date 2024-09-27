const { crearPedido } = require('../models/pedidoModel');


const pedidoController = {
    crearPedido: async (req, res) => {
        try {
            const pedido = await crearPedido();
            res.json(pedido);
        } catch (error) {
            console.error('Error al buscar en el menú:', error);
        }
    }
};

module.exports = pedidoController;