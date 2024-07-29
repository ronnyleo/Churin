import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MenuList.css'; // Asegúrate de que el archivo CSS esté en la misma carpeta o ajusta la ruta según sea necesario
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener el menú desde el backend
    async function fetchMenu() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        setMenuItems(response.data); // Actualiza el estado con los datos del menú
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        setError('Hubo un problema al obtener el menú. Por favor, espera 1 minuto e intenta nuevamente.');
      }
    }

    // Llama a la función para obtener el menú al cargar el componente
    fetchMenu();
  }, []); // El segundo argumento [] asegura que useEffect solo se ejecute una vez al montar el componente

  return (
    <div className="menu-list">
      <h2>Realiza tu pedido</h2>
      {error && <p>{error}</p>}
      <ul>
        {menuItems.map(item => (
          <li key={item.id} className="menu-item">
            <h3>{item.nombre}</h3> 
            <img src={item.image_url} alt={item.nombre} className="menu-item-image" />
            <p>{item.descripcion}</p>
            <span className="menu-item-price">${item.precio}</span>
            <button>Agregar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuList;
