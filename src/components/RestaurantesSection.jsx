import { useAppContext } from '../context/AppContext';
import RestauranteItem from './RestauranteItem';

// Iconos SVG inline
const IconRestaurant = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a4 4 0 00-3.945 3.284A8.968 8.968 0 010 10a10 10 0 1120 0c0 2.186-.782 4.184-2.077 5.744A4.003 4.003 0 0012 11z" clipRule="evenodd" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const RestaurantesSection = () => {
  const { restaurantes, agregarRestaurante } = useAppContext();

  return (
    <section className="mb-6">
      <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center">
        <IconRestaurant className="mr-2" /> Restaurantes
      </h2>
      <div className="space-y-4 mb-3">
        {restaurantes.map(restaurante => (
          <RestauranteItem key={restaurante.id} restaurante={restaurante} />
        ))}
      </div>
      <button 
        onClick={agregarRestaurante} 
        className="bg-green-500 text-white px-3 py-2 rounded flex items-center justify-center"
      >
        <IconPlus className="mr-1" /> Agregar Restaurante
      </button>
    </section>
  );
};

export default RestaurantesSection;
