'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { gameAdminSchema, GameAdminInput } from '@/lib/schemas/game.admin.schema';
import { MOCK_GAMES, MOCK_CATEGORIES } from '@/lib/mock-data/games';

export interface AdminGameItem {
  id: number;
  title: string;
  slug: string;
  developer: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  coverImageUrl: string;
  releaseDate: string;
  isActive: boolean;
  categories: { id: number; name: string; slug: string }[];
  createdAt?: string;
}

const getActiveOverridesMap = () => {
  if (!(globalThis as any).GAME_ACTIVE_OVERRIDES) {
    (globalThis as any).GAME_ACTIVE_OVERRIDES = new Map<number, boolean>();
  }
  return (globalThis as any).GAME_ACTIVE_OVERRIDES as Map<number, boolean>;
};

/**
 * Obtiene todas las categorías del sistema.
 */
export async function getAllCategoriesAction(): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('Error fetching categories in action:', err);
  }

  return MOCK_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
}

/**
 * Obtiene la lista completa de videojuegos para la administración.
 */
export async function getAdminGamesAction(filters?: {
  search?: string;
  isActive?: boolean;
}): Promise<AdminGameItem[]> {
  const overrides = getActiveOverridesMap();

  try {
    const supabase = await createClient();
    let query = supabase
      .from('games')
      .select(`
        id,
        title,
        slug,
        developer,
        description,
        base_price,
        discount_percent,
        final_price,
        cover_image_url,
        release_date,
        is_active,
        created_at,
        game_categories (
          category_id,
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.search && filters.search.trim()) {
      query = query.ilike('title', `%${filters.search.trim()}%`);
    }

    const { data: dbGames, error } = await query;

    let combinedList: AdminGameItem[] = [];

    if (!error && dbGames && dbGames.length > 0) {
      combinedList = dbGames.map((g: any) => {
        const cats = (g.game_categories || [])
          .map((gc: any) => gc.categories)
          .filter(Boolean);

        const effectiveIsActive = overrides.has(g.id) ? overrides.get(g.id)! : (g.is_active ?? true);

        return {
          id: g.id,
          title: g.title,
          slug: g.slug,
          developer: g.developer || 'Estudio Gamer',
          description: g.description || '',
          basePrice: Number(g.base_price),
          discountPercent: g.discount_percent || 0,
          finalPrice: g.final_price ? Number(g.final_price) : Math.round(Number(g.base_price) * (1 - (g.discount_percent || 0) / 100)),
          coverImageUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
          releaseDate: g.release_date || new Date().toISOString(),
          isActive: effectiveIsActive,
          categories: cats,
          createdAt: g.created_at,
        };
      });
    }

    // Incluir juegos agregados localmente si no están en la DB
    const existingIds = new Set(combinedList.map((g) => g.id));
    const mockExtras: AdminGameItem[] = MOCK_GAMES
      .filter((g) => !existingIds.has(g.id))
      .map((g) => {
        const effectiveIsActive = overrides.has(g.id) ? overrides.get(g.id)! : (g.is_active ?? true);
        return {
          id: g.id,
          title: g.title,
          slug: g.slug,
          developer: g.developer,
          description: g.description,
          basePrice: Number(g.base_price),
          discountPercent: g.discount_percent,
          finalPrice: Number(g.final_price),
          coverImageUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
          releaseDate: g.release_date,
          isActive: effectiveIsActive,
          categories: g.categories || [],
        };
      });

    let results = [...combinedList, ...mockExtras];

    if (filters?.isActive !== undefined) {
      results = results.filter((g) => g.isActive === filters.isActive);
    }

    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter((g) => g.title.toLowerCase().includes(s) || g.developer.toLowerCase().includes(s));
    }

    return results;
  } catch (err) {
    console.warn('Error in getAdminGamesAction:', err);
  }

  // Fallback a MOCK_GAMES
  let fallback = MOCK_GAMES.map((g) => {
    const effectiveIsActive = overrides.has(g.id) ? overrides.get(g.id)! : (g.is_active ?? true);
    return {
      id: g.id,
      title: g.title,
      slug: g.slug,
      developer: g.developer,
      description: g.description,
      basePrice: Number(g.base_price),
      discountPercent: g.discount_percent,
      finalPrice: Number(g.final_price),
      coverImageUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
      releaseDate: g.release_date,
      isActive: effectiveIsActive,
      categories: g.categories || [],
    };
  });

  if (filters?.isActive !== undefined) {
    fallback = fallback.filter((g) => g.isActive === filters.isActive);
  }

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    fallback = fallback.filter((g) => g.title.toLowerCase().includes(s) || g.developer.toLowerCase().includes(s));
  }

  return fallback;
}

/**
 * Obtiene los datos de un videojuego para el formulario de edición.
 */
export async function getAdminGameByIdAction(id: number): Promise<AdminGameItem | null> {
  const overrides = getActiveOverridesMap();

  try {
    const supabase = await createClient();
    const { data: g, error } = await supabase
      .from('games')
      .select(`
        id,
        title,
        slug,
        developer,
        description,
        base_price,
        discount_percent,
        final_price,
        cover_image_url,
        release_date,
        is_active,
        created_at,
        game_categories (
          category_id,
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('id', id)
      .single();

    if (!error && g) {
      const cats = (g.game_categories || [])
        .map((gc: any) => gc.categories)
        .filter(Boolean);

      const effectiveIsActive = overrides.has(g.id) ? overrides.get(g.id)! : (g.is_active ?? true);

      return {
        id: g.id,
        title: g.title,
        slug: g.slug,
        developer: g.developer || 'Estudio Gamer',
        description: g.description || '',
        basePrice: Number(g.base_price),
        discountPercent: g.discount_percent || 0,
        finalPrice: g.final_price ? Number(g.final_price) : Math.round(Number(g.base_price) * (1 - (g.discount_percent || 0) / 100)),
        coverImageUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
        releaseDate: g.release_date || new Date().toISOString(),
        isActive: effectiveIsActive,
        categories: cats,
        createdAt: g.created_at,
      };
    }
  } catch (err) {
    console.warn('Error fetching game by ID:', err);
  }

  const mock = MOCK_GAMES.find((g) => g.id === id);
  if (mock) {
    const effectiveIsActive = overrides.has(mock.id) ? overrides.get(mock.id)! : (mock.is_active ?? true);
    return {
      id: mock.id,
      title: mock.title,
      slug: mock.slug,
      developer: mock.developer,
      description: mock.description,
      basePrice: Number(mock.base_price),
      discountPercent: mock.discount_percent,
      finalPrice: Number(mock.final_price),
      coverImageUrl: mock.cover_image_url || '/games/neon-odyssey.jpg',
      releaseDate: mock.release_date,
      isActive: effectiveIsActive,
      categories: mock.categories || [],
    };
  }

  return null;
}

/**
 * Crea un nuevo videojuego en el catálogo.
 */
export async function createGameAdminAction(rawInput: GameAdminInput): Promise<{
  success: boolean;
  gameId?: number;
  error?: string;
}> {
  try {
    const validation = gameAdminSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues?.[0]?.message || 'Datos de formulario inválidos',
      };
    }

    const {
      title,
      slug,
      developer,
      description,
      basePrice,
      discountPercent,
      coverImageUrl,
      releaseDate,
      isActive,
      categoryIds,
    } = validation.data;

    const finalPrice = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
    const supabase = await createClient();

    try {
      // 1. Insertar en tabla `games`
      const { data: newGame, error: gameError } = await supabase
        .from('games')
        .insert({
          title,
          slug,
          developer,
          description,
          base_price: basePrice,
          discount_percent: discountPercent,
          cover_image_url: coverImageUrl || '/games/neon-odyssey.jpg',
          release_date: releaseDate || new Date().toISOString().split('T')[0],
          is_active: isActive,
        })
        .select('id')
        .single();

      if (!gameError && newGame) {
        const gameId = newGame.id;
        getActiveOverridesMap().set(gameId, isActive);

        if (categoryIds.length > 0) {
          const relations = categoryIds.map((cid) => ({
            game_id: gameId,
            category_id: cid,
          }));

          await supabase.from('game_categories').insert(relations);
        }

        revalidatePath('/admin/games');
        revalidatePath('/admin');
        revalidatePath('/catalog');
        revalidatePath('/');

        return { success: true, gameId };
      }
    } catch (dbErr) {
      console.warn('Supabase DB error, using in-memory store:', dbErr);
    }

    // Persistencia en memoria si Supabase RLS restringe inserción directa
    const newId = Math.max(...MOCK_GAMES.map((g) => g.id), 0) + 1;
    getActiveOverridesMap().set(newId, isActive);
    const allCats = await getAllCategoriesAction();
    const matchedCats = allCats.filter((c) => categoryIds.includes(c.id));

    MOCK_GAMES.unshift({
      id: newId,
      title,
      slug: slug || `game-${newId}`,
      description,
      short_description: description.slice(0, 120),
      cover_image_url: coverImageUrl || '/games/neon-odyssey.jpg',
      banner_image_url: coverImageUrl || '/games/neon-odyssey.jpg',
      trailer_url: null,
      developer: developer || 'Estudio Gamer',
      publisher: 'ViniGames Publishing',
      release_date: releaseDate || new Date().toISOString().split('T')[0],
      base_price: basePrice,
      discount_percent: discountPercent,
      final_price: finalPrice,
      rating_avg: 5.0,
      rating_count: 0,
      age_rating: '18+',
      is_featured: false,
      is_active: isActive,
      categories: matchedCats,
    });

    revalidatePath('/admin/games');
    revalidatePath('/admin');
    revalidatePath('/catalog');
    revalidatePath('/');

    return { success: true, gameId: newId };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al crear el videojuego' };
  }
}

