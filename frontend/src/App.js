import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register'
import MenuList from './components/MenuList'; // Ajusta la ruta según la ubicación de MenuList
import AdminUpload from './components/AdminUpload'; // Importar el componente AdminUpload
import Cart from './components/Cart';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext'; // Asegúrate de importar el AuthProvider

const App = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null); // Inicializa con el valor de localStorage si existe

  // Función para actualizar el rol del usuario y guardarlo en localStorage
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role); // Guarda el rol en localStorage
  };

  // Efecto para comprobar si el rol está almacenado en localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <AuthProvider>

    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<MenuList />} />
          <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
          
          {/* Mostrar AdminUpload solo si el usuario es admin */}
          {userRole === 'admin' && (
            <Route path='/admin' element={<AdminUpload />} />
          )}

          <Route path='/cart' element={<Cart />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>

  );
};

export default App;
