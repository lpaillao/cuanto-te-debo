import { useAppContext } from '../context/AppContext';

// Iconos SVG inline
const IconHistory = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const IconSave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
  </svg>
);

const IconNew = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const ToolbarDivider = ({ onToggleHistorial }) => {
  const { 
    grupoActual,
    guardarComoNuevoGrupo,
    actualizarGrupo,
    crearNuevaSesion
  } = useAppContext();

  const handleNuevoGrupo = () => {
    if (window.confirm('¿Quieres crear una nueva salida? Se descartarán los cambios no guardados.')) {
      crearNuevaSesion();
    }
  };

  const handleGuardar = () => {
    if (grupoActual) {
      actualizarGrupo(grupoActual);
      alert('Cambios guardados correctamente');
    } else {
      const nombre = prompt('Ingresa un nombre para esta salida:');
      if (nombre) {
        guardarComoNuevoGrupo(nombre);
        alert('Salida guardada correctamente');
      }
    }
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleNuevoGrupo}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center text-sm"
          >
            <IconNew className="mr-1" /> <span className="hidden sm:inline">Nueva salida</span>
          </button>
          <button 
            onClick={handleGuardar}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center text-sm"
          >
            <IconSave className="mr-1" /> <span className="hidden sm:inline">Guardar</span>
          </button>
        </div>
        
        <button 
          onClick={onToggleHistorial}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded flex items-center text-sm"
        >
          <IconHistory className="mr-1" /> <span className="hidden sm:inline">Historial</span>
        </button>
      </div>
    </div>
  );
};

export default ToolbarDivider;
