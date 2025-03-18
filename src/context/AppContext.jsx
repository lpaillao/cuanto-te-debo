import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const STORAGE_KEY = 'cuantoTeDeboBoletas';

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // Estado para manejar grupos de boletas
  const [grupos, setGrupos] = useState([]);
  const [grupoActual, setGrupoActual] = useState(null); // ID del grupo seleccionado
  
  // Estados originales
  const [restaurantes, setRestaurantes] = useState([
    {
      id: 1,
      nombre: "Restaurante 1",
      items: [
        { id: 1, nombre: "Ítem 1", precio: 0, cantidad: 1, personasAsignadas: [] }
      ],
      propina: 10
    }
  ]);
  
  const [personas, setPersonas] = useState([
    { id: 1, nombre: "Persona 1" },
    { id: 2, nombre: "Persona 2" }
  ]);
  
  const [pagador, setPagador] = useState(1);
  const [modoPropina, setModoPropina] = useState('proporcional');
  
  // Cargar grupos del localStorage al iniciar
  useEffect(() => {
    const gruposGuardados = localStorage.getItem(STORAGE_KEY);
    if (gruposGuardados) {
      try {
        const data = JSON.parse(gruposGuardados);
        setGrupos(data.grupos || []);
        
        // Si hay un grupo seleccionado, cargar sus datos
        const ultimoGrupo = data.grupoActual ? 
          data.grupos.find(g => g.id === data.grupoActual) : null;
          
        if (ultimoGrupo) {
          setGrupoActual(ultimoGrupo.id);
          setRestaurantes(ultimoGrupo.restaurantes);
          setPersonas(ultimoGrupo.personas);
          setPagador(ultimoGrupo.pagador);
          setModoPropina(ultimoGrupo.modoPropina || 'proporcional');
        }
      } catch (error) {
        console.error("Error al cargar datos del localStorage:", error);
      }
    }
  }, []);
  
  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    if (grupos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        grupos,
        grupoActual
      }));
    }
  }, [grupos, grupoActual]);
  
  // Función para guardar el estado actual como un nuevo grupo
  const guardarComoNuevoGrupo = (nombre) => {
    const ahora = new Date();
    const nuevoGrupo = {
      id: `grupo_${Date.now()}`,
      nombre: nombre || `Salida ${ahora.toLocaleDateString()}`,
      fecha: ahora.toISOString(),
      restaurantes,
      personas,
      pagador,
      modoPropina,
      total: calcularResultados().total
    };
    
    const nuevosGrupos = [...grupos, nuevoGrupo];
    setGrupos(nuevosGrupos);
    setGrupoActual(nuevoGrupo.id);
    
    return nuevoGrupo.id;
  };
  
  // Función para actualizar un grupo existente
  const actualizarGrupo = (grupoId) => {
    if (!grupoId) return;
    
    setGrupos(prevGrupos => prevGrupos.map(grupo => {
      if (grupo.id === grupoId) {
        return {
          ...grupo,
          restaurantes,
          personas,
          pagador,
          modoPropina,
          total: calcularResultados().total,
          fechaActualizacion: new Date().toISOString()
        };
      }
      return grupo;
    }));
  };
  
  // Función para cargar un grupo existente
  const cargarGrupo = (grupoId) => {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return;
    
    setRestaurantes(grupo.restaurantes);
    setPersonas(grupo.personas);
    setPagador(grupo.pagador);
    setModoPropina(grupo.modoPropina || 'proporcional');
    setGrupoActual(grupoId);
  };
  
  // Función para eliminar un grupo
  const eliminarGrupo = (grupoId) => {
    setGrupos(prevGrupos => prevGrupos.filter(g => g.id !== grupoId));
    if (grupoId === grupoActual) {
      setGrupoActual(null);
      // Reiniciar a estado inicial
      setRestaurantes([
        {
          id: 1,
          nombre: "Restaurante 1",
          items: [
            { id: 1, nombre: "Ítem 1", precio: 0, cantidad: 1, personasAsignadas: [] }
          ],
          propina: 10
        }
      ]);
      setPersonas([
        { id: 1, nombre: "Persona 1" },
        { id: 2, nombre: "Persona 2" }
      ]);
      setPagador(1);
    }
  };
  
  // Función para crear una nueva sesión vacía
  const crearNuevaSesion = () => {
    setRestaurantes([
      {
        id: 1,
        nombre: "Restaurante 1",
        items: [
          { id: 1, nombre: "Ítem 1", precio: 0, cantidad: 1, personasAsignadas: [] }
        ],
        propina: 10
      }
    ]);
    setPersonas([
      { id: 1, nombre: "Persona 1" },
      { id: 2, nombre: "Persona 2" }
    ]);
    setPagador(1);
    setGrupoActual(null);
  };
  
  // Funciones originales
  const agregarRestaurante = () => {
    const nuevoId = restaurantes.length > 0 ? Math.max(...restaurantes.map(r => r.id)) + 1 : 1;
    setRestaurantes([...restaurantes, {
      id: nuevoId,
      nombre: `Restaurante ${nuevoId}`,
      items: [{ id: 1, nombre: "Ítem 1", precio: 0, cantidad: 1, personasAsignadas: [] }],
      propina: 10
    }]);
  };
  
  const eliminarRestaurante = (restauranteId) => {
    if (restaurantes.length > 1) {
      // Usar setRestaurantes con función de callback para asegurar el estado más reciente
      setRestaurantes(prevRestaurantes => 
        prevRestaurantes.filter(r => r.id !== restauranteId)
      );
      console.log(`Eliminando restaurante con ID ${restauranteId}`); // Log para depuración
    } else {
      console.log("No se puede eliminar el último restaurante"); // Log para depuración
    }
  };
  
  const agregarPersona = () => {
    const nuevoId = personas.length > 0 ? Math.max(...personas.map(p => p.id)) + 1 : 1;
    setPersonas([...personas, { id: nuevoId, nombre: `Persona ${nuevoId}` }]);
  };
  
  const eliminarPersona = (personaId) => {
    if (personas.length > 1) {
      setPersonas(personas.filter(p => p.id !== personaId));
      
      // Eliminar asignaciones de ítems a esta persona
      setRestaurantes(prevRestaurantes => 
        prevRestaurantes.map(restaurante => ({
          ...restaurante,
          items: restaurante.items.map(item => ({
            ...item,
            personasAsignadas: item.personasAsignadas.filter(
              asignacion => asignacion.personaId !== personaId
            )
          }))
        }))
      );
      
      // Si se elimina al pagador actual, seleccionar otro
      if (personaId === pagador && personas.length > 1) {
        const nuevoPagador = personas.find(p => p.id !== personaId)?.id || 1;
        setPagador(nuevoPagador);
      }
    }
  };
  
  const actualizarPagador = (nuevoId) => {
    setPagador(parseInt(nuevoId));
  };
  
  const calcularResultados = () => {
    // Calcular el total global de los restaurantes (lo que realmente pagó el pagador)
    const totalGlobalRestaurantes = restaurantes.reduce((total, restaurante) => {
      const subtotalRestaurante = restaurante.items.reduce((subtotal, item) => 
        subtotal + (parseFloat(item.precio) || 0), 0);
      
      const propinaRestaurante = subtotalRestaurante * (restaurante.propina / 100);
      return total + subtotalRestaurante + propinaRestaurante;
    }, 0);
    
    // Calcular subtotales por restaurante
    const subtotalesPorRestaurante = restaurantes.map(restaurante => {
      // Subtotal del restaurante (suma de todos los ítems)
      const subtotalRestaurante = restaurante.items.reduce((total, item) => {
        return total + (parseFloat(item.precio) || 0);
      }, 0);
      
      // Propina total para este restaurante
      const propinaTotalRestaurante = subtotalRestaurante * (restaurante.propina / 100);
      
      // Calcular consumo por persona en este restaurante (sin propina)
      const consumoPorPersona = {};
      
      personas.forEach(persona => {
        let subtotalPersona = 0;
        
        restaurante.items.forEach(item => {
          const asignacion = item.personasAsignadas.find(a => a.personaId === persona.id);
          
          if (asignacion) {
            const precioUnitario = item.precio / item.cantidad;
            const subtotalItem = precioUnitario * asignacion.cantidad;
            subtotalPersona += subtotalItem;
          }
        });
        
        consumoPorPersona[persona.id] = subtotalPersona;
      });
      
      return {
        restaurante,
        subtotalRestaurante,
        propinaTotalRestaurante,
        consumoPorPersona
      };
    });
    
    // Inicializar los totales para cada persona
    let deudasPorPersona = personas.reduce((acc, persona) => {
      acc[persona.id] = {
        persona,
        subtotal: 0,
        propina: 0,
        total: 0,
        esPagador: persona.id === pagador
      };
      return acc;
    }, {});
    
    // Distribuir los montos entre las personas
    subtotalesPorRestaurante.forEach(({ restaurante, subtotalRestaurante, propinaTotalRestaurante, consumoPorPersona }) => {
      // Para cada persona, calcular su parte de propina según el modo seleccionado
      const personasConConsumo = personas.filter(p => (consumoPorPersona[p.id] || 0) > 0);
      
      personas.forEach(persona => {
        const subtotalPersona = consumoPorPersona[persona.id] || 0;
        
        // Acumular el subtotal a la persona
        deudasPorPersona[persona.id].subtotal += subtotalPersona;
        
        // No añadir propina si la persona no consumió nada
        if (subtotalPersona <= 0) return;
        
        let propinaPersona = 0;
        
        if (modoPropina === 'proporcional') {
          // La propina se distribuye proporcionalmente al consumo
          if (subtotalRestaurante > 0) {
            const proporcionConsumo = subtotalPersona / subtotalRestaurante;
            propinaPersona = propinaTotalRestaurante * proporcionConsumo;
          }
        } else if (modoPropina === 'dividido') {
          // La propina se divide equitativamente entre las personas que consumieron
          if (personasConConsumo.length > 0) {
            propinaPersona = propinaTotalRestaurante / personasConConsumo.length;
          }
        }
        
        // Acumular los valores de propina para esta persona
        deudasPorPersona[persona.id].propina += propinaPersona;
        deudasPorPersona[persona.id].total += subtotalPersona + propinaPersona;
      });
    });
    
    // Convertir a array y calcular porcentajes
    const deudas = Object.values(deudasPorPersona);
    // Usar el total calculado directamente de los restaurantes
    const total = totalGlobalRestaurantes;
    
    const deudasConPorcentaje = deudas.map(deuda => ({
      ...deuda,
      porcentajeDelTotal: total > 0 ? (deuda.total / total) * 100 : 0,
      deudaAlPagador: deuda.persona.id !== pagador ? deuda.total : 0
    }));
    
    // Encontrar los datos del pagador
    const infoPagador = deudasConPorcentaje.find(d => d.esPagador);
    
    // Calcular el total que otros deben al pagador
    const totalARecuperar = deudas.filter(d => !d.esPagador).reduce((sum, d) => sum + d.total, 0);
    
    return {
      deudas: deudasConPorcentaje,
      total,
      totalARecuperar,
      infoPagador
    };
  };
  
  const value = {
    restaurantes,
    personas,
    pagador,
    modoPropina,
    grupos,
    grupoActual,
    agregarRestaurante,
    eliminarRestaurante,
    agregarPersona,
    eliminarPersona,
    actualizarPagador,
    setModoPropina,
    setRestaurantes,
    setPersonas,
    calcularResultados,
    guardarComoNuevoGrupo,
    actualizarGrupo,
    cargarGrupo,
    eliminarGrupo,
    crearNuevaSesion
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
