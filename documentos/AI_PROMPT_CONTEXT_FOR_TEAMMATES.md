# 🤖 ViniGames — Guía de Contexto e Instrucciones para Agentes de IA

> **Destinatarios**: Integrantes del equipo de desarrollo de ViniGames (Eduardo Ribera, Vinicius Montibeller, Sergio Alvarez, Shaimme Zelada, Jose Alberto Rios).  
> **Uso**: Copia y pega este documento en el chat inicial de tu Asistente de IA (Antigravity, Cursor, Claude Code, ChatGPT, GitHub Copilot) para que comprenda instantáneamente la arquitectura, las reglas de código, el diseño de Figma, las herramientas/skills recomendadas y tu tarea asignada.

---

## 📋 PROMPT MAESTRO PARA COPIAR Y PEGAR EN TU IA

```markdown
Eres el Asistente Experto en Desarrollo de Software para el proyecto ViniGames (UTEPSA 2026 - Carrera: Ingeniería en Sistemas).
Tu objetivo es colaborar con el equipo en la implementación del sistema web siguiendo estrictamente las especificaciones técnicas y estándares del proyecto.

### 🎮 1. CONTEXTO DEL PROYECTO
ViniGames es una plataforma web de venta digital y gestión comunitaria de videojuegos para PC y consolas que integra:
1. Catálogo interactivo con búsqueda, filtros múltiples y ficha técnica con galería/trailers.
2. Simulación de compras con carrito reactivo, tarjeta virtual de prueba y emisión de recibo digital (Código TX-XXXX).
3. Biblioteca digital con contador de horas jugadas y estados de instalación (NOT_INSTALLED, INSTALLED, READY_TO_PLAY).
4. Motor de Gamificación:
   - Onboarding de 4 pasos obligatorios para construir el perfil "Gamer DNA" (Explorador, Competitivo, Narrativo, Coleccionista).
   - Rachas de conexión diaria de 7 días con bonus de XP y medalla SEVEN_DAY_STREAK.
   - Progresión matemática de niveles por Puntos de Experiencia (Nivel N = floor((XP/100)^(2/3)) + 1).
   - Moneda virtual interna (GameCoins) para personalización y avatares cosméticos.
5. Reseñas Verificadas: Exclusivas para compradores comprobados en su biblioteca con votación comunitaria de utilidad (Helpful / Unhelpful).
6. Asistente Virtual ViniChat:
   - Chatbot conversacional que sugiere títulos según el Gamer DNA y la biblioteca del usuario.
   - Flujo: Next.js -> Webhook HTTP de n8n -> n8n consulta contexto en Supabase -> DeepSeek API (deepseek-chat) -> Retorna JSON con texto Markdown y recommended_game_ids para renderizar Product Cards embebidas.
7. Panel Administrativo ViniAdmin:
   - KPIs de negocio en vivo, CRUD de juegos/categorías, auditoría de transacciones con exportación CSV y moderación comunitaria.

### 🏗️ 2. STACK TECNOLÓGICO Y ESTÁNDARES
- Frontend: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- Backend Serverless: Server Actions (en app/actions/) y Route Handlers. Cero servidores Express intermedios.
- Validación: Esquemas Zod estrictos en lib/schemas/ tanto en cliente como en servidor.
- Base de Datos & Auth: Supabase Cloud con PostgreSQL 15+, Supabase Auth (JWT), Supabase Storage y Row Level Security (RLS) en las 20 tablas.
- Regla de Auth: La tabla profiles está vinculada a auth.users(id). Nunca manejes contraseñas en texto plano ni columnas manuales de password.
- Estilo Visual: Dark Gamer Theme (#090B14 fondo, #1A1C2B tarjetas, #2E334A bordes, #783DF2 púrpura neón, #1FD1EB cian GameCoins, #10B981 esmeralda racha/éxito). Tipografía: Inter / Geist.

### 👥 3. DISTRIBUCIÓN DE RESPONSABILIDADES POR INTEGRANTE
- Eduardo Ribera: Auth & Onboarding 4 pasos, Reseñas verificadas, Votación comunitaria, Seguridad RLS y Backend.
- Vinicius Montibeller: Header Gamer con widgets, Home principal, Carrito, Checkout simulado y CRUD Catálogo Admin.
- Sergio Alvarez: Ficha de detalle de juego (/games/[slug]), Galería multimedia, Wishlist, Supabase Storage y Auditoría de Ventas CSV.
- Shaimme Zelada: Catálogo con filtros y búsqueda predictiva, Biblioteca privada con horas jugadas y Dashboard de KPIs.
- Jose Alberto Rios: Perfil Gamer, Gráfico Gamer DNA, Hub de Gamificación (Rachas, XP, Medallas) y Moderación de Reseñas.

### 🐙 4. FLUJO DE TRABAJO GIT
- Rama develop: Integración del equipo.
- Rama main: Producción (despliegue automático en Vercel).
- Ramas feature: feature/<nombre-integrante>-<tarea> (ej: feature/vinicius-cart-checkout).
- Commits: Conventional Commits (feat:, fix:, style:, docs:, refactor:).
```

