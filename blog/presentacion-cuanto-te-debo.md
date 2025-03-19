# ¿Cuánto te debo? - La solución definitiva para dividir cuentas

![Imagen de portada de Cuánto te debo](https://raw.githubusercontent.com/lpaillao/cuanto-te-debo/main/public/blog-header.png)

**Fecha de publicación:** 15 de junio de 2024  
**Autor:** Luis Paillao  
**Tiempo de lectura:** 7 minutos

## 🌟 El problema que todos hemos vivido

Estás con amigos en un restaurante. La comida estuvo deliciosa, las risas abundaron y ahora llega ese momento incómodo: dividir la cuenta. Algunos pidieron entradas, otros postres, unos bebieron más que otros... y por supuesto, alguien debe adelantar el pago total.

"¿Cuánto te debo?" es la pregunta del millón, y calcular esto correctamente se convierte en un pequeño dolor de cabeza.

## 💡 Nuestro propósito: simplificar las matemáticas sociales

Desarrollamos **[¿Cuánto te debo?](https://cuanto-te-debo.cubitdev.com/)** con un objetivo claro: **eliminar la incomodidad y las complicaciones matemáticas de dividir cuentas**. Queríamos una herramienta que:

1. Calculara con precisión lo que cada persona debe según lo que consumió
2. Incluyera la propina de manera justa
3. Fuera fácil de usar en el momento, desde cualquier dispositivo
4. Permitiera compartir los resultados con el grupo

## 🛠️ El proceso de desarrollo

El desarrollo de esta aplicación surgió de una necesidad personal. Después de varias salidas con amigos donde perdíamos tiempo calculando lo que cada uno debía, decidimos crear una solución tecnológica.

### Etapas clave del desarrollo:

- **Investigación inicial**: Exploramos aplicaciones existentes y entrevistamos a personas sobre sus experiencias dividiendo cuentas
- **Diseño UX/UI**: Creamos prototipos centrados en la simplicidad y usabilidad en dispositivos móviles
- **Desarrollo frontend**: Utilizamos React y Tailwind CSS para construir una interfaz responsiva y moderna
- **Pruebas con usuarios reales**: Iteramos el diseño basándonos en feedback de usuarios en situaciones reales
- **Implementación de almacenamiento local**: Para guardar grupos y facilitar el uso recurrente

## 🔍 Funcionalidades destacadas

### 1. Gestión flexible de personas y pagos

![Gestión de personas](https://raw.githubusercontent.com/lpaillao/cuanto-te-debo/main/public/personas-section.png)

Esta sección permite:
- Añadir todas las personas que participaron en la comida
- Designar a quien pagó la cuenta completa
- Organizar grupos recurrentes

### 2. Asignación precisa de ítems

La aplicación permite dos modos de asignación que se adaptan a diferentes situaciones:

#### Asignación individual
Ideal para elementos que solo consumió una persona (ej: un plato personal).

#### Asignación compartida
Perfect para ítems compartidos entre varios comensales (ej: una pizza, botella de vino).

```javascript
// Ejemplo de cómo funciona la distribución compartida
const dividirEntreSeleccionados = () => {
  const personasSeleccionadas = item.personasAsignadas
    .filter(asignacion => asignacion.cantidad > 0)
    .map(asignacion => asignacion.personaId);
  
  if (personasSeleccionadas.length > 0) {
    const cantidadPorPersona = item.cantidad / personasSeleccionadas.length;
    // Asignar cantidadPorPersona a cada persona seleccionada
  }
};
```

### 3. Cálculo inteligente de propinas

Ofrecemos dos métodos para calcular la propina:

- **Proporcional al consumo**: Cada persona paga propina basada en lo que consumió
- **Dividida equitativamente**: La propina se divide por igual entre todos

![Modos de propina](https://raw.githubusercontent.com/lpaillao/cuanto-te-debo/main/public/propina-section.png)

### 4. Compartir resultados

Una vez calculados los montos, puedes:
- Generar una imagen con el resumen
- Compartir directamente a través de aplicaciones de mensajería
- Descargar la imagen para compartir después

## 🎯 ¿Qué queremos lograr?

Nuestros objetivos con esta aplicación son:

1. **Facilitar momentos sociales**: Eliminar discusiones y cálculos tediosos
2. **Promover pagos justos**: Asegurar que cada persona pague exactamente lo que le corresponde
3. **Crear una comunidad**: Establecer una base de usuarios que contribuyan a mejorar la herramienta
4. **Expandir funcionalidades**: Incorporar nuevas características como integración con apps de pago

## 👨‍💻 Ejemplo práctico de uso

Imaginemos un escenario común: cuatro amigos (Ana, Carlos, Elena y David) van a cenar.

1. **Configuración inicial**:
   - Añaden sus nombres en la aplicación
   - Marcan a David como pagador (quien pagó la cuenta completa)

2. **Registro de consumo**:
   - Añaden los platos individuales (ej: Ana pidió pasta por $12)
   - Registran elementos compartidos (ej: una botella de vino de $24 que bebieron todos excepto Carlos)
   - Establecen la propina al 15%

3. **Resultados**:
   - La aplicación calcula que:
     - Ana debe $22.50 a David
     - Carlos debe $15.75 a David
     - Elena debe $26.25 a David
   - David recupera exactamente lo que pagó menos su parte

4. **Compartir**:
   - David genera una imagen y la comparte en el grupo de WhatsApp

Este proceso toma menos de 3 minutos y evita errores de cálculo.

## 🚀 ¿Cómo probar la aplicación?

Te invitamos a probar **[¿Cuánto te debo?](https://cuanto-te-debo.cubitdev.com/)** en tu próxima salida con amigos:

1. Accede desde tu móvil a **[cuanto-te-debo.cubitdev.com](https://cuanto-te-debo.cubitdev.com/)**
2. No requiere registro ni instalación
3. Funciona incluso sin conexión una vez cargada

La próxima vez que salgas con amigos, tendrás la solución al alcance de tu mano.

## ⚙️ Levantar el proyecto localmente

Si eres desarrollador y quieres explorar o contribuir al código:

```bash
# Clonar el repositorio
git clone https://github.com/lpaillao/cuanto-te-debo.git

# Entrar al directorio
cd cuanto-te-debo

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El proyecto está construido con:
- React para la interfaz de usuario
- Tailwind CSS para los estilos
- Context API para manejo de estado
- HTML2Canvas para la generación de imágenes compartibles

## 🔮 Próximas mejoras

Estamos trabajando en:

- Soporte para múltiples monedas
- Temas visuales personalizables
- Integración con aplicaciones de pago
- Funcionalidad para dividir otros tipos de gastos (viajes, alquiler, etc.)

## 👋 Conclusión e invitación

**¿Cuánto te debo?** nació para resolver un problema cotidiano pero molesto. Lo que comenzó como una herramienta personal, ahora está disponible para todos aquellos que quieran simplificar la división de cuentas.

Te invitamos a:

1. [Probar la aplicación](https://cuanto-te-debo.cubitdev.com/)
2. [Visitar el repositorio en GitHub](https://github.com/lpaillao/cuanto-te-debo)
3. Compartir tus experiencias y sugerencias

Porque dividir la cuenta no debería dividir amistades.

---

*¿Te ha resultado útil esta herramienta? Compártela con amigos y déjanos tus comentarios abajo.*
