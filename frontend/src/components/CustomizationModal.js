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
        addToCart(item);
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
    const handleCheckboxChange = (ingredientId, tipo) => {
        console.log('item:', item); // Asegúrate de que item esté definido

        setSelectedIngredients(prevSelected => {
            const currentSelected = prevSelected[tipo] || [];
            const isSelected = currentSelected.includes(ingredientId);
            console.log('tipo_combinacion:', tipo);
            // Si el ingrediente ya está seleccionado, se desmarca
            if (currentSelected.includes(ingredientId)) {
                setSelectedCount(prevCount => prevCount - 1);
                return {
                    ...prevSelected,
                    [tipo]: currentSelected.filter(id => id !== ingredientId)
                };
            }

            // Según el tipo de combinación, controlar la cantidad de selección
            if (item.tipo_combinacion === 1) {
                // Escoger máximo 2 de cada tipo
                if (currentSelected.length >= 2) {
                    alert('No puedes seleccionar mas ingredientes');
                    return prevSelected;
                }


                setSelectedCount(prevCount => prevCount + 1);
                return {
                    ...prevSelected,
                    [tipo]: [...currentSelected, ingredientId]
                };
            }


            // Manejando el tipo de combinación 2
            if (item.tipo_combinacion === 2) {
                if (isSelected) {
                    // Si ya está seleccionado, eliminar el ingrediente y decrementar el contador
                    setSelectedCount(prevCount => prevCount - 1);
                    return {
                        ...prevSelected,
                        [tipo]: currentSelected.filter(id => id !== ingredientId),
                    };
                } else {
                    // Verificar si el total de ingredientes seleccionados es menor que 2
                    const totalSelected = Object.values(prevSelected).flat().length; // Contamos todos los ingredientes seleccionados
                    if (totalSelected >= 2) {
                        alert('Solo puedes seleccionar 2 ingredientes en total.');
                        return prevSelected; // Retorna el estado anterior si se alcanza el límite
                    }

                    // Si no ha alcanzado el límite, agregar el ingrediente
                    setSelectedCount(prevCount => prevCount + 1);
                    return {
                        ...prevSelected,
                        [tipo]: [...currentSelected, ingredientId],
                    };
                }
            }

            if (item.tipo_combinacion === 3) {
                // Escoger máximo 3 en total, independientemente del tipo
                const totalSelected = Object.values(prevSelected).flat().length; // Contamos todos los ingredientes seleccionados

                // Verificamos si ya se ha alcanzado el límite
                if (totalSelected >= 3) {
                    alert('Solo puedes seleccionar 3 ingredientes en total.');
                    return prevSelected; // Si se ha alcanzado, no hacemos nada
                }
                // Si el ingrediente ya está seleccionado, lo desmarcamos
                if (currentSelected.includes(ingredientId)) {
                    return {
                        ...prevSelected,
                        [tipo]: currentSelected.filter(id => id !== ingredientId) // Deseleccionamos el ingrediente
                    };
                }

                // Si el ingrediente no está seleccionado y hay espacio
                return {
                    ...prevSelected,
                    [tipo]: [...currentSelected, ingredientId] // Añadimos el nuevo ingrediente
                };
            }


            return prevSelected;
        });
    };

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <h2>Personaliza tu {item.nombre}</h2>


                <div className="ingredients-section">
                    <p>Elige tus ingredientes:</p>
                    {Object.keys(groupedIngredients).map(tipo => (
                        <div key={tipo} className="ingredients-type-section">
                            <h3>{tipo}</h3>
                            <ul className="ingredients-list">
                                {groupedIngredients[tipo].map(ingrediente => (
                                    <li key={ingrediente.id} className="ingredient-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={ingrediente.id}
                                                checked={selectedIngredients[tipo]?.includes(ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente.id, tipo)}
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
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default CustomizationModal;
