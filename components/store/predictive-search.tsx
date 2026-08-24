'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Star, ArrowRight, Loader2 } from 'lucide-react';
import { GameItem } from '@/types/catalog';
import { getPredictiveSuggestionsAction } from '@/app/actions/games.actions';

interface PredictiveSearchProps {
  placeholder?: string;
  className?: string;
}

export function PredictiveSearch({
  placeholder = 'Buscar por título, desarrollador o categoría...',
  className = '',
}: PredictiveSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<GameItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar estado si la URL cambia externamente
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Manejar el debounce de 300ms para URL y sugerencias
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);

      // Si se borra la búsqueda, actualizar la URL
      if (searchParams.get('q')) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        params.delete('page');
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }
      return;
    }

    setIsLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      // 1. Actualizar URL SearchParams con debounce
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', query.trim());
      params.delete('page');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });

      // 2. Obtener sugerencias predictivas
      try {
        const results = await getPredictiveSuggestionsAction(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegación por teclado (Flechas, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selectedGame = suggestions[selectedIndex];
      if (selectedGame) {
        setIsOpen(false);
        router.push(`/games/${selectedGame.slug}`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input de Búsqueda */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-[#949CB2] pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (suggestions.length > 0 && query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-[#2D3349] bg-[#090B14]/90 pl-11 pr-11 text-sm text-[#F5F7FF] placeholder-[#949CB2] backdrop-blur-md transition-all duration-200 focus:border-[#783DF2] focus:bg-[#090B14] focus:outline-none focus:ring-2 focus:ring-[#783DF2]/30"
        />

        {/* Indicador de Carga o Botón de Borrado */}
        <div className="absolute right-3.5 flex items-center">
          {isLoading || isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#1FD1EB]" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md p-1 text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Menú Desplegable Predictivo */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[#2D3349] bg-[#131421] shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#949CB2]">
              Sugerencias Predictivas
            </div>

            <div className="flex flex-col gap-1">
              {suggestions.map((game, idx) => {
                const isSelected = idx === selectedIndex;
                const isFree = game.final_price === 0;

                return (
                  <Link
                    key={game.id}
                    href={`/games/${game.slug}`}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 rounded-xl p-2 transition-all ${
                      isSelected
                        ? 'bg-[#783DF2]/20 border border-[#783DF2]/40 text-white'
                        : 'hover:bg-[#1A1C2B] text-[#F5F7FF]'
                    }`}
                  >
                    {/* Miniatura del Videojuego */}
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#090B14]">
                      <Image
                        src={game.cover_image_url}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold text-[#F5F7FF]">
                          {game.title}
                        </span>
                        {game.discount_percent > 0 && (
                          <span className="shrink-0 rounded bg-[#783DF2] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                            -{game.discount_percent}%
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#949CB2]">
                        <span>{game.categories.map((c) => c.name).slice(0, 2).join(' • ')}</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{game.rating_avg.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="shrink-0 text-right pr-2">
                      {game.discount_percent > 0 && (
                        <div className="text-[10px] text-[#949CB2] line-through">
                          Bs. {game.base_price.toFixed(2)}
                        </div>
                      )}
                      <div className={`text-xs font-bold ${isFree ? 'text-emerald-400' : 'text-[#1FD1EB]'}`}>
                        {isFree ? 'GRATIS' : `Bs. ${game.final_price.toFixed(2)}`}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pie del Dropdown */}
            <div className="mt-2 border-t border-[#2D3349]/70 pt-2 px-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-[#1FD1EB] hover:bg-[#1FD1EB]/10 transition-colors"
              >
                <span>Ver todos los resultados en el catálogo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
