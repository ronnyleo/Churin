import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Pedidos.css'

function Pedidos() {
    const [pedidosPorFecha, setPedidosPorFecha] = useState([]);
    const [resumenPorFecha, setResumenPorFecha] = useState({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [detallesPedidos, setDetallesPedidos] = useState({}); // Objeto para almacenar detalles de cada pedido
    const [visibilidadDetalles, setVisibilidadDetalles] = useState({}); // Estado para controlar visibilidad

    const handleDetallesClick = async (pedidoId) => {
        const detallePedido = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalle-pedido/${pedidoId}`);
        setDetallesPedidos(prev => (
            {
                ...prev,
                [pedidoId]: detallePedido.data
            }
        ));

        setVisibilidadDetalles(prev => ({
            ...prev,
            [pedidoId]: !prev[pedidoId]
        }));
    }

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`);
                const pedidos = response.data;
                console.log('Datos recibidos:', response.data);
                // Asegurarse de que `pedidos` sea un array
                if (Array.isArray(pedidos)) {
                    // Agrupar pedidos por fecha
                    const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
                        const fecha = pedido.fecha; // Asegúrate de que el campo `fecha` existe
                        if (!acc[fecha]) {
                            acc[fecha] = []; // Inicializar como array si no existe
                        }
                        acc[fecha].push(pedido);
                        return acc;
                    }, {});

                    // Convertir a array de [fecha, pedidos] y ordenar por fecha
                    const pedidosOrdenados = Object.entries(pedidosAgrupados).sort((a, b) => new Date(b[0]) - new Date(a[0]));
                    setPedidosPorFecha(pedidosOrdenados);


                } else {
                    throw new Error("Formato inesperado de los datos de pedidos.");
                }

                setCargando(false);
            } catch (error) {
                console.log('Error al obtener los pedidos:', error);
                setError('Error al obtener los pedidos');
                setCargando(false);
            }
        };

        fetchPedidos();
    }, []);


    const obtenerEstadisticasPorFecha2 = async (fecha) => {
        try {
            const respuesta = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/estadisticas/dia/${fecha}`);
            setResumenPorFecha((prevResumen) => ({
                ...prevResumen,
                [fecha]: respuesta.data, // Almacenar las estadísticas por fecha
            }));
            console.log(resumenPorFecha)
        } catch (error) {
            console.error(`Error al obtener estadísticas para ${fecha}:`, error);
        }
    };

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Pedidos recibidos</h2>
            {pedidosPorFecha.length > 0 ? (
                pedidosPorFecha.map(([fecha, pedidos]) => (
                    <div key={fecha}>
                        <h3>Pedidos del {fecha}</h3>
                        <table className='pedidos__tabla'>
                            <thead>
                                <tr>
                                    <th className='pedidos__fila'>Nro.</th>
                                    <th className='pedidos__fila'>Nombre</th>
                                    <th className='pedidos__fila'>Teléfono</th>
                                    <th className='pedidos__fila'>Hora</th>
                                    <th className='pedidos__fila'>Total</th>
                                    <th className='pedidos__fila'>Entrega/Retiro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map(pedido => (
                                    <React.Fragment key={pedido.id}>
                                        <tr key={pedido.id}>
                                            <td className='pedidos__fila'>{pedido.id}</td>
                                            <td className='pedidos__fila'>{pedido.first_name} {pedido.last_name}</td>
                                            <td className='pedidos__fila'>{pedido.telefono}</td>
                                            <td className='pedidos__fila'>{pedido.hora}</td>
                                            <td className='pedidos__fila'>{pedido.total}</td>
                                            <td className='pedidos__fila'>
                                                {pedido.delivery ? pedido.lugar_envio : 'Retiro'}
                                            </td>
                                            <td className='pedidos__fila'>
                                                <button onClick={() => handleDetallesClick(pedido.id)}>
                                                    {visibilidadDetalles[pedido.id] ? '-' : '+'}
                                                </button>
                                            </td>
                                        </tr>
                                        {visibilidadDetalles[pedido.id] && (
                                            <tr>
                                                <td className='pedidos__fila' colSpan="5">
                                                    <h3>Detalle: </h3>
                                                    {(detallesPedidos[pedido.id] || []).map(detallePedido => (
                                                        <div key={detallePedido.id} className="detalle-pedido">
                                                            {/* Mostrar el nombre del producto */}
                                                            <h4 className="producto-nombre">{detallePedido.nombre}</h4>
                                                            {/* Lista de ingredientes y otros detalles */}
                                                            <ul className="detalle-lista">
                                                                {detallePedido.ingredientes && (
                                                                    <li>
                                                                        Ingredientes: {detallePedido.ingredientes.map((detalle, index) => (
                                                                            <span key={detalle.id} className="ingrediente">
                                                                                {detalle.nombre}{index < detallePedido.ingredientes.length - 1 && ','}
                                                                            </span>
                                                                        ))}
                                                                    </li>
                                                                )}
                                                                <li>Cantidad: {detallePedido.cantidad}</li>
                                                                <li>Total: {detallePedido.precio}</li>
                                                            </ul>
                                                        </div>
                                                    ))}

                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => obtenerEstadisticasPorFecha2(fecha)}>Ver resumen</button>
                        {resumenPorFecha[fecha] && (
                            <div>
                                <p>Número de pedidos: {resumenPorFecha[fecha].total_pedidos}</p>
                                <p>Valor total: {resumenPorFecha[fecha].valor_total}</p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No hay pedidos disponibles.</p>
            )}
        </div>
    );
}

export default Pedidos;
