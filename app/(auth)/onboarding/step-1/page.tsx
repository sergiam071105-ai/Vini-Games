'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/context/onboarding-context';
import { onboardingStep1Schema } from '@/lib/schemas/auth.schema';
import {
  Sparkles,
  ArrowRight,
  User,
  Sword,
  Bot,
  Crown,
  Skull,
  Shield,
  Rocket,
  Zap,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  {
    id: 'cyber_ninja',
    name: 'Cyber Ninja',
    badge: 'Sigilo & Reflejos',
    icon: Sword,
    gradient: 'from-[#783DF2] to-[#1FD1EB]',
    glowColor: 'rgba(120, 61, 242, 0.4)',
  },
  {
    id: 'mecha_titan',
    name: 'Mecha Titan',
    badge: 'Fuerza Blindada',
    icon: Bot,
    gradient: 'from-[#1FD1EB] to-[#3B82F6]',
    glowColor: 'rgba(31, 209, 235, 0.4)',
  },
  {
    id: 'neon_wizard',
    name: 'Neon Wizard',
    badge: 'Magia Cuántica',
    icon: Sparkles,
    gradient: 'from-[#EC4899] to-[#783DF2]',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
  {
    id: 'shadow_assassin',
    name: 'Shadow Assassin',
    badge: 'Crítico Letal',
    icon: Skull,
    gradient: 'from-[#EF4444] to-[#7F1D1D]',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  {
    id: 'synth_valkyrie',
    name: 'Synth Valkyrie',
    badge: 'Líder de Batalla',
    icon: Crown,
    gradient: 'from-[#F59E0B] to-[#EC4899]',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'pixel_paladin',
    name: 'Pixel Paladin',
    badge: 'Defensa Sagrada',
    icon: Shield,
    gradient: 'from-[#10B981] to-[#1FD1EB]',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'space_corsair',
    name: 'Space Corsair',
    badge: 'Explorador Estelar',
    icon: Rocket,
    gradient: 'from-[#6366F1] to-[#06B6D4]',
    glowColor: 'rgba(99, 102, 241, 0.4)',
  },
  {
    id: 'holo_rebel',
    name: 'Holo Rebel',
    badge: 'Hacker Táctico',
    icon: Zap,
    gradient: 'from-[#8B5CF6] to-[#06B6D4]',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
];

export default function OnboardingStep1Page() {
  const router = useRouter();
  const { data, updateStep1 } = useOnboarding();

  const [selectedAvatar, setSelectedAvatar] = useState(data.avatarUrl || 'cyber_ninja');
  const [username, setUsername] = useState(data.username || '');
  const [fullName, setFullName] = useState(data.fullName || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = onboardingStep1Schema.safeParse({
      avatarUrl: selectedAvatar,
      username: username.trim(),
      fullName: fullName.trim() || undefined,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    updateStep1({
      avatarUrl: selectedAvatar,
      username: username.trim(),
      fullName: fullName.trim(),
    });

    router.push('/onboarding/step-2');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-[#252A40] bg-[#131625]/90 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#783DF2]/20 text-[#1FD1EB]">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Paso 1: Define tu Identidad Gamer
          </h1>
          <p className="text-sm text-[#949CB2] mt-1">
            Elige tu avatar representativo y tu Gamer Tag oficial en la red ViniGames.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Selector de Avatar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#1FD1EB]" />
                Selecciona tu Avatar
              </label>
              <span className="text-xs text-[#949CB2]">8 Arquetipos disponibles</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {AVATAR_OPTIONS.map((avatar) => {
                const Icon = avatar.icon;
                const isSelected = selectedAvatar === avatar.id;

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`group relative flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#1FD1EB] bg-[#1A2238] shadow-[0_0_20px_rgba(31,209,235,0.35)] scale-[1.03]'
                        : 'border-[#252A40] bg-[#0D101D] hover:border-[#783DF2] hover:bg-[#15192D]'
                    }`}
                  >
                    {/* Icono / Emblema del Avatar */}
                    <div
                      className={`h-14 w-14 rounded-2xl p-0.5 mb-3 bg-gradient-to-br ${avatar.gradient} transition-transform group-hover:scale-105`}
                      style={{
                        boxShadow: isSelected ? `0 0 15px ${avatar.glowColor}` : 'none',
                      }}
                    >
                      <div className="h-full w-full rounded-[14px] bg-[#080A13] flex items-center justify-center">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    <p className="text-xs font-bold text-white tracking-wide truncate w-full">
                      {avatar.name}
                    </p>
                    <p className="text-[10px] text-[#949CB2] mt-0.5 truncate w-full">
                      {avatar.badge}
                    </p>

                    {isSelected && (
                      <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1FD1EB] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1FD1EB]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Inputs de Usuario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Gamer Tag */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                Gamer Tag (Nombre de usuario único) <span className="text-[#1FD1EB]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ej: CyberVini_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`
                    w-full rounded-xl border bg-[#0D101D] px-4 py-3.5 text-white text-sm
                    outline-none transition-all duration-200 placeholder:text-[#525B75]
                    ${
                      errors.username
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-[#252A40] focus:border-[#1FD1EB] focus:ring-2 focus:ring-[#1FD1EB]/20'
                    }
                  `}
                />
              </div>
              {errors.username ? (
                <span className="text-xs text-red-400 block mt-1">{errors.username}</span>
              ) : (
                <span className="text-[11px] text-[#949CB2] block mt-1">
                  Mínimo 3 caracteres. Letras, números, guiones (-) y (_).
                </span>
              )}
            </div>

            {/* Nombre Completo */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-[#C8D1E6]">
                Nombre Completo <span className="text-zinc-500">(Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="ej: Eduardo Ribera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-[#252A40] bg-[#0D101D] px-4 py-3.5 text-white text-sm outline-none transition-all duration-200 placeholder:text-[#525B75] focus:border-[#783DF2] focus:ring-2 focus:ring-[#783DF2]/20"
              />
              <span className="text-[11px] text-[#949CB2] block mt-1">
                Visible opcionalmente en tu perfil gamer.
              </span>
            </div>
          </div>

          {/* Botón Siguiente */}
          <div className="flex items-center justify-end pt-4 border-t border-[#252A40]/60">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(120,61,242,0.4)] hover:shadow-[0_0_25px_rgba(31,209,235,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Continuar a Géneros Favoritos</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
