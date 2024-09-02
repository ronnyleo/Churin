import React, { useEffect, useState } from "react";
import '../styles/CustomizationModal.css'
import axios from "axios";

function CustomizationModal({ item, onClose }) {

    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(() => {

        async function fetchIngredients() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ingredients`);
                setIngredients(response.data);
            } catch (error) {
                console.error('Error al obtener los ingredientes:', error);
            }
        }

        // Llama a la función para obtener el menú al cargar el componente
        fetchIngredients();
    }, []);

    // Agrupar ingredientes por tipo
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
        //Verificando si ingredient.tipo existe en acc
        if (!acc[ingredient.tipo]) {
            acc[ingredient.tipo] = [];
        }
        acc[ingredient.tipo].push(ingredient);
        return acc;
    }, {});

    const handleCheckboxChange = (ingredientId, tipo) => {
        // Actualizar estado basado en el anterior
        setSelectedIngredients(prevSelected => {

            const currentSelected = prevSelected[tipo] || [];

            // Si el ingrediente ya está seleccionado se desmarca
            if (currentSelected.includes(ingredientId)) {

                return {
                    ...prevSelected, //spread operator
                    [tipo]: currentSelected.filter(id => id !== ingredientId) // solo los ids que no sean iguales se mantienen en la lista.
                };
            }

            // Si el ingrediente no está seleccionado y hay 2, no se marca
            if (currentSelected.length >= 2) {
                return prevSelected;
            }

            // Si el ingrediente no está seleccionado y hay espacio
            return {
                ...prevSelected,
                [tipo]: [...currentSelected, ingredientId]
            };
        });
    };


    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <h2>Personaliza tu {item.nombre}</h2>
                <div className="ingredients-section">
                    <p>Elige tus ingredientes:</p>
                    {Object.keys(groupedIngredients).map(tipo =>
                        <div key={tipo} className="ingredients-type-section">
                            <h3>{tipo}</h3>
                            <ul className="ingredients-list">
                                {groupedIngredients[tipo].map(ingrediente =>
                                    <li key={ingrediente.id} className="ingredient-item">
                                        <label>
                                            <input
                                                type='checkbox'
                                                value={ingrediente.id}
                                                checked={selectedIngredients[tipo]?.includes(ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente.id, tipo)}
                                            />
                                            {ingrediente.nombre}
                                        </label>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="custom-modal-buttons">
                    <button>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default CustomizationModal;