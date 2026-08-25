import { Trophy } from "lucide-react";

import { mockAchievements } from "@/lib/mock-data/achievements";
import type { Database } from "@/types/database.types";
import { createClient } from "@/lib/supabase/server";
import XpBar from "@/components/gamification/xp-bar";
import StreakCard from "@/components/gamification/streak-card";
import GameCoinsCard from "@/components/gamification/gamecoins-card";
import BadgeGrid, {
  GamerBadge,
} from "@/components/gamification/badge-grid";

type AchievementRow =
  Database["public"]["Tables"]["achievements"]["Row"];

export default async function GamificationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let achievements: AchievementRow[] = [];
  let unlockedAchievementIds = new Set<number>();

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select(`
        total_xp,
        current_level,
        current_streak,
        longest_streak,
        gamecoins_balance,
        username,
        avatar_url
      `)
      .eq("id", user.id)
      .single();

    profile = profileData;

    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*");

    achievements = achievementsData ?? [];

    const { data: userAchievementsData } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user.id);

    unlockedAchievementIds = new Set(
      (userAchievementsData ?? []).map(
        (item) => item.achievement_id
      )
    );
  }

  const categoryMap = {
    EXPLORATION: "Exploración",
    COMPETITIVE: "Competitivo",
    COLLECTION: "Colección",
    SOCIAL: "Social",
  } as const;

  const badges: GamerBadge[] = achievements.length > 0
    ? achievements.map((achievement) => {
        const rewards: string[] = [];

        if (achievement.xp_reward > 0) {
          rewards.push(`+${achievement.xp_reward} XP`);
        }

        if (achievement.gamecoins_reward > 0) {
          rewards.push(
            `+${achievement.gamecoins_reward} GameCoins`
          );
        }

        return {
          id: achievement.id,
          name: achievement.title,
          description: achievement.description,
          category: categoryMap[achievement.category] || "Social",
          unlocked: unlockedAchievementIds.has(achievement.id),
          reward: rewards.join(" · "),
        };
      })
    : mockAchievements;

  return (
    <div className="w-full space-y-8 text-white">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#1FD1EB]">
            <Trophy className="h-5 w-5" />

            <span className="text-sm font-semibold uppercase tracking-wider">
              Centro de Gamificación
            </span>
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Tu progreso gamer
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#949CB2]">
            Mantén tu racha, sube de nivel y desbloquea medallas mientras
            exploras ViniGames.
          </p>
        </div>

        <div className="rounded-xl border border-[#783DF2]/40 bg-[#783DF2]/10 px-5 py-3">
          <p className="text-xs text-[#949CB2]">
            Título honorífico
          </p>

          <p className="font-bold text-[#A879FF]">
            Aventurero
          </p>
        </div>
      </section>

      <XpBar totalXp={profile?.total_xp ?? 0} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <StreakCard
          currentStreak={profile?.current_streak ?? 0}
          longestStreak={profile?.longest_streak ?? 0}
        />

        <GameCoinsCard
          balance={profile?.gamecoins_balance ?? 0}
        />
      </div>

<BadgeGrid
  badges={badges.length > 0 ? badges : mockAchievements}
/>
    </div>
  );
}