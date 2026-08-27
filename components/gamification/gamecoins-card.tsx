"use client";

import { useState, useTransition } from "react";
import { Gem, Gift } from "lucide-react";

import { redeemRewardAction } from "@/app/actions/gamification.actions";

interface GameCoinsCardProps {
  balance: number;
}

const DEMO_REWARD = {
  name: "Cofre Gamer",
  description: "Recompensa especial del Hub de Gamificación.",
  cost: 50,
};

export default function GameCoinsCard({
  balance,
}: GameCoinsCardProps) {
  const [displayBalance, setDisplayBalance] =
    useState(balance);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRedeem = () => {
    setMessage("");

    startTransition(async () => {
      const result = await redeemRewardAction(
        DEMO_REWARD.name,
        DEMO_REWARD.cost
      );

      setSuccess(result.success);
      setMessage(result.message);

      if (
        result.success &&
        result.newBalance !== undefined
      ) {
        setDisplayBalance(result.newBalance);
      }
    });
  };

  const canRedeem =
    displayBalance >= DEMO_REWARD.cost;

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
            {displayBalance.toLocaleString()}
          </h2>

          <p className="text-sm font-medium text-[#1FD1EB]">
            GameCoins
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#2D3349] pt-5">
        <div className="rounded-xl border border-[#2D3349] bg-[#0B0D18] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#783DF2]/15">
              <Gift className="h-5 w-5 text-[#A879FF]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#949CB2]">
                Recompensa disponible
              </p>

              <h3 className="mt-1 font-bold text-white">
                {DEMO_REWARD.name}
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#949CB2]">
                {DEMO_REWARD.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#949CB2]">
                Costo
              </p>

              <p className="font-bold text-[#1FD1EB]">
                {DEMO_REWARD.cost} GameCoins
              </p>
            </div>

            <button
              type="button"
              onClick={handleRedeem}
              disabled={isPending || !canRedeem}
              className="rounded-lg bg-[#783DF2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8B52F5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Canjeando..."
                : canRedeem
                  ? "Canjear"
                  : "Saldo insuficiente"}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
              success
                ? "border-[#10B981]/40 bg-[#10B981]/10 text-[#6EE7B7]"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-[#949CB2]">
          Gana GameCoins completando logros, manteniendo
          tu racha y participando en ViniGames.
        </p>
      </div>
    </section>
  );
}