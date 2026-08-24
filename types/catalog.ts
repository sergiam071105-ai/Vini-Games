export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon_name?: string | null;
  count?: number;
}

export interface GameItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string | null;
  cover_image_url: string;
  banner_image_url?: string | null;
  trailer_url?: string | null;
  developer: string;
  publisher?: string | null;
  release_date: string;
  base_price: number;
  discount_percent: number;
  final_price: number;
  rating_avg: number;
  rating_count: number;
  age_rating?: string | null;
  is_featured: boolean;
  is_active: boolean;
  categories: CategoryItem[];
}

export type SortOption = 'featured' | 'rating' | 'price_asc' | 'price_desc' | 'discount' | 'newest';

export interface CatalogFilters {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface CatalogResult {
  games: GameItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  allCategories: CategoryItem[];
  minCatalogPrice: number;
  maxCatalogPrice: number;
}
