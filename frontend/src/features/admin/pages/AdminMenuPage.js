import { useState } from "react";

export default function MenuPage() {
  const [categorias, setCategorias] = useState([
    "Categoria 1",
    "Categoria 2",
    "Categoria 3",
  ]);

  const [menu, setMenu] = useState([
    { id: 1, nombre: "Item 1", categoria: "Categoria 1", precio: 10 },
    { id: 2, nombre: "Item 2", categoria: "Categoria 2", precio: 15 },
  ]);

  return (
    <div>
      <h2>Menú</h2>
      <div className='flex flex-col gap-4'>
        <div className="border-2">
          <div className="flex justify-end">
            <label>Buscar</label>
            <input type="search" />
          </div>
          <ul className="flex gap-4">
            {categorias &&
              categorias.map((categoria) => (
                <li>
                  <h3>{categoria}</h3>
                </li>
              ))}
          </ul>
        </div>
        <div className="border-2">
          <ul>
            {menu && menu.map((item) => <li key={item.id}>{item.nombre}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
