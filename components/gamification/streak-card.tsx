import { Check, Flame, Gift } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCard({
  currentStreak,
  longestStreak,
}: StreakCardProps) {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <section className="rounded-2xl border border-[#2D3349] bg-[#131521] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#949CB2]">
            Racha actual
          </p>

          <h2 className="flex items-center gap-2 text-3xl font-bold text-white">
            <Flame className="h-7 w-7 text-[#10B981]" />
            {currentStreak} días
          </h2>
        </div>

        <div className="text-right">
          <p className="text-sm text-[#949CB2]">
            Mejor racha
          </p>

          <p className="text-xl font-semibold text-[#1FD1EB]">
            {longestStreak} días
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
         const isCompleted =
  currentStreak >= 7 ? day <= 7 : day < currentStreak;

const isCurrent =
  currentStreak > 0 &&
  currentStreak < 7 &&
  day === currentStreak;

const isGoal = day === 7;

          return (
            <div
              key={day}
              className={`
                flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center
                ${
                  isCompleted
                    ? "border-[#10B981] bg-[#10B981]/10"
                    : isCurrent
                    ? "border-[#783DF2] bg-[#783DF2]/10 shadow-[0_0_15px_rgba(120,61,242,0.35)]"
                    : "border-[#2D3349] bg-[#0B0D18]"
                }
              `}
            >
              {isGoal ? (
                <Gift
                  className={`h-6 w-6 ${
                    isCompleted || isCurrent
                      ? "text-yellow-400"
                      : "text-[#555B70]"
                  }`}
                />
              ) : isCompleted ? (
                <Check className="h-6 w-6 text-[#10B981]" />
              ) : (
                <Flame
                  className={`h-6 w-6 ${
                    isCurrent
                      ? "text-[#783DF2]"
                      : "text-[#555B70]"
                  }`}
                />
              )}

              <span className="text-xs font-semibold text-white">
                Día {day}
              </span>

              {isCurrent && (
                <span className="text-[10px] text-[#1FD1EB]">
                  ¡Conectado hoy!
                </span>
              )}

              {isGoal && (
                <span className="text-[9px] leading-tight text-[#949CB2]">
                  +50 XP
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[#949CB2]">
        Completa 7 días para desbloquear la medalla{" "}
        <span className="font-semibold text-yellow-400">
          Racha Legendaria
        </span>
        .
      </p>
    </section>
  );
}