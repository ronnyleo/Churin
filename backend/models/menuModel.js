const db = require('../db');

/* Consultar base de datos: operación asíncrona.
async que se procesen en segundo plato otras operaciones
permite usar await dentro de la consulta
async devuelve una promesa */
const getMenu = async () => {
    try{
        // db.any es metodo de pg-promise
        //await hace que la funcion se "pause" y
        // permite que la promesa db.any se resuelva o rechace
        return await db.any("SELECT * FROM menu");
    } 
    catch (error) {
        console.error("Error al mostrar menú");
        throw new Error("Error al mostrar menú");
    }
};

// Función para obtener un plato específico por ID
const getPlateById = async (id) => {
    try{
        // oneOrNone -> Espera un solo registro o ninguno. 
        return await db.oneOrNone("SELECT * FROM menu WHERE id = $1", [id]);
    }
    catch (error) {
        console.error(`Error al obtener el plato con ID ${id}:`, error);
        throw new Error("Error al obtener plato");
    }
};

// Funcion para buscador 
const searchPlates = async (searchTerm) => {
    try{
        // Ussar comillas invertidas para consultas de multiples lineas
        const query = `SELECT * FROM menu 
        WHERE nombre ILIKE $1`;
        //template literal `${}`para inservar variables dentro de cadenas
        return await db.any(query, [`%${searchTerm}%`])
    }
    catch (error) {
        console.error("Error al buscar platos");
        throw new Error("Error al buscar");
    }
}

const subirPlato = async (nombre, descripcion, precio, tipo_id, image_url, tipo_combinacion) => {
    try {
        const query = 
        `INSERT INTO menu 
        (nombre, descripcion, precio, tipo_id, image_url, tipo_combinacion)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
        const plato = await db.one(query, [nombre, descripcion, precio, tipo_id, image_url, tipo_combinacion])
        console.log('Plato a subir: ', plato)
        return plato;
    } catch (error) {
        console.error('Error al subir plato');
        throw new Error('Error al subir plato');
    }
}

module.exports = {
    getMenu, 
    getPlateById,
    searchPlates,
    subirPlato
};

