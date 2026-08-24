import { Gem } from "lucide-react";

interface GameCoinsCardProps {
  balance: number;
}

export default function GameCoinsCard({
  balance,
}: GameCoinsCardProps) {
  return (
    <section className="rounded-2xl border border-[#2D3349] bg-[#131521] p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1FD1EB]/10">
          <Gem className="h-7 w-7 text-[#1FD1EB]" />
        </div>

        <div>
          <p className="text-sm text-[#949CB2]">
            Saldo disponible
          </p>

          <h2 className="text-3xl font-bold text-white">
            {balance.toLocaleString()}
          </h2>

          <p className="text-sm font-medium text-[#1FD1EB]">
            GameCoins
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#2D3349] pt-4">
        <p className="text-xs leading-5 text-[#949CB2]">
          Gana GameCoins completando logros, manteniendo tu racha
          y participando en ViniGames.
        </p>
      </div>
    </section>
  );
}