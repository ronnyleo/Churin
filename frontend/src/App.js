import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "shared/ui/Navbar";
import MenuList from "features/menu/pages/MenuPage"; // Ajusta la ruta según la ubicación de MenuList
import AdminUpload from "features/admin/components/AdminUpload"; // Importar el componente AdminUpload
import Cart from "features/cart/pages/Cart";
import Login from "features/auth/pages/Login";
import Profile from "features/account/pages/ProfilePage";
import AdminLayout from "features/admin/components/AdminLayout";
import OrdersPage from "features/admin/pages/AdminOrdersPage";
import MenuPage from 'features/admin/pages/AdminMenuPage'
import AdminOverviewPage from "features/admin/pages/AdminOverviewPage";
import { AuthProvider, useAuth } from "app/context/AuthContext"; // Asegúrate de importar el AuthProvider

const App = () => {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null,
  ); // Inicializa con el valor de localStorage si existe

  // Función para actualizar el rol del usuario y guardarlo en localStorage
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role); // Guarda el rol en localStorage
  };

  // Efecto para comprobar si el rol está almacenado en localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
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
            <Route path="/" element={<MenuList />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Mostrar AdminUpload solo si el usuario es admin */}
            {userRole === "admin" && (
              <Route path="/admin" element={<AdminUpload />} />
            )}
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-dashboard" element={<AdminLayout />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="menu" element={<MenuPage />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
