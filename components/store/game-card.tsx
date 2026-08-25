'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { GameItem } from '@/types/catalog';
import { useWishlist } from '@/lib/context/wishlist-context';

export interface Game {
  id: number;
  title: string;
  slug: string;
  base_price: number;
  discount_percent: number;
  final_price: number;
  cover_image_url: string | null;
  rating_avg: number;
  rating_count?: number;
  developer?: string;
  short_description?: string | null;
  categories?: { id: number; name: string; slug: string }[];
  is_featured?: boolean;
}

interface GameCardProps {
  game: Game | GameItem;
  priority?: boolean;
}

export function GameCard({ game, priority = false }: GameCardProps) {
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkIsWishlisted(game.id);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(game);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const isDiscounted = (game.discount_percent || 0) > 0;
  const isFree = Number(game.final_price) === 0;
  const categories = 'categories' in game && Array.isArray(game.categories) ? game.categories : [];
  const ratingAvg = Number(game.rating_avg || 0);
  const ratingCount = 'rating_count' in game ? game.rating_count : undefined;
  const developer = 'developer' in game ? game.developer : undefined;
  const shortDescription = 'short_description' in game ? game.short_description : undefined;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#2D3349] bg-[#1A1C2B] transition-all duration-300 hover:-translate-y-1 hover:border-[#783DF2]/80 hover:shadow-[0_8px_30px_rgba(120,61,242,0.25)] h-full">
      {/* Enlace principal al detalle del videojuego */}
      <Link href={`/games/${game.slug}`} className="block flex-1">
        {/* Contenedor de la Imagen de Portada con Hover Zoom */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F111A]">
          {game.cover_image_url ? (
            <Image
              src={game.cover_image_url}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-center p-4">
              <span className="text-4xl">🎮</span>
              <span className="text-[10px] text-[#949CB2] mt-2 font-mono">Sin Portada</span>
            </div>
          )}

          {/* Overlay con degradado inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C2B] via-transparent to-transparent opacity-80" />

          {/* Badges superiores */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {isDiscounted && (
              <span className="inline-flex items-center rounded-md bg-gradient-to-r from-[#783DF2] to-[#9D68FF] px-2 py-0.5 text-xs font-black tracking-wider text-white shadow-md">
                -{game.discount_percent}%
              </span>
            )}
            {'is_featured' in game && game.is_featured && !isDiscounted && (
              <span className="inline-flex items-center rounded-md bg-[#1FD1EB]/20 border border-[#1FD1EB]/50 px-2 py-0.5 text-xs font-bold text-[#1FD1EB] backdrop-blur-md">
                DESTACADO
              </span>
            )}
          </div>

          {/* Botón de Wishlist rápido */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? 'Quitar de lista de deseos' : 'Añadir a lista de deseos'}
            className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 ${
              isWishlisted
                ? 'border-pink-500/80 bg-pink-500/20 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                : 'border-white/10 bg-[#090B14]/60 text-[#949CB2] hover:border-white/30 hover:bg-[#090B14]/90 hover:text-white'
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-transform ${isWishlisted ? 'fill-current scale-110' : ''}`}
            />
          </button>

          {/* Puntuación Rating */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 rounded-md bg-[#090B14]/80 px-2 py-0.5 text-xs font-semibold text-[#F5F7FF] backdrop-blur-md border border-white/10">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{ratingAvg.toFixed(1)}</span>
            {ratingCount !== undefined && (
              <span className="text-[#949CB2] text-[10px]">({ratingCount})</span>
            )}
          </div>
        </div>

        {/* Información del Videojuego */}
        <div className="p-4">
          {/* Categorías / Géneros si existen */}
          {categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((cat) => (
                <span
                  key={cat.slug || cat.id}
                  className="rounded-full bg-[#2D3349]/50 px-2 py-0.5 text-[11px] font-medium text-[#949CB2] transition-colors group-hover:text-[#F5F7FF]"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <h3 className="line-clamp-1 text-base font-bold text-[#F5F7FF] transition-colors duration-200 group-hover:text-[#1FD1EB]">
            {game.title}
          </h3>

          {/* Desarrollador si existe */}
          {developer && (
            <p className="mt-1 text-xs text-[#949CB2]">
              {developer}
            </p>
          )}

          {/* Breve descripción */}
          {shortDescription && (
            <p className="mt-2 line-clamp-2 text-xs text-[#949CB2]/80 leading-relaxed">
              {shortDescription}
            </p>
          )}
        </div>
      </Link>

      {/* Barra Inferior de Precios y Acción Rápida */}
      <div className="flex items-center justify-between border-t border-[#2D3349]/70 bg-[#131421]/60 px-4 py-3 mt-auto">
        {/* Precios */}
        <div className="flex flex-col">
          {isDiscounted && (
            <span className="text-xs text-[#949CB2] line-through font-medium">
              Bs. {Number(game.base_price).toFixed(2)}
            </span>
          )}
          <span className={`text-base font-black tracking-tight ${isFree ? 'text-emerald-400' : 'text-[#F5F7FF]'}`}>
            {isFree ? 'GRATIS' : `Bs. ${Number(game.final_price).toFixed(2)}`}
          </span>
        </div>

        {/* Botón de acción rápida */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddedToCart}
          aria-label="Añadir al carrito"
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
            isAddedToCart
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-[#783DF2] text-white hover:bg-[#6A32DB] hover:shadow-[0_0_12px_rgba(120,61,242,0.5)] active:scale-95'
          }`}
        >
          {isAddedToCart ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Añadido</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Comprar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
