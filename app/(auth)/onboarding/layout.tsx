'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { OnboardingProvider } from '@/lib/context/onboarding-context';
import {
  Gamepad2,
  Sparkles,
  Dna,
  ShieldCheck,
  Check,
} from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'Identidad',
    subtitle: 'Avatar & Tag',
    path: '/onboarding/step-1',
    icon: Gamepad2,
  },
  {
    number: 2,
    title: 'Géneros',
    subtitle: 'Favoritos',
    path: '/onboarding/step-2',
    icon: Sparkles,
  },
  {
    number: 3,
    title: 'Gamer DNA',
    subtitle: 'Arquetipo',
    path: '/onboarding/step-3',
    icon: Dna,
  },
  {
    number: 4,
    title: 'Cuenta',
    subtitle: 'Credenciales',
    path: '/onboarding/step-4',
    icon: ShieldCheck,
  },
];

function OnboardingStepper() {
  const pathname = usePathname();

  // Si está en la página de bienvenida, no mostrar el stepper
  if (pathname === '/onboarding/welcome') {
    return null;
  }

  const currentStepObj = STEPS.find((s) => pathname.startsWith(s.path)) || STEPS[0];
  const currentStepNumber = currentStepObj.number;
  const progressPercent = (currentStepNumber / STEPS.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      {/* Barra de progreso superior */}
      <div className="mb-3 flex items-center justify-between text-xs text-[#949CB2]">
        <span className="font-semibold text-[#1FD1EB] tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Misión de Reclutamiento — Paso {currentStepNumber} de {STEPS.length}
        </span>
        <span className="font-mono text-white font-bold">{progressPercent}% Completado</span>
      </div>

      <div className="h-2 w-full rounded-full bg-[#131625] overflow-hidden border border-[#252A40]">
        <div
          className="h-full bg-gradient-to-r from-[#783DF2] via-[#A879FF] to-[#1FD1EB] transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(31,209,235,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Grid de 4 Pasos con Badges */}
      <div className="grid grid-cols-4 gap-2 mt-5">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = step.number < currentStepNumber;
          const isCurrent = step.number === currentStepNumber;

          return (
            <div
              key={step.number}
              className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'border-[#783DF2] bg-[#1E1B38] shadow-[0_0_20px_rgba(120,61,242,0.3)]'
                  : isDone
                  ? 'border-[#1FD1EB]/40 bg-[#131E2B]/60'
                  : 'border-[#252A40]/40 bg-[#0D101D]/40 opacity-50'
              }`}
            >
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isDone
                    ? 'bg-[#1FD1EB] text-[#080A13]'
                    : isCurrent
                    ? 'bg-[#783DF2] text-white'
                    : 'bg-[#1A1D2D] text-[#949CB2]'
                }`}
              >
                {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="hidden sm:block min-w-0">
                <p
                  className={`text-xs font-bold truncate ${
                    isCurrent ? 'text-white' : isDone ? 'text-[#1FD1EB]' : 'text-[#949CB2]'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-[#949CB2] truncate">{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-[#080A13] text-[#F5F7FF] flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden font-sans">
        {/* Luces de fondo ambientales Gamer */}
        <div className="pointer-events-none absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#783DF2]/15 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#1FD1EB]/10 blur-[160px]" />

        {/* Header Superior */}
        <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-[#252A40]/50 mb-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative h-11 w-36 flex items-center">
              <Image
                src="/logo.png"
                alt="ViniGames Logo"
                width={140}
                height={45}
                className="object-contain h-auto w-auto max-h-11 transition-transform group-hover:scale-105"
                priority
                onError={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#949CB2] hidden sm:inline">¿Ya tienes cuenta?</span>
            <Link
              href="/login"
              className="rounded-lg border border-[#252A40] bg-[#131625] px-3.5 py-2 font-semibold text-white hover:border-[#783DF2] hover:bg-[#1A1E33] transition-all"
            >
              Iniciar Sesión
            </Link>
          </div>
        </header>

        {/* Contenido Principal con Stepper */}
        <main className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          <OnboardingStepper />
          <div className="w-full">{children}</div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-12 text-center text-xs text-[#949CB2] pb-2">
          <p>© {new Date().getFullYear()} ViniGames. Plataforma Gamer Universitaria — UTEPSA.</p>
        </footer>
      </div>
    </OnboardingProvider>
  );
}
