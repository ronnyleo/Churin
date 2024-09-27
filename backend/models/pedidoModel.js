const db = require('../db');

const crearPedido = async (cliente, total) => {
    try {
        const query = `INSERT INTO pedidos (cliente, total) 
        VALUES ($1, $2) RETURNING id`;
        const pedido = await db.one(query, [cliente, total])
        return pedido;
    } catch (error) {
        console.error('Error al crear pedido');
        throw new Error('Error al crear');
    }
};

module.exports = {
    crearPedido
}