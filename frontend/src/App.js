import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuList from './components/MenuList'; // Ajusta la ruta según la ubicación de MenuList
import AdminUpload from './components/AdminUpload'; // Importar el componente AdminUpload


const App = () => {
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminUpload />} /> {/* Ruta para administración */}
          <Route path="/" element={<MenuList />} /> {/* Ruta pública */}
        </Routes>
        </div>       
    </Router>
  );
};

export default App;
