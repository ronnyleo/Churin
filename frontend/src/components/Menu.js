import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Función para obtener el menú desde el backend
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        setMenuItems(response.data); // Actualiza el estado con los datos del menú
      } catch (error) {
        console.error('Error al obtener el menú:', error);
      }
    };

    // Llama a la función para obtener el menú al cargar el componente
    fetchMenu();
  }, []); // El segundo argumento [] asegura que useEffect solo se ejecute una vez al montar el componente

  return (
    <div>
      <h2>Menú del Restaurante</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>{item.nombre} - {item.descripcion}</li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
