const db = require('../db');

const enviarPedido = async (cliente, total, delivery, lugar_envio) => {
    try {
        const fecha_hora = new Date(); // Esto genera la fecha y hora actual.
        const query = `
            INSERT INTO pedido (cliente, total, fecha_hora, delivery, lugar_envio) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const nuevoPedido = await db.one(query, [cliente, total, fecha_hora, delivery, lugar_envio]);
        return nuevoPedido;
    } catch (error) {
        console.error('Error al crear pedido', error);
        throw new Error('Error al crear');
    }
};


const enviarDetallePedido = async (id_pedido, articulo_id, cantidad, precio, ingredientes) => {
    try {
        const query = `
            INSERT INTO detalle_pedido (id_pedido, articulo_id, cantidad, precio, ingredientes) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const nuevoDetalle = await db.one(query, [id_pedido, articulo_id, cantidad, precio, ingredientes]);
        return nuevoDetalle;
    } catch (error) {
        console.error('Error al crear detalle de pedido', error);
        throw new Error('Error al crear detalle');
    }
};


module.exports = {
    enviarPedido, 
    enviarDetallePedido
}