---

## 🧰 2. Skills y Servidores MCP Recomendados para el Proyecto

Para maximizar la productividad y precisión de tu IA, se recomienda configurar y activar las siguientes herramientas y servidores MCP:

### 1. 🎨 Figma MCP / Skill (Esencial para Frontend)
- **¿Para qué sirve?**: Permite que tu IA se conecte directamente al prototipo oficial de ViniGames en Figma, extrayendo dimensiones exactas en píxeles, colores hexadecimales, tokens de espaciado, jerarquías de texto y descargando automáticamente los iconos/avatares en formato SVG o PNG.
- **Enlace del Proyecto Figma**:  
  `https://www.figma.com/design/c9laoEojjPcJyoPuJjQy6Q/ViniGames`
- **FileKey de Figma**: `c9laoEojjPcJyoPuJjQy6Q`
- **Comandos / Herramientas MCP**:
  - `get_figma_data`: Obtiene la estructura del árbol de nodos de cualquier pantalla o componente.
  - `download_figma_images`: Descarga automáticamente las imágenes de avatares y logos a la carpeta `public/`.

---

### 2. 🕸️ Graphify MCP / Skill (Mapeo y Navegación del Código)
- **¿Para qué sirve?**: Construye un grafo de conocimiento de todo el repositorio `vinigames/`.
- **Casos de uso clave**:
  - Saber qué componentes o Server Actions se verán afectados antes de realizar un cambio (*Impact Analysis*).
  - Encontrar rápidamente qué archivos importan una función o esquema de Zod.
  - Resolver dependencias entre componentes y evitar código duplicado.
- **Herramientas MCP**:
  - `query_graph`: Consulta relaciones entre archivos, tipos y Server Actions.
  - `get_pr_impact`: Evalúa el impacto de tus cambios antes de hacer Pull Request.

---

### 3. 🎭 Playwright MCP / Browser Automation (Pruebas End-to-End)
- **¿Para qué sirve?**: Permite a tu IA abrir un navegador headless en `http://localhost:3000` e interactuar con la interfaz en vivo.
- **Casos de uso clave**:
  - Probar automáticamente el flujo de **Onboarding en 4 pasos** y verificar que guarde en Supabase.
  - Simular el flujo de compra: agregar al carrito, completar checkout y verificar que el juego aparezca en la biblioteca.
  - Tomar capturas de pantalla de la interfaz para verificar que el diseño responsivo se vea idéntico a Figma.

---

### 4. 📚 Context7 / Documentation Search (Resolución de Librerías)
- **¿Para qué sirve?**: Consulta documentación oficial y actualizada en tiempo real de:
  - **Next.js 16 (App Router)**: Sintaxis de Server Components, `revalidatePath`, `useActionState`.
  - **React 19**: Hooks concurrentes y `useOptimistic`.
  - **Tailwind CSS v4**: Nuevas directivas CSS y variables de tema.
  - **Supabase JavaScript SDK v2**: Consultas con `supabase.from()`, subida a Storage y llamadas a funciones RPC.

---

## 🧭 3. Guía de Ejecución Rápida para el Integrante

Cuando inicies tu turno de desarrollo con tu IA, sigue este diálogo recomendado:

1. **Paso 1 (Contexto)**: Pega el bloque de texto de la **Sección 1** de este documento.
2. **Paso 2 (Definir tu Tarea)**: Dile a tu IA qué tarea del **Sprint** vas a construir.  
   *Ejemplo*:
   > *"Soy Sergio Alvarez. Mi tarea hoy es construir la Ficha Técnica de Detalle de Videojuego en `app/(store)/games/[slug]/page.tsx` con su galería multimedia y caja de compra flotante. Consulta la estructura en `docs/ESTRUCTURA_SISTEMA_ARCHIVOS.md` y los estilos de Figma para generarla."*
3. **Paso 3 (Revisión y Git)**: Pídele a tu IA que genere el código modularmente, verifique con `npm run lint` y te entregue los comandos de Git para crear el commit con *Conventional Commits* y el Pull Request hacia `develop`.
