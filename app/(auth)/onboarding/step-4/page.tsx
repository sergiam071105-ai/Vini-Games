'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/context/onboarding-context';
import { registerOnboardingAction } from '@/app/actions/auth.actions';
import { onboardingStep4Schema } from '@/lib/schemas/auth.schema';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Coins,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';

export default function OnboardingStep4Page() {
  const router = useRouter();
  const { data, updateStep4, resetOnboarding } = useOnboarding();

  const [formData, setFormData] = useState({
    email: data.email || '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: 'email' | 'password' | 'confirmPassword', value: string) => {
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

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    // 1. Validar paso 4
    const validation = onboardingStep4Schema.safeParse(formData);
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

    // 2. Verificar datos de pasos previos
    if (!data.username || data.username.length < 3) {
      setGlobalError('Debes completar el Paso 1 (Gamer Tag) antes de finalizar.');
      return;
    }

    setIsLoading(true);

    try {
      updateStep4(formData.email);

      // 3. Ejecutar Server Action consolidada
      const result = await registerOnboardingAction({
        username: data.username,
        avatarUrl: data.avatarUrl || 'cyber_ninja',
        fullName: data.fullName || undefined,
        favoriteCategories: data.favoriteCategories.length > 0 ? data.favoriteCategories : ['action'],
        gamerDna: data.gamerDna,
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!result.success) {
        if (result.fieldErrors) {
          const errors: Record<string, string> = {};
          for (const [key, val] of Object.entries(result.fieldErrors)) {
            errors[key] = val[0] || '';
          }
          setFieldErrors(errors);
        }
        setGlobalError(result.error || 'Error al crear la cuenta.');
        setIsLoading(false);
        return;
      }

      // 4. Limpiar borrador de onboarding y redirigir a Bienvenida
      resetOnboarding();
      router.push('/onboarding/welcome');
    } catch {
      setGlobalError('Ocurrió un error inesperado de red al conectar con Supabase.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-[#252A40] bg-[#131625]/90 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1FD1EB]/20 text-[#1FD1EB]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Paso 4: Credenciales & Creación de Cuenta
          </h1>
          <p className="text-sm text-[#949CB2] mt-1">
            Ingresa tu correo y contraseña para activar tu perfil y desbloquear tus recompensas.
          </p>
        </div>

        {/* Banner de error general */}
        {globalError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <span>{globalError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tarjeta de Resumen Gamer ID Card (5 Columnas) */}
          <div className="lg:col-span-5 p-5 rounded-xl border border-[#783DF2]/50 bg-[#0D101D] shadow-[0_0_25px_rgba(120,61,242,0.2)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252A40]">
              <span className="text-[11px] font-bold text-[#949CB2] uppercase tracking-wider">
                Gamer Passport
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 px-2 py-0.5 text-[10px] font-bold text-green-400 border border-green-500/30">
                <CheckCircle2 className="h-3 w-3" />
                Listo para emitir
              </span>
            </div>

            {/* Avatar & Tag Preview */}
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#783DF2] to-[#1FD1EB] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(120,61,242,0.5)]">
                <div className="h-full w-full rounded-[10px] bg-[#080A13] flex items-center justify-center text-white">
                  <Gamepad2 className="h-7 w-7 text-[#1FD1EB]" />
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-white truncate">
                  {data.username || 'Gamer Tag'}
                </h2>
                <p className="text-xs text-[#949CB2] truncate">
                  {data.fullName || 'Nuevo Jugador'}
                </p>
                <span className="inline-block text-[10px] font-mono text-[#A879FF] font-semibold">
                  Nivel 1 • Racha 1 Día
                </span>
              </div>
            </div>

            {/* Recompensas de Bienvenida */}
            <div className="rounded-lg border border-[#252A40] bg-[#131625] p-3 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#949CB2] tracking-wider block">
                Recompensas al registrarte:
              </span>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Sparkles className="h-3.5 w-3.5 text-[#783DF2]" />
                  Experiencia inicial
                </span>
                <span className="font-bold text-[#A879FF]">+100 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Coins className="h-3.5 w-3.5 text-[#F59E0B]" />
                  Saldo GameCoins
                </span>
                <span className="font-bold text-[#F59E0B]">100 🪙</span>
              </div>
            </div>

            {/* Resumen de Categorías */}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#949CB2] tracking-wider block mb-2">
                Géneros Seleccionados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.favoriteCategories.slice(0, 4).map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] rounded-md bg-[#131625] border border-[#252A40] px-2 py-0.5 text-zinc-300 uppercase font-semibold"
                  >
                    {cat}
                  </span>
                ))}
                {data.favoriteCategories.length > 4 && (
                  <span className="text-[10px] text-[#949CB2] self-center">
                    +{data.favoriteCategories.length - 4} más
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de Credenciales (7 Columnas) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {/* Correo */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                  Correo Electrónico <span className="text-[#1FD1EB]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  className={`
                    w-full rounded-xl border bg-[#0D101D] px-4 py-3 text-white text-sm
                    outline-none transition-all duration-200 placeholder:text-[#525B75]
                    ${
                      fieldErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#252A40] focus:border-[#1FD1EB] focus:ring-2 focus:ring-[#1FD1EB]/20'
                    }
                  `}
                />
                {fieldErrors.email && (
                  <span className="text-xs text-red-400 block">{fieldErrors.email}</span>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                  Contraseña <span className="text-[#1FD1EB]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className={`
                      w-full rounded-xl border bg-[#0D101D] px-4 py-3 text-white text-sm pr-12
                      outline-none transition-all duration-200 placeholder:text-[#525B75]
                      ${
                        fieldErrors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#252A40] focus:border-[#783DF2] focus:ring-2 focus:ring-[#783DF2]/20'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949CB2] hover:text-white transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="text-xs text-red-400 block">{fieldErrors.password}</span>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                  Confirmar Contraseña <span className="text-[#1FD1EB]">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className={`
                    w-full rounded-xl border bg-[#0D101D] px-4 py-3 text-white text-sm
                    outline-none transition-all duration-200 placeholder:text-[#525B75]
                    ${
                      fieldErrors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#252A40] focus:border-[#783DF2] focus:ring-2 focus:ring-[#783DF2]/20'
                    }
                  `}
                />
                {fieldErrors.confirmPassword && (
                  <span className="text-xs text-red-400 block">{fieldErrors.confirmPassword}</span>
                )}
              </div>

              {/* Botones de Navegación */}
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#252A40]/60">
                <button
                  type="button"
                  onClick={() => router.push('/onboarding/step-3')}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#252A40] bg-[#0D101D] px-4 py-3 text-sm font-semibold text-zinc-300 hover:border-[#783DF2] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] px-7 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(120,61,242,0.4)] hover:shadow-[0_0_25px_rgba(31,209,235,0.5)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creando tu cuenta Gamer...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Completar Misión & Crear Perfil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
