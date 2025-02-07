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
    <div className="p-20">
      <h1 className="text-3xl font-bold text-center">Menú</h1>
      {error && <p>{error}</p>}
      <div>
        {categorias.map(categoria => (
          <div key={categoria.id}>
            <h2 className="text-2xl font-semibold">{categoria.nombre}</h2>
            <div className="m-10 flex gap-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
              {groupedMenuItems[categoria.id] && groupedMenuItems[categoria.id].map(item => (
                <div
                  key={item.id}
                  className="p-10 bg-white rounded-lg flex flex-col gap-3 justify-evenly"
                >
                  <h3 className="text-xl font-semibold">{item.nombre}</h3>
                  {item.tipo_id === 5 ? (
                    <>
                      {/* Aquí defines el diseño especial para el item con id 5 */}
                      <span>${item.precio}</span>
                    </>
                  ) : (
                    <>
                      <img src={item.image_url} alt={item.nombre}/>
                      <p>{item.descripcion}</p>
                      <span>${item.precio}</span>
                    </>
                  )}
                  <button onClick={() => handleAddToCart(item)}>
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
