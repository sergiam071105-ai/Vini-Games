'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getUserLibraryGamesAction, LibraryGameItem } from '@/app/actions/library.actions';
import { mockAchievements } from '@/lib/mock-data/achievements';
import { MOCK_GAMES } from '@/lib/mock-data/games';

export interface UserProfileData {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  gamecoinsBalance: number;
  dnaExploration: number;
  dnaCompetitive: number;
  dnaNarrative: number;
  dnaCollection: number;
  gamesCount: number;
  achievementsCount: number;
  reviewsCount: number;
}

export interface ProfileAchievementItem {
  id: number;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  gamecoinsReward: number;
  badgeIcon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ProfileReviewItem {
  id: number;
  gameTitle: string;
  gameSlug: string;
  gameCoverUrl: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  likesCount: number;
}

export interface FullProfilePayload {
  profile: UserProfileData;
  libraryGames: LibraryGameItem[];
  achievements: ProfileAchievementItem[];
  reviews: ProfileReviewItem[];
}

/**
 * Obtiene toda la información dinámica consolidada del perfil del usuario autenticado.
 */
export async function getFullUserProfileDataAction(): Promise<FullProfilePayload | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // 1. Obtener perfil
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const username = profileRow?.username || user.email?.split('@')[0] || 'Gamer';
    const avatarUrl = profileRow?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
    const bio = profileRow?.bio || 'Explorando universos digitales y sumando victorias en ViniGames.';

    // 2. Obtener biblioteca de juegos
    const libraryGames = await getUserLibraryGamesAction();

    // 3. Obtener logros
    const { data: dbAchievements } = await supabase
      .from('achievements')
      .select('*');

    const { data: dbUserAchievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id);

    const userAchMap = new Map<number, string>();
    (dbUserAchievements || []).forEach((ua: any) => {
      userAchMap.set(ua.achievement_id, ua.unlocked_at || new Date().toISOString());
    });

    const allAchievements = (dbAchievements && dbAchievements.length > 0) ? dbAchievements : mockAchievements.map((m) => ({
      id: m.id,
      title: m.name,
      description: m.description,
      category: m.category.toUpperCase(),
      xp_reward: 150,
      gamecoins_reward: 50,
      badge_icon: '🏆',
    }));

    const achievements: ProfileAchievementItem[] = allAchievements.map((ach: any) => {
      const isUnlocked = userAchMap.has(ach.id) || ach.id === 1;
      return {
        id: ach.id,
        title: ach.title || ach.name,
        description: ach.description,
        category: ach.category,
        xpReward: ach.xp_reward || 100,
        gamecoinsReward: ach.gamecoins_reward || 25,
        badgeIcon: ach.badge_icon || '🏆',
        unlocked: isUnlocked,
        unlockedAt: userAchMap.get(ach.id) || (isUnlocked ? new Date().toISOString() : null),
      };
    });

    // 4. Obtener reseñas del usuario
    const { data: dbReviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        status,
        created_at,
        game_id,
        games (
          title,
          slug,
          cover_image_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    let reviews: ProfileReviewItem[] = [];
    if (dbReviews && dbReviews.length > 0) {
      reviews = dbReviews.map((r: any) => {
        const game = r.games || MOCK_GAMES.find((mg) => mg.id === r.game_id);
        return {
          id: r.id,
          gameTitle: game?.title || 'Videojuego',
          gameSlug: game?.slug || 'neon-odyssey',
          gameCoverUrl: game?.cover_image_url || '/games/neon-odyssey.jpg',
          rating: r.rating || 5,
          comment: r.comment || '',
          status: r.status || 'APPROVED',
          createdAt: r.created_at || new Date().toISOString(),
          likesCount: 3,
        };
      });
    }

    const profile: UserProfileData = {
      id: user.id,
      email: user.email || '',
      username,
      fullName: profileRow?.full_name || username,
      avatarUrl,
      bio,
      role: (profileRow?.role as any) || 'USER',
      totalXp: profileRow?.total_xp ?? 450,
      currentLevel: profileRow?.current_level ?? 3,
      currentStreak: profileRow?.current_streak ?? 5,
      longestStreak: profileRow?.longest_streak ?? 7,
      gamecoinsBalance: profileRow?.gamecoins_balance ?? 350,
      dnaExploration: profileRow?.dna_exploration ?? 60,
      dnaCompetitive: profileRow?.dna_competitive ?? 25,
      dnaNarrative: profileRow?.dna_narrative ?? 10,
      dnaCollection: profileRow?.dna_collection ?? 5,
      gamesCount: libraryGames.length,
      achievementsCount: achievements.filter((a) => a.unlocked).length,
      reviewsCount: reviews.length,
    };

    return {
      profile,
      libraryGames,
      achievements,
      reviews,
    };
  } catch (error) {
    console.error('Error fetching full user profile data:', error);
    return null;
  }
}

/**
 * Actualiza la información básica del perfil del usuario (username, avatar, bio, full_name).
 */
export async function updateProfileAction(payload: {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'No autenticado. Por favor inicia sesión.' };
    }

    const updateFields: {
      username?: string;
      full_name?: string;
      bio?: string;
      avatar_url?: string;
    } = {};
    if (payload.username !== undefined) updateFields.username = payload.username.trim();
    if (payload.fullName !== undefined) updateFields.full_name = payload.fullName.trim();
    if (payload.bio !== undefined) updateFields.bio = payload.bio.trim();
    if (payload.avatarUrl !== undefined) updateFields.avatar_url = payload.avatarUrl.trim();

    const { error } = await supabase
      .from('profiles')
      .update(updateFields)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile in Supabase:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/profile');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error inesperado al guardar el perfil.' };
  }
}
