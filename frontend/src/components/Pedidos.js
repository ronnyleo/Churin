import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Pedidos() {

    const [pedidosAgrupados, setPedidosAgrupados] = useState([]);
    const [detallesPedidos, setDetallesPedidos] = useState({}); // Objeto para almacenar detalles de cada pedido


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

                // Ordenar por fecha
                //const pedidosOrdenados = [...pedidosAgrupados].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                // Convertir a array de [fecha, pedidos] y ordenar por fecha
                setPedidosAgrupados(Object.entries(pedidosAgrupados).sort((a, b) => new Date(b[0]) - new Date(a[0])));

                // Llamar a la API de detalles por cada pedido
                pedidos.forEach(async (pedido) => {
                    const responseDetPedido = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/detalle-pedido/${pedido.id}`);
                    setDetallesPedidos(prev => ({
                        ...prev,
                        [pedido.id]: responseDetPedido.data // Guardar los detalles del pedido en un objeto
                    }));
                });


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
                    <h3>Pedidos para {fecha}</h3>
                    <table>
                        <thead>
                            <th>Nro.</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Ubicación</th>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>{pedido.total}</td>
                                    <td>{pedido.lugar_envio}</td>
                                    <td>
                                        {detallesPedidos[pedido.id] 
                                            ? <ul>
                                                {detallesPedidos[pedido.id].map(detalle => (
                                                    <li key={detalle.id}>{detalle.descripcion}</li>
                                                ))}
                                              </ul>
                                            : "Cargando detalles..."}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default Pedidos;