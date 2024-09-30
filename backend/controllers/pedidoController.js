const { enviarPedido, enviarDetallePedido } = require('../models/pedidoModel');


const pedidoController = {
    enviarPedido: async (req, res) => {
        const { cliente, total, delivery, lugar_envio } = req.body;
        try {
            const pedido = await enviarPedido(cliente, total, delivery, lugar_envio);
            res.status(201).json({ pedido: pedido });
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
        }
    },

    enviarDetallePedido: async (req, res) => {
        console.log('Cuerpo de la solicitud (req.body):', req.body);
        const { pedido_id, menu_id, cantidad, precio, ingredientes } = req.body;


        try {
            const detallePedido = await enviarDetallePedido(pedido_id, menu_id, cantidad, precio, ingredientes);                
            res.status(201).json({
                message: 'Detalle del pedido enviado exitosamente',
                detalle_id: detallePedido
            });
        } catch (error) {
            console.error('Error al enviar el detalle del pedido:', error);
        }
    }
};

module.exports = pedidoController;