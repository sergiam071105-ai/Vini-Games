'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Percent, Sparkles, Flame } from 'lucide-react';
import { GameCard, Game } from '@/components/store/game-card';
import { GameItem } from '@/types/catalog';

interface OffersCarouselProps {
  games: (Game | GameItem)[];
}

export function OffersCarousel({ games }: OffersCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScrollLimits = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollLimits();
    container.addEventListener('scroll', checkScrollLimits, { passive: true });
    window.addEventListener('resize', checkScrollLimits);

    return () => {
      container.removeEventListener('scroll', checkScrollLimits);
      window.removeEventListener('resize', checkScrollLimits);
    };
  }, [checkScrollLimits, games]);

  // Auto-scroll suave cada 4 segundos si el usuario no tiene el mouse encima
  useEffect(() => {
    if (isPaused || games.length === 0) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // Volver al principio si llega al final
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Desplazar a la derecha
        scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, games.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (games.length === 0) return null;

  return (
    <section 
      aria-label="Ofertas Especiales" 
      className="relative flex flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Encabezado con Controles de Carrusel */}
      <div className="flex items-center justify-between border-b border-[#2D3349] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#F5F7FF] tracking-wide">
                Ofertas Especiales
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                <Flame className="w-3 h-3" />
                {games.length} Descuentos
              </span>
            </div>
            <p className="text-xs text-[#949CB2] mt-0.5">
              Descuentos por tiempo limitado en los mejores títulos
            </p>
          </div>
        </div>

        {/* Botones de Navegación Izquierda / Derecha */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Desplazar a la izquierda"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:bg-[#783DF2] hover:text-white hover:border-[#783DF2] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Desplazar a la derecha"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D3349] bg-[#1A1C2B] text-[#949CB2] hover:bg-[#783DF2] hover:text-white hover:border-[#783DF2] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenedor del Carrusel Desplazable */}
      <div className="relative -mx-2 px-2">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 no-scrollbar snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {games.map((game) => (
            <div
              key={`carousel-offer-${game.id}-${game.slug}`}
              className="w-[280px] sm:w-[300px] md:w-[320px] flex-shrink-0 snap-start transition-transform duration-200 hover:scale-[1.02]"
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>

        {/* Sombra de desvanecimiento lateral derecha e izquierda para efecto premium */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#080A13] to-transparent z-10" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#080A13] to-transparent z-10" />
        )}
      </div>
    </section>
  );
}
