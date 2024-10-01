import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Pedidos() {

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`);
                setPedidos(response.data);

                //responseOrdenada = response.sort(a, b) =>

            } catch (error) {
                console.log('Error al obtener los pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    return (
        <div>
            <h2>Pedidos recibidos</h2>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Cliente</th>
                        <th>Fecha y hora del pedido</th>
                        <th>Total</th>
                        <th>Delivery</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                            <td>{pedido.id}</td>
                            <td>{pedido.cliente}</td>
                            <td>{pedido.fecha_hora}</td>
                            <td>{pedido.total}</td>
                            <td>{pedido.delivery ? 'Si' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default Pedidos;