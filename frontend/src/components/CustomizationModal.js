import React, { useEffect, useState, useContext } from "react";
import '../styles/CustomizationModal.css';
import axios from "axios";
import { CartContext } from '../context/CartContext';


function CustomizationModal({ item, onClose }) {

    const [ingredients, setIngredients] = useState([]);
    const [salsas, setSalsas] = useState([]);
    const [sabores, setSabores] = useState([]);
    const [ensaladas, setEnsaladas] = useState([]);
    const [proteinas, setProteinas] = useState([]);
    const [proteinasYEnsaladas, setProteinasYEnsaladas] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0); // Total de ingredientes seleccionados
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        async function fetchIngredients() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ingredients`);
                const ingredientes = response.data

                // Filtrar salsas y sabores
                const proteinasFiltradas = ingredientes.filter(ingrediente => ingrediente.tipo_id === 1);
                const ensaladasFiltradas = ingredientes.filter(ingrediente => ingrediente.tipo_id === 2);
                const salsasFiltradas = ingredientes.filter(ingrediente => ingrediente.tipo_id === 3);
                const saboresFiltrados = ingredientes.filter(ingrediente => ingrediente.tipo_id === 4);


                setProteinas(proteinasFiltradas);
                setEnsaladas(ensaladasFiltradas);
                setSalsas(salsasFiltradas);
                setSabores(saboresFiltrados);
                

                console.log('Proteinas y ensaladas: ', proteinas);
            } catch (error) {
                console.error('Error al obtener los ingredientes:', error);
            }
        }
        fetchIngredients();
    }, []);

    const handleAddToCart = (item) => {
        const ingredientesSeleccionados = Object.values(selectedIngredients).flat();
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
                alert('No puedes seleccionar más opciones de este tipo.');
                return prevSelected;
            }

            if (item.tipo_combinacion === 2) {
                const totalSelected = Object.values(prevSelected).flat().length;
                if (totalSelected >= 2) {
                    alert('Solo puedes seleccionar 2 opciones en total.');
                    return prevSelected;
                }
            }

            if (item.tipo_combinacion === 3) {
                const totalSelected = Object.values(prevSelected).flat().length;
                if (totalSelected >= 3) {
                    alert('Solo puedes seleccionar 3 opciones en total.');
                    return prevSelected;
                }
            }

            if (item.tipo_combinacion === 5) {
                const totalSelected = Object.values(prevSelected).flat().length;
                if (totalSelected >= 1) {
                    alert('Solo puedes seleccionar 1 opción en total.');
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
                    <p>Elige entre las siguientes opciones:</p>
                    {/* Mostrar Proteínas y Ensaladas solo si están permitidas */}
                    {item.tipo_ingrediente === 1 && (      
                        <div className="ingredients-type-section">
                             <p className='item__descripcion'>
                    Nota: Si seleccionas menos ingredientes de los indicados, 
                    se considerará como doble porción al ingrediente elegido.
                </p>
                            <h3>Proteínas</h3>
                            <ul className="ingredients-list">
                                {proteinas.map(ingrediente => (
                                    <li key={ingrediente.id} className="ingredient-list__item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={ingrediente.id}
                                                checked={selectedIngredients['proteinas']?.some(item => item.id === ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente, 'proteinas')}
                                            />
                                            {ingrediente.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <h3>Ensaladas</h3>
                            <ul className="ingredients-list">
                                {ensaladas.map(ingrediente => (
                                    <li key={ingrediente.id} className="ingredient-list__item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={ingrediente.id}
                                                checked={selectedIngredients['ensaladas']?.some(item => item.id === ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente, 'ensaladas')}
                                            />
                                            {ingrediente.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Mostrar Salsas solo si están permitidas */}
                    {item.tipo_ingrediente === 2 && (
                        <div className="ingredients-type-section">
                             <p className='item__descripcion'>
                    Nota: Si seleccionas menos ingredientes de los indicados, 
                    se considerará como doble porción al ingrediente elegido.
                </p>
                            <h3>Salsas</h3>
                            <ul className="ingredients-list">
                                {salsas.map(ingrediente => (
                                    <li key={ingrediente.id} className="ingredient-list__item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={ingrediente.id}
                                                checked={selectedIngredients['salsas']?.some(item => item.id === ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente, 'salsas')}
                                            />
                                            {ingrediente.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Mostrar Sabores solo si están permitidos */}
                    {item.tipo_ingrediente === 3 && (
                        <div className="ingredients-type-section">
                            <h3>Sabores</h3>
                            <ul className="ingredients-list">
                                {sabores.map(ingrediente => (
                                    <li key={ingrediente.id} className="ingredient-list__item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={ingrediente.id}
                                                checked={selectedIngredients['sabores']?.some(item => item.id === ingrediente.id) || false}
                                                onChange={() => handleCheckboxChange(ingrediente, 'sabores')}
                                            />
                                            {ingrediente.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="custom-modal-buttons">
                    {/* Deshabilitar el botón si no hay ingredientes seleccionados */}
                    <button
                        onClick={() => handleAddToCart(item)}
                        disabled={selectedCount === 0} // Deshabilitar si no se seleccionan ingredientes
                        className={selectedCount === 0 ? "disabled-button" : "active-button"}>
                        Agregar
                    </button>
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

export default CustomizationModal;
