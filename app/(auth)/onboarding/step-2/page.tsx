'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/context/onboarding-context';
import { onboardingStep2Schema } from '@/lib/schemas/auth.schema';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Gamepad2,
  Sword,
  Target,
  Cpu,
  Flame,
  Ghost,
  Skull,
  Compass,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'action',
    name: 'Acción & Aventura',
    description: 'Combates dinámicos, exploración y adrenalina pura.',
    icon: Sword,
    gradient: 'from-[#783DF2] to-[#A879FF]',
    accentColor: '#783DF2',
  },
  {
    id: 'rpg',
    name: 'RPG & Fantasía',
    description: 'Progresión de personajes, historias profundas y mundos mágicos.',
    icon: Sparkles,
    gradient: 'from-[#EC4899] to-[#8B5CF6]',
    accentColor: '#EC4899',
  },
  {
    id: 'fps',
    name: 'Shooters & FPS',
    description: 'Puntería precisa, partidas competitivas y táctica militar.',
    icon: Target,
    gradient: 'from-[#EF4444] to-[#F59E0B]',
    accentColor: '#EF4444',
  },
  {
    id: 'strategy',
    name: 'Estrategia & Táctica',
    description: 'Gestión de recursos, tácticas por turnos y dominio bélico.',
    icon: Cpu,
    gradient: 'from-[#3B82F6] to-[#1FD1EB]',
    accentColor: '#3B82F6',
  },
  {
    id: 'racing',
    name: 'Carreras & Simulación',
    description: 'Velocidad extrema, física realista y circuitos mundiales.',
    icon: Flame,
    gradient: 'from-[#F59E0B] to-[#EF4444]',
    accentColor: '#F59E0B',
  },
  {
    id: 'indie',
    name: 'Indie & Pixel Art',
    description: 'Mecánicas innovadoras, narrativa de autor y arte retro.',
    icon: Ghost,
    gradient: 'from-[#10B981] to-[#1FD1EB]',
    accentColor: '#10B981',
  },
  {
    id: 'horror',
    name: 'Survival & Terror',
    description: 'Tensión psicológica, sustos y gestión de supervivencia.',
    icon: Skull,
    gradient: 'from-[#6B7280] to-[#1F2937]',
    accentColor: '#9CA3AF',
  },
  {
    id: 'sandbox',
    name: 'Sandbox & Supervivencia',
    description: 'Construcción libre, crafteo y mundos infinitos.',
    icon: Compass,
    gradient: 'from-[#06B6D4] to-[#3B82F6]',
    accentColor: '#06B6D4',
  },
];

export default function OnboardingStep2Page() {
  const router = useRouter();
  const { data, updateStep2 } = useOnboarding();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    data.favoriteCategories && data.favoriteCategories.length > 0
      ? data.favoriteCategories
      : ['action', 'rpg']
  );
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
    if (error) setError(null);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = onboardingStep2Schema.safeParse({
      favoriteCategories: selectedCategories,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Selecciona al menos 1 categoría.');
      return;
    }

    updateStep2(selectedCategories);
    router.push('/onboarding/step-3');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-[#252A40] bg-[#131625]/90 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1FD1EB]/20 text-[#1FD1EB]">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Paso 2: ¿Qué géneros te apasionan?
          </h1>
          <p className="text-sm text-[#949CB2] mt-1">
            Personalizaremos las ofertas y recomendaciones de la tienda según tus gustos.
          </p>
        </div>

        {/* Contador de categorías */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#949CB2]">
            Haz clic para seleccionar o deseleccionar géneros:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#783DF2]/50 bg-[#783DF2]/15 px-3 py-1 text-xs font-bold text-[#A879FF]">
            <Sparkles className="h-3 w-3" />
            {selectedCategories.length} Seleccionados
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Cuadrícula de Categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategories.includes(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`group flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'border-[#1FD1EB] bg-[#172238] shadow-[0_0_20px_rgba(31,209,235,0.25)]'
                    : 'border-[#252A40] bg-[#0D101D] hover:border-[#783DF2] hover:bg-[#15192D]'
                }`}
              >
                {/* Icono con gradiente */}
                <div
                  className={`h-11 w-11 rounded-xl p-0.5 shrink-0 bg-gradient-to-br ${cat.gradient} transition-transform group-hover:scale-105`}
                >
                  <div className="h-full w-full rounded-[10px] bg-[#080A13] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 pr-6">
                  <p className="text-sm font-bold text-white tracking-wide">{cat.name}</p>
                  <p className="text-xs text-[#949CB2] mt-0.5 line-clamp-2">{cat.description}</p>
                </div>

                {/* Checkbox circular custom */}
                <div
                  className={`absolute top-4 right-4 h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#1FD1EB] text-[#080A13] shadow-[0_0_8px_#1FD1EB]'
                      : 'border border-zinc-700 bg-[#080A13]'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botones de Navegación */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#252A40]/60">
          <button
            type="button"
            onClick={() => router.push('/onboarding/step-1')}
            className="inline-flex items-center gap-2 rounded-xl border border-[#252A40] bg-[#0D101D] px-5 py-3 text-sm font-semibold text-zinc-300 hover:border-[#783DF2] hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Atrás</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(120,61,242,0.4)] hover:shadow-[0_0_25px_rgba(31,209,235,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Siguiente: Ponderar Gamer DNA</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
