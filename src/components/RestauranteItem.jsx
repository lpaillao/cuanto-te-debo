import { useAppContext } from '../context/AppContext';
import ItemConsumido from './ItemConsumido';
import { useState } from 'react';

// Iconos SVG inline
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const IconRestaurant = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.336.071.66.178.968.319C16.254 5.124 17 6.33 17 8v5.25c0 .97-.784 1.75-1.75 1.75H4.75c-.966 0-1.75-.78-1.75-1.75V8c0-1.67.746-2.876 2.032-3.488A4.45 4.45 0 016 4.193V3.75zm1.75-.75a.75.75 0 00-.75.75v.293c.067 0 .132-.002.196-.006.324-.02.664-.056 1.006-.121.345-.066.684-.152 1.002-.256.317-.104.614-.232.886-.392l.068-.044V3c0-.414-.336-.75-.75-.75h-1.658zm2.5 0a.75.75 0 00-.75.75v.579l.084.055c.268.16.561.288.873.392.317.104.654.19.999.256.344.065.682.101 1.005.121.067.004.132.006.2.006V3.75A.75.75 0 0011.75 3h-1.5z" />
  </svg>
);

const IconExpand = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const IconCollapse = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const RestauranteItem = ({ restaurante }) => {
  const { setRestaurantes, eliminarRestaurante, modoPropina, restaurantes } = useAppContext();
  const [mostrarItems, setMostrarItems] = useState(true);
  
  const actualizarNombreRestaurante = (nuevoNombre) => {
    setRestaurantes(prevRestaurantes => 
      prevRestaurantes.map(r => 
        r.id === restaurante.id ? { ...r, nombre: nuevoNombre } : r
      )
    );
  };
  
  const actualizarPropina = (nuevaPropina) => {
    setRestaurantes(prevRestaurantes => 
      prevRestaurantes.map(r => 
        r.id === restaurante.id ? { ...r, propina: parseFloat(nuevaPropina) || 0 } : r
      )
    );
  };
  
  const agregarItem = () => {
    setRestaurantes(prevRestaurantes => 
      prevRestaurantes.map(r => {
        if (r.id === restaurante.id) {
          const nuevoItemId = r.items.length > 0 
            ? Math.max(...r.items.map(i => i.id)) + 1 
            : 1;
          return {
            ...r,
            items: [...r.items, {
              id: nuevoItemId,
              nombre: `Ítem ${nuevoItemId}`,
              precio: 0,
              cantidad: 1,
              personasAsignadas: []
            }]
          };
        }
        return r;
      })
    );
  };
  
  const eliminarItem = (itemId) => {
    setRestaurantes(prevRestaurantes => 
      prevRestaurantes.map(r => {
        if (r.id === restaurante.id && r.items.length > 1) {
          return {
            ...r,
            items: r.items.filter(item => item.id !== itemId)
          };
        }
        return r;
      })
    );
  };
  
  const calcularTotalRestaurante = () => {
    // Calcular el subtotal (suma de todos los ítems)
    const subtotal = restaurante.items.reduce((total, item) => {
      return total + (parseFloat(item.precio) || 0);
    }, 0);
    
    // Calcular la propina total basada en el subtotal completo
    const propina = subtotal * ((parseFloat(restaurante.propina) || 0) / 100);
    
    // Sumar subtotal y propina para obtener el total
    const totalConPropina = subtotal + propina;
    
    return {
      subtotal: subtotal.toFixed(2),
      propina: propina.toFixed(2),
      total: totalConPropina.toFixed(2)
    };
  };

  // Función auxiliar para contar cuántas personas comparten un ítem
  const contarPersonasCompartidas = (item) => {
    return item.personasAsignadas.filter(a => a.cantidad > 0).length;
  };
  
  return (
    <div className="border p-2 sm:p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-grow mr-2">
          <input
            type="text"
            value={restaurante.nombre}
            onChange={(e) => actualizarNombreRestaurante(e.target.value)}
            className="text-base sm:text-lg font-semibold p-2 border rounded w-full"
            placeholder="Nombre del restaurante"
          />
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setMostrarItems(!mostrarItems)}
            className="bg-blue-500 text-white p-1.5 rounded-full w-7 h-7 flex items-center justify-center"
            aria-label={mostrarItems ? "Ocultar ítems" : "Mostrar ítems"}
          >
            {mostrarItems ? <IconCollapse /> : <IconExpand />}
          </button>
          <button 
            onClick={() => eliminarRestaurante(restaurante.id)}
            className="bg-red-500 text-white p-1.5 rounded-full w-7 h-7 flex items-center justify-center"
            disabled={restaurantes.length <= 1} 
            aria-label="Eliminar restaurante"
          >
            <IconTrash />
          </button>
        </div>
      </div>
      
      <div className="flex items-end mb-3">
        <div className="flex-grow">
          <label className="block mb-1 text-sm">Propina (%)</label>
          <input
            type="number"
            value={restaurante.propina}
            onChange={(e) => actualizarPropina(e.target.value)}
            className="p-2 border rounded w-full text-sm"
            min="0"
            step="0.1"
          />
        </div>
        <div className="ml-2 text-xs text-gray-600 self-end mb-2">
          {modoPropina === 'proporcional' ? 'Proporcional' : 'Dividida'}
        </div>
      </div>
      
      {mostrarItems && (
        <>
          <div className="space-y-2 mb-3">
            <h3 className="font-semibold text-sm">Ítems consumidos</h3>
            {restaurante.items.map(item => (
              <div key={item.id} className="mb-2">
                {contarPersonasCompartidas(item) > 1 && (
                  <div className="text-xs font-medium text-blue-600 mb-0.5">
                    Compartido por {contarPersonasCompartidas(item)} personas
                  </div>
                )}
                <ItemConsumido 
                  key={item.id} 
                  restauranteId={restaurante.id}
                  item={item}
                  onEliminar={eliminarItem}
                />
              </div>
            ))}
          </div>
          
          <button 
            onClick={agregarItem} 
            className="bg-green-500 text-white px-3 py-1.5 rounded mb-3 text-sm flex items-center"
          >
            <IconPlus className="mr-1" /> Agregar Ítem
          </button>
        </>
      )}
      
      <div className="border-t pt-2">
        <div className="text-sm font-medium mb-1">Resumen del Restaurante:</div>
        <div className="grid grid-cols-3 text-right text-xs sm:text-sm">
          <div className="text-gray-600">Subtotal: ${calcularTotalRestaurante().subtotal}</div>
          <div className="text-gray-600">Propina ({restaurante.propina}%): ${calcularTotalRestaurante().propina}</div>
          <div className="font-semibold">Total pagado: ${calcularTotalRestaurante().total}</div>
        </div>
      </div>
    </div>
  );
};

export default RestauranteItem;
