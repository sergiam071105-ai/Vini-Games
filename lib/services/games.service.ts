import { createClient } from '@/lib/supabase/server';
import { MOCK_CATEGORIES, MOCK_GAMES } from '@/lib/mock-data/games';
import { CatalogFilters, CatalogResult, CategoryItem, GameItem } from '@/types/catalog';

/**
 * Obtiene las categorías disponibles en la plataforma con el conteo de videojuegos.
 */
export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const supabase = await createClient();
    const { data: dbCategories, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, icon_name');

    if (!error && dbCategories && dbCategories.length > 0) {
      const { data: gameCategories } = await supabase
        .from('game_categories')
        .select('category_id');

      const countMap = new Map<number, number>();
      gameCategories?.forEach((gc) => {
        countMap.set(gc.category_id, (countMap.get(gc.category_id) || 0) + 1);
      });

      return dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon_name: c.icon_name,
        count: countMap.get(c.id) || 0,
      }));
    }
  } catch {
    // Fail silently in development
  }

  // Fallback con conteo dinámico desde MOCK_GAMES
  return MOCK_CATEGORIES.map((cat) => {
    const count = MOCK_GAMES.filter((g) =>
      g.categories.some((c) => c.slug === cat.slug || c.id === cat.id)
    ).length;
    return { ...cat, count };
  });
}

/**
 * Obtiene la lista de videojuegos aplicando filtros multicategoría, rango de precios,
 * búsqueda predictiva y ordenamiento.
 */
export async function getFilteredGames(filters: CatalogFilters = {}): Promise<CatalogResult> {
  let allGames: GameItem[] = [];

  try {
    const supabase = await createClient();
    const { data: dbGames, error } = await supabase
      .from('games')
      .select(`
        id,
        title,
        slug,
        description,
        short_description,
        cover_image_url,
        banner_image_url,
        trailer_url,
        developer,
        publisher,
        release_date,
        base_price,
        discount_percent,
        final_price,
        rating_avg,
        rating_count,
        age_rating,
        is_featured,
        is_active,
        game_categories (
          categories (
            id,
            name,
            slug,
            description,
            icon_name
          )
        )
      `)
      .eq('is_active', true);

    if (!error && dbGames && dbGames.length > 0) {
      allGames = dbGames.map((g: any) => {
        const categories: CategoryItem[] = (g.game_categories || [])
          .map((gc: any) => gc.categories)
          .filter(Boolean);

        const discount = g.discount_percent || 0;
        const basePrice = Number(g.base_price);
        const finalPrice = g.final_price
          ? Number(g.final_price)
          : discount > 0
          ? basePrice * (1 - discount / 100)
          : basePrice;

        return {
          id: g.id,
          title: g.title,
          slug: g.slug,
          description: g.description || '',
          short_description: g.short_description,
          cover_image_url: g.cover_image_url,
          banner_image_url: g.banner_image_url,
          trailer_url: g.trailer_url,
          developer: g.developer,
          publisher: g.publisher,
          release_date: g.release_date,
          base_price: basePrice,
          discount_percent: discount,
          final_price: finalPrice,
          rating_avg: Number(g.rating_avg || 0),
          rating_count: Number(g.rating_count || 0),
          age_rating: g.age_rating,
          is_featured: Boolean(g.is_featured),
          is_active: Boolean(g.is_active),
          categories,
        };
      });
    }
  } catch {
    // Fail silently in development
  }

  const overrides = (globalThis as any).GAME_ACTIVE_OVERRIDES as Map<number, boolean> | undefined;

  // Fusión con MOCK_GAMES activos para que los juegos nuevos o editados en admin aparezcan siempre en la tienda
  const existingDbIds = new Set(allGames.map((g) => g.id));
  const existingDbSlugs = new Set(allGames.map((g) => g.slug));
  const activeMockGames = MOCK_GAMES.filter(
    (g) => !existingDbIds.has(g.id) && !existingDbSlugs.has(g.slug)
  );

  allGames = [...allGames, ...activeMockGames].filter((g) => {
    const isAct = overrides?.has(g.id) ? overrides.get(g.id)! : g.is_active;
    return isAct !== false;
  });

  // Precios mínimos y máximos globales del catálogo para los límites de los sliders
  const allPrices = allGames.map((g) => g.final_price);
  const minCatalogPrice = allPrices.length > 0 ? Math.floor(Math.min(...allPrices)) : 0;
  const maxCatalogPrice = allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 250;

  // 1. Filtrado por Búsqueda de Texto
  let filtered = [...allGames];
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.trim().toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        (g.short_description && g.short_description.toLowerCase().includes(q)) ||
        g.developer.toLowerCase().includes(q) ||
        g.categories.some((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
    );
  }

  // 2. Filtrado Multicategoría
  if (filters.categories && filters.categories.length > 0) {
    const selectedSlugs = new Set(filters.categories.map((c) => c.toLowerCase()));
    filtered = filtered.filter((g) =>
      g.categories.some((c) => selectedSlugs.has(c.slug.toLowerCase()))
    );
  }

  // 3. Filtrado por Rango de Precios
  if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
    filtered = filtered.filter((g) => g.final_price >= (filters.minPrice as number));
  }
  if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
    filtered = filtered.filter((g) => g.final_price <= (filters.maxPrice as number));
  }

  // 4. Ordenamiento
  const sortBy = filters.sortBy || 'featured';
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating_avg - a.rating_avg;
      case 'price_asc':
        return a.final_price - b.final_price;
      case 'price_desc':
        return b.final_price - a.final_price;
      case 'discount':
        return b.discount_percent - a.discount_percent;
      case 'newest':
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      case 'featured':
      default:
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.rating_avg - a.rating_avg;
    }
  });

  const total = filtered.length;
  const page = Math.max(1, filters.page || 1);
  const pageSize = filters.pageSize || 24;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const paginatedGames = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allCategories = await getCategories();

  return {
    games: paginatedGames,
    total,
    page,
    pageSize,
    totalPages,
    allCategories,
    minCatalogPrice,
    maxCatalogPrice,
  };
}

/**
 * Búsqueda predictiva rápida para autocompletado y dropdown de sugerencias (máximo 6 elementos).
 */
export async function getPredictiveSuggestions(query: string): Promise<GameItem[]> {
  if (!query || query.trim().length < 2) return [];

  const { games } = await getFilteredGames({
    query,
    pageSize: 6,
    sortBy: 'featured',
  });

  return games.slice(0, 6);
}
