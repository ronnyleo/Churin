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
            id_cliente: `${cliente.id}`,
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

                // Verifica si detallePedido.data es null o un array
                let items = [];
                if (Array.isArray(detallePedido.data)) {
                    items = detallePedido.data; // Si es un array, lo usamos directamente
                } else if (detallePedido.data === null) {
                    console.error('Error: La respuesta de la API es null');
                } else {
                    console.error('Error: La respuesta de la API no es un array');
                }
                const isDesktop = /Mobi|Android/i.test(navigator.userAgent) === false;
                const phoneNumber = '593996153861'; // Reemplaza con el número deseado
                // Usamos una variable para el tipo de entrega
                const tipoPedido = isDelivery ? `para entregar en ${direccion}` : 'para retirar';

                let mensaje = `Hola, hice un pedido ${tipoPedido}.\n\n`;
                mensaje += `*Datos:*\n`;
                mensaje += `Nombres: ${cliente.first_name} ${cliente.last_name}\n`;
                mensaje += `Teléfono: ${cliente.telefono}\n\n`;
                mensaje += `*Detalle:*\n`;


                if (items.length > 0) {
                    mensaje += items.map(item => {
                        // Manejo de ingredientes
                        let ingredientesLista;
                        if (Array.isArray(item.ingredientes) && item.ingredientes.length > 0) {
                            // Si es un array y tiene elementos, los mapeamos
                            ingredientesLista = item.ingredientes.map(ingrediente => `${ingrediente.nombre}`).join(', ');
                        } else if (item.ingredientes === null) {
                            // Si ingredientes es null
                            ingredientesLista = 'N/A';
                        } else {
                            // Si es un array vacío
                            ingredientesLista = 'N/A';
                        }

                        return `${item.nombre} (Cantidad: ${item.cantidad}, Precio: $${(Number(item.precio) * item.cantidad).toFixed(2)})\n` +
                            ` - Ingredientes: ${ingredientesLista}\n`;
                    }).join('\n');
                } else {
                    mensaje += 'No se encontraron detalles de pedido.';
                }

                mensaje += `\n*Subtotal:* $${(totalPrice).toFixed(2)}\n`;
                mensaje += `*Envío:* $${Number(costoEnvio).toFixed(2)}\n`
                mensaje += `*Total:*  $${(totalPrice + Number(costoEnvio)).toFixed(2)}\n\n`
                mensaje += `Gracias!`;


                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;
                alert('Serás redirigido a Whatsapp para completar tu pedido');

                if (isDesktop) {
                    // Usar window.open si está en escritorio
                    const newWindow = window.open(whatsappURL, '_blank');

                    // Verifica si se bloqueó la ventana emergente
                    if (!newWindow) {
                        alert('Por favor, permite las ventanas emergentes para este sitio.');
                    }
                } else {
                    // Usar window.location.href si está en móvil
                    window.location.href = whatsappURL;
                }

                clearCart();
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
        <div className="p-10 flex flex-col w-1/2 mx-auto gap-2">
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío</p>
            ) : (

                cartItems.map(item => (
                    <div key={item.id} className="bg-white p-5 my-5 rounded-lg">
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
            <button className="bg-yellow-300 p-2 rounded-lg p-2 text-center w-1/3" onClick={clearCart}>Vaciar Carrito</button>

            <div className='finalizar-pedido'>
                <div className='flex flex-col'>
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
                    <div className='flex flex-col'>
                        <label className='finalizar-pedido__datos-label'>Lugar:</label>
                        <select className='p-2' value={direccion} onChange={handleDireccionChange}>
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
            <div className='flex flex-col w-full my-5 gap-2'>
                <div className='w-full flex justify-between'>
                    <h3>Subtotal</h3><span className='font-bold'>${totalPrice.toFixed(2)}</span>
                </div>
                <div className='w-full flex justify-between'>
                    <h3>Envío</h3><span className='font-bold'>${costoEnvio}</span>
                </div>
                <div className='w-full flex justify-between'>
                    <h3>Total a pagar</h3><span className='font-bold'>${(totalPrice + Number(costoEnvio)).toFixed(2)}</span>
                </div>
            </div>
            {currentUser ?
                <div className='flex flex-col gap-2 items-center'>
                    <button className="bg-yellow-300 p-2 rounded-lg p-2 w-1/3" onClick={finalizarPedido}>Finalizar pedido</button>
                    <Link className="bg-yellow-300 p-2 rounded-lg p-2 text-center w-1/3" to='/'>Volver al menú</Link>
                </div>
                :
                <Link className="bg-yellow-300 p-2 rounded-lg p-2 text-center" to='/Login'>Inicia sesión para finalizar tu pedido</Link>
            }
        </div>
    );
};

export default Cart;
