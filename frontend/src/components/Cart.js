// Cart.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const totalPrice = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
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
            <h3>Subtotal: </h3>
            <h3>Envio: </h3>
            <h3>Total a pagar: ${totalPrice}</h3>
            <button>Finalizar pedido</button>
        </div>
    );
}

export default Cart;
