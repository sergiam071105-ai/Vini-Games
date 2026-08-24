'use client';

import Link from 'next/link';
import {
  Trophy,
  Sparkles,
  Gamepad2,
  User,
  Flame,
  Coins,
  ArrowRight,
} from 'lucide-react';

export default function OnboardingWelcomePage() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center py-6">
      <div className="rounded-3xl border border-[#783DF2]/50 bg-gradient-to-b from-[#1E1838]/90 via-[#131625]/90 to-[#0D101D]/90 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(120,61,242,0.35)] relative overflow-hidden">
        {/* Efectos de resplandor festivo */}
        <div className="pointer-events-none absolute top-[-30%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#1FD1EB]/25 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-[#783DF2]/30 blur-[100px]" />

        {/* Emblema de Nivel 1 Animado */}
        <div className="relative z-10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#783DF2] via-[#A879FF] to-[#1FD1EB] p-1 shadow-[0_0_35px_rgba(31,209,235,0.6)] animate-bounce">
          <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#080A13]">
            <Trophy className="h-12 w-12 text-[#1FD1EB]" />
          </div>
        </div>

        {/* Badge de Victoria */}
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[#1FD1EB]/50 bg-[#1FD1EB]/15 px-4 py-1.5 text-xs font-extrabold text-[#1FD1EB] tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(31,209,235,0.3)]">
          <Sparkles className="h-4 w-4" />
          <span>¡Misión de Reclutamiento Completada!</span>
        </div>

        {/* Título Principal */}
        <h1 className="relative z-10 text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          ¡Bienvenido a <span className="text-[#1FD1EB]">ViniGames</span>!
        </h1>
        <p className="relative z-10 text-sm sm:text-base text-[#949CB2] max-w-md mx-auto mb-8">
          Tu cuenta ha sido creada exitosamente y tu <strong>Gamer DNA</strong> está configurado para ofrecerte la mejor experiencia en videojuegos.
        </p>

        {/* 3 Tarjetas de Recompensas Obtenidas */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl border border-[#783DF2]/40 bg-[#0D101D]/80 p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-lg bg-[#783DF2]/20 flex items-center justify-center text-[#A879FF] mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white">+100 XP</span>
            <span className="text-[11px] text-[#949CB2]">Nivel 1 Desbloqueado</span>
          </div>

          <div className="rounded-xl border border-[#F59E0B]/40 bg-[#0D101D]/80 p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] mb-2">
              <Coins className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white">100 🪙</span>
            <span className="text-[11px] text-[#949CB2]">GameCoins de Bienvenida</span>
          </div>

          <div className="rounded-xl border border-[#EF4444]/40 bg-[#0D101D]/80 p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-lg bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] mb-2">
              <Flame className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white">Día 1</span>
            <span className="text-[11px] text-[#949CB2]">Racha Diaria Iniciada</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(120,61,242,0.4)] hover:shadow-[0_0_25px_rgba(31,209,235,0.5)] hover:scale-105 transition-all"
          >
            <Gamepad2 className="h-4 w-4" />
            <span>Explorar la Tienda de Juegos</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#252A40] bg-[#131625] px-6 py-3.5 text-sm font-semibold text-white hover:border-[#783DF2] hover:bg-[#1A1E33] transition-all"
          >
            <User className="h-4 w-4 text-[#1FD1EB]" />
            <span>Ver mi Perfil Gamer</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
