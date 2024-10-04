import React, { useState } from 'react';
import axios from 'axios';

function UploadPlate() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [tipoCombinacion, setTipoCombinacion] = useState('');
  const [imagen, setImagen] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Aquí simplemente envías un objeto con los datos
    const plateData = {
      nombre,
      descripcion,
      precio,
      tipo_id: tipoId, 
      image_url: 'url de prueba',// Usa tipo_id como string si es necesario
      tipo_combinacion: tipoCombinacion
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/menu/plato`, plateData, {
        headers: {
          'Content-Type': 'application/json' // Cambiado a 'application/json'
        }
      });
      console.log('Plato subido con éxito:', response.data);
    } catch (error) {
      console.error('Error al subir el plato:', error.response.data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>
        <input
          type='text'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} 
          required
        />
      </div>
      <div>
        <label>Descripción</label>
        <input
          type='text'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} 
          required
        />
      </div>
      <div>
        <label>Precio</label>
        <input
          type='number'
          value={precio}
          onChange={(e) => setPrecio(e.target.value)} 
          required
        />
      </div>
      <div>
        <label>Tipo</label>
        <input
          type='number'
          value={tipoId}
          onChange={(e) => setTipoId(e.target.value)} 
          required
        />
      </div>
      <div>
        <label>Personalización de ingredientes</label>
        <input
          type='number'
          value={tipoCombinacion}
          onChange={(e) => setTipoCombinacion(e.target.value)} 
          required
        />
      </div>
      <button type='submit'>Subir Plato</button>
    </form>
  );
}

export default UploadPlate;
