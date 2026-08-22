# 🎮 ViniGames

> **Plataforma Web de E-Commerce Digital, Gamificación y Comunidad Gamer con Asistencia IA.**  
> Proyecto desarrollado para la carrera de **Ingeniería en Sistemas** — *Desarrollo de Aplicaciones Web*  
> **Universidad Tecnológica Privada de Santa Cruz (UTEPSA)** | 2026

---

## 👥 Equipo de Desarrollo (Grupo ViniGames)

| Integrante | Rol Principal | Rama Sugerida (Sprint 1) |
| :--- | :--- | :--- |
| **Eduardo Ribera** | Supabase Backend, Autenticación, Onboarding & Integración IA | `feature/eduardo-auth-onboarding` |
| **Vinicius Montibeller** | UI/UX Layout, Home Page, Carrito de Compras & Checkout | `feature/vinicius-layout-home` |
| **Sergio Alvarez** | Detalle de Producto, Wishlist & Panel de Ventas | `feature/sergio-game-details` |
| **Shaimme Zelada** | Catálogo con Filtros, Biblioteca de Usuario & Métricas | `feature/shaimme-catalog-filters` |
| **Jose Alberto Rios** | Perfil Gamer DNA, Hub de Gamificación & Moderación | `feature/jose-profile-gamer-dna` |

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Versión | Rol |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router) | `16.3.0` | Framework React con Server Components y Server Actions |
| **Librería UI** | [React](https://react.dev/) | `19.2.8` | Interfaz reactiva y componentes modernos |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) | `v4.0` | Diseño responsivo y Dark Gamer Theme |
| **Iconos** | [Lucide React](https://lucide.dev/) | `^1.33.0` | Iconografía gamer y administrativa |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | `^5.0` | Tipado estático y robustez |
| **BaaS & DB** | [Supabase](https://supabase.com/) | PostgreSQL 15+ | Autenticación, Base de datos relacional y RLS |
| **Validación** | [Zod](https://zod.dev/) | `^4.0` | Validación de esquemas en cliente y servidor |
| **IA & Orquestación**| DeepSeek (`deepseek-chat`) + n8n | Webhooks | Asistente conversacional ViniChat y flujos |

---

## 📦 Prerrequisitos e Instalación

### 1. Clonar el repositorio y navegar a la carpeta:
```bash
git clone https://github.com/sergiam071105-ai/Vini-Games.git
cd Vini-Games/vinigames
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Configurar variables de entorno:
Copia el archivo `.env.example` como `.env.local`:
```bash
cp .env.example .env.local
```

Verifica las credenciales en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rjtjzuvpdqnaxfenwsot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_N8N_VINICHAT_WEBHOOK_URL=http://localhost:5678/webhook/vinichat
```

### 4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

---

## 🛠️ Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con Turbopack.
- `npm run build`: Compila la aplicación y optimiza la salida para producción.
- `npm run start`: Inicia el servidor Next.js en modo producción.
- `npm run lint`: Ejecuta el análisis estático de código con ESLint.

---

## 📁 Estructura del Proyecto

```
vinigames/
├── app/                  # Rutas y páginas del App Router (Next.js 16)
│   ├── globals.css       # Estilos globales, variables de color y tema gamer
│   ├── layout.tsx        # Layout raíz de la aplicación con fuentes Geist
│   └── page.tsx          # Página principal (Home)
├── components/           # Componentes modulares
│   └── ui/               # Primitivas UI reutilizables (Badge, Button, Card, Input, Modal)
├── lib/                  # Utilidades y configuración de clientes
│   ├── supabase/         # Clientes de Supabase (browser, server, middleware)
│   └── utils.ts          # Funciones auxiliares (cn / clsx + tailwind-merge)
├── types/                # Definiciones de TypeScript y tipos de base de datos
│   └── database.types.ts # Tipos generados de Supabase PostgreSQL
├── public/               # Recursos estáticos (imágenes, favicons)
├── docs/                 # Documentación técnica, guías de Git y arquitectura
└── package.json          # Dependencias y scripts del proyecto
```

---

## 🌿 Flujo de Trabajo en Git (GitHub Flow)

- **`main`**: Rama de producción (despliegue en Vercel).
- **`develop`**: Rama de integración donde se unen las características aprobadas mediante Pull Request.
- **`feature/<nombre>-<funcionalidad>`**: Ramas de trabajo individuales por integrante.

### Comandos básicos del flujo:
```bash
# 1. Asegurarse de tener lo último de develop
git checkout develop
git pull origin develop

# 2. Crear tu rama de trabajo
git checkout -b feature/nombre-funcionalidad

# 3. Guardar cambios y subir al repositorio
git add .
git commit -m "feat(modulo): descripcion clara del cambio"
git push -u origin feature/nombre-funcionalidad
```

---

## 📄 Licencia y Uso Académico
Proyecto desarrollado con fines académicos en la **UTEPSA** bajo la supervisión docente de la **Ing. Bryana Ojopi Banegas**.

