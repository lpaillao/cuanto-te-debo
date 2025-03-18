import { useAppContext } from '../context/AppContext';

const ResultadosSection = () => {
  const { calcularResultados, personas, pagador, modoPropina, setModoPropina } = useAppContext();
  const resultados = calcularResultados();
  
  const personaPagadora = personas.find(p => p.id === pagador);
  const deudores = resultados.deudas.filter(d => !d.esPagador);
  
  // Crear un objeto más descriptivo para mostrar los totales del restaurante
  const totalesRestaurantes = {
    subtotal: resultados.deudas.reduce((sum, d) => sum + d.subtotal, 0).toFixed(2),
    propina: resultados.deudas.reduce((sum, d) => sum + d.propina, 0).toFixed(2),
    total: resultados.total.toFixed(2)
  };
  
  return (
    <section className="mt-10 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Resultados</h2>
      
      {/* Selector de modo de propina */}
      <div className="mb-6 bg-gray-100 p-4 rounded">
        <h3 className="font-medium mb-2">Modo de cálculo de propina</h3>
        <div className="flex space-x-4">
          <label className="flex items-center cursor-pointer">
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
          
          <label className="flex items-center cursor-pointer">
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
        
        <div className="mt-2 text-xs text-gray-600">
          {modoPropina === 'proporcional' ? 
            "La propina se distribuye según el consumo de cada persona." : 
            "La propina se divide por igual entre todas las personas que consumieron algo."
          }
        </div>
      </div>
      
      {/* Panel informativo principal */}
      <div className="bg-blue-50 p-4 rounded mb-6 border border-blue-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <p className="font-bold text-lg mb-2 md:mb-0">
            {personaPagadora.nombre} pagó la cuenta total:
            <span className="text-blue-700 ml-2">${resultados.total.toFixed(2)}</span>
          </p>
          <div className="bg-white px-3 py-1 rounded-full border border-blue-300 text-sm font-medium">
            {resultados.deudas.length} personas
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Parte correspondiente al pagador */}
          <div className="bg-blue-100 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">Parte de {personaPagadora.nombre}:</span>
                <div className="text-sm text-gray-600 mt-1">
                  (ya incluida en el pago que realizó)
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">${resultados.infoPagador.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{resultados.infoPagador.porcentajeDelTotal.toFixed(1)}% del total</div>
              </div>
            </div>
          </div>

          {/* Parte que debe recuperar de los demás */}
          <div className="bg-green-100 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">A recuperar:</span>
                <div className="text-sm text-gray-600 mt-1">
                  (lo que los demás deben pagar)
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-700">${resultados.totalARecuperar.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{((resultados.totalARecuperar / resultados.total) * 100).toFixed(1)}% del total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 text-center text-sm bg-white border rounded p-2">
          <div>
            <div className="font-medium">Subtotal</div>
            <div>${totalesRestaurantes.subtotal}</div>
          </div>
          <div>
            <div className="font-medium">Propina</div>
            <div>${totalesRestaurantes.propina}</div>
          </div>
          <div>
            <div className="font-medium">Total pagado</div>
            <div className="font-bold">${totalesRestaurantes.total}</div>
          </div>
        </div>
      </div>
      
      {/* Tabla resumen */}
      <div className="overflow-hidden mb-6 bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Persona</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Subtotal</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Propina</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">%</th>
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
                <td className="px-3 py-4 text-right text-sm">{deuda.porcentajeDelTotal.toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-4 pl-4 pr-3 text-sm">TOTAL GENERAL</td>
              <td className="px-3 py-4 text-right text-sm">
                ${resultados.deudas.reduce((sum, d) => sum + d.subtotal, 0).toFixed(2)}
              </td>
              <td className="px-3 py-4 text-right text-sm">
                ${resultados.deudas.reduce((sum, d) => sum + d.propina, 0).toFixed(2)}
              </td>
              <td className="px-3 py-4 text-right text-sm">${resultados.total.toFixed(2)}</td>
              <td className="px-3 py-4 text-right text-sm">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Detalles de deudores */}
      {deudores.length > 0 && (
        <>
          <h3 className="font-bold text-lg mb-4">Detalle de pagos a {personaPagadora.nombre}:</h3>
          <div className="divide-y">
            {deudores.map((deuda, index) => (
              <div key={index} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{deuda.persona.nombre}</span> debe pagar:
                  </div>
                  <div className="text-xl font-bold text-green-600">${deuda.total.toFixed(2)}</div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Subtotal: ${deuda.subtotal.toFixed(2)}</div>
                    <div>Propina: ${deuda.propina.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-6 bg-green-50 p-4 rounded border border-green-200">
        <div className="flex justify-between items-center text-lg">
          <div className="font-semibold">Total a recuperar por {personaPagadora.nombre}:</div>
          <div className="font-bold text-green-700">
            ${resultados.totalARecuperar.toFixed(2)}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Esta es la cantidad total que los demás deben pagar a {personaPagadora.nombre} para compensar el pago que realizó.
        </p>
      </div>
      
      <div className="mt-6 bg-gray-100 p-3 rounded text-sm text-gray-700">
        <h4 className="font-semibold mb-1">¿Cómo se calculó la propina?</h4>
        <p>
          {modoPropina === 'proporcional' ? 
            "La propina se calcula sobre el subtotal de cada restaurante y se distribuye proporcionalmente según lo consumido por cada persona." : 
            "La propina se calcula sobre el subtotal de cada restaurante y se divide equitativamente entre todas las personas que consumieron."
          }
        </p>
      </div>
    </section>
  );
};

export default ResultadosSection;
