'use server';

import { getFilteredGames, getPredictiveSuggestions } from '@/lib/services/games.service';
import { CatalogFilters, CatalogResult, GameItem } from '@/types/catalog';

/**
 * Server Action para obtener videojuegos filtrados desde Client Components.
 */
export async function getFilteredGamesAction(filters: CatalogFilters): Promise<CatalogResult> {
  return getFilteredGames(filters);
}

/**
 * Server Action para la búsqueda predictiva instantánea.
 */
export async function getPredictiveSuggestionsAction(query: string): Promise<GameItem[]> {
  return getPredictiveSuggestions(query);
}
