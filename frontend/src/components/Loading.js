import React from "react";
import logo2 from '../assets/logo2.png';

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex justify-center items-center">
            <div className="flex flex-col font-semibold items-center">
                <img 
                    src={logo2}
                    className="w-20 h-15 sm:w-40 sm:h-30 animate-bounce"
                />
                <p>Cargando...</p>
            </div>
        </div>
    )
}

export default Loading;