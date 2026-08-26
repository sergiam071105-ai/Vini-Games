import {
  Coins,
  Flame,
  MessageSquareText,
  Users,
} from "lucide-react";

import type { CommunityKpis } from "@/types/moderation.types";

interface KpiCommunityCardsProps {
  kpis: CommunityKpis;
}

export default function KpiCommunityCards({
  kpis,
}: KpiCommunityCardsProps) {
  const cards = [
    {
      title: "Usuarios registrados",
      value: kpis.totalUsers.toLocaleString("es-BO"),
      description: "Perfiles activos en ViniGames",
      icon: Users,
      accent: "text-[#1FD1EB]",
      background: "bg-[#1FD1EB]/10",
      border: "border-[#1FD1EB]/20",
    },
    {
      title: "Retención de rachas",
      value: `${kpis.streakRetentionRate}%`,
      description: "Usuarios con una racha activa",
      icon: Flame,
      accent: "text-[#F59E0B]",
      background: "bg-[#F59E0B]/10",
      border: "border-[#F59E0B]/20",
    },
    {
      title: "Reseñas totales",
      value: kpis.totalReviews.toLocaleString("es-BO"),
      description: `${kpis.reviewApprovalRate}% aprobadas`,
      icon: MessageSquareText,
      accent: "text-[#783DF2]",
      background: "bg-[#783DF2]/10",
      border: "border-[#783DF2]/20",
    },
    {
      title: "GameCoins activos",
      value: kpis.gameCoinsInCirculation.toLocaleString("es-BO"),
      description: "GameCoins en circulación",
      icon: Coins,
      accent: "text-[#10B981]",
      background: "bg-[#10B981]/10",
      border: "border-[#10B981]/20",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className={`rounded-2xl border ${card.border} bg-[#1A1C2B] p-5 transition hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#949CB2]">
                  {card.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-white">
                  {card.value}
                </p>

                <p className="mt-2 text-sm text-[#777E94]">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.background}`}
              >
                <Icon className={`h-5 w-5 ${card.accent}`} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}