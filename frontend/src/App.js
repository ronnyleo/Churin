import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuList from './components/MenuList'; // Ajusta la ruta según la ubicación de MenuList
import AdminUpload from './components/AdminUpload'; // Importar el componente AdminUpload
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

    fetchMenu();
  }, []); 

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>ChurinChurin Funflais</h1>
        </header>
        <Routes>
          <Route path="/admin" element={<AdminUpload />} /> {/* Ruta para administración */}
          <Route path="/" element={<MenuList menuItems={menuItems} />} /> {/* Ruta pública */}
        </Routes>
        </div>       
    </Router>
  );
};

export default App;
