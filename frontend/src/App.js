import React, { useState, useEffect } from 'react';
import MenuList from './components/MenuList'; // Ajusta la ruta según la ubicación de MenuList
import axios from 'axios';

const App = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Función para hacer la solicitud GET al backend cuando el componente se monta
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        setMenuItems(response.data); // Actualiza el estado con los datos recibidos
      } catch (error) {
        console.error('Error al obtener el menú:', error);
      }
    };

    // Llama a la función para hacer la solicitud al backend
    fetchMenu();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  return (
    <div className="App">
      <header className="App-header">
        <h1>Churin Churin</h1>
      </header>
      <main>
        <MenuList />
      </main>
    </div>
  );
};

export default App;
