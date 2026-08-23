# Resumen de Desarrollo — ViniGames
## 💻 Sprints 0 y 1 (Configuración, Base de Datos, UI Primitivas y Layout Home Gamer)

Este documento detalla todas las tareas, integraciones y desarrollos completados para los **Sprints 0 y 1** del proyecto **ViniGames** para la materia de Desarrollo de Aplicaciones Web (**UTEPSA 2026**).

---

## 📌 Sprint 0: Configuración Inicial, Supabase y Componentes Primitivos (UI)

El Sprint 0 se centró en sentar las bases tecnológicas del proyecto y habilitar las conexiones esenciales de infraestructura.

### 1. ⚙️ Inicialización y Entorno de Desarrollo
*   Configuración del proyecto base con **Next.js** y **TypeScript**.
*   Integración de **Tailwind CSS v4** y especificación de variables globales de tema (`globals.css`) con la paleta de colores oficial de Figma (púrpura gamer `#783DF2`, cian brillante `#1FD1EB`, fondos `#080A13` / `#0B0D18` y contenedores `#1A1C2B`).

### 2. 🗄️ Infraestructura y Supabase
*   Configuración de **Supabase SSR** para control de sesión tanto del lado del cliente como del servidor.
*   Implementación de variables de entorno para comunicación segura con la API.
*   Creación de **Middleware de Enrutamiento** para proteger áreas restringidas e interceptar peticiones de sesión de usuario.
*   Tipado automático de esquemas de tablas relacionales de la base de datos de Supabase en TypeScript.

### 3. 🎨 Primitivas de Componentes UI
*   Construcción de componentes visuales primitivos de Shadcn:
    *   `button.tsx`: Botones altamente personalizables y adaptativos.
    *   `input.tsx`: Cajas de texto gamer para formularios.
    *   `badge.tsx`: Etiquetas de categoría y estado.
    *   `card.tsx`: Contenedor base de tarjetas.
    *   `dialog.tsx`: Modales para vistas rápidas de catálogo e interacciones.

### 4. 📝 Documentación Base
*   Creación del archivo [README.md](file:///c:/Users/vinom/OneDrive/Desktop/ViniGames/Vini-Games/README.md) del proyecto documentando:
    *   Nombres de los integrantes del grupo de desarrollo.
    *   Requisitos previos y comandos de despliegue.
    *   Estructura general de base de datos.

---

## 📌 Sprint 1: Layout Gamer, Home Principal, Logo y Buscador

El Sprint 1 implementó la experiencia interactiva del portal de juegos, centrada en la identidad gamer, la barra de navegación responsiva de ancho completo y la página de inicio principal.

### 1. 🖼️ Integración del Logotipo de Figma
*   Descarga directa de la imagen oficial del logotipo (`logo.png`) a través de la API REST de Figma (Nodo `29:89`) y almacenamiento en la carpeta de recursos estáticos de producción.
*   Ajuste exacto del logotipo a **`110x62px`** respetando el aspect ratio original.

### 2. 🗺️ Cabecera Gamer de Ancho Completo (`header.tsx`)
*   **Diseño e Integración Simétrica**: Altura de cabecera de `82px` (`h-[82px]`) y color de fondo `#0B0D18` a juego con Figma. Centrado vertical completo.
*   **Protección de Layout responsivo**: Uso de `flex-shrink-0` en componentes críticos (como el logotipo, menú y barra de estado) que previene el colapso a ancho 0 del logo al cambiar la resolución o el zoom del navegador.
*   **Ocupación de Pantalla Completa**: El contenedor se adaptó a ancho completo (`w-full flex justify-between`) para expandirse de forma fluida de extremo a extremo de la pantalla.
*   **Widgets Gamer Reactivos**:
    *   **XP y Nivel**: Barra de progreso que calcula dinámicamente el nivel de XP en base a la fórmula:
        $$N = \left\lfloor \left(\frac{XP}{100}\right)^{2/3} \right\rfloor + 1$$
    *   **GameCoins**: Saldo en tiempo real con icono `Coins`.
    *   **Racha de Login**: Contador con icono de flama (`Flame`).
*   **Enrutamiento Corregido**: Corrección de enlaces en menú PC y móvil:
    *   **Inicio**: Apunta a la raíz `/`.
    *   **Tienda**: Apunta a `/catalog` (catálogo principal).

### 3. 🔍 Buscador de Juegos
*   Diseño gamer del input de búsqueda con icono de lupa (visible en responsive móvil y desktop).
*   Enrutamiento reactivo: Al presionar Enter, se realiza una redirección automática a `/catalog?search=termino`, permitiendo a Shaimme capturar la búsqueda y filtrar el catálogo general de videojuegos.

### 4. 🏠 Página Principal (Inicio - Home)
*   **Banner Hero**: Banner destacado interactivo para el juego *Neon Odyssey* con efectos de brillo neón.
*   **Ofertas Especiales**: Carrusel responsivo con tarjetas animadas de videojuegos (`game-card.tsx`).
*   **Recomendaciones Gamer**: Algoritmo visual basado en el ADN Gamer del usuario.
*   **Sticky Sidebar**: Barra lateral derecha flotante que mantiene visibles los widgets de **Misión Diaria** y **ADN Gamer** durante el desplazamiento vertical de la página.

### 5. 🎓 Footer Académico (`footer.tsx`)
*   Sección con logotipo oficial y créditos a la **UTEPSA**, a la Facultad de Tecnología y la carrera de Ingeniería en Sistemas.
*   Mención explícita a los 5 integrantes del equipo.

### 6. 🚀 Server Actions e Integración
*   Creación de la Server Action mock `signOutAction` en [`app/actions/auth.actions.ts`](file:///c:/Users/vinom/OneDrive/Desktop/ViniGames/Vini-Games/app/actions/auth.actions.ts) para realizar la revalidación de sesión y logout de Supabase.
*   Eliminación del archivo por defecto de Next.js `app/page.tsx` para evitar solapamientos de enrutamiento con el grupo de rutas `(store)`.

---

## 🔬 Calidad del Proyecto y Compilación
*   **Linter (`npm run lint`)**: 0 errores, 0 warnings.
*   **Compilador (`npm run build`)**: Empaquetado exitoso del código en producción con Turbopack.
*   **Control de Versiones (Git)**:
    *   Staged de archivos completo.
    *   Commit oficial del Sprint 1 realizado en la rama `feature/vinicius-layout-home`.
    *   Push exitoso realizado hacia el repositorio de GitHub.
