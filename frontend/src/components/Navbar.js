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

            <ul className="text-sm sm:text-lg flex w-2/3 sm:w-1/2 h-full justify-between">
                <li className="flex-1 flex items-center justify-center text-center hover:bg-yellow-300 hover:font-bold">
                    <Link to="/" className="w-full h-full flex items-center justify-center">
                        Inicio
                    </Link>
                </li>
                {currentUser && userRole === "admin" && (
                    <li className="flex-1 flex items-center justify-center text-center hover:bg-yellow-300 hover:font-bold">
                        <Link to="/admin" className="w-full h-full flex items-center justify-center">
                            Administrador
                        </Link>
                    </li>
                )}
                <li className="flex-1 flex items-center justify-center text-center hover:bg-yellow-300 hover:font-bold">
                    <Link to="/Cart" className="w-full h-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                </li>
                {currentUser ? (
                    <>
                        <li className="flex-1 flex items-center justify-center text-center hover:bg-yellow-300 hover:font-bold">
                            <Link to="/perfil" className="w-full h-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} />
                            </Link>
                        </li>
                        <li className="flex-1 flex items-center justify-center text-center hover:bg-yellow-300 hover:font-bold">
                            <button
                                onClick={handleLogout}
                                className="w-full h-full flex items-center justify-center"
                            >
                                Salir
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="flex-1 flex items-center justify-center text-center hover:bg-yellow-300 hover:font-bold">
                        <Link to="/Login" className="w-full h-full flex items-center justify-center">
                            Ingresar
                        </Link>
                    </li>
                )}
            </ul>


        </nav>
    );
};

export default Navbar;
