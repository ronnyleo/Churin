const db = require('../db');

const obtenerResumenDia = async () => {

    try {
        const query = 
            `SELECT 
                COUNT(*) AS total_pedidos,
                SUM(total) AS valor_total
            FROM pedido`
        return db.any(query);

    } catch (error) {
        console.log('Error al obtener las estadísticas: ', error);
    }

}

module.exports = {
    obtenerResumenDia
}