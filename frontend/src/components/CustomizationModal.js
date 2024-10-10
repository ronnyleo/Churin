import React, { useEffect, useState, useContext } from "react";
import '../styles/CustomizationModal.css';
import axios from "axios";
import { CartContext } from '../context/CartContext';


function CustomizationModal({ item, onClose }) {

    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0); // Total de ingredientes seleccionados
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        async function fetchIngredients() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ingredients`);
                setIngredients(response.data);
            } catch (error) {
                console.error('Error al obtener los ingredientes:', error);
            }
        }
        fetchIngredients();
    }, []);

    const handleAddToCart = (item) => {
        const ingredientesSeleccionados = Object.values(selectedIngredients).flat();
        console.log("Itemwi:", ingredientesSeleccionados)
        const itemWithIngredientes = {
            ...item,
            ingredientes: ingredientesSeleccionados
        };
        addToCart(itemWithIngredientes);
        onClose();  // Cierra el modal después de agregar al carrito
    }

    // Agrupar ingredientes por tipo
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
        if (!acc[ingredient.tipo]) {
            acc[ingredient.tipo] = [];
        }
        acc[ingredient.tipo].push(ingredient);
        return acc;
    }, {});

    // Manejo de selección de ingredientes
   // Manejo de selección de ingredientes
   const handleCheckboxChange = (ingredient, tipo) => {
    setSelectedIngredients(prevSelected => {
        const currentSelected = prevSelected[tipo] || [];
        const isSelected = currentSelected.some(item => item.id === ingredient.id);

        if (isSelected) {
            setSelectedCount(prevCount => prevCount - 1);
            return {
                ...prevSelected,
                [tipo]: currentSelected.filter(item => item.id !== ingredient.id)
            };
        }

        if (item.tipo_combinacion === 1 && currentSelected.length >= 2) {
            alert('No puedes seleccionar más ingredientes de este tipo.');
            return prevSelected;
        }

        if (item.tipo_combinacion === 2) {
            const totalSelected = Object.values(prevSelected).flat().length;
            if (totalSelected >= 2) {
                alert('Solo puedes seleccionar 2 ingredientes en total.');
                return prevSelected;
            }
        }

        if (item.tipo_combinacion === 3) {
            const totalSelected = Object.values(prevSelected).flat().length;
            if (totalSelected >= 3) {
                alert('Solo puedes seleccionar 3 ingredientes en total.');
                return prevSelected;
            }
        }

        setSelectedCount(prevCount => prevCount + 1);
        return {
            ...prevSelected,
            [tipo]: [...currentSelected, ingredient]
        };
    });
};



    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <h2 className='item__titulo'>Personaliza tu {item.nombre}</h2>
                <p className='item__descripcion'>{item.descripcion}</p>
                <div className="item__ingredients-section">
                    <p>Elige tus ingredientes:</p>
                    {Object.keys(groupedIngredients).map(tipo => (
                        <div key={tipo} className="ingredients-type-section">
                            <h3>{tipo}</h3>
                            <ul className="ingredients-list">
                                {groupedIngredients[tipo].map(ingrediente => (
                                    <li key={ingrediente.id} className="ingredient-list__item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={ingrediente.id}
                                                checked={selectedIngredients[tipo]?.some(item => item.id === ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente, tipo)}
                                            />
                                            {ingrediente.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="custom-modal-buttons">
                    <button  onClick={() => handleAddToCart(item)}>Agregar</button>
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

export default CustomizationModal;
