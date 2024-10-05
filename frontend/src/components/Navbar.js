import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.jpg'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth

const Navbar = () => {
    const { currentUser, logout } = useAuth(); // Usa el hook useAuth para acceder a la autenticación
    const navigate = useNavigate(); 
    const userRole = localStorage.getItem('userRole'); // Obtén el rol del usuario desde el localStorage

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('userRole'); // Elimina el rol del usuario del localStorage
            navigate('/'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <nav className='navbar-container'>
            <div className='navbar-logo-container'>
                <img src={logo} alt='logo'></img>
            </div>
            <div className='navbar-links'>
                <ul> 
                    <li>
                        <Link to='/'>Inicio</Link>
                    </li>
                    {currentUser && userRole === 'admin' && ( // Solo muestra si el usuario es administrador
                        <li>
                            <Link to='/admin'>Administrador</Link>
                        </li>
                    )}
                    {currentUser ? (
                        <>
                            <li>
                                <button onClick={handleLogout}>Salir</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to='/Login'>Ingresar</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/Cart">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
