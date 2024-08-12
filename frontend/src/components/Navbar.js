import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.jpg'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth

const Navbar = () => {
    const { currentUser, logout } = useAuth(); // Usa el hook useAuth para acceder a la autenticación

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
                    {currentUser ? (
                        <>
                            <li>
                                <Link to='/Admin'>
                                    <FontAwesomeIcon icon={faUser} size="lg" /> {/* Icono de Font Awesome */}
                                </Link>
                            </li>
                            <li>
                                <button onClick={logout}>Salir</button>
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
