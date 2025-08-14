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

const obtenerPedidosUsuario = async (id) => {
    try {
        const query =  `SELECT 
            P.id AS id_pedido,
            P.id_cliente,
            P.fecha_hora,
            P.total,
            P.delivery, 
            P.lugar_envio,
            P.lugar_envio_id,
            DP.id AS id_detalle,
            DP.menu_id,
            DP.cantidad,
            ROUND(DP.precio / DP.cantidad, 2) AS precio_unitario,
            DP.precio,
            DP.ingredientes,
            M.id AS id_menu,
            M.nombre AS plato
            FROM pedido AS P 
            INNER JOIN detalle_pedidos AS DP
            ON P.id = DP.pedido_id
            INNER JOIN menu AS M
            ON DP.menu_id = M.id 
            WHERE P.id_cliente = $1`

            const result = await db.any(query, [id]);
            

            // row es cada fila obtenida en la consulta SQL.
            // acc es el objeto donde se almacenarán los pedidos agrupados
            const pedidosAgrupados = result.reduce((acc, row) => {
                
                const {id_pedido, id_cliente, fecha_hora, total, delivery, lugar_envio, lugar_envio_id, id_detalle,
                    plato, cantidad, precio_unitario, ingredientes} = row;

                const fechaISO = new Date(fecha_hora); // fecha para ordenar

                // fecha en string
                const fecha = new Date(fecha_hora). toLocaleString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false // formato de 24 horas
                });

                if (!acc[id_pedido]) {
                    acc[id_pedido] = {
                        id_pedido,
                        id_cliente,
                        fecha,
                        fechaISO,
                        total,
                        delivery,
                        lugar_envio,
                        lugar_envio_id,
                        detalles: []
                    };
                }

                acc[id_pedido].detalles.push({
                    id_detalle,
                    plato,
                    cantidad,
                    precio_unitario,
                    ingredientes
                })

                return acc 
            }, {});

            const pedidos = Object.values(pedidosAgrupados).sort((a, b) => {
                return new Date(b.fechaISO) - new Date(a.fechaISO);
            });

        return pedidos;
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

const obtenerDetalleConRetry = async(id, intentos=5) => {
  for (let i=0; i<intentos; i++) {
    const d = await obtenerDetallePedidos(id);
    if (d.length) return d;
    await new Promise(r => setTimeout(r, 400)); // 0.4s
  }
  return [];
}

module.exports = {
    enviarPedido,
    enviarDetallePedido,
    obtenerPedidos,
    obtenerPedidosUsuario,
    obtenerDetallePedidos,
    obtenerDetalleConRetry
}