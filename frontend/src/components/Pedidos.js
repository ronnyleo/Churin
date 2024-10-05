import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Pedidos.css'

function Pedidos() {

    const [pedidosAgrupados, setPedidosAgrupados] = useState([]);
    const [detallesPedidos, setDetallesPedidos] = useState({}); // Objeto para almacenar detalles de cada pedido
    const [visibilidadDetalles, setVisibilidadDetalles] = useState({}); // Estado para controlar visibilidad

    const handleDetallesClick = async (pedidoId) => {
        const detallePedido = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/detalle-pedido/${pedidoId}`);
        setDetallesPedidos(prev => (
            {
                ...prev,
                [pedidoId]: detallePedido.data
            }
        ));


    }

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const responsePedidos = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`);
                const pedidos = responsePedidos.data;

                const pedidosAgrupados = [...pedidos].reduce((acc, pedido) => {
                    const fecha = pedido.fecha;
                    if (!acc[fecha]) {
                        acc[fecha] = [];
                    };

                    acc[fecha].push(pedido)
                    return acc;
                }, {})

                // Convertir a array de [fecha, pedidos] y ordenar por fecha
                setPedidosAgrupados(Object.entries(pedidosAgrupados).sort((a, b) => new Date(b[0]) - new Date(a[0])));

            } catch (error) {
                console.log('Error al obtener los pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    return (
        <div>
            <h2>Pedidos recibidos</h2>
            {pedidosAgrupados.map(([fecha, pedidos]) => (
                <div key={fecha}>
                    <h3>Pedidos {fecha}</h3>
                    <table>
                        <thead>
                            <th>Nro.</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Ubicación</th>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => (
                                <React.Fragment key={pedido.id}>

                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.cliente}</td>
                                        <td>{pedido.total}</td>
                                        <td>{pedido.lugar_envio}</td>
                                        <td>
                                            
                                            <button onClick={() => handleDetallesClick(pedido.id)}>+</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5">
                                            {(detallesPedidos[pedido.id] || []).map(detallePedido => (
                                                <ul>
                                                    <li key={detallePedido.id}>Precio {detallePedido.precio} - Cantidad: {detallePedido.cantidad}</li>
                                                </ul>
                                            ))}
                                        </td>
                                    </tr>
                                </React.Fragment>

                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default Pedidos;