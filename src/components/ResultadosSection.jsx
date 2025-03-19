import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ShareResults from './ShareResults';

const ResultadosSection = () => {
  const { calcularResultados, personas, pagador, modoPropina, setModoPropina } = useAppContext();
  const resultados = calcularResultados();
  
  const personaPagadora = personas.find(p => p.id === pagador);
  const deudores = resultados.deudas.filter(d => !d.esPagador);
  
  // Estados para controlar la visibilidad de secciones
  const [mostrarDetalleDeudores, setMostrarDetalleDeudores] = useState(false);
  const [mostrarTablaCompleta, setMostrarTablaCompleta] = useState(false);
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [mostrarAyudaPropina, setMostrarAyudaPropina] = useState(false);
  
  // Crear un objeto más descriptivo para mostrar los totales del restaurante
  const totalesRestaurantes = {
    subtotal: resultados.deudas.reduce((sum, d) => sum + d.subtotal, 0).toFixed(2),
    propina: resultados.deudas.reduce((sum, d) => sum + d.propina, 0).toFixed(2),
    total: resultados.total.toFixed(2)
  };
  
  return (
    <section>
      {/* Selector de modo de propina */}
      <div className="mb-6 bg-gray-100 p-4 rounded">
        <h3 className="font-medium mb-2 flex items-center justify-between">
          <span>Modo de cálculo de propina</span>
          <button 
            onClick={() => setMostrarAyudaPropina(!mostrarAyudaPropina)}
            className="text-blue-600 text-xs flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
            </svg>
            {mostrarAyudaPropina ? 'Ocultar ayuda' : 'Ayuda'}
          </button>
        </h3>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center cursor-pointer px-3 py-2 bg-white rounded-full border">
            <input
              type="radio"
              name="modoPropina"
              checked={modoPropina === 'proporcional'}
              onChange={() => setModoPropina('proporcional')}
              className="mr-2"
            />
            <span className="text-sm">Proporcional al consumo</span>
            <span className="text-xs text-gray-500 ml-1">(recomendado)</span>
          </label>
          
          <label className="flex items-center cursor-pointer px-3 py-2 bg-white rounded-full border">
            <input
              type="radio"
              name="modoPropina"
              checked={modoPropina === 'dividido'}
              onChange={() => setModoPropina('dividido')}
              className="mr-2"
            />
            <span className="text-sm">Dividido equitativamente</span>
          </label>
        </div>
        
        {mostrarAyudaPropina && (
          <div className="mt-3 p-3 bg-blue-50 text-sm rounded border border-blue-200">
            <h4 className="font-semibold mb-2">¿Cómo funciona el cálculo de propina?</h4>
            <p className="mb-2">
              <strong>Proporcional al consumo:</strong> La propina se distribuye según lo consumido por cada persona.
              <br />
              <em className="text-xs">Ejemplo: Si Juan consume el 60% del total, pagará el 60% de la propina.</em>
            </p>
            <p>
              <strong>Dividido equitativamente:</strong> La propina se divide por igual entre todos los que consumieron.
              <br />
              <em className="text-xs">Ejemplo: Si hay 5 personas, cada una pagará 1/5 de la propina total, independientemente de lo que consumió.</em>
            </p>
          </div>
        )}
      </div>
      
      {/* Panel informativo principal - Resumen compacto */}
      <div className="bg-blue-50 p-4 rounded mb-6 border border-blue-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <p className="font-bold text-lg mb-2 md:mb-0">
            {personaPagadora.nombre} pagó:
            <span className="text-blue-700 ml-2">${resultados.total.toFixed(2)}</span>
          </p>
          <div className="bg-white px-3 py-1 rounded-full border border-blue-300 text-sm font-medium">
            {resultados.deudas.length} personas
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Parte correspondiente al pagador */}
          <div className="bg-blue-100 p-3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Su parte:</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">${resultados.infoPagador.total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Parte que debe recuperar de los demás */}
          <div className="bg-green-100 p-3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">A recuperar:</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-700">${resultados.totalARecuperar.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para mostrar más detalles */}
        <button 
          onClick={() => setMostrarTablaCompleta(!mostrarTablaCompleta)}
          className="w-full py-2 text-center text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
        >
          {mostrarTablaCompleta ? 'Ocultar detalles completos' : 'Ver detalles completos'}
          <svg 
            className={`w-4 h-4 inline ml-1 transition-transform ${mostrarTablaCompleta ? 'transform rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
      
      {/* Tabla resumen - Visible solo si se expande */}
      {mostrarTablaCompleta && (
        <div className="overflow-x-auto mb-6 bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Persona</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Subtotal</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Propina</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {resultados.deudas.map((deuda, index) => (
                <tr key={index} className={deuda.esPagador ? "bg-blue-50" : ""}>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium">
                    {deuda.persona.nombre} {deuda.esPagador && <span className="text-blue-600">(Pagador)</span>}
                  </td>
                  <td className="px-3 py-4 text-right text-sm">${deuda.subtotal.toFixed(2)}</td>
                  <td className="px-3 py-4 text-right text-sm">${deuda.propina.toFixed(2)}</td>
                  <td className="px-3 py-4 text-right text-sm font-medium">${deuda.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-4 pl-4 pr-3 text-sm">TOTAL GENERAL</td>
                <td className="px-3 py-4 text-right text-sm">${totalesRestaurantes.subtotal}</td>
                <td className="px-3 py-4 text-right text-sm">${totalesRestaurantes.propina}</td>
                <td className="px-3 py-4 text-right text-sm">${totalesRestaurantes.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Tarjetas de deudores - Visión resumida siempre visible */}
      {deudores.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Resumen de pagos:</h3>
            <button 
              onClick={() => setMostrarDetalleDeudores(!mostrarDetalleDeudores)}
              className="text-blue-600 text-sm flex items-center"
            >
              {mostrarDetalleDeudores ? 'Ocultar detalles' : 'Ver detalles'}
              <svg 
                className={`w-4 h-4 ml-1 transition-transform ${mostrarDetalleDeudores ? 'transform rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deudores.map((deuda, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{deuda.persona.nombre}</span>
                  <span className="text-lg font-bold text-green-600">${deuda.total.toFixed(2)}</span>
                </div>
                
                {mostrarDetalleDeudores && (
                  <div className="mt-2 pt-2 border-t text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <div>Subtotal: ${deuda.subtotal.toFixed(2)}</div>
                    <div>Propina: ${deuda.propina.toFixed(2)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Resumen de monto a recuperar */}
      <div className="mt-6 bg-green-50 p-4 rounded border border-green-200">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Total a recuperar:</div>
          <div className="font-bold text-green-700 text-lg">
            ${resultados.totalARecuperar.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Botón para compartir resultados */}
      <div className="mt-6">
        <button 
          onClick={() => setMostrarCompartir(!mostrarCompartir)}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
          </svg>
          {mostrarCompartir ? 'Ocultar opciones para compartir' : 'Compartir resultados'}
        </button>
      </div>
      
      {/* Sección para compartir resultados - Solo visible cuando se solicita */}
      {mostrarCompartir && (
        <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Genera una imagen con el resumen de la cuenta para compartir con los demás participantes.
          </p>
          
          <ShareResults 
            resultados={resultados} 
            personaPagadora={personaPagadora} 
          />
        </div>
      )}
      
      {/* Indicador de página completada */}
      <div className="mt-8 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 flex items-center justify-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="font-medium">¡Listo! Ahora puedes ver y compartir los resultados</span>
      </div>
    </section>
  );
};

export default ResultadosSection;
