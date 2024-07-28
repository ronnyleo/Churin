// src/components/NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'

const Navbar = () => {

    return (
        <nav className='navbar-container'>
            <ul className='navbar'> 
                <li>
                    <Link to='/'>Inicio</Link>
                </li>
                <li>
                    <Link to='/Admin'>Admin</Link>
                </li>
            </ul>
        </nav>

    );

};

export default Navbar;