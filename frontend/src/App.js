import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register'
import MenuList from './components/MenuList'; // Ajusta la ruta según la ubicación de MenuList
import AdminUpload from './components/AdminUpload'; // Importar el componente AdminUpload
import Cart from './components/Cart';
import Login from './components/Login';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<MenuList />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<AdminUpload />} />
          <Route path='/cart' element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
