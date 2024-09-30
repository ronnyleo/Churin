import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth
import axios from 'axios';
import '../styles/Cart.css';

const Cart = () => {
    const { cartItems, setCartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { currentUser } = useAuth(); // Usa el hook para acceder al currentUser
    const [isDelivery, setIsDelivery] = useState(false); // Estado para delivery
    const [isPickup, setIsPickup] = useState(false); // Estado para retirar
    const [direcciones, setDirecciones] = useState([]);
    const [cliente, setCliente] = useState('');
    const [direccion, setDireccion] = useState('');
    const [costoEnvio, setCostoEnvio] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const totalPrice = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

    

    const finalizarPedido = async () => {

        if (cartItems.length === 0) {
            alert('Tu carrito está vacío. No se puede realizar el pedido.');
            return; // Sal de la función si el carrito está vacío
        }
        
        const pedido = {
            cliente: cliente.first_name + ' ' + cliente.last_name, // Usar el nombre del usuario logueado
            total: totalPrice + Number(costoEnvio), // Total incluye el costo de envío
            delivery: isDelivery, // Usa el estado de delivery
            lugar_envio: isDelivery ? direccion : '', // Solo establece la dirección si es delivery
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`, pedido);
            if (response.status === 200) {
                clearCart();
                alert('Pedido realizado con éxito');
            } else {
                alert('Error al realizar el pedido');
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un problema al enviar el pedido');
        }
    };

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Recuperar el carrito desde localStorage cuando se monta el componente
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart)); // Restaurar carrito desde localStorage
        }
    }, [setCartItems]);

    useEffect(() => {
        const fetchDirecciones = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/direcciones`); // Reemplaza con tu URL
                setDirecciones(response.data); // Asume que los datos están en response.data
            } catch (error) {
                setError('Error al obtener las direcciones');
            } finally {
                setLoading(false);
            }
        };

        fetchDirecciones();
    }, []);

    // Nuevo useEffect para obtener el nombre del cliente
    useEffect(() => {
        const fetchCliente = async () => {
            if (currentUser) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
                        email: currentUser.email
                    });
                    setCliente(response.data);
                    console.log('Cliente:', cliente)
                    console.log('Cliente:', currentUser.email) // Asume que el nombre está en response.data.nombre
                } catch (error) {
                    setError('Error al obtener el cliente');
                }
            }
        };

        fetchCliente();
    }, [currentUser]);

    const handleDireccionChange = (e) => {
        const selectedDireccion = direcciones.find(d => d.nombre === e.target.value);
        setDireccion(e.target.value);
        setCostoEnvio(selectedDireccion ? selectedDireccion.costo_envio : 0); // Actualiza el costo de envío
    };
    const handleDeliveryChange = (e) => {
        const selectedDireccion = direcciones.find(d => d.nombre === e.target.value);
        setIsDelivery(e.target.checked);
        setIsPickup(false); // Desactiva la opción de retirar
        setDireccion(''); // Reinicia la dirección
        setCostoEnvio(selectedDireccion ? selectedDireccion.costo_envio : 0); // Reinicia el costo de envío
    };

    const handlePickupChange = (e) => {
        setIsPickup(e.target.checked);
        setIsDelivery(false); // Desactiva la opción de delivery
        setDireccion(''); // Reinicia la dirección
        setCostoEnvio(0); // El costo de envío es 0 para recoger
    };

    // Manejo del loading y error
    if (loading) return <p>Cargando direcciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="cart-container">
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-content">
                            <img src={item.image_url} alt={item.nombre} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.nombre}</h3>
                                <p>Precio unitario: ${item.precio}</p>
                                <p>Cantidad: {item.quantity}</p>
                                <button onClick={() => removeFromCart(item.id)} className='cart-button'>Eliminar</button>
                            </div>
                            <div className="cart-item-total">
                                <p>${(item.precio * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <button className='carrito__button' onClick={clearCart}>Vaciar Carrito</button>

            <div className='finalizar-pedido'>
                <div className='finalizar-pedido__datos'>
                    <label className='finalizar-pedido__datos-label'>Cliente: </label>
                    {currentUser ? 
                    <input
                        className='finalizar-pedido__datos-value'
                        type='text'
                        value={`${cliente.first_name} ${cliente.last_name}`}  // Mostrar el nombre del usuario logueado
                        readOnly // Evita que el usuario edite el campo
                    /> : <input
                    className='finalizar-pedido__datos-value'
                    type='text'
                    value={''}  // Mostrar el nombre del usuario logueado
                    readOnly // Evita que el usuario edite el campo
                /> 
                    }
                </div>

                <div className='finalizar-pedido__datos'>
                    <label className='finalizar-pedido__datos-label'>
                        <input
                            className='finalizar-pedido__datos-value'
                            type="checkbox"
                            checked={isDelivery}
                            onChange={handleDeliveryChange}
                        />
                        Delivery
                    </label>
                    <label className='finalizar-pedido__datos-label'>
                        <input
                            className='finalizar-pedido__datos-value'
                            type="checkbox"
                            checked={isPickup}
                            onChange={handlePickupChange}
                        />
                        Retirar
                    </label>
                </div>

                {isDelivery && (
                    <div className='finalizar-pedido__datos'>
                        <label className='finalizar-pedido__datos-label'>
                            Envío:
                        </label>
                        <select className='finalizar-pedido__datos-value' value={direccion} onChange={handleDireccionChange}>
                            <option value=''>Selecciona una opción</option>
                            {direcciones.map(direccion => (
                                <option key={direccion.id} value={direccion.nombre}>
                                    {direccion.nombre} - ${direccion.costo_envio}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <h3>Subtotal: ${totalPrice.toFixed(2)}</h3>
            <h3>Envío: ${costoEnvio}</h3>
            <h3>Total a pagar: ${(totalPrice + Number(costoEnvio)).toFixed(2)}</h3>
            {currentUser ? <button className='carrito__button' onClick={finalizarPedido}>Finalizar pedido</button>
            : <Link className='carrito__button' to='/Login'>Inicia sesión para finalizar tu pedido</Link>
            }
        </div>
    );
}

export default Cart;
