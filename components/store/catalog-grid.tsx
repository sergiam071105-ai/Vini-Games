'use client';

import { useTransition, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, ArrowUpDown, X, Gamepad2, Sparkles } from 'lucide-react';
import { GameCard } from '@/components/store/game-card';
import { FilterSidebar } from '@/components/store/filter-sidebar';
import { GameItem, CategoryItem, SortOption } from '@/types/catalog';

interface CatalogGridProps {
  games: GameItem[];
  total: number;
  allCategories: CategoryItem[];
  minCatalogPrice: number;
  maxCatalogPrice: number;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Destacados', value: 'featured' },
  { label: 'Mejor valorados', value: 'rating' },
  { label: 'Precio: menor a mayor', value: 'price_asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc' },
  { label: 'Mayor descuento', value: 'discount' },
  { label: 'Novedades', value: 'newest' },
];

export function CatalogGrid({
  games,
  total,
  allCategories,
  minCatalogPrice,
  maxCatalogPrice,
}: CatalogGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const currentSort = (searchParams.get('sort') as SortOption) || 'featured';
  const query = searchParams.get('q') || '';
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const activeFiltersCount =
    (query ? 1 : 0) +
    selectedCategories.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const removeCategoryFilter = (slug: string) => {
    const newCategories = selectedCategories.filter((c) => c !== slug);
    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const removeSearchFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const removePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleResetAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Barra Lateral de Filtros (Desktop y Drawer Móvil) */}
      <FilterSidebar
        categories={allCategories}
        minCatalogPrice={minCatalogPrice}
        maxCatalogPrice={maxCatalogPrice}
        isMobileDrawerOpen={isMobileFilterOpen}
        onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
      />

      {/* Área Principal de Contenido del Catálogo */}
      <div className="flex-1 w-full flex flex-col gap-6">
        {/* Barra Superior: Contador, Botón Filtros Móvil y Selector de Ordenamiento */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#2D3349] bg-[#1A1C2B]/60 px-4 py-3 backdrop-blur-md">
          {/* Contador y Botón Móvil */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex lg:hidden items-center gap-2 rounded-lg bg-[#783DF2] px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_12px_rgba(120,61,242,0.4)]"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1FD1EB] text-[10px] font-black text-[#090B14]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs font-semibold text-[#949CB2]">
              Mostrando <strong className="text-[#F5F7FF] font-bold">{games.length}</strong> de{' '}
              <strong className="text-[#F5F7FF] font-bold">{total}</strong> títulos
            </span>
          </div>

          {/* Selector de Ordenamiento */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#1FD1EB]" />
            <span className="text-xs font-semibold text-[#949CB2] hidden sm:inline">
              Ordenar por:
            </span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-[#2D3349] bg-[#090B14] px-3 py-1.5 text-xs font-medium text-[#F5F7FF] focus:border-[#783DF2] focus:outline-none focus:ring-1 focus:ring-[#783DF2] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#090B14] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#949CB2] font-semibold">Filtros activos:</span>

            {query && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#783DF2]/20 border border-[#783DF2]/50 px-3 py-1 text-xs font-medium text-[#A879FF]">
                <span>Búsqueda: &ldquo;{query}&rdquo;</span>
                <button
                  type="button"
                  onClick={removeSearchFilter}
                  className="rounded-full hover:bg-white/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedCategories.map((slug) => {
              const catObj = allCategories.find((c) => c.slug === slug);
              return (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1FD1EB]/15 border border-[#1FD1EB]/40 px-3 py-1 text-xs font-medium text-[#1FD1EB]"
                >
                  <span>{catObj ? catObj.name : slug}</span>
                  <button
                    type="button"
                    onClick={() => removeCategoryFilter(slug)}
                    className="rounded-full hover:bg-white/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2D3349] border border-white/10 px-3 py-1 text-xs font-medium text-[#F5F7FF]">
                <span>
                  Precio: Bs. {minPrice || minCatalogPrice} - Bs. {maxPrice || maxCatalogPrice}
                </span>
                <button
                  type="button"
                  onClick={removePriceFilter}
                  className="rounded-full hover:bg-white/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetAll}
              className="text-xs font-bold text-[#1FD1EB] underline underline-offset-4 hover:text-white transition-colors ml-2"
            >
              Borrar todos
            </button>
          </div>
        )}

        {/* Grilla de Videojuegos */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {games.map((game, idx) => (
              <GameCard key={game.id} game={game} priority={idx < 6} />
            ))}
          </div>
        ) : (
          /* Estado Vacío / Sin Resultados */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2D3349] bg-[#1A1C2B]/40 p-12 text-center backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#783DF2]/20 border border-[#783DF2]/40 text-[#783DF2] shadow-[0_0_20px_rgba(120,61,242,0.3)] mb-4">
              <Gamepad2 className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-bold text-[#F5F7FF]">
              No se encontraron videojuegos
            </h3>
            <p className="mt-1.5 max-w-md text-xs text-[#949CB2]">
              No hay coincidencias con los criterios de búsqueda o filtros seleccionados. Intenta
              ampliar el rango de precio o eliminar algunos filtros.
            </p>

            <button
              type="button"
              onClick={handleResetAll}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#783DF2] px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(120,61,242,0.4)] hover:bg-[#6A32DB] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Restablecer Filtros</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
