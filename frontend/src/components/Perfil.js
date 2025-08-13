import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import { useAuth } from '../context/AuthContext';

const Perfil = () => {

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const [cliente, setCliente] = useState('');

    useEffect(() => {
        setLoading(true);
        const fetchCliente = async () => {
            if (currentUser) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
                        email: currentUser.email
                    });
                    setCliente(response.data);
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCliente();
    }, [currentUser]);

    useEffect(() => {
        setLoading(true);
        const fetchPedidos = async () => {
            try{
                if (cliente) {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/${cliente.id}`)
                    setPedidos(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }    
        }

        fetchPedidos();
    }, [cliente])

    if (loading) return <Loading />

    return (
        <div className="sm:p-10">
            <div className="flex flex-col gap-5 w-full sm:w-1/2 mx-auto">
                <h2 className="text-3xl font-bold" >¡Hola {cliente.first_name}!</h2>
                {pedidos && pedidos.length > 0 ? 
                <h3 className="text-2xl font-bold">Pedidos realizados</h3> :
                <h3 className="text-2xl mx-auto">Aún no has realizado pedidos</h3>}
                <ul>
                    {pedidos && pedidos.map(pedido => (
                        <li
                            className="bg-white mt-10 rounded-lg p-5 shadow-md"
                            key={pedido.id_pedido}

                        >
                            {/* 📌 Fecha y total alineados */}
                            <div className="text-sm sm:text-lg sm:w-2/3 font-semibold flex justify-between sm:justify-between">
                                <div className="sm:w-1/2 flex items-center">
                                    <span>📅</span>
                                    <span>{pedido.fecha}</span>
                                </div>
                                    <div className="w-1/4 flex items-center justify-center">
                                        <span >💰</span>
                                        <span>${pedido.total}</span>
                                    </div>
                                    {pedido.lugar_envio ? 
                                        <div className="w-1/4 flex items-center justify-center">
                                            <span>🛵</span>
                                            <span>{pedido.lugar_envio}</span>
                                        </div> :
                                        <div className="w-1/4 flex items-center justify-center">
                                            <span>Retiro</span>
                                        </div>
                                    }
                            </div>

                            {/* 📌 Detalles, envio y estado */}
                            <div className="flex mt-5 items-center">
                                <ul className="flex flex-col w-1/2">
                                    {pedido.detalles.map(detalle => (
                                        <li
                                            key={detalle.id_detalle}
                                            className="flex justify-between mb-4 items-center"
                                        >
                                            <div className="ml-6">
                                                {detalle.plato}
                                                <ul className="ml-6 flex flex-col list-disc">
                                                {detalle.ingredientes && detalle.ingredientes.map(ingrediente => (
                                                    <li className="text-xs">{ingrediente.nombre}</li>
                                                ))}
                                                </ul>
                                            </div>
                                            <div className="font-semibold">
                                                {detalle.cantidad} x ${detalle.precio_unitario}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* 📌 Estado del pedido como badge */}
                                <div className="flex justify-center w-1/2">
                                    <span className="bg-lime-400 text-sm font-semibold rounded-full p-3">Recibido</span>
                                </div>


                            </div>

                        </li>

                    ))}

                </ul>
            </div>
        </div>


    );
}

export default Perfil;


