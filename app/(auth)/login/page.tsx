'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loginAction } from '@/app/actions/auth.actions';
import { loginSchema } from '@/lib/schemas/auth.schema';
import {
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

// Banners rotativos de videojuegos para el lateral derecho
const HERO_SLIDES = [
  {
    id: 1,
    image: '/auth-banner.png',
    title: 'Voxel Adventure',
    category: 'Mundo Abierto / Sandbox',
    tagline: 'Descubre. Compra. Juega.',
    description: 'Explora mundos infinitos y construye tu propio imperio gamer.',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    title: 'Neon Cyberpunk 2099',
    category: 'Acción & Aventura Futurista',
    tagline: 'Sobrevive en la megaciudad.',
    description: 'Mejora tus implantes, domina la red y reclama recompensas legendarias.',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
    title: 'Eldritch Kingdom',
    category: 'RPG Souls-like / Fantasía Oscura',
    tagline: 'Desafía a los dioses olvidados.',
    description: 'Combates épicos, secretos ancestrales y armas míticas.',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    title: 'Cosmic Horizon',
    category: 'Simulación Espacial & Exploración',
    tagline: 'Tu próximo destino está en las estrellas.',
    description: 'Pilota tu nave, comercia recursos y funda colonias intergalácticas.',
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const urlError = searchParams.get('error');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(
    urlError === 'auth_callback_failed'
      ? 'La autenticación falló o el enlace expiró. Intenta iniciar sesión.'
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estado del carrusel rotativo
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (globalError) setGlobalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    // Validación con Zod
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          const errors: Record<string, string> = {};
          for (const [key, val] of Object.entries(result.fieldErrors)) {
            errors[key] = val[0] || '';
          }
          setFieldErrors(errors);
        }
        setGlobalError(result.error || 'No se pudo iniciar sesión');
        setIsLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch {
      setGlobalError('Ocurrió un error inesperado al conectar con el servidor.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setFormData({ email: demoEmail, password: demoPass });
    setFieldErrors({});
    setGlobalError(null);
  };

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#080A13]">
      {/* Columna Izquierda: Formulario de Login */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 z-10">
        <div>
          {/* Logo Superior Oficial */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-14 w-40 flex items-center">
                <Image
                  src="/logo.png"
                  alt="ViniGames Logo"
                  width={160}
                  height={60}
                  className="object-contain h-auto w-auto max-h-14 transition-transform group-hover:scale-105"
                  priority
                  onError={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Encabezado del Formulario */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-[#949CB2]">
              Inicia sesión para continuar tu experiencia en ViniGames.
            </p>
          </div>

          {/* Banner de error general */}
          {globalError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-300 animate-in fade-in duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <span>{globalError}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Correo */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className={`
                  w-full rounded-xl border bg-[#131625] px-4 py-3.5 text-white text-sm
                  outline-none transition-all duration-200 placeholder:text-[#525B75]
                  ${
                    fieldErrors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-[#252A40] focus:border-[#783DF2] focus:ring-2 focus:ring-[#783DF2]/20'
                  }
                  disabled:cursor-not-allowed disabled:opacity-50
                `}
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-400 block mt-1">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={`
                    w-full rounded-xl border bg-[#131625] px-4 py-3.5 text-white text-sm pr-12
                    outline-none transition-all duration-200 placeholder:text-[#525B75]
                    ${
                      fieldErrors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#252A40] focus:border-[#783DF2] focus:ring-2 focus:ring-[#783DF2]/20'
                    }
                    disabled:cursor-not-allowed disabled:opacity-50
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949CB2] hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="text-xs text-red-400 block mt-1">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Enlace Olvidaste tu contraseña */}
            <div className="pt-1">
              <Link
                href="/onboarding/step-1"
                className="text-xs text-[#783DF2] hover:text-[#9F6EFE] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#783DF2] hover:bg-[#682FE0] text-white font-semibold py-3.5 text-sm transition-all duration-200 shadow-[0_0_20px_rgba(120,61,242,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {/* Divisor "o" */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#252A40]" />
              </div>
              <span className="relative bg-[#080A13] px-3 text-xs text-[#949CB2]">
                o
              </span>
            </div>

            {/* Botón Crear una cuenta */}
            <Link
              href="/onboarding/step-1"
              className="w-full block text-center rounded-xl bg-[#131625] border border-[#252A40] hover:border-[#783DF2] hover:bg-[#1A1E33] text-white font-semibold py-3.5 text-sm transition-all duration-200"
            >
              Crear una cuenta
            </Link>
          </form>

          {/* Acceso rápido para evaluación */}
          <div className="mt-8 pt-4 border-t border-[#252A40]/40">
            <p className="text-xs text-[#949CB2] mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1FD1EB]" />
              Acceso rápido para evaluación:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@vinigames.com', 'Admin123*')}
                className="text-xs rounded-lg bg-[#131625] border border-[#252A40] px-3 py-1.5 text-zinc-300 hover:border-[#783DF2] hover:text-white transition-colors cursor-pointer"
              >
                👤 Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('gamer@vinigames.com', 'Gamer123*')}
                className="text-xs rounded-lg bg-[#131625] border border-[#252A40] px-3 py-1.5 text-zinc-300 hover:border-[#1FD1EB] hover:text-white transition-colors cursor-pointer"
              >
                🎮 Gamer Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer legal */}
        <div className="mt-8 pt-4 text-center">
          <p className="text-[11px] text-[#6B7280]">
            Al continuar, aceptas los términos y condiciones de ViniGames.
          </p>
        </div>
      </div>

      {/* Columna Derecha: Carrusel Dinámico de Videojuegos */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden bg-[#0D101D] flex-col justify-end p-12">
        {/* Slideshow de imágenes con transición suave */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                priority={index === 0}
              />
            </div>
          );
        })}

        {/* Capas de degradado para legibilidad y estilo Gamer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A13] via-[#080A13]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A13] via-transparent to-transparent opacity-80 z-10" />

        {/* Tarjeta de Información Dinámica del Videojuego */}
        <div className="relative z-20 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1FD1EB]/40 bg-[#1FD1EB]/10 px-3.5 py-1 text-xs font-semibold text-[#1FD1EB] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{activeSlide.category}</span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-white tracking-wide uppercase drop-shadow-md">
              {activeSlide.title}
            </h2>
            <p className="text-lg font-bold text-[#1FD1EB] drop-shadow">
              {activeSlide.tagline}
            </p>
            <p className="text-sm text-zinc-300 mt-1 max-w-md drop-shadow">
              {activeSlide.description}
            </p>
          </div>

          {/* Indicadores / Puntos de navegación del carrusel */}
          <div className="flex items-center gap-2 pt-4">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-8 bg-[#1FD1EB] shadow-[0_0_10px_#1FD1EB]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#080A13]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#783DF2] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
