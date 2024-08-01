import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EditPlate.css'; // Ajusta la ruta según sea necesario

const EditPlate = () => {
  const [platos, setPlatos] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setPlatos([]);
      setIsSearched(false);
      return;
    }
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search?term=${searchTerm}`);
      setPlatos(response.data);
      setError('');
      setIsSearched(true);
    } catch (error) {
      console.error('Error al buscar:', error);
      setError('Error al buscar platos');
      setIsSearched(true);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="edit-plate-container">
      <h2>Editar</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Buscar plato..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Buscar</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="plate-list">
        {platos.length > 0 ? (
          <table className="plate-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                {/* Agrega más encabezados según los datos que quieras mostrar */}
              </tr>
            </thead>
            <tbody>
              {platos.map((plato) => (
                <tr key={plato.id}>
                  <td>{plato.nombre}</td>
                  <td>{plato.descripcion}</td>
                  <td>${plato.precio}</td>
                  {/* Agrega más celdas según los datos que quieras mostrar */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          isSearched && <p className="no-results-message">No se encontraron platos.</p>
        )}
      </div>
    </div>
  );
};

export default EditPlate;
