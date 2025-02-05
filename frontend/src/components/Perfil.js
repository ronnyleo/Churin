import React, { useEffect, useState } from "react";
import axios from "axios";

const Perfil = () => {

    const [pedidos, setPedidos] = useState([]);

    useEffect (() => {
        const fetchPedidos = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`)
            setPedidos(response.data);         
        }

        fetchPedidos();
    }, [])


    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold">Mis pedidos</h2>
            <ul>
                {pedidos && pedidos.map(pedido => (
                    <li>{pedido.total}</li>
                ))}
            </ul>
        </div>
    );
}

export default Perfil;


