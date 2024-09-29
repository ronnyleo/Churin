import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import '../styles/Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
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
        const pedido = {
            cliente: cliente,
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
                                <p>${item.precio * item.quantity}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <button onClick={clearCart}>Vaciar Carrito</button>

            <div className='finalizar-pedido'>
                <div className='finalizar-pedido__cliente'>
                    <label>Cliente: </label>
                    <input
                        type='text'
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        placeholder='Ingresa tu nombre y apellido'
                        required
                    />
                </div>

                <div className='finalizar-pedido__opciones'>
                    <label>
                        <input
                            type="checkbox"
                            checked={isDelivery}
                            onChange={handleDeliveryChange}
                        />
                        Delivery
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isPickup}
                            onChange={handlePickupChange}
                        />
                        Retirar
                    </label>
                </div>

                {isDelivery && (
                    <div className='finalizar-pedido__direccion'>
                        <label>Envío:</label>
                        <select value={direccion} onChange={handleDireccionChange}>
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
            <h3>Subtotal: ${totalPrice}</h3>
            <h3>Envío: ${costoEnvio}</h3>
            <h3>Total a pagar: ${totalPrice + Number(costoEnvio)}</h3>
            <button onClick={finalizarPedido}>Finalizar pedido</button>
        </div>
    );
}

export default Cart;
