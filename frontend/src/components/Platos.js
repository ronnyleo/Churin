import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Platos.css'; // Ajusta la ruta según sea necesario

const Platos = () => {
  const [platos, setPlatos] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [editingPlato, setEditingPlato] = useState(null); // Almacena el plato que se está editando
  const [updatedPlato, setUpdatedPlato] = useState({ nombre: '', descripcion: '', precio: '' });

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

  const handleEditClick = (plato) => {
    setEditingPlato(plato);
    setUpdatedPlato({ nombre: plato.nombre, descripcion: plato.descripcion, precio: plato.precio });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlato({ ...updatedPlato, [name]: value });
  };

  const handleUpdatePlato = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/platos/${editingPlato.id}`, updatedPlato);
      setPlatos(platos.map(plato => (plato.id === editingPlato.id ? { ...plato, ...updatedPlato } : plato)));
      setEditingPlato(null); // Cierra el formulario de edición
      setError('');
    } catch (error) {
      console.error('Error al actualizar el plato:', error);
      setError('Error al actualizar el plato');
    }
  };

  return (
    <div className="edit-plate-container">
      <h2>Buscar</h2>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platos.map((plato) => (
                <tr key={plato.id}>
                  <td>{plato.nombre}</td>
                  <td>{plato.descripcion}</td>
                  <td>${plato.precio}</td>
                  <td>
                    <button onClick={() => handleEditClick(plato)} className="edit-button">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          isSearched && <p className="no-results-message">No se encontraron platos.</p>
        )}
      </div>

      {/* Formulario de edición */}
      {editingPlato && (
        <div className="edit-form">
          <h3>Editando {editingPlato.nombre}</h3>
          <input
            type="text"
            name="nombre"
            value={updatedPlato.nombre}
            onChange={handleInputChange}
            placeholder="Nombre del plato"
          />
          <input
            type="text"
            name="descripcion"
            value={updatedPlato.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción"
          />
          <input
            type="number"
            name="precio"
            value={updatedPlato.precio}
            onChange={handleInputChange}
            placeholder="Precio"
          />
          <button onClick={handleUpdatePlato} className="update-button">Guardar cambios</button>
          <button onClick={() => setEditingPlato(null)} className="cancel-button">Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default Platos;
