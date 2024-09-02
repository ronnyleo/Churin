const db = require('../db');

const getIngredient = async () => {
    try{
        return await db.any(`SELECT i.id, i.nombre, t.nombre AS tipo 
            FROM ingredientes AS i 
            INNER JOIN tipo_ingrediente AS t ON t.id=i.tipo_id
            ORDER BY t.nombre`);
    }
    catch (error) {
        console.error("Error al obtener ingredientes");
    }
}; 

module.exports = {
    getIngredient
}