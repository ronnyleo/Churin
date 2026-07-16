const db = require('../db');

const obtenerResumenDia = async (fecha) => {
    try {
        const query = `
            WITH pedidos_dia AS (
                SELECT p.*, u.email
                FROM pedido p
                LEFT JOIN users u ON u.id = p.id_cliente
                WHERE p.fecha_hora >= $1::date
                    AND p.fecha_hora < ($1::date + INTERVAL '1 day')
            )
            SELECT
                COUNT(*)::int AS total_pedidos,
                COALESCE(SUM(total), 0) AS valor_total,
                COUNT(*) FILTER (WHERE delivery = true)::int AS delivery_pedidos,
                COUNT(*) FILTER (
                    WHERE COALESCE(delivery, false) = false
                        AND (COALESCE(email = 'mesa@churin.local', false) OR COALESCE(lugar_envio ILIKE 'Mesa %', false))
                )::int AS mesa_pedidos,
                COUNT(*) FILTER (
                    WHERE COALESCE(delivery, false) = false
                        AND NOT (COALESCE(email = 'mesa@churin.local', false) OR COALESCE(lugar_envio ILIKE 'Mesa %', false))
                )::int AS retiro_pedidos
            FROM pedidos_dia`;

        return db.one(query, [fecha]);
    } catch (error) {
        console.log('Error al obtener las estadisticas: ', error);
        throw error;
    }
};

module.exports = {
    obtenerResumenDia
};