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

  const toggleHistorial = () => {
    setHistorialAbierto(!historialAbierto);
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
        
        <PersonasSection />
        
        <RestaurantesSection />
        
        <ResultadosSection />
      </div>
      
      <footer className="text-center text-xs text-gray-500 mb-8">
        © {new Date().getFullYear()} - Aplicación para dividir cuentas por CubitDev.com
      </footer>
    </>
  );
};

export default CuantoTeDeboDivider;
