"use client";

import { useState } from "react";
import { Award, Lock } from "lucide-react";

type BadgeCategory =
  | "Exploración"
  | "Competitivo"
  | "Colección"
  | "Social";

type BadgeRarity =
  | "Común"
  | "Rara"
  | "Épica"
  | "Legendaria";

interface GamerBadge {
  id: number;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity?: BadgeRarity;
  unlocked: boolean;
  reward: string;
}

interface BadgeGridProps {
  badges: GamerBadge[];
}

type FilterCategory = "Todas" | BadgeCategory;

const filters: FilterCategory[] = [
  "Todas",
  "Exploración",
  "Competitivo",
  "Colección",
  "Social",
];

function getRarityClasses(rarity: BadgeRarity) {
  switch (rarity) {
    case "Legendaria":
      return "border-yellow-400/50 bg-yellow-400/10 text-yellow-300";

    case "Épica":
      return "border-[#A879FF]/50 bg-[#783DF2]/15 text-[#C4A5FF]";

    case "Rara":
      return "border-[#1FD1EB]/50 bg-[#1FD1EB]/10 text-[#67E8F9]";

    case "Común":
    default:
      return "border-[#777E94]/50 bg-[#777E94]/10 text-[#B6BBC9]";
  }
}

export default function BadgeGrid({
  badges,
}: BadgeGridProps) {
  const [activeFilter, setActiveFilter] =
    useState<FilterCategory>("Todas");

  const filteredBadges =
    activeFilter === "Todas"
      ? badges
      : badges.filter(
          (badge) => badge.category === activeFilter
        );

  return (
    <section className="rounded-2xl border border-[#2D3349] bg-[#131521] p-6">
      <div className="mb-6">
        <p className="text-sm text-[#949CB2]">
          Colección
        </p>

        <h2 className="text-2xl font-bold text-white">
          Galería de medallas
        </h2>

        <p className="mt-2 text-xs text-[#949CB2]">
          Desbloquea medallas de diferentes rarezas
          completando desafíos en ViniGames.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              activeFilter === filter
                ? "border-[#783DF2] bg-[#783DF2] text-white"
                : "border-[#2D3349] bg-[#0B0D18] text-[#949CB2] hover:border-[#783DF2] hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Medallas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBadges.map((badge) => {
          const rarity = badge.rarity ?? "Común";

          return (
            <div
              key={badge.id}
              className={`rounded-xl border p-5 transition ${
                badge.unlocked
                  ? "border-[#783DF2]/50 bg-[#783DF2]/10"
                  : "border-[#2D3349] bg-[#0B0D18] opacity-70"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    badge.unlocked
                      ? "bg-[#783DF2]/20"
                      : "bg-[#2E334A]"
                  }`}
                >
                  {badge.unlocked ? (
                    <Award className="h-6 w-6 text-[#1FD1EB]" />
                  ) : (
                    <Lock className="h-5 w-5 text-[#777E94]" />
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full border px-2 py-1 text-[10px] font-bold ${getRarityClasses(
                      rarity
                    )}`}
                  >
                    {rarity}
                  </span>

                  <span className="rounded-full border border-[#2D3349] px-2 py-1 text-[10px] text-[#949CB2]">
                    {badge.category}
                  </span>
                </div>
              </div>

              <h3
                className={`font-bold ${
                  badge.unlocked
                    ? "text-white"
                    : "text-[#777E94]"
                }`}
              >
                {badge.name}
              </h3>

              <p className="mt-2 min-h-10 text-xs leading-5 text-[#949CB2]">
                {badge.description}
              </p>

              <div className="mt-4 border-t border-[#2D3349] pt-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-[#949CB2]">
                    Estado
                  </p>

                  <p
                    className={`text-xs font-semibold ${
                      badge.unlocked
                        ? "text-[#10B981]"
                        : "text-[#777E94]"
                    }`}
                  >
                    {badge.unlocked
                      ? "Desbloqueada"
                      : "Bloqueada"}
                  </p>
                </div>

                <p className="mt-3 text-xs text-[#949CB2]">
                  Recompensa
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    badge.unlocked
                      ? "text-[#1FD1EB]"
                      : "text-[#777E94]"
                  }`}
                >
                  {badge.reward}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export type {
  GamerBadge,
  BadgeCategory,
  BadgeRarity,
};