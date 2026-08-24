import { getLevelProgress } from "@/lib/gamification/level-calculator";

interface XpBarProps {
  totalXp: number;
}

export default function XpBar({ totalXp }: XpBarProps) {
  const {
    level,
    currentXpInLevel,
    xpNeededForNextLevel,
    percentage,
  } = getLevelProgress(totalXp);

  const remainingXp = Math.max(
    0,
    xpNeededForNextLevel - currentXpInLevel
  );

  return (
    <section className="rounded-2xl border border-[#2D3349] bg-[#131521] p-6">
      <div className="flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#949CB2]">
              Nivel actual
            </p>

            <h2 className="text-3xl font-bold text-white">
              Nivel {level}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm text-[#949CB2]">
              Próximo nivel
            </p>

            <p className="text-xl font-semibold text-[#1FD1EB]">
              Nivel {level + 1}
            </p>
          </div>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-[#2E334A]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[#F5F7FF]">
            {currentXpInLevel} XP / {xpNeededForNextLevel} XP
            <span className="ml-2 text-[#1FD1EB]">
              ({percentage}% completado)
            </span>
          </p>

          <p className="text-[#949CB2]">
            Te faltan{" "}
            <span className="font-semibold text-white">
              {remainingXp} XP
            </span>{" "}
            para subir al siguiente nivel
          </p>
        </div>

      </div>
    </section>
  );
}