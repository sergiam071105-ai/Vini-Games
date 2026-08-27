"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getLevelProgress } from "@/lib/gamification/level-calculator";

export interface StreakUpdateResult {
  streakUpdated: boolean;
  currentStreak: number;
  longestStreak: number;
  xpAwarded: number;
  isSevenDayStreak: boolean;
  isReset: boolean;
  message: string;
}

export interface RedeemRewardResult {
  success: boolean;
  message: string;
  newBalance?: number;
}

/**
 * Desbloquea la medalla "Racha Legendaria" para el usuario.
 * Primero busca el achievement por título para no depender
 * de un ID fijo en Supabase.
 */
async function unlockSevenDayAchievement(
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data: achievement, error: achievementError } =
      await supabase
        .from("achievements")
        .select("id")
        .eq("title", "Racha Legendaria")
        .maybeSingle();

    if (achievementError) {
      console.error(
        "Error buscando Racha Legendaria:",
        achievementError
      );
      return false;
    }

    if (!achievement) {
      console.warn(
        'No se encontró el achievement "Racha Legendaria".'
      );
      return false;
    }

    // Comprobar si ya está desbloqueada.
    const {
      data: existingAchievement,
      error: existingError,
    } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievement.id)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Error comprobando achievement desbloqueado:",
        existingError
      );
      return false;
    }

    // Ya estaba desbloqueada.
    if (existingAchievement) {
      return true;
    }

    const { error: unlockError } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
      });

    if (unlockError) {
      console.error(
        "Error desbloqueando Racha Legendaria:",
        unlockError
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Error inesperado desbloqueando Racha Legendaria:",
      error
    );
    return false;
  }
}

/**
 * Evalúa y actualiza la racha de conexión diaria.
 *
 * - Día consecutivo: +1 a la racha y +20 XP.
 * - Día 7: +20 XP base +50 XP de bono.
 * - Día 7: desbloquea "Racha Legendaria".
 * - Mismo día: no vuelve a sumar.
 * - Si se pierde un día: vuelve a 1.
 */
