import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Cart.css';

const Cart = () => {
    const { cartItems, setCartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { currentUser } = useAuth();
    const [isDelivery, setIsDelivery] = useState(false);
    const [isPickup, setIsPickup] = useState(false);
    const [direcciones, setDirecciones] = useState([]);
    const [cliente, setCliente] = useState('');
    const [direccion, setDireccion] = useState('');
    const [costoEnvio, setCostoEnvio] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMobileDevice = () => {
        return /Mobi|Android/i.test(navigator.userAgent);
      };
    const totalPrice = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

    const finalizarPedido = async () => {
        if (cartItems.length === 0) {
            alert('Debe tener al menos un producto en el carrito');
            return;
        }

        if (!isDelivery && !isPickup) {
            alert('Debe seleccionar una forma de entrega');
            return;
        }

        if (isDelivery && !direccion) {
            alert('Debe seleccionar un lugar de envío');
            return;
        }

        const pedido = {
            cliente: `${cliente.first_name} ${cliente.last_name}`,
            total: totalPrice + Number(costoEnvio),
            delivery: isDelivery,
            lugar_envio: isDelivery ? direccion : '',
        };

        console.log('Pedido a enviar:', pedido);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`, pedido);
            console.log('Respuesta de la API al crear el pedido:', response);
            if (response.status === 201) {
                const idPedido = response.data.pedido.id;

                // Envía los detalles del pedido
                await enviarDetallesPedido(idPedido);


                const detallePedido = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalle-pedido/${idPedido}`);
                console.log('detalle: ', detallePedido.data);

               
                const phoneNumber = '593996995441'; // Reemplaza con el número deseado
                const message = 'Hola, me interesa su producto'; // Mensaje predeterminado
            
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.location.href = whatsappURL; // Redirige a la URL de WhatsApp


                //clearCart();
            } else {
                alert('Error al realizar el pedido');
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un problema al enviar el pedido');
        }
    };

    const enviarDetallesPedido = async (idPedido) => {
        const detallesPedido = cartItems.map(item => ({
            menu_id: item.id,
            cantidad: item.cantidad,
            precio: item.precio * item.cantidad,
            ingredientes: item.ingredientes,
        }));

        for (const detalle of detallesPedido) {
            try {
                console.log('Enviado detalles:', detalle);
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalle-pedido`, {
                    pedido_id: idPedido,
                    ...detalle,
                });
            } catch (error) {
                console.error('Error al enviar el detalle del pedido:', error);
                alert('Hubo un problema al enviar los detalles del pedido');
            }
        }
    };

    const enviarPedidoWhatsApp = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalle-pedido/`);
        const items = response.data || [];

        let mensaje = `Hola, soy ${cliente.first_name} ${cliente.last_name}. Hice el siguiente pedido `;

        if (isDelivery) {
            mensaje += `para entregar en ${direccion}.\n\n`;
        } else {
            mensaje += `para retirar.\n\n`;
        }

        if (items.length > 0) {
            mensaje += items.map(item => {
                let ingredientesLista = 'N/A';
                if (Array.isArray(item.ingredientes) && item.ingredientes.length > 0) {
                    ingredientesLista = item.ingredientes.map(ingrediente => ingrediente.nombre).join(', ');
                }

                return `${item.nombre} (Cantidad: ${item.cantidad}, Precio: $${(item.precio * item.cantidad).toFixed(2)})\n` +
                    ` - Ingredientes: ${ingredientesLista}\n`;
            }).join('\n');
        }

        mensaje += `\nEl total es de $${(totalPrice + Number(costoEnvio)).toFixed(2)}. Gracias!`;

        const mensajeCodificado = encodeURIComponent(mensaje);
        const numeroWhatsApp = '593996995441';
        const isMobile = isMobileDevice();

        const enlaceWhatsApp = isMobile
            ? `whatsapp://send?phone=${numeroWhatsApp}&text=${mensajeCodificado}` // Para móviles
            : `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`; // Para computadoras

        window.open(enlaceWhatsApp, '_blank');
    };


    useEffect(() => {
        if (cartItems.length > 0) {
            console.log('Último valor de cartItems:', cartItems);
        }
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [setCartItems]);

    useEffect(() => {
        const fetchDirecciones = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/direcciones`);
                setDirecciones(response.data);
            } catch (error) {
                setError('Error al obtener las direcciones');
            } finally {
                setLoading(false);
            }
        };

        fetchDirecciones();
    }, []);

    useEffect(() => {
        const fetchCliente = async () => {
            if (currentUser) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
                        email: currentUser.email
                    });
                    setCliente(response.data);
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
        setCostoEnvio(selectedDireccion ? selectedDireccion.costo_envio : 0);
    };

    const handleDeliveryChange = (e) => {
        const selectedDireccion = direcciones.find(d => d.nombre === e.target.value);
        setIsDelivery(e.target.checked);
        setIsPickup(false);
        setDireccion('');
        setCostoEnvio(selectedDireccion ? selectedDireccion.costo_envio : 0);
    };

    const handlePickupChange = (e) => {
        setIsPickup(e.target.checked);
        setIsDelivery(false);
        setDireccion('');
        setCostoEnvio(0);
    };

    if (loading) return <p>Cargando...</p>;
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
                                <p>Cantidad: {item.cantidad}</p>
                                {item.ingredientes && item.ingredientes.length > 0 ? (
                                    item.ingredientes.map(ingrediente => (
                                        <li key={ingrediente.id}>{ingrediente.nombre}</li>
                                    ))
                                ) : null}
                                <button onClick={() => removeFromCart(item.id)} className='cart-button'>Eliminar</button>
                            </div>
                            <div className="cart-item-total">
                                <p>${(item.precio * item.cantidad).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <button className='carrito__button' onClick={clearCart}>Vaciar Carrito</button>

            <div className='finalizar-pedido'>
                <div className='finalizar-pedido__datos'>
                    <label className='finalizar-pedido__datos-label'>Cliente: </label>
                    <input
                        className='finalizar-pedido__datos-value'
                        type='text'
                        value={currentUser ? `${cliente.first_name} ${cliente.last_name}` : ''}
                        readOnly
                    />
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
                        <label className='finalizar-pedido__datos-label'>Envío:</label>
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
            {currentUser ?
                <>
                    <button className='carrito__button' onClick={finalizarPedido}>Finalizar pedido</button>
                    <Link className='carrito__button' to='/'>Volver al menú</Link></>
                :
                <Link className='carrito__button' to='/Login'>Inicia sesión para finalizar tu pedido</Link>
            }
        </div>
    );
};

export default Cart;
