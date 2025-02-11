import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/MenuList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext';
import CustomizationModal from './CustomizationModal';
import Loading from './Loading';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [open, setOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        const responseCategorias = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categorias`);

        const categoriasOrdenadas = responseCategorias.data.sort((a, b) => a.orden - b.orden);

        setMenuItems(response.data);
        setCategorias(categoriasOrdenadas);
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        setError('Hubo un problema al obtener el menú. Por favor, espera 1 minuto e intenta nuevamente.');
      } finally {
        setLoading(false);
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
    <div className="sm:p-20">
      <h1 className="my-5 sm:my-0 text-3xl font-bold text-center">Menú</h1>
      {error && <p>{error}</p>}
      {loading ? (
        <Loading />
      ) : (
        <div>
          {categorias.map(categoria => (
            <div className='mb-20' key={categoria.id}>
              <div className="my-10 flex items-center justify-center space-x-4">
                <h2 className="text-2xl font-semibold">{categoria.nombre}</h2>
                <div className="sm:flex-grow sm:border-t-2 sm:border-gray-300" />
              </div>
              <div className="flex gap-2 grid grid-cols-1 sm:grid-cols-1 sm:gap-3 lg:grid-cols-3 ">
                {groupedMenuItems[categoria.id] && groupedMenuItems[categoria.id].map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-lg flex flex-col gap-4 sm:gap-6 border-b sm:p-8 sm:text-xl "
                  >
                    <h3 className="text-sm sm:text-xl font-semibold">{item.nombre}</h3>
                    {item.tipo_id === 5 ? (
                      <>
                        {/* Aquí defines el diseño especial para el item con id 5 */}
                        <span className='text-center font-bold'>${item.precio}</span>
                      </>
                    ) : (
                      <div className="flex gap-2 sm:flex-col sm:gap-5">
                        {/* Contenedor con alto fijo */}
                        <div className="w-1/2 sm:w-full flex">
                          <img
                            src={item.image_url}
                            alt={item.nombre}
                            className="h-auto sm:w-full sm:h-96 object-cover rounded-lg"
                          />
                        </div>
                        <div className='w-1/2 gap-2 sm:gap-5 h-full flex flex-col sm:w-full justify-center'>
                          <p
                            className='text-xs sm:text-lg sm:h-[60px] overflow-hidden opacity-60 sm:line-clamp-2 text-center'
                            title={item.descripcion}
                          >
                            {item.descripcion}</p>
                          <span className='text-center font-bold'>${item.precio}</span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className='bg-yellow-300 hover:bg-yellow-400 w-full py-2 text-xs sm:text-lg rounded-md sm:w-1/3 mx-auto'
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
      )}

    </div>
  );
}

export default MenuList;