export async function updateStreakAction(): Promise<StreakUpdateResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        streakUpdated: false,
        currentStreak: 1,
        longestStreak: 1,
        xpAwarded: 0,
        isSevenDayStreak: false,
        isReset: false,
        message: "Usuario no autenticado",
      };
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select(
          "id, total_xp, current_streak, longest_streak, last_login_date"
        )
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      return {
        streakUpdated: false,
        currentStreak: 1,
        longestStreak: 1,
        xpAwarded: 0,
        isSevenDayStreak: false,
        isReset: false,
        message: "Perfil no encontrado",
      };
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const lastLoginStr = profile.last_login_date;

    // Ya registró su racha hoy.
    if (lastLoginStr === todayStr) {
      const currentStreak =
        profile.current_streak || 1;

      const isSevenDayStreak =
        currentStreak % 7 === 0;

      // Si ya tiene una racha múltiplo de 7,
      // aseguramos que la medalla esté desbloqueada.
      if (isSevenDayStreak) {
        await unlockSevenDayAchievement(user.id);
      }

      return {
        streakUpdated: false,
        currentStreak,
        longestStreak: profile.longest_streak || 1,
        xpAwarded: 0,
        isSevenDayStreak,
        isReset: false,
        message: "Racha de hoy ya registrada",
      };
    }

    let daysDiff = 999;

    if (lastLoginStr) {
      const lastLoginDate = new Date(
        `${lastLoginStr}T00:00:00Z`
      );

      const todayDate = new Date(
        `${todayStr}T00:00:00Z`
      );

      const diffTime =
        todayDate.getTime() -
        lastLoginDate.getTime();

      daysDiff = Math.round(
        diffTime / (1000 * 60 * 60 * 24)
      );
    }

    let newStreak = 1;
    let xpAward = 20;
    let isSevenDayStreak = false;
    let isReset = false;

    if (daysDiff === 1) {
      newStreak =
        (profile.current_streak || 0) + 1;

      isSevenDayStreak =
        newStreak % 7 === 0;

      // 20 XP diarios + 50 XP por completar 7 días.
      xpAward = isSevenDayStreak ? 70 : 20;
    } else if (
      daysDiff > 1 ||
      daysDiff <= 0
    ) {
      newStreak = 1;
      xpAward = 20;
      isReset = true;
    }

    const currentLongest =
      profile.longest_streak || 1;

    const newLongest = Math.max(
      currentLongest,
      newStreak
    );

    const newTotalXp =
      (profile.total_xp || 0) + xpAward;

    const { level: newLevel } =
      getLevelProgress(newTotalXp);

    // 1. Actualizar perfil.
    const { error: updateError } =
      await supabase
        .from("profiles")
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          total_xp: newTotalXp,
          current_level: newLevel,
          last_login_date: todayStr,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (updateError) {
      console.error(
        "Error al actualizar la racha:",
        updateError
      );

      return {
        streakUpdated: false,
        currentStreak:
          profile.current_streak || 1,
        longestStreak:
          profile.longest_streak || 1,
        xpAwarded: 0,
        isSevenDayStreak: false,
        isReset: false,
        message:
          "No se pudo actualizar la racha.",
      };
    }

    // 2. Registrar actividad diaria.
    const { error: streakLogError } =
      await supabase
        .from("streak_logs")
        .upsert(
          {
            user_id: user.id,
            activity_date: todayStr,
            streak_count: newStreak,
            xp_awarded: xpAward,
          },
          {
            onConflict: "user_id,activity_date",
          }
        );

    if (streakLogError) {
      console.error(
        "Error al registrar streak_log:",
        streakLogError
      );
    }

    // 3. Desbloquear Racha Legendaria al llegar
    // a 7, 14, 21... días.
    if (isSevenDayStreak) {
      const achievementUnlocked =
        await unlockSevenDayAchievement(user.id);

      if (!achievementUnlocked) {
        console.error(
          "La racha llegó a 7 días, pero no se pudo registrar la medalla."
        );
      }
    }

    // 4. Refrescar las vistas.
    revalidatePath("/gamification");
    revalidatePath("/profile");
    revalidatePath("/");

    return {
      streakUpdated: true,
      currentStreak: newStreak,
      longestStreak: newLongest,
      xpAwarded: xpAward,
      isSevenDayStreak,
      isReset,
      message: isSevenDayStreak
        ? `¡Felicitaciones! Has completado 7 días seguidos (+${xpAward} XP) y desbloqueaste Racha Legendaria.`
        : isReset
          ? `Nueva racha iniciada (+${xpAward} XP ganados).`
          : `¡Racha del día mantenida! (+${xpAward} XP ganados).`,
    };
  } catch (err: unknown) {
    console.error(
      "Error in updateStreakAction:",
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : "Error al actualizar racha diaria";

    return {
      streakUpdated: false,
      currentStreak: 1,
      longestStreak: 1,
      xpAwarded: 0,
      isSevenDayStreak: false,
      isReset: false,
      message,
    };
  }
}

/**
 * Canjea una recompensa utilizando GameCoins.
 */
export async function redeemRewardAction(
  rewardName: string,
  cost: number
): Promise<RedeemRewardResult> {
  try {
    if (
      !rewardName.trim() ||
      !Number.isInteger(cost) ||
      cost <= 0
    ) {
      return {
        success: false,
        message: "Recompensa o costo inválido.",
      };
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message:
          "Debes iniciar sesión para canjear recompensas.",
      };
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("gamecoins_balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "Error al obtener saldo de GameCoins:",
        profileError
      );

      return {
        success: false,
        message:
          "No se pudo obtener tu saldo de GameCoins.",
      };
    }

    const currentBalance =
      profile.gamecoins_balance ?? 0;

    if (currentBalance < cost) {
      return {
        success: false,
        message: `GameCoins insuficientes. Necesitas ${cost} GameCoins y tienes ${currentBalance}.`,
        newBalance: currentBalance,
      };
    }

    const newBalance =
      currentBalance - cost;

    const { error: updateError } =
      await supabase
        .from("profiles")
        .update({
          gamecoins_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (updateError) {
      console.error(
        "Error al descontar GameCoins:",
        updateError
      );

      return {
        success: false,
        message:
          "No se pudo completar el canje.",
        newBalance: currentBalance,
      };
    }

    revalidatePath("/gamification");
    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      message: `¡${rewardName} canjeado correctamente por ${cost} GameCoins!`,
      newBalance,
    };
  } catch (err: unknown) {
    console.error(
      "Error in redeemRewardAction:",
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : "Error al canjear la recompensa.";

    return {
      success: false,
      message,
    };
  }
}