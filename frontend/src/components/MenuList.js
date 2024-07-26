import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles//MenuList.css'; // Asegúrate de que el archivo CSS esté en la misma carpeta o ajusta la ruta según sea necesario

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Función para obtener el menú desde el backend
    async function fetchMenu() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        setMenuItems(response.data); // Actualiza el estado con los datos del menú
      } catch (error) {
        console.error('Error al obtener el menú:', error);
      }
    }

    // Llama a la función para obtener el menú al cargar el componente
    fetchMenu();
  }, []); // El segundo argumento [] asegura que useEffect solo se ejecute una vez al montar el componente

  return (
    <div className="menu-list">
      <Link to='/admin'>
        <button>Admin</button>
      </Link>
      <h2>Realiza tu pedido</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id} className="menu-item">
            <strong>{item.nombre}</strong> 
            ${item.precio}
            <img src={item.image_url} alt={item.nombre} className="menu-item-image" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuList;
