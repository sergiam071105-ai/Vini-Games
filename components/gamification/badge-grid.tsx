"use client";

import { useState } from "react";
import { Award, Lock } from "lucide-react";

type BadgeCategory =
  | "Exploración"
  | "Competitivo"
  | "Colección"
  | "Social";

interface GamerBadge {
  id: number;
  name: string;
  description: string;
  category: BadgeCategory;
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

export default function BadgeGrid({ badges }: BadgeGridProps) {
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
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-xl border p-5 ${
              badge.unlocked
                ? "border-[#783DF2]/50 bg-[#783DF2]/10"
                : "border-[#2D3349] bg-[#0B0D18] opacity-70"
            }`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
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

              <span className="rounded-full border border-[#2D3349] px-2 py-1 text-[10px] text-[#949CB2]">
                {badge.category}
              </span>
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
              <p className="text-xs text-[#949CB2]">
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
        ))}
      </div>
    </section>
  );
}

export type { GamerBadge, BadgeCategory };