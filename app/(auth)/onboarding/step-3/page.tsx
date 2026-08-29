'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding, type GamerDnaData } from '@/lib/context/onboarding-context';
import { onboardingStep3Schema } from '@/lib/schemas/auth.schema';
import {
  Dna,
  ArrowRight,
  ArrowLeft,
  Compass,
  Trophy,
  BookOpen,
  Gem,
  Sparkles,
  Zap,
} from 'lucide-react';

const ARCHETYPES = [
  {
    key: 'exploration' as keyof GamerDnaData,
    name: 'Explorador',
    tagline: 'Mundos abiertos & secretos',
    icon: Compass,
    color: '#1FD1EB',
  },
  {
    key: 'competitive' as keyof GamerDnaData,
    name: 'Competitivo',
    tagline: 'Rankeds, reflejos & PvP',
    icon: Trophy,
    color: '#EF4444',
  },
  {
    key: 'narrative' as keyof GamerDnaData,
    name: 'Narrativo',
    tagline: 'Historias cinemáticas & lore',
    icon: BookOpen,
    color: '#A879FF',
  },
  {
    key: 'collection' as keyof GamerDnaData,
    name: 'Coleccionista',
    tagline: '100% logros & completismo',
    icon: Gem,
    color: '#F59E0B',
  },
];

const PRESETS = [
  {
    label: '⚖️ Equilibrado',
    values: { exploration: 25, competitive: 25, narrative: 25, collection: 25 },
  },
  {
    label: '🏆 Tryhard / PvP',
    values: { exploration: 15, competitive: 55, narrative: 10, collection: 20 },
  },
  {
    label: '🗺️ Aventurero RPG',
    values: { exploration: 45, competitive: 10, narrative: 35, collection: 10 },
  },
  {
    label: '💎 Completista 100%',
    values: { exploration: 20, competitive: 15, narrative: 20, collection: 45 },
  },
];