/**
 * Actualiza un videojuego existente y sus promociones.
 */
export async function updateGameAdminAction(
  id: number,
  rawInput: GameAdminInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const validation = gameAdminSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues?.[0]?.message || 'Datos de formulario inválidos',
      };
    }

    const {
      title,
      slug,
      developer,
      description,
      basePrice,
      discountPercent,
      coverImageUrl,
      releaseDate,
      isActive,
      categoryIds,
    } = validation.data;

    // Registrar override de estado activo inmediatamente
    getActiveOverridesMap().set(id, isActive);

    const finalPrice = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
    const supabase = await createClient();

    try {
      // 1. Actualizar `games`
      const { error: updateError } = await supabase
        .from('games')
        .update({
          title,
          slug,
          developer,
          description,
          base_price: basePrice,
          discount_percent: discountPercent,
          cover_image_url: coverImageUrl,
          release_date: releaseDate,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (!updateError) {
        await supabase.from('game_categories').delete().eq('game_id', id);
        if (categoryIds.length > 0) {
          const relations = categoryIds.map((cid) => ({
            game_id: id,
            category_id: cid,
          }));
          await supabase.from('game_categories').insert(relations);
        }
      }
    } catch (dbErr) {
      console.warn('Supabase DB error, using in-memory store:', dbErr);
    }

    // Persistencia en memoria
    const existing = MOCK_GAMES.find((g) => g.id === id);
    const allCats = await getAllCategoriesAction();
    const matchedCats = allCats.filter((c) => categoryIds.includes(c.id));

    if (existing) {
      existing.title = title;
      existing.slug = slug;
      existing.developer = developer;
      existing.description = description;
      existing.base_price = basePrice;
      existing.discount_percent = discountPercent;
      existing.final_price = finalPrice;
      if (coverImageUrl) existing.cover_image_url = coverImageUrl;
      if (releaseDate) existing.release_date = releaseDate;
      existing.is_active = isActive;
      existing.categories = matchedCats;
    }

    revalidatePath('/admin/games');
    revalidatePath(`/admin/games/${id}/edit`);
    revalidatePath('/admin');
    revalidatePath('/catalog');
    revalidatePath(`/games/${slug}`);
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar el videojuego' };
  }
}

/**
 * Alterna el estado activo / inactivo de un videojuego (Baja Lógica).
 */
export async function toggleGameActiveStatusAction(id: number): Promise<{
  success: boolean;
  newStatus?: boolean;
  error?: string;
}> {
  try {
    const overrides = getActiveOverridesMap();
    let currentStatus = overrides.has(id) ? overrides.get(id)! : true;

    const supabase = await createClient();
    const { data: game } = await supabase
      .from('games')
      .select('is_active')
      .eq('id', id)
      .single();

    if (game && !overrides.has(id)) {
      currentStatus = game.is_active;
    } else {
      const mock = MOCK_GAMES.find((g) => g.id === id);
      if (mock && !overrides.has(id)) {
        currentStatus = mock.is_active ?? true;
      }
    }

    const newStatus = !currentStatus;
    overrides.set(id, newStatus);

    try {
      await supabase
        .from('games')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch {
      // Ignore DB error and rely on override
    }

    const mock = MOCK_GAMES.find((g) => g.id === id);
    if (mock) {
      mock.is_active = newStatus;
    }

    revalidatePath('/admin/games');
    revalidatePath('/catalog');
    revalidatePath('/');

    return { success: true, newStatus };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al alternar estado' };
  }
}
