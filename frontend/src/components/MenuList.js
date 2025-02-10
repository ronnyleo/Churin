import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/MenuList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext';
import CustomizationModal from './CustomizationModal';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [open, setOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        const responseCategorias = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categorias`);

        const categoriasOrdenadas = responseCategorias.data.sort((a, b) => a.orden - b.orden);

        setMenuItems(response.data);
        setCategorias(categoriasOrdenadas);
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        setError('Hubo un problema al obtener el menú. Por favor, espera 1 minuto e intenta nuevamente.');
      }
    }

    fetchMenu();
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.tipo_id]) {
      acc[item.tipo_id] = [];
    }
    acc[item.tipo_id].push(item);
    return acc;
  }, {});

  const handleAddToCart = (item) => {
    if (item.tipo_combinacion !== 4 && item.tipo_combinacion !== null) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  const handleCloseModal = () => {
    setCustomizingItem(null);
  };

  return (
    <div className="p-4 sm:p-20">
      <h1 className="text-3xl font-bold text-center">Menú</h1>
      {error && <p>{error}</p>}
      <div>
        {categorias.map(categoria => (
          <div className='mb-20' key={categoria.id}>
            <div className="m-10 flex items-center justify-center space-x-4">
              <h2 className="text-2xl font-semibold">{categoria.nombre}</h2>
              <div className="flex-grow border-t-2 border-gray-300" />
            </div>
            <div className="flex sm:gap-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
              {groupedMenuItems[categoria.id] && groupedMenuItems[categoria.id].map(item => (
                <div
                  key={item.id}
                  className="p-10 bg-white rounded-lg flex flex-col gap-4"
                >
                  <h3 className="text-sm sm:text-lg font-semibold">{item.nombre}</h3>
                  {item.tipo_id === 5 ? (
                    <>
                      {/* Aquí defines el diseño especial para el item con id 5 */}
                      <span className='text-center font-bold'>${item.precio}</span>
                    </>
                  ) : (
                  <div className="flex flex-col gap-4">
                    {/* Contenedor con alto fijo */}
                    <div className="h-[150px] sm:h-[400px]">
                      <img 
                        src={item.image_url} 
                        alt={item.nombre}  
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <p 
                      className='text-xs sm:text-sm h-[20px] sm:h-[40px] overflow-hidden opacity-60 line-clamp-2'
                      title={item.descripcion}
                      >
                      {item.descripcion}</p>
                    <span className='text-center font-bold'>${item.precio}</span>
                  </div>
                  )}
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className='bg-yellow-300 hover:bg-yellow-400 w-full py-2 text-xs sm:text-sm rounded-md'
                    >
                    {item.tipo_combinacion !== 4 && item.tipo_combinacion !== null ? 'Personalizar' : 'Agregar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {customizingItem && (
          <CustomizationModal
            item={customizingItem}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default MenuList;
