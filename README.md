# 🎮 ViniGames — Plataforma E-Commerce Gamer & Comunidad

> **Plataforma Web de Comercio Electrónico Digital, Gamificación y Comunidad Gamer con Asistencia IA.**  
> Proyecto desarrollado para la carrera de **Ingeniería en Sistemas** — *Desarrollo de Aplicaciones Web*  
> **Universidad Tecnológica Privada de Santa Cruz (UTEPSA)** | Gestión 2026  
> **Docente Guía**: Ing. Bryana Ojopi Banegas  

---

## 📌 Estado del Proyecto & Sprints

```mermaid
flowchart LR
    S0["✅ SPRINT 0\nCimientos & UI Base"] --> S1["✅ SPRINT 1\nNúcleo de la Plataforma"] --> S2["🚀 SPRINT 2 (ACTUAL)\nTransaccionalidad & Biblioteca"] --> S3["⏳ SPRINT 3\nIA, ViniChat & ViniAdmin"]
```

* **✅ Sprint 0 (Setup & Fundaciones)**: Arquitectura Next.js 16, Supabase SSR, DDL de 20 tablas relacionales con RLS, tokens de diseño Dark Gamer Figma y librería de primitivas UI (`Button`, `Input`, `Badge`, `Card`, `Modal`).
* **✅ Sprint 1 (Núcleo de la Plataforma)**: Sistema de Autenticación Split-Screen con carrusel Ken Burns, Onboarding en 4 pasos con Gamer DNA, Header persistente con widgets en vivo, Storefront Home, Catálogo multicriterio con búsqueda predictiva, Ficha técnica `/games/[slug]` y Perfil Gamer `/profile`.
* **🚀 Sprint 2 (En Desarrollo Activo)**: Carrito de compras y Checkout simulado con emisión de comprobante digital, Biblioteca interactiva `/library` con acumulador de horas jugadas, Lista de Deseos (Wishlist), Hub de Gamificación `/gamification` (rachas, niveles y medallas) y Sistema de Reseñas Verificadas.

---

## 👥 Equipo de Desarrollo & Asignación de Módulos (Sprint 2)

| Integrante | Rol Principal | Módulos Asignados (Sprint 2) | Rama de Trabajo |
| :--- | :--- | :--- | :--- |
| **Eduardo Ribera** | Líder Técnico & Backend | Reseñas Verificadas, Votación de Utilidad, Reglas RLS & Middleware RBAC | `feature/eduardo-verified-reviews` |
| **Vinicius Montibeller** | Frontend Lead & E-Commerce | Carrito de Compras, Drawer Lateral, Checkout Simulado & Recibo Digital `TX-XXXX` | `feature/vinicius-cart-checkout` |
| **Sergio Alvarez** | Multimedia & Storage | Lista de Deseos (Wishlist), Descuentos en Detalle & Buckets Supabase Storage | `feature/sergio-wishlist-storage` |
| **Shaimme Zelada** | Búsqueda & Biblioteca | Biblioteca Digital (`/library`), Horas Jugadas, Simulador "▶ Jugar" & Analítica | `feature/shaimme-user-library` |
| **Jose Alberto Rios** | Gamificación & Perfil | Hub de Gamificación (`/gamification`), Calendario de Rachas, Galería de Medallas | `feature/jose-gamification-hub` |

---

## 🚀 Stack Tecnológico

