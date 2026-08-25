'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getLevelProgress } from '@/lib/gamification/level-calculator';

export interface StreakUpdateResult {
  streakUpdated: boolean;
  currentStreak: number;
  longestStreak: number;
  xpAwarded: number;
  isSevenDayStreak: boolean;
  isReset: boolean;
  message: string;
}

/**
 * Evalúa y actualiza la racha de conexión diaria del usuario autenticado.
 * - Conexión en días consecutivos: +1 a la racha y +20 XP (bono especial de +50 XP al alcanzar el día 7).
 * - Conexión el mismo día: No suma racha repetida.
 * - Desconexión por más de 48h: Reinicia la racha a 1 día y otorga +20 XP.
 */
export async function updateStreakAction(): Promise<StreakUpdateResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        streakUpdated: false,
        currentStreak: 1,
        longestStreak: 1,
        xpAwarded: 0,
        isSevenDayStreak: false,
        isReset: false,
        message: 'Usuario no autenticado',
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, total_xp, current_streak, longest_streak, last_login_date')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return {
        streakUpdated: false,
        currentStreak: 1,
        longestStreak: 1,
        xpAwarded: 0,
        isSevenDayStreak: false,
        isReset: false,
        message: 'Perfil no encontrado',
      };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const lastLoginStr = profile.last_login_date;

    // Caso 1: Ya inició sesión y registró su racha hoy
    if (lastLoginStr === todayStr) {
      return {
        streakUpdated: false,
        currentStreak: profile.current_streak || 1,
        longestStreak: profile.longest_streak || 1,
        xpAwarded: 0,
        isSevenDayStreak: (profile.current_streak || 1) % 7 === 0,
        isReset: false,
        message: 'Racha de hoy ya registrada',
      };
    }

    // Calcular diferencia en días
    let daysDiff = 999;
    if (lastLoginStr) {
      const lastLoginDate = new Date(lastLoginStr);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastLoginDate.getTime());
      daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));
    }

    let newStreak = 1;
    let xpAward = 20;
    let isSevenDayStreak = false;
    let isReset = false;

    if (daysDiff === 1) {
      // Caso 2: Día consecutivo consecutivo (+1 a la racha)
      newStreak = (profile.current_streak || 0) + 1;
      isSevenDayStreak = newStreak % 7 === 0;
      xpAward = isSevenDayStreak ? 70 : 20; // 20 base + 50 bono semanal
    } else if (daysDiff > 1) {
      // Caso 3: Saltó más de 1 día (Racha reiniciada)
      newStreak = 1;
      xpAward = 20;
      isReset = true;
    }

    const currentLongest = profile.longest_streak || 1;
    const newLongest = Math.max(currentLongest, newStreak);
    const newTotalXp = (profile.total_xp || 0) + xpAward;
    const { level: newLevel } = getLevelProgress(newTotalXp);

    // 1. Actualizar perfil
    await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        total_xp: newTotalXp,
        current_level: newLevel,
        last_login_date: todayStr,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 2. Registrar en streak_logs
    await supabase
      .from('streak_logs')
      .upsert(
        {
          user_id: user.id,
          activity_date: todayStr,
          streak_count: newStreak,
          xp_awarded: xpAward,
        },
        { onConflict: 'user_id,activity_date' }
      );

    // 3. Revalidar vistas
    revalidatePath('/gamification');
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      streakUpdated: true,
      currentStreak: newStreak,
      longestStreak: newLongest,
      xpAwarded: xpAward,
      isSevenDayStreak,
      isReset,
      message: isSevenDayStreak
        ? `¡Felicitaciones! Has completado 7 días seguidos (+${xpAward} XP ganados).`
        : `¡Racha del día mantenida! (+${xpAward} XP ganados).`,
    };
  } catch (err: any) {
    console.error('Error in updateStreakAction:', err);
    return {
      streakUpdated: false,
      currentStreak: 1,
      longestStreak: 1,
      xpAwarded: 0,
      isSevenDayStreak: false,
      isReset: false,
      message: err.message || 'Error al actualizar racha diaria',
    };
  }
}
