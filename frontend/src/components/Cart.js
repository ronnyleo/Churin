import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import axios from 'axios';
import logo2 from '../assets/logo2.png';
import '../styles/Cart.css';

const Cart = () => {
    const { cartItems, setCartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { currentUser } = useAuth();
    const [isDelivery, setIsDelivery] = useState(false);
    const [isPickup, setIsPickup] = useState(false);
    const [direcciones, setDirecciones] = useState([]);
    const [cliente, setCliente] = useState('');
    const [direccion, setDireccion] = useState('');
    const [formaPago, setFormaPago] = useState('');
    const [costoEnvio, setCostoEnvio] = useState(0);
    const [loading, setLoading] = useState(false);
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

        setLoading(true)

        const pedido = {
            id_cliente: `${cliente.id}`,
            total: totalPrice + Number(costoEnvio),
            delivery: isDelivery,
            lugar_envio: isDelivery ? direccion : '',
            id_forma_pago: formaPago
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
                const tipoPedido = isDelivery ? `para entregar en ${direccion}` : 'para retirar';

                let mensaje = `Hola, hice un pedido ${tipoPedido}.\n\n`;
                mensaje += `*Datos:*\n`;
                mensaje += `Nombres: ${cliente.first_name} ${cliente.last_name}\n`;
                mensaje += `Teléfono: ${cliente.telefono}\n\n`;
                mensaje += `*Detalle:*\n`;

                if (items.length > 0) {
                    mensaje += items.map(item => {
                        let ingredientesLista;
                        if (Array.isArray(item.ingredientes) && item.ingredientes.length > 0) {
                            ingredientesLista = item.ingredientes.map(ingrediente => `${ingrediente.nombre}`).join(', ');
                        } else {
                            ingredientesLista = 'N/A';
                        }

                        return `${item.nombre} (Cantidad: ${item.cantidad}, Precio: $${(Number(item.precio) * item.cantidad).toFixed(2)})\n` +
                            ` - Ingredientes: ${ingredientesLista}\n`;
                    }).join('\n');
                } else {
                    mensaje += 'No se encontraron detalles de pedido.';
                }

                mensaje += `\n*Subtotal:* $${(totalPrice).toFixed(2)}\n`;
                mensaje += `*Envío:* $${Number(costoEnvio).toFixed(2)}\n`;
                mensaje += `*Total:* $${(totalPrice + Number(costoEnvio)).toFixed(2)}\n\n`;
                mensaje += `Gracias!`;

                const encodedMessage = encodeURIComponent(mensaje);
                const whatsappURLMobile = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                const whatsappURLEscritorio = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

                alert('Serás redirigido a WhatsApp para completar tu pedido');

                // Verifica el dispositivo y redirige
                if (isDesktop) {
                    // Redirige a WhatsApp Web en escritorio
                    const newWindow = window.open(whatsappURLEscritorio, '_blank');
                    if (!newWindow) {
                        alert('Por favor, permite las ventanas emergentes para este sitio.');
                    }
                } else {
                    // Redirige a la app de WhatsApp en móvil
                    window.location.href = whatsappURLMobile;
                }

                clearCart();
            } else {
                alert('Error al realizar el pedido');
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un problema al enviar el pedido');
        } finally {
            setLoading(false);
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
            setLoading(true);
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

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;

    return (
        <div className="sm:p-10 flex flex-col sm:w-1/2 mx-auto gap-5">
            {cartItems.length > 0 && (
                <div className='border flex flex-col gap-5'>
                    <h3 className='px-4 py-2 text-lg font-bold bg-white'>¿Cómo quieres recibir tu pedido?</h3>
                    <div className='flex flex-col py-5 px-10 gap-5'>
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5'>
                            <div className='flex justify-center'>
                                <label className='flex gap-2'>
                                    <input
                                        className=''
                                        type="checkbox"
                                        checked={isDelivery}
                                        onChange={handleDeliveryChange}
                                    />
                                    Delivery
                                </label>
                            </div>
                            <div><span className='font-bold'>-o-</span></div>
                            <div className='flex justify-center'>
                                <label className='flex gap-2'>
                                    <input
                                        className=''
                                        type="checkbox"
                                        checked={isPickup}
                                        onChange={handlePickupChange}
                                    />
                                    Retirar
                                </label>
                            </div>
                        </div>
                        {isDelivery && (

                            <div className='flex flex-col gap-2'>
                                <label className='font-bold'>Lugar</label>
                                <select className='p-2' value={direccion} onChange={handleDireccionChange}>
                                    <option className='text-sm' value=''>Selecciona una opción</option>
                                    {direcciones.map(direccion => (
                                        <option className='text-sm' key={direccion.id} value={direccion.nombre}>
                                            {direccion.nombre} - ${direccion.costo_envio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        )}
                    </div>
                </div>)}

            <div className='border flex flex-col gap-5'>
                <h3 className='px-4 py-2 text-lg font-bold bg-white'>Detalles del pedido</h3>
                <div className='flex flex-col px-5 sm:py-5 sm:px-10 gap-5'>
                    {cartItems.length === 0 ? (
                        <div className='flex flex-col gap-5'>
                            <p className='text-center text-lg font-semibold'>Tu carrito está vacío</p>
                            <Link className="mx-auto bg-yellow-300 p-2 rounded-lg p-2 text-center w-full sm:w-1/3" to='/'>Ver menú</Link>                        </div>
                    ) : (
                        <>
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white sm:py-5 sm:px-10 px-5 shadow-md flex items-center gap-2 justify-between">
                                    <div className="flex gap-5">
                                        <img src={item.image_url} alt={item.nombre} className="w-32 h-32 object-cover" />
                                        <div className='flex flex-col justify-center'>
                                            <h3 className='font-semibold'>{item.nombre}</h3>
                                            <p>{item.cantidad} x ${item.precio} </p>

                                            {item.ingredientes && item.ingredientes.length > 0 ? (
                                                item.ingredientes.map(ingrediente => (
                                                    <li key={ingrediente.id}>{ingrediente.nombre}</li>
                                                ))
                                            ) : null}
                                            <button onClick={() => removeFromCart(item.id)} className='cart-button'>Borrar</button>
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        <p>${(item.precio * item.cantidad).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="mx-auto bg-yellow-300 p-2 rounded-lg p-2 text-center w-1/3" onClick={clearCart}>Vaciar carrito</button>

                            <div className='flex flex-col w-full gap-2'>
                                <div>
                                    <h3 className='text-lg font-bold'>Pago</h3>
                                    <div className='w-full flex justify-between'>
                                        <h3>Subtotal</h3><span className='font-bold'>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className='w-full flex justify-between'>
                                        <h3>Envío</h3><span className='font-bold'>${Number(costoEnvio).toFixed(2)}</span>
                                    </div>
                                    <div className='w-full flex justify-between'>
                                        <h3>Total a pagar</h3><span className='font-bold text-xl'>${(totalPrice + Number(costoEnvio)).toFixed(2)}</span>
                                    </div>
                                </div>
                                {currentUser ? (
                                    <div className='p-5 sm:p-0 flex flex-col gap-2 items-center'>
                                        <button className="bg-yellow-300 p-2 rounded-lg p-2 w-full sm:w-1/3" onClick={finalizarPedido}>Finalizar</button>
                                        <Link className="bg-yellow-300 p-2 rounded-lg p-2 text-center w-full sm:w-1/3" to='/'>Volver al menú</Link>
                                    </div>
                                ) : (
                                    <Link className="bg-yellow-300 p-2 rounded-lg p-2 text-center" to='/Login'>Inicia sesión para finalizar tu pedido</Link>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div >
    );
};

export default Cart;
