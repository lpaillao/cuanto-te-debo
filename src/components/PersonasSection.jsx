import { useAppContext } from '../context/AppContext';

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

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const PersonasSection = () => {
  const { personas, agregarPersona, eliminarPersona, pagador, actualizarPagador, setPersonas } = useAppContext();

  const handleActualizarNombrePersona = (id, nuevoNombre) => {
    setPersonas(prevPersonas => 
      prevPersonas.map(p => p.id === id ? { ...p, nombre: nuevoNombre } : p)
    );
  };

  return (
    <section className="mb-6">
      <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center">
        <IconUser className="mr-2" /> Personas
      </h2>
      <div className="space-y-2 mb-3">
        {personas.map(persona => (
          <div key={persona.id} className="flex items-center">
            <input
              type="text"
              value={persona.nombre}
              onChange={(e) => handleActualizarNombrePersona(persona.id, e.target.value)}
              className="p-2 border rounded flex-grow text-sm"
              placeholder="Nombre de la persona"
            />
            <button
              onClick={() => eliminarPersona(persona.id)}
              className="ml-2 bg-red-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
              disabled={personas.length <= 1}
              aria-label="Eliminar persona"
            >
              <IconTrash />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <button 
          onClick={agregarPersona}
          className="bg-green-500 text-white px-3 py-2 rounded flex items-center justify-center sm:justify-start"
        >
          <IconPlus className="mr-1" /> Agregar Persona
        </button>

        <div className="flex items-center mt-2 sm:mt-0">
          <label htmlFor="pagador" className="font-medium text-sm mr-2 whitespace-nowrap">¿Quién pagó?</label>
          <select
            id="pagador"
            value={pagador}
            onChange={(e) => actualizarPagador(e.target.value)}
            className="p-2 border rounded flex-grow text-sm"
          >
            {personas.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default PersonasSection;
