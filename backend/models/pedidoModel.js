const db = require('../db');

const obtenerPedidos = async () => {
    try {
        const query = `SELECT p.*, c.first_name, c.last_name, c.telefono  
            FROM pedido AS p INNER JOIN users AS c
            ON p.id_cliente = c.id`;
            
        const pedidos = await db.any(query);

        const pedidosConFechayHora = pedidos.map(pedido => {
            const fechaCompleta = new Date(pedido.fecha_hora);

            // Extraer los componentes de fecha y hora sin convertir a UTC
            const year = fechaCompleta.getFullYear();
            const month = String(fechaCompleta.getMonth() + 1).padStart(2, '0'); // Mes va de 0 a 11
            const day = String(fechaCompleta.getDate()).padStart(2, '0');
            const hours = String(fechaCompleta.getHours()).padStart(2, '0');
            const minutes = String(fechaCompleta.getMinutes()).padStart(2, '0');

            // Formatear la fecha y la hora manualmente
            const fecha = `${year}-${month}-${day}`;
            const hora = `${hours}:${minutes}`;


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


const obtenerDetallePedidos = async (id) => {
    try {
        const query = `SELECT detalle_pedidos.*, menu.nombre 
            FROM  detalle_pedidos 
            INNER JOIN menu
            ON menu.id = detalle_pedidos.menu_id
            WHERE pedido_id = $1`;
        const detallePedido = await db.any(query, [id]);
        return detallePedido;

    } catch (error) {
        console.log('Error al obtener los pedidos:', error);
    }
}


const enviarPedido = async (id_cliente, total, delivery, lugar_envio) => {
    try {
        const query = `
            INSERT INTO pedido (id_cliente, total, fecha_hora, delivery, lugar_envio) 
            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING *`;
        const nuevoPedido = await db.one(query, [id_cliente, total, delivery, lugar_envio]);
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
    obtenerPedidos,
    obtenerDetallePedidos
}