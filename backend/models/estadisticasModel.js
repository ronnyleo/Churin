const db = require('../db');

const obtenerResumenDia = async (fecha) => {

    try {
        const query = 
            `SELECT 
                COUNT(*) AS total_pedidos,
                SUM(total) AS valor_total
            FROM pedido
            WHERE DATE(fecha_hora) = $1`
        return db.one(query, [fecha]);

    } catch (error) {
        console.log('Error al obtener las estadísticas: ', error);
    }

}

module.exports = {
    obtenerResumenDia
}