// src/components/UploadPlate.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import '../styles/CargarPlato.css';

const UploadPlate = ({ tipos, onImageUrlChange }) => {
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('');

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

      onImageUrlChange(response.data.imageUrl);
    } catch (error) {
      console.error('Error al subir plato:', error);
    }
  };

  return (
    <div className='upload-tab'>
      <h2>Subir plato al menú:</h2>
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
            step='0.01'
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="tipo">Tipo de plato:</label>
          <Autocomplete
            options={tipos}
            getOptionLabel={(option) => option.nombre}
            onChange={(event, newValue) => setTipo(newValue ? newValue.id : '')}
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
        <button type="submit" className='form-group__button'>Subir plato</button>
      </form>
    </div>
  );
};

export default UploadPlate;
