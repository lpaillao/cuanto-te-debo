import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

// Iconos SVG inline
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const IconIndividual = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const IconGroup = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const IconDivide = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM10 4a1 1 0 100 2 1 1 0 000-2zm0 10a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
  </svg>
);

// Agregamos el componente IconUser que faltaba
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const ItemConsumido = ({ restauranteId, item, onEliminar }) => {
  const { personas, setRestaurantes } = useAppContext();
  const [tipoAsignacion, setTipoAsignacion] = useState('individual'); // 'individual', 'compartido'
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarAsignaciones, setMostrarAsignaciones] = useState(false);

  const actualizarNombreItem = (nombre) => {
    setRestaurantes(prev => 
      prev.map(r => 
        r.id === restauranteId 
          ? { ...r, items: r.items.map(i => i.id === item.id ? { ...i, nombre } : i) } 
          : r
      )
    );
  };

  const actualizarCantidadItem = (cantidadStr) => {
    const cantidad = parseInt(cantidadStr) || 1;
    setRestaurantes(prev => 
      prev.map(r => 
        r.id === restauranteId 
          ? { 
              ...r, 
              items: r.items.map(i => {
                if(i.id === item.id) {
                  return { 
                    ...i, 
                    cantidad: cantidad > 0 ? cantidad : 1,
                    personasAsignadas: cantidad !== i.cantidad ? [] : i.personasAsignadas
                  };
                }
                return i;
              }) 
            } 
          : r
      )
    );
  };

  const actualizarPrecioItem = (precioStr) => {
    const precio = parseFloat(precioStr) || 0;
    setRestaurantes(prev => 
      prev.map(r => 
        r.id === restauranteId 
          ? { ...r, items: r.items.map(i => i.id === item.id ? { ...i, precio } : i) } 
          : r
      )
    );
  };

  const calcularPrecioUnitario = () => {
    return item.cantidad > 0 ? item.precio / item.cantidad : 0;
  };

  const verificarAsignacionCompleta = () => {
    const totalAsignado = item.personasAsignadas.reduce(
      (total, asignacion) => total + asignacion.cantidad, 
      0
    );
    return Math.abs(totalAsignado - item.cantidad) < 0.01; // Usar una pequeña tolerancia para valores decimales
  };

  const calcularUnidadesPorAsignar = () => {
    const totalAsignado = item.personasAsignadas.reduce(
      (total, asignacion) => total + asignacion.cantidad, 
      0
    );
    return item.cantidad - totalAsignado;
  };

  // Nueva función para dividir equitativamente entre todas las personas
  const dividirEntreTodos = () => {
    const cantidadPersonas = personas.length;
    if (cantidadPersonas <= 0) return;
    
    // Cada persona recibe la misma cantidad
    const cantidadPorPersona = item.cantidad / cantidadPersonas;
    
    const nuevasAsignaciones = personas.map(persona => ({
      personaId: persona.id,
      cantidad: cantidadPorPersona
    }));
    
    actualizarAsignaciones(nuevasAsignaciones);
    setTipoAsignacion('compartido');
  };
  
  // Nueva función para dividir entre las personas seleccionadas
  const dividirEntreSeleccionados = () => {
    // Filtrar las personas que están seleccionadas actualmente
    const personasSeleccionadas = item.personasAsignadas
      .filter(asignacion => asignacion.cantidad > 0)
      .map(asignacion => asignacion.personaId);
    
    if (personasSeleccionadas.length <= 0) {
      // Si no hay personas seleccionadas, mostrar mensaje o usar todas
      return;
    }
    
    // Cada persona seleccionada recibe la misma cantidad
    const cantidadPorPersona = item.cantidad / personasSeleccionadas.length;
    
    const nuevasAsignaciones = item.personasAsignadas.map(asignacion => ({
      ...asignacion,
      cantidad: personasSeleccionadas.includes(asignacion.personaId) ? cantidadPorPersona : 0
    }));
    
    actualizarAsignaciones(nuevasAsignaciones);
    setTipoAsignacion('compartido');
  };
  
  // Función auxiliar para actualizar las asignaciones
  const actualizarAsignaciones = (nuevasAsignaciones) => {
    setRestaurantes(prev => 
      prev.map(r => {
        if (r.id === restauranteId) {
          return {
            ...r,
            items: r.items.map(i => {
              if (i.id === item.id) {
                return { ...i, personasAsignadas: nuevasAsignaciones };
              }
              return i;
            })
          };
        }
        return r;
      })
    );
  };

  const toggleItemAPersona = (personaId) => {
    setRestaurantes(prev => 
      prev.map(r => {
        if(r.id === restauranteId) {
          return {
            ...r,
            items: r.items.map(i => {
              if(i.id === item.id) {
                const asignacionExistente = i.personasAsignadas.find(a => a.personaId === personaId);
                
                let nuevasAsignaciones;
                if(asignacionExistente) {
                  // Eliminar asignación
                  nuevasAsignaciones = i.personasAsignadas.filter(a => a.personaId !== personaId);
                } else {
                  // Agregar asignación
                  const cantidadDisponible = calcularUnidadesPorAsignar();
                  if(cantidadDisponible <= 0) return i;
                  
                  nuevasAsignaciones = [
                    ...i.personasAsignadas,
                    { personaId, cantidad: 1 }
                  ];
                }
                
                return { ...i, personasAsignadas: nuevasAsignaciones };
              }
              return i;
            })
          };
        }
        return r;
      })
    );
  };

  const actualizarCantidadAsignada = (personaId, cantidadStr) => {
    const cantidad = parseInt(cantidadStr) || 0;
    
    setRestaurantes(prev => 
      prev.map(r => {
        if(r.id === restauranteId) {
          return {
            ...r,
            items: r.items.map(i => {
              if(i.id === item.id) {
                if(cantidad <= 0) {
                  // Eliminar asignación si cantidad es 0
                  return { 
                    ...i, 
                    personasAsignadas: i.personasAsignadas.filter(a => a.personaId !== personaId)
                  };
                }
                
                // Actualizar cantidad de la asignación
                return {
                  ...i,
                  personasAsignadas: i.personasAsignadas.map(a => 
                    a.personaId === personaId ? { ...a, cantidad } : a
                  )
                };
              }
              return i;
            })
          };
        }
        return r;
      })
    );
  };

  const asignarAutomaticamente = () => {
    setRestaurantes(prev => 
      prev.map(r => {
        if(r.id === restauranteId) {
          return {
            ...r,
            items: r.items.map(i => {
              if(i.id === item.id) {
                // Calcular cuántas unidades quedan por asignar
                const unidadesPorAsignar = calcularUnidadesPorAsignar();
                if(unidadesPorAsignar <= 0) return i;
                
                // Distribuir equitativamente entre todas las personas
                const personasSeleccionadas = i.personasAsignadas.map(a => a.personaId);
                const personasDisponibles = personas.filter(p => !personasSeleccionadas.includes(p.id));
                
                if(personasDisponibles.length === 0) return i;
                
                const unidadesPorPersona = Math.ceil(unidadesPorAsignar / personasDisponibles.length);
                
                const nuevasAsignaciones = [
                  ...i.personasAsignadas,
                  ...personasDisponibles.map((persona, idx) => {
                    const esUltima = idx === personasDisponibles.length - 1;
                    const cantidadAsignada = esUltima 
                      ? Math.min(unidadesPorAsignar - (unidadesPorPersona * idx), unidadesPorPersona)
                      : Math.min(unidadesPorPersona, unidadesPorAsignar);
                    
                    return { 
                      personaId: persona.id, 
                      cantidad: cantidadAsignada
                    };
                  })
                ];
                
                return { ...i, personasAsignadas: nuevasAsignaciones };
              }
              return i;
            })
          };
        }
        return r;
      })
    );
  };

  return (
    <div className={`border p-3 rounded ${tipoAsignacion === 'compartido' ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block mb-1 text-sm font-medium">Cantidad</label>
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => actualizarCantidadItem(e.target.value)}
            className="p-2 border rounded w-full text-sm"
            min="1"
            step="1"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={item.nombre}
            onChange={(e) => actualizarNombreItem(e.target.value)}
            className="p-2 border rounded w-full text-sm"
            placeholder="Nombre del ítem"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Precio total</label>
          <input
            type="number"
            value={item.precio}
            onChange={(e) => actualizarPrecioItem(e.target.value)}
            className="p-2 border rounded w-full text-sm"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Asignar a personas</label>
          <div className="text-sm text-gray-600">
            Precio unitario: ${calcularPrecioUnitario().toFixed(2)} <span className="text-xs">(sin propina)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 mb-3">
          <div className="text-xs font-medium">Tipo:</div>
          <div className="flex space-x-1">
            <button
              onClick={() => setTipoAsignacion('individual')}
              className={`px-2 py-1 text-xs rounded-full flex items-center ${
                tipoAsignacion === 'individual' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <IconIndividual className="mr-1" /> Individual
            </button>
            <button
              onClick={() => setTipoAsignacion('compartido')}
              className={`px-2 py-1 text-xs rounded-full flex items-center ${
                tipoAsignacion === 'compartido' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <IconGroup className="mr-1" /> Compartido
            </button>
          </div>
        </div>
        
        {tipoAsignacion === 'compartido' && (
          <div className="bg-blue-100 p-2 rounded mb-3">
            <p className="text-xs text-blue-800 mb-2">
              Este ítem será compartido entre varias personas.
            </p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={dividirEntreTodos}
                className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
              >
                <IconDivide className="mr-1" /> Dividir entre todos
              </button>
              <button 
                onClick={dividirEntreSeleccionados}
                className="bg-indigo-600 text-white px-2 py-1 text-xs rounded hover:bg-indigo-700 transition-colors flex items-center"
                disabled={item.personasAsignadas.length === 0}
              >
                <IconGroup className="mr-1" /> Dividir entre seleccionados
              </button>
            </div>
          </div>
        )}
        
        <div className={`p-2 mt-1 mb-2 text-xs rounded ${
          verificarAsignacionCompleta() 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {verificarAsignacionCompleta() 
            ? (
            <span className="text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              Asignado completamente
            </span>
            ) : (
            <span className="text-orange-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Faltan {calcularUnidadesPorAsignar().toFixed(2)} por asignar
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Precio unitario: ${calcularPrecioUnitario().toFixed(2)}
          </span>
          
          {item.personasAsignadas.length > 0 && (
            <span className="text-xs bg-blue-100 px-2 py-1 rounded flex items-center">
              <IconUser className="mr-1" />
              {item.personasAsignadas.length} {item.personasAsignadas.length === 1 ? 'persona' : 'personas'}
            </span>
          )}
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button 
          onClick={() => setMostrarDetalles(!mostrarDetalles)} 
          className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center transition-colors"
        >
          {mostrarDetalles ? 'Ocultar detalles' : 'Mostrar detalles'}
          <svg 
            className={`w-3 h-3 ml-1 transition-transform ${mostrarDetalles ? 'transform rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
        
        <button 
          onClick={() => setMostrarAsignaciones(!mostrarAsignaciones)} 
          className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center transition-colors"
        >
          {mostrarAsignaciones ? 'Ocultar asignaciones' : 'Asignar a personas'}
          <svg 
            className={`w-3 h-3 ml-1 transition-transform ${mostrarAsignaciones ? 'transform rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
        
        <button
          onClick={() => onEliminar(item.id)}
          className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center ml-auto transition-colors"
        >
          <IconTrash className="mr-1" /> Eliminar
        </button>
      </div>
      
      {/* Detalles expandibles */}
      {mostrarDetalles && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <h4 className="font-medium mb-2">Opciones avanzadas</h4>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-xs font-medium">Tipo de asignación:</div>
            <div className="flex space-x-1">
              <button
                onClick={() => setTipoAsignacion('individual')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  tipoAsignacion === 'individual' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <IconIndividual className="mr-1" /> Individual
              </button>
              <button
                onClick={() => setTipoAsignacion('compartido')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  tipoAsignacion === 'compartido' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <IconGroup className="mr-1" /> Compartido
              </button>
            </div>
          </div>
          
          {tipoAsignacion === 'compartido' && (
            <div className="bg-blue-100 p-2 rounded mb-3">
              <p className="text-xs text-blue-800 mb-2">
                Este ítem será compartido entre varias personas.
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={dividirEntreTodos}
                  className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700 transition-colors flex items-center"
                >
                  <IconDivide className="mr-1" /> Dividir entre todos
                </button>
                <button 
                  onClick={dividirEntreSeleccionados}
                  className="bg-indigo-600 text-white px-2 py-1 text-xs rounded hover:bg-indigo-700 transition-colors flex items-center"
                  disabled={item.personasAsignadas.length === 0}
                >
                  <IconGroup className="mr-1" /> Dividir entre seleccionados
                </button>
              </div>
            </div>
          )}
          
          {!verificarAsignacionCompleta() && (
            <button 
              onClick={asignarAutomaticamente}
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              Asignar automáticamente
            </button>
          )}
        </div>
      )}
      
      {/* Asignación a personas - Visible solo si se expande */}
      {mostrarAsignaciones && (
        <div className="border-t pt-3 mt-3">
          <div className="mb-2 flex justify-between items-center">
            <h4 className="font-medium text-sm">Asignar a personas:</h4>
            {item.personasAsignadas.length > 0 && (
              <div className="text-xs text-gray-500">
                {tipoAsignacion === 'compartido' ? 'Fracciones permitidas' : 'Unidades enteras'}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {personas.map(persona => {
              const asignacion = item.personasAsignadas.find(a => a.personaId === persona.id);
              const cantidadAsignada = asignacion ? asignacion.cantidad : 0;
              
              return (
                <div key={persona.id} className={`flex items-center space-x-2 border p-1.5 rounded text-sm ${
                  cantidadAsignada > 0 ? 'bg-blue-50 border-blue-200' : ''
                }`}>
                  <input
                    type="checkbox"
                    id={`persona-${persona.id}-item-${item.id}`}
                    checked={cantidadAsignada > 0}
                    onChange={() => toggleItemAPersona(persona.id)}
                    className="mr-1"
                  />
                  <label 
                    htmlFor={`persona-${persona.id}-item-${item.id}`}
                    className="flex-grow truncate cursor-pointer"
                  >
                    {persona.nombre}
                  </label>
                  
                  {cantidadAsignada > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">Cant:</span>
                      <input
                        type="number"
                        value={cantidadAsignada}
                        onChange={(e) => actualizarCantidadAsignada(persona.id, e.target.value)}
                        className="p-1 border rounded w-14 text-center text-xs"
                        min={tipoAsignacion === 'compartido' ? "0.01" : "1"}
                        max={item.cantidad}
                        step={tipoAsignacion === 'compartido' ? "0.01" : "1"}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {verificarAsignacionCompleta() && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 text-xs rounded flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Todas las unidades asignadas correctamente
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemConsumido;