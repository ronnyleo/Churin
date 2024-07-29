import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material'; // Asegúrate de que MUI esté instalado
import '../styles/AdminUpload.css';

function AdminUpload() {
  const [authenticated, setAuthenticated] = useState(true);
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tipos`);
        console.log('Datos obtenidos:', response.data);
        if (Array.isArray(response.data)) {
          setTipos(response.data);
        } else {
          console.error('Los datos obtenidos no son un array:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener los tipos:', error);
      }
    };

    fetchTipos();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', nombre);
      formData.append('description', descripcion);
      formData.append('price', precio);
      formData.append('type', tipo);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImageUrl(response.data.imageUrl);
      console.log('Imagen subida correctamente:', response.data.imageUrl);

    } catch (error) {
      console.error('Error al subir plato:', error);
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
          <input
            type="text"
            id="nombre"
            value={nombre}
            placeholder='Nombre del plato'
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            placeholder='Descripción del plato'
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            placeholder='0.00'
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            step='0.01' // Permite decimales
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="tipo">Tipo de plato:</label>
          <Autocomplete
            options={tipos} // `tipos` debería ser un array de objetos con { id, nombre }
            getOptionLabel={(option) => option.nombre} // Nombre para mostrar
            onChange={(event, newValue) => setTipo(newValue ? newValue.id : '')} // Establece el ID del tipo
            renderInput={(params) => <TextField {...params} label="Tipo de plato" />}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="image">Seleccionar foto:</label>
          <input
            type="file"
            id='image'
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Subir plato</button>
      </form>
      {imageUrl && (
        <div>
          <h3>Imagen subida:</h3>
          <img src={imageUrl} alt="Imagen subida" className='form-img'/>
          <p>Plato subido correctamente</p>
        </div>
      )}
    </div>
  );
}

export default AdminUpload;
