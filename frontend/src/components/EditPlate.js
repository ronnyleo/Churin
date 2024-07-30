import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EditPlate.css'; // Ajusta la ruta según sea necesario

const EditPlate = () => {
  const [platos, setPlatos] = useState([]);
  const [error, setError] = useState('');

  // Buscar todos los platos
  const handleFetchAllPlates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
      setPlatos(response.data);
      setError('');
    } catch (error) {
      console.error('Error al obtener el menú:', error);
      setError('Error al obtener el menú');
    }
  };

  return (
    <div className="edit-plate">
      <h2>Buscar Todos los Platos</h2>
      <button onClick={handleFetchAllPlates}>Obtener Platos</button>
      {error && <p className="error">{error}</p>}
      {platos.length > 0 && (
        <div className="plate-list">
          {platos.map((plato) => (
            <div key={plato.id} className="plate-item">
              <h3>{plato.nombre}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditPlate;
