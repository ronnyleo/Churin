import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { FaCalendar, FaMoneyBillWave } from "react-icons/fa";

const Perfil = () => {

    const [pedidos, setPedidos] = useState([]);
    const { currentUser } = useAuth();
    const [cliente, setCliente] = useState('');

    useEffect(() => {
        const fetchCliente = async () => {
            if (currentUser) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
                        email: currentUser.email
                    });
                    setCliente(response.data);
                } catch (error) {
                }
            }
        };

        fetchCliente();
    }, [currentUser]);

    useEffect(() => {
        const fetchPedidos = async () => {
            if (cliente) {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/${cliente.id}`)
                setPedidos(response.data);
            }
        }

        fetchPedidos();
    }, [cliente])

    return (
        <div>
            <h2 >Bienvenid@ {cliente.first_name}</h2>
            <div className="w-1/2 mx-auto">
                <h3 className="text-2xl font-bold">Pedidos realizados</h3>
                <ul>
                    {pedidos && pedidos.map(pedido => (
                        <li
                            className="bg-gray-200 mt-10 rounded-lg p-5"
                            key={pedido.id_pedido}

                        >
                            {/* 📌 Fecha y total alineados */}
                            <div className="flex gap-5">
                                <div className="text-lg font-bold w-1/3">
                                    <div>
                                        <span>📅</span>
                                        <span className="text-green">{pedido.fecha}</span>
                                    </div>
                                    <div>
                                        <span >🛵</span>
                                        <span>$2.50 - Yachay</span>
                                    </div>
                                    
                                 </div>
                                 <div className="text-lg font-bold">
                                    <span >💰</span>
                                    <span>${pedido.total}</span>
                                </div>
                            </div>

                            {/* 📌 Detalles, envio y estado */}
                            <div className="flex gap-20 mt-5 w-2/3 justify-between items-center">
                                <ul className="flex flex-col w-1/2">
                                    {pedido.detalles.map(detalle => (
                                        <li
                                            key={detalle.id_detalle}
                                            className="flex justify-between"
                                        >
                                            <div className="ml-6">{detalle.plato}</div>
                                            <div className="font-semibold">
                                                {detalle.cantidad} x ${detalle.precio_unitario}
                                            </div>
                                        </li>
                                    ))}
                                </ul>


                                {/* 📌 Estado del pedido como badge */}
                                <div className="bg-lime-500 text-sm font-semibold rounded-full p-3">
                                    Recibido
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


