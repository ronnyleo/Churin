import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../app/context/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/context/AuthContext";
import Loading from "../../../shared/ui/Loading";
import axios from "axios";
import "../../../shared/styles/Cart.css";

const API_BASE = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

const DEFAULT_OPERATION_SETTINGS = {
  acceptOrders: true,
  freeDelivery: false,
  notifyTelegram: true,
  highlightDelivery: true,
};

const Cart = () => {
  const { cartItems, setCartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { currentUser } = useAuth();
  const [isDelivery, setIsDelivery] = useState(false);
  const [isPickup, setIsPickup] = useState(false);
  const [direcciones, setDirecciones] = useState([]);
  const [cliente, setCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [formaPago] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [operationSettings, setOperationSettings] = useState(DEFAULT_OPERATION_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  );
  const effectiveShippingCost = isDelivery && operationSettings.freeDelivery ? 0 : Number(costoEnvio);
  const totalToPay = totalPrice + effectiveShippingCost;

  const finalizarPedido = async () => {
    if (!operationSettings.acceptOrders) {
      alert("El restaurante no está aceptando pedidos en este momento");
      return;
    }

    if (cartItems.length === 0) {
      alert("Debe tener al menos un producto en el carrito");
      return;
    }

    if (!isDelivery && !isPickup) {
      alert("Debe seleccionar una forma de entrega");
      return;
    }

    if (isDelivery && !direccion) {
      alert("Debe seleccionar un lugar de envío");
      return;
    }

    setLoading(true);

    const pedido = {
      id_cliente: `${cliente.id}`,
      total: totalToPay,
      delivery: isDelivery,
      lugar_envio: isDelivery ? direccion : "",
      id_forma_pago: formaPago,
    };

    try {
      const response = await axios.post(`${API_BASE}/api/pedido`, pedido);
      if (response.status === 201) {
        const idPedido = response.data.pedido.id;
        await enviarDetallesPedido(idPedido);

        const detallePedido = await axios.get(`${API_BASE}/api/pedido/detalle-pedido/${idPedido}`);
        const items = Array.isArray(detallePedido.data) ? detallePedido.data : [];
        const isDesktop = /Mobi|Android/i.test(navigator.userAgent) === false;
        const phoneNumber = "593996153861";
        const tipoPedido = isDelivery ? `para entregar en ${direccion}` : "para retirar";

        let mensaje = `Hola, hice un pedido ${tipoPedido}.\n\n`;
        mensaje += `*Datos:*\n`;
        mensaje += `Nombres: ${cliente.first_name} ${cliente.last_name}\n`;
        mensaje += `Teléfono: ${cliente.telefono}\n\n`;
        mensaje += `*Detalle:*\n`;

        if (items.length > 0) {
          mensaje += items
            .map((item) => {
              const ingredientesLista = Array.isArray(item.ingredientes) && item.ingredientes.length > 0
                ? item.ingredientes.map((ingrediente) => ingrediente.nombre).join(", ")
                : "N/A";

              return (
                `${item.nombre} (Cantidad: ${item.cantidad}, Precio: $${(Number(item.precio) * item.cantidad).toFixed(2)})\n` +
                ` - Ingredientes: ${ingredientesLista}\n`
              );
            })
            .join("\n");
        } else {
          mensaje += "No se encontraron detalles de pedido.";
        }

        mensaje += `\n*Subtotal:* $${totalPrice.toFixed(2)}\n`;
        mensaje += `*Envío:* $${effectiveShippingCost.toFixed(2)}\n`;
        mensaje += `*Total:* $${totalToPay.toFixed(2)}\n\n`;
        mensaje += `¡Gracias!`;

        const encodedMessage = encodeURIComponent(mensaje);
        const whatsappURLMobile = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        const whatsappURLEscritorio = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        alert("Serás redirigido a WhatsApp para completar tu pedido");

        if (isDesktop) {
          const newWindow = window.open(whatsappURLEscritorio, "_blank");
          if (!newWindow) {
            alert("Por favor, permite las ventanas emergentes para este sitio.");
          }
        } else {
          window.location.href = whatsappURLMobile;
        }

        clearCart();
      } else {
        alert("Error al realizar el pedido");
      }
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert(error.response?.data?.error || "Hubo un problema al enviar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const enviarDetallesPedido = async (idPedido) => {
    const detallesPedido = cartItems.map((item) => ({
      menu_id: item.id,
      cantidad: item.cantidad,
      precio: item.precio * item.cantidad,
      ingredientes: item.ingredientes,
    }));

    try {
      await Promise.all(
        detallesPedido.map((detalle) =>
          axios.post(`${API_BASE}/api/pedido/detalle-pedido`, {
            pedido_id: idPedido,
            ...detalle,
          }),
        ),
      );
    } catch (error) {
      console.error("Error al enviar los detalles del pedido:", error);
      alert("Hubo un problema al enviar los detalles del pedido");
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [setCartItems]);

  useEffect(() => {
    let cancelled = false;

    const fetchOperationSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/settings/operation`);
        if (!cancelled) {
          setOperationSettings({ ...DEFAULT_OPERATION_SETTINGS, ...response.data });
        }
      } catch (error) {
        console.error("Error al obtener la configuración operativa:", error);
      }
    };

    fetchOperationSettings();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const fetchDirecciones = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/api/direcciones`);
        setDirecciones(response.data);
      } catch (error) {
        setError("Error al obtener las direcciones");
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
          const response = await axios.post(`${API_BASE}/api/auth/getUser`, {
            email: currentUser.email,
          });
          setCliente(response.data);
        } catch (error) {
          setError("Error al obtener el cliente");
        }
      }
    };

    fetchCliente();
  }, [currentUser]);

  const handleDireccionChange = (event) => {
    const selectedDireccion = direcciones.find((item) => item.nombre === event.target.value);
    setDireccion(event.target.value);
    setCostoEnvio(selectedDireccion ? selectedDireccion.costo_envio : 0);
  };

  const handleDeliveryChange = (event) => {
    setIsDelivery(event.target.checked);
    setIsPickup(false);
    setDireccion("");
    setCostoEnvio(0);
  };

  const handlePickupChange = (event) => {
    setIsPickup(event.target.checked);
    setIsDelivery(false);
    setDireccion("");
    setCostoEnvio(0);
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto flex flex-col gap-5 p-5 font-comfortaa sm:w-1/2 sm:p-10">
      {!operationSettings.acceptOrders && cartItems.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          El restaurante no está aceptando pedidos en este momento.
        </div>
      )}

      {operationSettings.freeDelivery && cartItems.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Delivery gratis activo para pedidos a domicilio.
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="flex flex-col gap-5 border">
          <h3 className="bg-white px-4 py-2 font-paytone text-lg font-bold">
            ¿Cómo quieres recibir tu pedido?
          </h3>
          <div className="flex flex-col gap-5 px-10 py-5">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
              <div className="flex justify-center">
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={isDelivery}
                    onChange={handleDeliveryChange}
                  />
                  Delivery
                </label>
              </div>
              <div>
                <span className="font-bold">-o-</span>
              </div>
              <div className="flex justify-center">
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={isPickup}
                    onChange={handlePickupChange}
                  />
                  Retirar
                </label>
              </div>
            </div>
            {isDelivery && (
              <div className="flex flex-col gap-2">
                <label className="font-bold">Lugar</label>
                <select
                  className="p-2"
                  value={direccion}
                  onChange={handleDireccionChange}
                >
                  <option className="text-sm" value="">
                    Selecciona una opción
                  </option>
                  {direcciones.map((direccionItem) => (
                    <option
                      className="text-sm"
                      key={direccionItem.id}
                      value={direccionItem.nombre}
                    >
                      {direccionItem.nombre} - {operationSettings.freeDelivery ? "Gratis" : `$${direccionItem.costo_envio}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 border">
        <h3 className="bg-white px-4 py-2 font-paytone text-lg font-bold">
          Detalles del pedido
        </h3>
        <div className="flex flex-col gap-5 px-5 sm:px-10 sm:py-5">
          {cartItems.length === 0 ? (
            <div className="flex flex-col gap-5">
              <p className="text-center text-lg font-semibold">
                Tu carrito está vacío
              </p>
              <Link
                className="mx-auto w-full rounded-lg bg-yellow-300 p-2 text-center sm:w-1/3"
                to="/"
              >
                Ver menú
              </Link>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 bg-white p-5 px-5 shadow-md sm:px-10 sm:py-5"
                >
                  <div className="flex gap-5">
                    <img
                      src={item.image_url}
                      alt={item.nombre}
                      className="h-32 w-32 object-cover"
                    />
                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold">{item.nombre}</h3>
                      <p>
                        {item.cantidad} x ${item.precio}
                      </p>

                      {item.ingredientes && item.ingredientes.length > 0
                        ? item.ingredientes.map((ingrediente) => (
                            <li key={ingrediente.id}>{ingrediente.nombre}</li>
                          ))
                        : null}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-button"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold">
                    <p>${(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <button
                className="mx-auto w-1/3 rounded-lg bg-yellow-300 p-2 text-center"
                onClick={clearCart}
              >
                Vaciar carrito
              </button>

              <div className="flex w-full flex-col gap-2">
                <div>
                  <h3 className="text-lg font-bold">Pago</h3>
                  <div className="flex w-full justify-between">
                    <h3>Subtotal</h3>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex w-full justify-between">
                    <h3>Envío</h3>
                    <span className="font-bold">
                      ${effectiveShippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex w-full justify-between">
                    <h3>Total a pagar</h3>
                    <span className="text-xl font-bold">
                      ${totalToPay.toFixed(2)}
                    </span>
                  </div>
                </div>
                {currentUser ? (
                  <div className="flex flex-col items-center gap-2 p-5 sm:p-0">
                    <button
                      className="w-full rounded-lg bg-yellow-300 p-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/3"
                      onClick={finalizarPedido}
                      disabled={!operationSettings.acceptOrders}
                    >
                      Finalizar
                    </button>
                    <Link
                      className="w-full rounded-lg bg-yellow-300 p-2 text-center sm:w-1/3"
                      to="/"
                    >
                      Volver al menú
                    </Link>
                  </div>
                ) : (
                  <Link
                    className="rounded-lg bg-yellow-300 p-2 text-center"
                    to="/Login"
                  >
                    Inicia sesión para finalizar tu pedido
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