export default function OnboardingStep3Page() {
  const router = useRouter();
  const { data, updateStep3 } = useOnboarding();

  const [dna, setDna] = useState<GamerDnaData>(
    data.gamerDna || {
      exploration: 30,
      competitive: 30,
      narrative: 20,
      collection: 20,
    }
  );

  const handleSliderChange = (key: keyof GamerDnaData, value: number) => {
    setDna((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyPreset = (presetValues: GamerDnaData) => {
    setDna(presetValues);
  };

  const totalSum = Math.max(
    1,
    dna.exploration + dna.competitive + dna.narrative + dna.collection
  );
  const normalized = {
    exploration: Math.round((dna.exploration / totalSum) * 100),
    competitive: Math.round((dna.competitive / totalSum) * 100),
    narrative: Math.round((dna.narrative / totalSum) * 100),
    collection: Math.round((dna.collection / totalSum) * 100),
  };

  const dominant = Object.entries(normalized).reduce((a, b) => (b[1] > a[1] ? b : a));
  const dominantArchetype = ARCHETYPES.find((a) => a.key === dominant[0]);
  const DominantIcon = dominantArchetype?.icon || Compass;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = onboardingStep3Schema.safeParse(normalized);
    if (!validation.success) {
      return;
    }

    updateStep3(normalized);
    router.push('/onboarding/step-4');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-[#252A40] bg-[#131625]/90 p-5 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Encabezado Compacto */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#252A40]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#783DF2]/20 text-[#A879FF]">
              <Dna className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Paso 3: Ponderación Gamer DNA
              </h1>
              <p className="text-xs text-[#949CB2]">
                Ajusta los sliders para calibrar tus recomendaciones IA personalizadas.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#1FD1EB]/30 bg-[#1FD1EB]/10 px-3 py-1 text-xs font-semibold text-[#1FD1EB]">
            <Sparkles className="h-3.5 w-3.5" />
            {dominantArchetype?.name} ({dominant[1]}%)
          </span>
        </div>

        {/* Layout 2 Columnas Compacto (Zero Scroll) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Columna Izquierda: Visualizador en vivo + Presets (5 Cols) */}
          <div className="lg:col-span-5 p-4 rounded-xl border border-[#252A40] bg-[#0D101D] space-y-4">
            {/* Arquetipo Dominante Card */}
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  backgroundColor: `${dominantArchetype?.color}20`,
                  color: dominantArchetype?.color,
                  border: `1px solid ${dominantArchetype?.color}40`,
                }}
              >
                <DominantIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#949CB2] tracking-wider block">
                  Arquetipo Dominante
                </span>
                <p className="text-base font-extrabold text-white truncate">
                  {dominantArchetype?.name}
                </p>
                <p className="text-[11px] text-[#949CB2] truncate">
                  {dominantArchetype?.tagline}
                </p>
              </div>
            </div>

            {/* Barra multicolor normalizada */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Distribución de estilo</span>
                <span className="font-mono text-white font-bold">100% Total</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#1A1D2D] overflow-hidden flex shadow-inner">
                <div
                  className="bg-[#1FD1EB] h-full transition-all duration-300"
                  style={{ width: `${normalized.exploration}%` }}
                  title={`Explorador: ${normalized.exploration}%`}
                />
                <div
                  className="bg-[#EF4444] h-full transition-all duration-300"
                  style={{ width: `${normalized.competitive}%` }}
                  title={`Competitivo: ${normalized.competitive}%`}
                />
                <div
                  className="bg-[#A879FF] h-full transition-all duration-300"
                  style={{ width: `${normalized.narrative}%` }}
                  title={`Narrativo: ${normalized.narrative}%`}
                />
                <div
                  className="bg-[#F59E0B] h-full transition-all duration-300"
                  style={{ width: `${normalized.collection}%` }}
                  title={`Coleccionista: ${normalized.collection}%`}
                />
              </div>
            </div>

            {/* Chips de porcentajes */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center justify-between px-2 py-1 rounded bg-[#131625] border border-[#252A40]">
                <span className="text-zinc-300 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#1FD1EB]" /> Explorador
                </span>
                <strong className="text-white font-mono">{normalized.exploration}%</strong>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-[#131625] border border-[#252A40]">
                <span className="text-zinc-300 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#EF4444]" /> Competitivo
                </span>
                <strong className="text-white font-mono">{normalized.competitive}%</strong>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-[#131625] border border-[#252A40]">
                <span className="text-zinc-300 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#A879FF]" /> Narrativo
                </span>
                <strong className="text-white font-mono">{normalized.narrative}%</strong>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded bg-[#131625] border border-[#252A40]">
                <span className="text-zinc-300 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> Colección
                </span>
                <strong className="text-white font-mono">{normalized.collection}%</strong>
              </div>
            </div>

            {/* Plantillas Rápidas */}
            <div className="pt-2 border-t border-[#252A40]/50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#949CB2] tracking-wider block">
                Plantillas Rápidas:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p.values)}
                    className="text-[11px] rounded-lg border border-[#252A40] bg-[#131625] px-2 py-1 text-zinc-300 hover:border-[#1FD1EB] hover:text-white transition-all cursor-pointer truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: 4 Sliders Compactos (7 Cols) */}
          <div className="lg:col-span-7 space-y-2.5">
            {ARCHETYPES.map((arch) => {
              const Icon = arch.icon;
              const val = dna[arch.key];
              const pct = normalized[arch.key];

              return (
                <div
                  key={arch.key}
                  className="p-3 rounded-xl border border-[#252A40] bg-[#0D101D] space-y-1.5 hover:border-[#783DF2]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: `${arch.color}15`,
                          color: arch.color,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{arch.name}</p>
                        <span className="text-[10px] text-[#949CB2]">{arch.tagline}</span>
                      </div>
                    </div>
                    <span
                      className="font-mono text-xs font-extrabold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${arch.color}20`,
                        color: arch.color,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleSliderChange(arch.key, Number(e.target.value))}
                    className="w-full h-1.5 bg-[#1A1D2D] rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: arch.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Botones de Navegación Inferiores */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#252A40]/60">
          <button
            type="button"
            onClick={() => router.push('/onboarding/step-2')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#252A40] bg-[#0D101D] px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:border-[#783DF2] hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Atrás</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] px-7 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(120,61,242,0.4)] hover:shadow-[0_0_20px_rgba(31,209,235,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Siguiente: Credenciales & Cuenta</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
