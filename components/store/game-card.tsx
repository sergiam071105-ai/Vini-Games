import Link from 'next/link';
import { Star } from 'lucide-react';

export interface Game {
  id: number;
  title: string;
  slug: string;
  base_price: number;
  discount_percent: number;
  final_price: number;
  cover_image_url: string | null;
  rating_avg: number;
}

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const hasDiscount = game.discount_percent > 0;
  
  // Format prices to Bs.
  const formatPrice = (val: number) => {
    return `Bs. ${Number(val).toFixed(2)}`;
  };

  return (
    <div className="group bg-[#1A1C2B] border border-[#2D3349] hover:border-[#783DF2] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Container */}
      <Link href={`/games/${game.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-[#131421] cursor-pointer">
        {game.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={game.cover_image_url} 
            alt={game.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-4xl">🎮</span>
            <span className="text-[10px] text-[#949CB2] mt-2 font-mono">Sin Portada</span>
          </div>
        )}
        
        {/* Discount Badge on Image Overlay */}
        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 bg-[#10B981] text-[#F5F7FF] text-[10px] font-extrabold px-2 py-0.5 rounded">
            {game.discount_percent}% OFF
          </span>
        )}
      </Link>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-grow gap-2.5">
        
        {/* Rating and Meta */}
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-[#1FD1EB] text-[#1FD1EB]" />
          <span className="text-xs font-bold text-[#F5F7FF]">
            {Number(game.rating_avg || 0).toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/games/${game.slug}`} className="cursor-pointer">
          <h3 className="font-bold text-sm text-[#F5F7FF] leading-snug group-hover:text-[#1FD1EB] transition-colors line-clamp-2 min-h-[2.5rem]">
            {game.title}
          </h3>
        </Link>

        {/* Price / Purchase Area */}
        <div className="mt-auto pt-2.5 border-t border-[#2D3349] flex items-baseline justify-between gap-2 flex-wrap">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-[#1FD1EB]">
                {formatPrice(game.final_price)}
              </span>
              <span className="text-[11px] text-[#949CB2] line-through">
                {formatPrice(game.base_price)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-[#F5F7FF]">
              {formatPrice(game.base_price)}
            </span>
          )}
          
          <Link 
            href={`/games/${game.slug}`}
            className="text-[10px] font-extrabold text-[#783DF2] group-hover:text-[#F5F7FF] group-hover:bg-[#783DF2] border border-[#783DF2] px-2.5 py-1 rounded transition-all"
          >
            Ver Detalles
          </Link>
        </div>

      </div>
    </div>
  );
}
