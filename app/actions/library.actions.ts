'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { MOCK_GAMES } from '@/lib/mock-data/games';

export interface LibraryGameItem {
  id: number;
  gameId: number;
  title: string;
  slug: string;
  coverUrl: string;
  developer: string;
  installStatus: 'NOT_INSTALLED' | 'INSTALLING' | 'INSTALLED' | 'READY_TO_PLAY';
  hoursPlayed: number;
  lastPlayedAt: string | null;
  acquiredAt: string;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
  ratingAvg: number;
}

/**
 * Obtiene la lista de videojuegos adquiridos por el usuario en su biblioteca personal.
 */
export async function getUserLibraryGamesAction(): Promise<LibraryGameItem[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: dbLibrary, error } = await supabase
      .from('user_library')
      .select(`
        id,
        game_id,
        install_status,
        hours_played,
        last_played_at,
        acquired_at,
        games (
          id,
          title,
          slug,
          cover_image_url,
          developer,
          rating_avg
        )
      `)
      .eq('user_id', user.id)
      .order('acquired_at', { ascending: false });

    if (!error && dbLibrary && dbLibrary.length > 0) {
      return dbLibrary
        .map((item: any) => {
          const g = item.games || MOCK_GAMES.find((mg) => mg.id === item.game_id);
          if (!g) return null;

          return {
            id: item.id,
            gameId: g.id,
            title: g.title,
            slug: g.slug,
            coverUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
            developer: g.developer || 'Estudio Gamer',
            installStatus: item.install_status || 'NOT_INSTALLED',
            hoursPlayed: Number(item.hours_played) || 0.0,
            lastPlayedAt: item.last_played_at,
            acquiredAt: item.acquired_at,
            unlockedAchievementsCount: 3,
            totalAchievementsCount: 8,
            ratingAvg: Number(g.rating_avg) || 4.8,
          };
        })
        .filter(Boolean) as LibraryGameItem[];
    }
  } catch (err) {
    console.warn('Error fetching user library from Supabase:', err);
  }

  return [];
}

/**
 * Alterna el estado de instalación de un juego en la biblioteca.
 */
export async function installGameAction(gameId: number): Promise<{ success: boolean; newStatus: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('user_library')
        .update({
          install_status: 'INSTALLED',
        })
        .eq('user_id', user.id)
        .eq('game_id', gameId);
    }

    revalidatePath('/library');
    return { success: true, newStatus: 'INSTALLED' };
  } catch {
    return { success: true, newStatus: 'INSTALLED' };
  }
}

/**
 * Simula una sesión de juego interactiva, acumulando horas y actualizando last_played_at.
 */
export async function playGameAction(gameId: number): Promise<{
  success: boolean;
  hoursAdded: number;
  totalHours: number;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const hoursAdded = 1.5;
    let totalHours = 1.5;

    if (user) {
      const { data: current } = await supabase
        .from('user_library')
        .select('hours_played')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .maybeSingle();

      totalHours = (Number(current?.hours_played) || 0) + hoursAdded;

      await supabase
        .from('user_library')
        .update({
          hours_played: totalHours,
          last_played_at: new Date().toISOString(),
          install_status: 'READY_TO_PLAY',
        })
        .eq('user_id', user.id)
        .eq('game_id', gameId);
    }

    revalidatePath('/library');
    return { success: true, hoursAdded, totalHours };
  } catch {
    return { success: true, hoursAdded: 1.5, totalHours: 1.5 };
  }
}

/**
 * Registra los juegos comprados en la biblioteca del usuario en Supabase
 * y procesa el débito de GameCoins si se seleccionó ese método de pago.
 */
export async function purchaseGamesAction(
  gameIds: number[],
  paymentMethod: 'qr' | 'card' | 'gamecoins' | 'tigo' = 'qr',
  totalCostBs: number = 0
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debes iniciar sesión para completar la compra.' };
    }

    // 1. Si el método de pago es GameCoins, validar saldo y debitar
    let updatedBalance: number | undefined = undefined;
    if (paymentMethod === 'gamecoins') {
      const requiredCoins = Math.ceil(totalCostBs * 10);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('gamecoins_balance, total_xp')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'No se pudo verificar el saldo de tu cuenta.' };
      }

      const currentBalance = Number(profile.gamecoins_balance || 0);

      if (currentBalance < requiredCoins) {
        return {
          success: false,
          error: `Saldo insuficiente de GameCoins. Necesitas ${requiredCoins} GC y cuentas con ${currentBalance} GC.`,
        };
      }

      updatedBalance = currentBalance - requiredCoins;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          gamecoins_balance: updatedBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        return { success: false, error: 'Error al procesar el pago con GameCoins.' };
      }
    }

    // 2. Insertar cada juego en user_library si aún no lo posee
    for (const gameId of gameIds) {
      const { data: existing } = await supabase
        .from('user_library')
        .select('id')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .maybeSingle();

      if (!existing) {
        await supabase.from('user_library').insert({
          user_id: user.id,
          game_id: gameId,
          install_status: 'NOT_INSTALLED',
          hours_played: 0,
          acquired_at: new Date().toISOString(),
        });
      }
    }

    revalidatePath('/library');
    revalidatePath('/checkout');
    revalidatePath('/profile');
    revalidatePath('/');
    return { success: true, newBalance: updatedBalance };
  } catch (err: any) {
    console.error('Error al registrar compra en biblioteca:', err);
    return { success: false, error: err.message || 'Error al procesar la compra.' };
  }
}
