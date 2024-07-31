// controllers/menuController.js
const { getMenu, getPlateById} = require('../models/menuModel');

const menuController = {
  //Función para manejar la solicitud de obtener el menú
  getMenu: async (req,res) => {
    try{
      const menu = await getMenu();
      res.json(menu);
      // Envía el menú como respuesta en formato JSON
    } 
    catch (error) {
      console.error("Error al obtener el menú")
    }
  },

  getPlateById: async (req, res) => {
    try{
      const id = parseInt(req.params.id); // Obtiene el ID del parámetro de la solicitud
      if (isNaN(id)) {
        return res.status(400).send("Id inválido");
      }
      const plate = await getPlateById(id);
      if (plate) {
        // console.log -> Mensaje en terminal
        console.log(`Plato con ID ${id} encontrado`); // Mensaje informativo
        res.json(plate);
      } else {
        res.status(404).send("Plato no encontrado");
      }
    } catch (error) {
        //comilla invertida en idioma ENG debajo de ESC
        console.error(`Error en el controlador al obtener el plato con id = ${req.params.id}: `, error)
        res.status(500).send("Error al obtener plato")
    }
  }
};

module.exports = menuController;
