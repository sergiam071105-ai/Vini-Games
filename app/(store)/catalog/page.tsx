import { Suspense } from 'react';
import { Metadata } from 'next';
import { Sparkles, Gamepad2 } from 'lucide-react';
import { getFilteredGames } from '@/lib/services/games.service';
import { PredictiveSearch } from '@/components/store/predictive-search';
import { CatalogGrid } from '@/components/store/catalog-grid';
import { SortOption } from '@/types/catalog';

export const metadata: Metadata = {
  title: 'Catálogo de Videojuegos | ViniGames',
  description: 'Explora nuestro catálogo completo de videojuegos para PC y consolas con los mejores precios en Bolivianos (Bs.) y ofertas exclusivas.',
};

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    categories?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;

  const query = resolvedParams.q || undefined;
  const categories = resolvedParams.categories
    ? resolvedParams.categories.split(',').filter(Boolean)
    : undefined;
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const sortBy = (resolvedParams.sort as SortOption) || 'featured';
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const catalogData = await getFilteredGames({
    query,
    categories,
    minPrice,
    maxPrice,
    sortBy,
    page,
    pageSize: 24,
  });

  return (
    <div className="min-h-screen bg-[#080A13] text-[#F5F7FF]">
      {/* Glow de fondo decorativo */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#783DF2]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-[#1FD1EB]/8 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabecera del Catálogo */}
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1FD1EB]">
            <Sparkles className="h-4 w-4" />
            <span>Tienda Oficial ViniGames</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Catálogo de Videojuegos
              </h1>
              <p className="mt-1.5 text-sm text-[#949CB2] max-w-2xl">
                Explora títulos legendarios, estrenos y joyas indie al mejor precio en Bolivianos (Bs.).
                Usa los filtros multicategoría y búsqueda en tiempo real.
              </p>
            </div>
          </div>

          {/* Barra de Búsqueda Predictiva con Debounce */}
          <div className="mt-2 max-w-2xl">
            <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-xl bg-[#1A1C2B]" />}>
              <PredictiveSearch placeholder="Buscar por título, desarrollador o categoría (ej. Neon, RPG)..." />
            </Suspense>
          </div>
        </header>

        {/* Grilla y Filtros Reactivos */}
        <main>
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-[#1A1C2B]/40" />}>
            <CatalogGrid
              games={catalogData.games}
              total={catalogData.total}
              allCategories={catalogData.allCategories}
              minCatalogPrice={catalogData.minCatalogPrice}
              maxCatalogPrice={catalogData.maxCatalogPrice}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
