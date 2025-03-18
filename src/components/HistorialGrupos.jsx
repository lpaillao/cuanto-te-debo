import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

// Iconos SVG inline
const IconSave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const IconNew = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HistorialGrupos = ({ isOpen, onClose }) => {
  const { 
    grupos, 
    grupoActual, 
    guardarComoNuevoGrupo, 
    actualizarGrupo, 
    cargarGrupo, 
    eliminarGrupo,
    crearNuevaSesion,
    calcularResultados
  } = useAppContext();
  
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const handleGuardarGrupo = () => {
    if (grupoActual) {
      actualizarGrupo(grupoActual);
    } else {
      setMostrarFormulario(true);
    }
  };
  
  const handleGuardarNuevoGrupo = (e) => {
    e.preventDefault();
    guardarComoNuevoGrupo(nuevoNombre.trim() || null);
    setNuevoNombre('');
    setMostrarFormulario(false);
  };
  
  const handleCargarGrupo = (grupoId) => {
    cargarGrupo(grupoId);
    onClose(); // Cerrar el panel después de cargar
  };
  
  const handleNuevoGrupo = () => {
    crearNuevaSesion();
    onClose(); // Cerrar el panel después de crear nueva sesión
  };
  
  const confirmarEliminar = (grupoId, e) => {
    e.stopPropagation(); // Prevenir que se propague al hacer clic en el botón
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      eliminarGrupo(grupoId);
    }
  };
  
  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera en móviles */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity z-30 md:hidden ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      ></div>
      
      {/* Panel lateral */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-800">Historial de Salidas</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Cerrar panel"
          >
            <IconClose />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleNuevoGrupo}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
            >
              <IconNew className="mr-1" /> Nueva salida
            </button>
            
            {grupoActual ? (
              <button
                onClick={handleGuardarGrupo}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                <IconSave className="mr-1" /> Guardar cambios
              </button>
            ) : (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                <IconSave className="mr-1" /> Guardar actual
              </button>
            )}
          </div>
          
          {mostrarFormulario && (
            <div className="mb-4 p-3 border rounded bg-gray-50">
              <form onSubmit={handleGuardarNuevoGrupo}>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Nombre de esta salida"
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex-1"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {grupoActual && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200 mb-4">
              <p className="text-sm">
                <span className="font-medium">Editando:</span> {grupos.find(g => g.id === grupoActual)?.nombre}
              </p>
            </div>
          )}
          
          <h4 className="font-medium text-sm mb-2 text-gray-600">SALIDAS GUARDADAS</h4>
          
          {grupos.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No hay salidas guardadas aún.</p>
          ) : (
            <div className="space-y-2">
              {grupos.map(grupo => {
                const fecha = new Date(grupo.fecha).toLocaleDateString();
                const estaActivo = grupo.id === grupoActual;
                
                return (
                  <div 
                    key={grupo.id} 
                    onClick={() => handleCargarGrupo(grupo.id)}
                    className={`border p-3 rounded cursor-pointer hover:bg-gray-50 ${
                      estaActivo ? 'bg-blue-50 border-blue-300' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{grupo.nombre}</div>
                      <button
                        onClick={(e) => confirmarEliminar(grupo.id, e)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar esta salida"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {fecha}
                    </div>
                    <div className="text-sm font-medium text-blue-600 mt-1">
                      Total: ${grupo.total?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorialGrupos;
