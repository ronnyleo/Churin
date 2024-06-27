// AdminUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function AdminUpload() {
    const [authenticated, setAuthenticated] = useState(true); 
    const [file, setFile] = useState(null);
    const [nombre, setNombre] = useState('');
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

      // Enviar archivo al backend para subir a Cloudinary
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
      console.error('Error al subir la imagen:', error);
      // Manejar errores, como mostrar un mensaje al usuario
    }
  };

 

  if (!authenticated) {
    return <h2>No tienes permiso para acceder a esta página.</h2>;
  }

  return (
    <div>
      <h2>Subir Imagen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Seleccionar Imagen:</label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Subir Imagen</button>
      </form>
      {imageUrl && (
        <div>
          <h3>Imagen Subida:</h3>
          <img src={imageUrl} alt="Imagen subida" />
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
