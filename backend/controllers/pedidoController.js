const { obtenerPedidos, enviarPedido, 
    enviarDetallePedido, obtenerDetallePedidos, 
    obtenerPedidosUsuario, obtenerDetalleConRetry } = require('../models/pedidoModel');
const { notifyTelegram } = require("../notifications/telegram"); // <- tu helper


const pedidoController = {
    obtenerPedidos: async (req, res) => {
        try {
            const pedidos = await obtenerPedidos();
            res.json(pedidos);
        } catch (error) {
            console.error('Error al obtener pedidos:', error)
        }
    },

    obtenerPedidosUsuario: async (req, res) => {
        const idCliente = parseInt(req.params.id)
        try {
            const pedidos = await obtenerPedidosUsuario(idCliente);
            res.json(pedidos);
        } catch (error) {
            console.error("Error al obtener los pedidos del usuario")
        }
    },
    obtenerDetallePedidos: async (req, res) => {
        const pedidoId = parseInt(req.params.id)
        try {
            const detallePedido = await obtenerDetallePedidos(pedidoId);



            res.json(detallePedido);
        } catch (error) {
            console.error('Error al obtener pedidos:', error)
        }
    },

    enviarPedido: async (req, res) => {
        const { id_cliente, total, delivery, lugar_envio } = req.body;
        try {
            const pedido = await enviarPedido(id_cliente, total, delivery, lugar_envio);
            
            
            res.status(201).json({ pedido: pedido });

            const detalle = await obtenerDetalleConRetry(pedido.id);

            const payload = {
                id: pedido.id,
                total: pedido.total,
                entrega: pedido.delivery ? pedido.lugar_envio : "Retiro",
                detalle: detalle.map(d=>({
                    nombre: d.nombre,
                    ingredientes: d.ingredientes,
                    cantidad: d.cantidad,
                    precio: d.precio,
                }))
            }

            notifyTelegram(payload);


        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            res.status(500).json({ error: 'Error al enviar el pedido.' });
        }
    },

    enviarDetallePedido: async (req, res) => {
        console.log('Cuerpo de la solicitud (req.body):', req.body);
        const { pedido_id, menu_id, cantidad, precio, ingredientes } = req.body;
        // Convertir ingredientes a JSON string
        const ingredientesJson = JSON.stringify(ingredientes);
        try {
            const detallePedido = await enviarDetallePedido(pedido_id, menu_id, cantidad, precio, ingredientesJson);
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
