import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const ShareResults = ({ resultados, personaPagadora }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const resultadosRef = useRef(null);

  // Función para generar la imagen de los resultados
  const generarImagen = async () => {
    if (!resultadosRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(resultadosRef.current, {
        scale: 2, // Mayor calidad
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      setShareImage(imgData);
      return imgData;
    } catch (error) {
      console.error("Error al generar la imagen:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para compartir usando Web Share API
  const compartir = async () => {
    let imgData = shareImage;
    
    if (!imgData) {
      imgData = await generarImagen();
    }
    
    if (!imgData) return;
    
    // Convertir base64 a blob para compartir
    const convertBase64ToBlob = async (base64) => {
      const response = await fetch(base64);
      const blob = await response.blob();
      return blob;
    };
    
    try {
      const blob = await convertBase64ToBlob(imgData);
      const file = new File([blob], 'cuanto-te-debo.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: '¿Cuánto te debo?',
          text: `Resumen de la cuenta pagada por ${personaPagadora.nombre}`,
          files: [file]
        });
      } else {
        // Si Web Share API no está disponible, ofrecer descarga
        descargarImagen();
      }
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  // Función para descargar la imagen generada
  const descargarImagen = async () => {
    let imgData = shareImage;
    
    if (!imgData) {
      imgData = await generarImagen();
    }
    
    if (!imgData) return;
    
    const link = document.createElement('a');
    link.download = 'cuanto-te-debo.png';
    link.href = imgData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6">
      <div
        ref={resultadosRef}
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-blue-600">¿Cuánto te debo?</h3>
          <p className="text-sm text-gray-500">Creado por CubitDev.com</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <p className="font-medium text-center">
            {personaPagadora.nombre} pagó ${resultados.total.toFixed(2)}
          </p>
        </div>
        
        <div className="space-y-2">
          {resultados.deudas
            .filter(d => !d.esPagador)
            .map((deuda, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <span>{deuda.persona.nombre}</span>
                <span className="font-bold">${deuda.total.toFixed(2)}</span>
              </div>
            ))
          }
        </div>
        
        <div className="mt-4 pt-2 border-t text-center">
          <div className="text-lg font-bold text-green-700">
            Total a recuperar: ${resultados.totalARecuperar.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={compartir}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          {isGenerating ? 'Generando...' : 'Compartir imagen'}
        </button>
        
        <button
          onClick={descargarImagen}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Descargar imagen
        </button>
      </div>
    </div>
  );
};

export default ShareResults;
