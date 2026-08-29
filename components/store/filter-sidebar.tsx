'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, RotateCcw, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { CategoryItem, SortOption } from '@/types/catalog';

interface FilterSidebarProps {
  categories: CategoryItem[];
  minCatalogPrice: number;
  maxCatalogPrice: number;
  className?: string;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function FilterSidebar({
  categories,
  minCatalogPrice,
  maxCatalogPrice,
  className = '',
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estados locales para los filtros
  const currentCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const currentMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : minCatalogPrice;
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : maxCatalogPrice;
  const currentSort = (searchParams.get('sort') as SortOption) || 'featured';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories);
  const [priceRange, setPriceRange] = useState<[number, number]>([currentMinPrice, currentMaxPrice]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Sincronizar estado local cuando la URL cambia
  useEffect(() => {
    setSelectedCategories(currentCategories);
    setPriceRange([currentMinPrice, currentMaxPrice]);
  }, [searchParams]);

  // Actualizar parámetros de búsqueda en la URL
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Resetear a página 1 en cada filtro
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Toggle de selección de categoría
  const handleCategoryToggle = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];

    setSelectedCategories(newCategories);
    updateUrlParams({
      categories: newCategories.length > 0 ? newCategories.join(',') : null,
    });
  };

  // Cambio de rango de precio
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    updateUrlParams({
      minPrice: min > minCatalogPrice ? String(min) : null,
      maxPrice: max < maxCatalogPrice ? String(max) : null,
    });
  };

  // Filtro rápido de precio predefinido
  const handleQuickPrice = (min: number, max: number | null) => {
    const newMax = max ?? maxCatalogPrice;
    setPriceRange([min, newMax]);
    updateUrlParams({
      minPrice: min > minCatalogPrice ? String(min) : null,
      maxPrice: max !== null && max < maxCatalogPrice ? String(max) : null,
    });
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minCatalogPrice, maxCatalogPrice]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('sort');
    params.delete('q');
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > minCatalogPrice ||
    priceRange[1] < maxCatalogPrice ||
    Boolean(searchParams.get('q')) ||
    Boolean(searchParams.get('sort') && searchParams.get('sort') !== 'featured');

  const content = (
    <div className="flex flex-col gap-6">
      {/* Cabecera de Filtros */}
      <div className="flex items-center justify-between border-b border-[#2D3349] pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#1FD1EB]" />
          <h2 className="text-base font-bold text-[#F5F7FF] tracking-wide">Filtros</h2>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-[#949CB2] hover:text-[#1FD1EB] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* Sección 1: Categorías / Géneros */}
      <div className="border-b border-[#2D3349]/60 pb-5">
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex w-full items-center justify-between text-sm font-bold text-[#F5F7FF] hover:text-[#1FD1EB] transition-colors"
        >
          <span>Categorías ({selectedCategories.length})</span>
          {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isCategoryOpen && (
          <div className="mt-3.5 flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 transition-all text-xs font-medium ${
                    isChecked
                      ? 'bg-[#783DF2]/15 text-[#1FD1EB] border border-[#783DF2]/40'
                      : 'text-[#949CB2] hover:bg-[#1A1C2B] hover:text-[#F5F7FF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat.slug)}
                      className="h-4 w-4 rounded border-[#2D3349] bg-[#090B14] text-[#783DF2] focus:ring-[#783DF2] focus:ring-offset-0 accent-[#783DF2]"
                    />
                    <span>{cat.name}</span>
                  </div>
                  {typeof cat.count === 'number' && (
                    <span className="text-[11px] text-[#949CB2]/60 font-mono">
                      {cat.count}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Sección 2: Rango de Precios */}
      <div className="border-b border-[#2D3349]/60 pb-5">
        <button
          type="button"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="flex w-full items-center justify-between text-sm font-bold text-[#F5F7FF] hover:text-[#1FD1EB] transition-colors"
        >
          <span>Rango de Precio (Bs.)</span>
          {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isPriceOpen && (
          <div className="mt-4 flex flex-col gap-4">
            {/* Presets rápidos */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickPrice(0, null)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  priceRange[0] === minCatalogPrice && priceRange[1] === maxCatalogPrice
                    ? 'border-[#1FD1EB] bg-[#1FD1EB]/10 text-[#1FD1EB]'
                    : 'border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrice(0, 0)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  priceRange[1] === 0
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:text-white'
                }`}
              >
                Gratis
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrice(0, 50)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  priceRange[0] === 0 && priceRange[1] === 50
                    ? 'border-[#783DF2] bg-[#783DF2]/10 text-[#A879FF]'
                    : 'border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:text-white'
                }`}
              >
                &lt; Bs. 50
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrice(50, 100)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  priceRange[0] === 50 && priceRange[1] === 100
                    ? 'border-[#783DF2] bg-[#783DF2]/10 text-[#A879FF]'
                    : 'border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:text-white'
                }`}
              >
                Bs. 50 - 100
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrice(100, null)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  priceRange[0] === 100 && priceRange[1] === maxCatalogPrice
                    ? 'border-[#783DF2] bg-[#783DF2]/10 text-[#A879FF]'
                    : 'border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:text-white'
                }`}
              >
                &gt; Bs. 100
              </button>
            </div>

            {/* Slider de Precio */}
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min={minCatalogPrice}
                max={maxCatalogPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                className="w-full accent-[#1FD1EB] cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs font-mono text-[#949CB2]">
                <span>Bs. {priceRange[0]}</span>
                <span className="font-bold text-[#1FD1EB]">Hasta Bs. {priceRange[1]}</span>
              </div>
            </div>

            {/* Inputs Numéricos */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-[#949CB2] font-semibold">MÍN</label>
                <div className="relative mt-1">
                  <span className="absolute left-2 top-1.5 text-xs text-[#949CB2]">Bs.</span>
                  <input
                    type="number"
                    min={minCatalogPrice}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(Number(e.target.value) || 0, priceRange[1])}
                    className="w-full rounded-md border border-[#2D3349] bg-[#090B14] py-1.5 pl-8 pr-2 text-xs text-[#F5F7FF] focus:border-[#1FD1EB] focus:outline-none"
                  />
                </div>
              </div>
              <span className="text-[#949CB2] pt-4">-</span>
              <div className="flex-1">
                <label className="text-[10px] text-[#949CB2] font-semibold">MÁX</label>
                <div className="relative mt-1">
                  <span className="absolute left-2 top-1.5 text-xs text-[#949CB2]">Bs.</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={maxCatalogPrice}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value) || maxCatalogPrice)}
                    className="w-full rounded-md border border-[#2D3349] bg-[#090B14] py-1.5 pl-8 pr-2 text-xs text-[#F5F7FF] focus:border-[#1FD1EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de carga de transición */}
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-[#1FD1EB] animate-pulse">
          <div className="h-2 w-2 rounded-full bg-[#1FD1EB]" />
          <span>Filtrando catálogo...</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar en versión Desktop */}
      <aside className={`hidden lg:block w-72 shrink-0 rounded-2xl border border-[#2D3349] bg-[#1A1C2B]/80 p-5 backdrop-blur-md self-start sticky top-24 ${className}`}>
        {content}
      </aside>

      {/* Drawer desplegable en versión Mobile */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Fondo oscuro con backdrop blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileDrawer}
          />

          {/* Panel lateral deslizante */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-[#090B14] border-l border-[#2D3349] p-6 shadow-2xl overflow-y-auto">
            <div className="mb-4 flex items-center justify-between pb-2 border-b border-[#2D3349]">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#1FD1EB]" />
                <h3 className="font-bold text-[#F5F7FF]">Filtros del Catálogo</h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="rounded-lg p-1.5 text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {content}

            {/* Botón de Aplicar / Cerrar en móvil */}
            <div className="mt-8 pt-4 border-t border-[#2D3349]">
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="w-full rounded-xl bg-[#783DF2] py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(120,61,242,0.4)] hover:bg-[#6A32DB]"
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
