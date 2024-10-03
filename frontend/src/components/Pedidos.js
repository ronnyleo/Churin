import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Pedidos() {

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`);
                const pedidos = response.data;
                // Ordenar por fecha
                //const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                //setPedidos(pedidosOrdenados);

                const pedidosAgrupados = [...pedidos].reduce((acc, pedido) => {
                    const fecha = pedido.fecha;
                    if (!acc[fecha]) {
                        acc[fecha] = [];
                    };

                    acc[fecha].push(pedido)
                    return acc;
                }, {})

                setPedidos(Object.entries(pedidosAgrupados));



            } catch (error) {
                console.log('Error al obtener los pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    return (
        <div>
            <h2>Pedidos recibidos en {fecha}</h2>
            {pedidosAgrupados.map(([fecha, pedidos]) => (
                <div key={fecha}>
                    <h3>Pedidos para {fecha}</h3>
                    <ul>
                        {pedidos.map(pedido => (
                            <li key={pedido.id}>
                                Cliente: {pedido.cliente}, Total: {pedido.total}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default Pedidos;