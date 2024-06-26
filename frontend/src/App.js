import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Función para hacer la solicitud GET al backend cuando el componente se monta
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/menu');
        setMenuItems(response.data); // Actualiza el estado con los datos recibidos
      } catch (error) {
        console.error('Error al obtener el menú:', error);
      }
    };

    // Llama a la función para hacer la solicitud al backend
    fetchMenu();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  return (
    <div>
      <h1>Menú del Restaurante</h1>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>{item.nombre} - {item.descripcion}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
