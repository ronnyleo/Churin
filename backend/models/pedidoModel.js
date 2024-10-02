const db = require('../db');

const getPedidos = async () => {
    try {
        const query = 'SELECT * FROM pedido';
        const pedidos = await db.any(query);

        const pedidosConFechayHora = pedidos.map(pedido => {
            const fechaCompleta = new Date(pedido.fecha_hora);
            const fecha = fechaCompleta.toISOString().split('T')[0];
            const hora = fechaCompleta.toTimeString().split(' ')[0];


            return {
                ...pedido,
                fecha: fecha,
                hora: hora,
            };
        });
        return pedidosConFechayHora;
    } catch (error) {
        console.log('Error al obtener los pedidos:', error);
    }
}

const enviarPedido = async (cliente, total, delivery, lugar_envio) => {
    try {
        //const fecha_hora = new Date(); // Esto genera la fecha y hora actual.
        const query = `
            INSERT INTO pedido (cliente, total, fecha_hora, delivery, lugar_envio) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const nuevoPedido = await db.one(query, [cliente, total, delivery, lugar_envio]);
        return nuevoPedido;
    } catch (error) {
        console.error('Error al crear pedido', error);
        throw new Error('Error al crear');
    }
};

const enviarDetallePedido = async (pedido_id, menu_id, cantidad, precio, ingredientes) => {
    try {
        const query = `INSERT INTO detalle_pedidos (pedido_id, menu_id, cantidad, precio, ingredientes)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const detallePedido = await db.one(query, [pedido_id, menu_id, cantidad, precio, ingredientes]);
        return detallePedido;
    } catch (error) {
        console.error('Error al enviar el detalle del pedido:', error);
    }

}

module.exports = {
    enviarPedido,
    enviarDetallePedido,
    getPedidos
}