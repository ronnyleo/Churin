// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Carga inicial desde localStorage si existe, de lo contrario usa un array vacío
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guarda los cambios en localStorage cada vez que se actualiza el carrito
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Verifica si ya existe un plato con la misma ID y combinación de ingredientes
      const existingItem = prevItems.find(cartItem =>
        cartItem.id === item.id && 
        JSON.stringify(cartItem.ingredientes) === JSON.stringify(item.ingredientes) // Compara las combinaciones de ingredientes
      );

      if (existingItem) {
        // Si el plato con la misma combinación ya existe, actualiza la cantidad
        return prevItems.map(cartItem =>
          cartItem.id === existingItem.id ? { ...cartItem, cantidad: cartItem.cantidad + 1 } : cartItem
        );
      } else {
        // Si no existe, agrega el nuevo plato al carrito
        return [...prevItems, { ...item, cantidad: 1 }];
      }
    });
    alert('Producto agregado');
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter(item => item.id !== itemId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); // Limpia el carrito también del localStorage
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
