// AdminUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminUpload.css';


function AdminUpload() {
  const [authenticated, setAuthenticated] = useState(true);
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('');
  const [imageUrl, setImageUrl] = useState('');


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Crear instancia de FormData para enviar archivo
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', nombre);
      formData.append('description', descripcion);
      formData.append('price', precio);
      formData.append('type', tipo);

      // Enviar archivo y datos al backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      // Obtener la URL de la imagen subida desde la respuesta
      setImageUrl(response.data.imageUrl);
      console.log('Imagen subida correctamente:', response.data.imageUrl);

      // Realizar otras acciones según sea necesario, como guardar en base de datos

    } catch (error) {
      console.error('Error al subir plato:', error);
      // Manejar errores, como mostrar un mensaje al usuario
    }

  };


  if (!authenticated) {
    return <h2>No tienes permiso para acceder a esta página.</h2>;
  }

  return (
    <div className='form-admin'>
      <h2>Subir plato al menú: </h2>
      <form onSubmit={handleSubmit} className='form-plato'>
        <div className='form-group'>
          <label htmlFor="nombre">Nombre:</label>
          {newFunction()}
        </div>
        <div className='form-group'>
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="tipo">Tipo de plato:</label>
          <input
            type="text"
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="image">Seleccionar foto:</label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Subir imagen</button>
      </form>
      {imageUrl && (
        <div>
          <h3>Imagen subida:</h3>
          <img src={imageUrl} alt="Imagen subida" />
           <p>Plato subido correctamente</p>
        </div>
      )}
    </div>
    
  );

  function newFunction() {
    return <input
      type="text"
      id="nombre"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      required />;
  }
};

export default AdminUpload;
