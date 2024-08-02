import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register'
import MenuList from './components/MenuList'; // Ajusta la ruta según la ubicación de MenuList
import AdminUpload from './components/AdminUpload'; // Importar el componente AdminUpload
import Login from './components/Login';

const App = () => {
  
  return (
    <Router>
      <div className="App">
        <Navbar />
          <Register />
          <Login />
        </div>       
    </Router>
  );
};

export default App;
