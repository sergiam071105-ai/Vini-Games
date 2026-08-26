import {
  BookOpen,
  Boxes,
  Compass,
  Swords,
} from "lucide-react";

import type {
  GamerDnaDistributionItem,
} from "@/types/moderation.types";

interface GamerDnaDistributionChartProps {
  data: GamerDnaDistributionItem[];
}

const archetypeVisuals = {
  explorer: {
    icon: Compass,
    color: "bg-[#1FD1EB]",
    text: "text-[#1FD1EB]",
  },
  competitive: {
    icon: Swords,
    color: "bg-[#EF4444]",
    text: "text-[#F87171]",
  },
  narrative: {
    icon: BookOpen,
    color: "bg-[#783DF2]",
    text: "text-[#A879FF]",
  },
  collector: {
    icon: Boxes,
    color: "bg-[#10B981]",
    text: "text-[#10B981]",
  },
} as const;

export default function GamerDnaDistributionChart({
  data,
}: GamerDnaDistributionChartProps) {
  const totalUsers = data.reduce(
    (total, item) => total + item.users,
    0
  );

  return (
    <section className="rounded-2xl border border-[#2E334A] bg-[#1A1C2B] p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1FD1EB]">
            Comunidad
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Distribución Gamer DNA
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#949CB2]">
            Distribución de los usuarios según su
            arquetipo gamer predominante.
          </p>
        </div>

        <div className="rounded-xl border border-[#2E334A] bg-[#090B14] px-4 py-3 text-right">
          <p className="text-xs text-[#949CB2]">
            Usuarios analizados
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {totalUsers.toLocaleString("es-BO")}
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {data.map((item) => {
          const visual =
            archetypeVisuals[item.archetype];

          const Icon = visual.icon;

          return (
            <div
              key={item.archetype}
              className="space-y-2"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#090B14]">
                    <Icon
                      className={`h-4 w-4 ${visual.text}`}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.label}
                    </p>

                    <p className="text-xs text-[#6F758C]">
                      {item.users.toLocaleString(
                        "es-BO"
                      )}{" "}
                      usuarios
                    </p>
                  </div>
                </div>

                <span
                  className={`text-sm font-bold ${visual.text}`}
                >
                  {item.percentage}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-[#090B14]">
                <div
                  className={`h-full rounded-full ${visual.color} transition-all duration-500`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        item.percentage
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalUsers === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-[#2E334A] bg-[#090B14] p-5 text-center">
          <p className="text-sm text-[#949CB2]">
            Todavía no hay suficientes datos Gamer DNA
            para generar la distribución comunitaria.
          </p>
        </div>
      )}
    </section>
  );
}