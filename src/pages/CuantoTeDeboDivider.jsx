import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import PersonasSection from '../components/PersonasSection';
import RestaurantesSection from '../components/RestaurantesSection';
import ResultadosSection from '../components/ResultadosSection';
import HistorialGrupos from '../components/HistorialGrupos';
import ToolbarDivider from '../components/ToolbarDivider';

const CuantoTeDeboDivider = () => {
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const { grupoActual, grupos } = useAppContext();
  // Nuevo estado para manejar los pasos del asistente
  const [pasoActual, setPasoActual] = useState(1);
  // Estado para controlar la expansión de las secciones
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    personas: true,
    restaurantes: false,
    resultados: false
  });

  const toggleHistorial = () => {
    setHistorialAbierto(!historialAbierto);
  };

  // Función para avanzar al siguiente paso
  const avanzarPaso = () => {
    if (pasoActual < 3) {
      const nuevoPaso = pasoActual + 1;
      setPasoActual(nuevoPaso);
      
      // Actualizar las secciones expandidas según el paso
      if (nuevoPaso === 2) {
        setSeccionesExpandidas({
          personas: false,
          restaurantes: true,
          resultados: false
        });
      } else if (nuevoPaso === 3) {
        setSeccionesExpandidas({
          personas: false,
          restaurantes: false,
          resultados: true
        });
      }
    }
  };

  // Función para retroceder al paso anterior
  const retrocederPaso = () => {
    if (pasoActual > 1) {
      const nuevoPaso = pasoActual - 1;
      setPasoActual(nuevoPaso);
      
      // Actualizar las secciones expandidas según el paso
      if (nuevoPaso === 1) {
        setSeccionesExpandidas({
          personas: true,
          restaurantes: false,
          resultados: false
        });
      } else if (nuevoPaso === 2) {
        setSeccionesExpandidas({
          personas: false,
          restaurantes: true,
          resultados: false
        });
      }
    }
  };

  // Función para expandir o colapsar una sección
  const toggleSeccion = (seccion) => {
    setSeccionesExpandidas(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  // Añadir metadatos para Open Graph y compartir en redes sociales
  useEffect(() => {
    // Actualizar metadatos para facilitar compartir
    document.title = "¿Cuánto te debo? - Divide cuentas fácilmente";
    
    // Agregar metadatos más específicos para SEO y Open Graph
    const metaTags = [
      { property: 'og:title', content: '¿Cuánto te debo? - Divide cuentas fácilmente' },
      { property: 'og:description', content: 'Aplicación web gratuita para dividir cuentas de restaurantes y calcular lo que cada uno debe pagar.' },
      { property: 'og:url', content: 'https://cuanto-te-debo.cubitdev.com' },
      { property: 'og:type', content: 'website' },
      { name: 'description', content: 'Divide cuentas y calcula lo que cada persona debe pagar de forma rápida y sencilla.' }
    ];
    
    // Eliminar metas existentes para evitar duplicados
    document.querySelectorAll('meta[property^="og:"], meta[name="description"]')
      .forEach(el => el.remove());
    
    // Añadir nuevas metas
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([attr, value]) => {
        meta.setAttribute(attr, value);
      });
      document.head.appendChild(meta);
    });
  }, []);

  return (
    <>
      <ToolbarDivider onToggleHistorial={toggleHistorial} />
      
      {/* Panel lateral de historial */}
      <HistorialGrupos 
        isOpen={historialAbierto} 
        onClose={() => setHistorialAbierto(false)} 
      />
      
      <div className="p-2 sm:p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg my-2 sm:my-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-blue-600">¿Cuánto te debo?</h1>
        <p className="text-center text-sm text-gray-600 mb-4">
          La manera más fácil de dividir cuentas y calcular lo que cada uno debe pagar.
        </p>
        
        {/* Indicador de sesión actual */}
        {grupoActual && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <span className="font-medium">Editando: </span> 
            <span className="text-blue-700">{grupos.find(g => g.id === grupoActual)?.nombre}</span>
          </div>
        )}
        
        {/* Indicador de pasos */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700">
              Paso {pasoActual} de 3: {pasoActual === 1 ? 'Participantes' : pasoActual === 2 ? 'Consumos' : 'Resultados'}
            </h2>
            <div className="flex space-x-1">
              {pasoActual > 1 && (
                <button 
                  onClick={retrocederPaso}
                  className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Anterior
                </button>
              )}
              {pasoActual < 3 && (
                <button 
                  onClick={avanzarPaso}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(pasoActual / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Sección de Personas */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg text-left"
            onClick={() => toggleSeccion('personas')}
          >
            <span className="font-medium flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-blue-600 text-white text-xs">1</span>
              Participantes y pagador
            </span>
            <svg 
              className={`w-5 h-5 transition-transform ${seccionesExpandidas.personas ? 'transform rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
          
          <div className={`border-l border-r border-b rounded-b-lg transition-all duration-300 overflow-hidden ${
            seccionesExpandidas.personas ? 'max-h-[2000px] py-4 px-3' : 'max-h-0 opacity-0'
          }`}>
            <PersonasSection />
          </div>
        </div>
        
        {/* Sección de Restaurantes */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg text-left"
            onClick={() => toggleSeccion('restaurantes')}
          >
            <span className="font-medium flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-blue-600 text-white text-xs">2</span>
              Consumos
            </span>
            <svg 
              className={`w-5 h-5 transition-transform ${seccionesExpandidas.restaurantes ? 'transform rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
          
          <div className={`border-l border-r border-b rounded-b-lg transition-all duration-300 overflow-hidden ${
            seccionesExpandidas.restaurantes ? 'max-h-[5000px] py-4 px-3' : 'max-h-0 opacity-0'
          }`}>
            <RestaurantesSection />
          </div>
        </div>
        
        {/* Sección de Resultados */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg text-left"
            onClick={() => toggleSeccion('resultados')}
          >
            <span className="font-medium flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-blue-600 text-white text-xs">3</span>
              Resultados y división
            </span>
            <svg 
              className={`w-5 h-5 transition-transform ${seccionesExpandidas.resultados ? 'transform rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
          
          <div className={`border-l border-r border-b rounded-b-lg transition-all duration-300 overflow-hidden ${
            seccionesExpandidas.resultados ? 'max-h-[5000px] py-4 px-3' : 'max-h-0 opacity-0'
          }`}>
            <ResultadosSection />
          </div>
        </div>
        
        {/* Botones de navegación de pasos (fijos en la parte inferior) */}
        <div className="flex justify-between pt-4 border-t mt-6">
          {pasoActual > 1 ? (
            <button 
              onClick={retrocederPaso}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Paso anterior
            </button>
          ) : (
            <div></div> // Espacio vacío para mantener el justify-between
          )}
          
          {pasoActual < 3 ? (
            <button 
              onClick={avanzarPaso}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              Siguiente paso
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <div></div> // Espacio vacío para mantener el justify-between
          )}
        </div>
      </div>
      
      <footer className="text-center text-xs text-gray-500 mb-8">
        © {new Date().getFullYear()} - Aplicación para dividir cuentas por CubitDev.com
      </footer>
    </>
  );
};

export default CuantoTeDeboDivider;