| Capa / Subsistema | Tecnología | Versión | Rol y Justificación Técnica |
| :--- | :--- | :--- | :--- |
| **Framework Web** | [Next.js](https://nextjs.org/) (App Router) | `16.3.0` | Arquitectura híbrida RSC/SSR con aceleración Turbopack y Server Actions seguras. |
| **Librería de UI** | [React](https://react.dev/) | `19.2.8` | Componentes declarativos basados en el modelo de concurrencia y Server Actions. |
| **Motor de Estilos** | [Tailwind CSS](https://tailwindcss.com/) | `v4.0` | Tokens de Figma, paleta Dark Gamer (`#080A13`, `#131521`) con acentos neón violeta (`#783DF2`) y cian (`#1FD1EB`). |
| **Base de Datos & Auth** | [Supabase](https://supabase.com/) | PostgreSQL 15+ | Autenticación JWT (`@supabase/ssr`), 20 tablas relacionales, RLS perimetral y Storage. |
| **Validación de Datos** | [Zod](https://zod.dev/) | `^4.0` | Validación isomórfica de esquemas en cliente y servidor. |
| **Iconografía** | [Lucide React](https://lucide.dev/) | `^1.33.0` | Iconos vectoriales consistentes para temáticas gamer, widgets y paneles. |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | `^5.0` | Tipado estático estricto end-to-end con autogeneración de tipos de base de datos. |
| **Motor de Gamificación** | Matemático Nativo | Custom | Progresión exponencial suave: $\text{XP} \rightarrow \text{Nivel}$, rachas diarias y recompensas. |

---

## 🗺️ Mapa de Rutas de la Aplicación

```
vini-games/
├── (auth)/
│   ├── /login                     # Login Split-Screen con carrusel dinámico y cuentas Demo
│   ├── /register                  # Registro directo de credenciales
│   └── /onboarding/               # Stepper de 4 pasos (Avatar, Géneros, Gamer DNA, Passport)
│       └── /welcome               # Pantalla festiva de bienvenida (Nivel 1 + 100 XP + 100 GameCoins)
├── (store)/
│   ├── /                          # Storefront Home (Hero Banner, lanzamientos y ofertas)
│   ├── /catalog                   # Catálogo general con filtros multicriterio y búsqueda predictiva
│   ├── /games/[slug]              # Ficha técnica, galería de video/fotos, requisitos y compra
│   ├── /cart                      # [Sprint 2] Carrito de compras y Checkout simulado
│   ├── /library                   # [Sprint 2] Biblioteca de juegos adquiridos y simulador de horas
│   ├── /profile                   # Perfil gamer, radar Gamer DNA y estadísticas
│   ├── /wishlist                  # [Sprint 2] Lista de deseos con alertas de ofertas
│   └── /gamification              # [Sprint 2] Hub de rachas, medallas, misiones y recompensas
└── /admin                         # [Sprint 3] Panel de administración ViniAdmin (Solo ADMIN)
```

---

## 📁 Estructura del Proyecto

```
vinigames/
├── app/                          # App Router (Next.js 16)
│   ├── (auth)/                   # Grupo de rutas de autenticación y onboarding
│   ├── (store)/                  # Grupo de rutas de tienda, catálogo, perfil y biblioteca
│   ├── actions/                  # Server Actions seguras (auth, games, cart, reviews)
│   ├── auth/callback/            # Endpoint OAuth / Supabase Auth Callback
│   ├── globals.css               # Variables de tema, fuentes y utilidades CSS gamer
│   └── layout.tsx                # Layout raíz de la aplicación con fuentes Geist
├── components/                   # Componentes modulares y reutilizables
│   ├── layout/                   # Header persistente, Footer gamer y Widgets de estado
│   ├── store/                    # Catálogo, Buscador predictivo, Ficha de juego, Galería
│   └── ui/                       # Primitivas UI (Badge, Button, Card, Input, Modal)
├── lib/                          # Capa de lógica de negocio y servicios
│   ├── context/                  # Context API (Onboarding, Cart, Auth)
│   ├── gamification/             # Fórmulas de XP, cálculo de niveles y progresión
│   ├── mock-data/                # Datasets de respaldo para desarrollo offline
│   ├── schemas/                  # Esquemas de validación Zod (auth, order, review)
│   ├── services/                 # Servicios desacoplados de datos (games, users, orders)
│   ├── supabase/                 # Clientes Supabase SSR (client, server, middleware)
│   └── utils.ts                  # Utilidades globales (cn = clsx + tailwind-merge)
├── types/                        # Definiciones TypeScript
│   ├── catalog.ts                # Interfaces del catálogo y filtros
│   └── database.types.ts         # Tipos autogenerados de Supabase PostgreSQL
├── public/                       # Recursos estáticos, portadas e imágenes vectoriales
├── middleware.ts                 # Middleware Edge para refresco de sesión y control RBAC
└── package.json                  # Dependencias y scripts del proyecto
```

---

## 📦 Prerrequisitos e Instalación Local

### 1. Clonar el repositorio y navegar a la carpeta de la app:
```bash
git clone https://github.com/sergiam071105-ai/Vini-Games.git
cd Vini-Games/vinigames
```

### 2. Instalar dependencias del proyecto:
```bash
npm install
```

### 3. Configurar variables de entorno:
Crear el archivo `.env.local` a partir de `.env.example`:
```bash
cp .env.example .env.local
```

Configurar las credenciales correspondientes:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rjtjzuvpdqnaxfenwsot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Iniciar el entorno de desarrollo:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador web.

---

## 🛠️ Scripts Disponibles

* `npm run dev`: Inicia el servidor de desarrollo local con Turbopack.
* `npm run build`: Compila la aplicación para producción optimizando rutas estáticas y dinámicas.
* `npm run start`: Inicia el servidor Next.js en modo de producción.
* `npm run lint`: Ejecuta el análisis estático de código con ESLint.

---

## 🌿 Flujo de Trabajo en Git (GitFlow / GitHub Flow)

* **`main`**: Rama principal de producción (despliegue productivo).
* **`develop`**: Rama de integración continua donde convergen las características aprobadas mediante Pull Request.
* **`feature/<integrante>-<funcionalidad>`**: Ramas de trabajo individuales para cada módulo.

### Convención de Commits Semánticos (Conventional Commits):
* `feat(modulo):` Nueva funcionalidad (ej: `feat(cart): agregar checkout modal`).
* `fix(modulo):` Corrección de errores (ej: `fix(auth): corregir refresco de token`).
* `docs:` Cambios en la documentación (ej: `docs: actualizar README para el Sprint 2`).
* `style:` Ajustes visuales o de formato sin impacto en la lógica.
* `refactor:` Reestructuración de código sin alterar el comportamiento.
* `chore:` Tareas de mantenimiento, dependencias o configuración.

---

## 📄 Licencia y Uso Académico

Proyecto desarrollado con fines académicos en la **Universidad Tecnológica Privada de Santa Cruz (UTEPSA)** bajo la supervisión docente de la **Ing. Bryana Ojopi Banegas**.

