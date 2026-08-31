import Link from 'next/link';
import { Gamepad2, ShoppingBag } from 'lucide-react';
import { Game } from './game-card';

interface HeroBannerProps {
  game: Game;
}

export function HeroBanner({ game }: HeroBannerProps) {
  const hasDiscount = game.discount_percent > 0;
  
  const formatPrice = (val: number) => {
    return `Bs. ${Number(val).toFixed(2)}`;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#2D3349] bg-[#1A1C2B] min-h-[360px] flex items-center">
      {/* Background Gradient & Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080A13] via-[#080A13]/95 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-cover bg-center opacity-40 md:opacity-50" style={{ 
        backgroundImage: game.cover_image_url ? `url(${game.cover_image_url})` : 'none',
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
      }} />
      
      {/* Ambient Neon Purple Glow in background */}
      <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#783DF2] rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-20 max-w-xl p-6 md:p-10 flex flex-col gap-4">
        {/* Banner Tag */}
        <div className="flex items-center gap-1.5 self-start bg-[#783DF2]/10 border border-[#783DF2]/30 text-[#aa87ff] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full">
          <Gamepad2 className="h-3 w-3" />
          Destacado de la semana
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F5F7FF] tracking-tight leading-tight">
          {game.title}
        </h1>

        {/* Description */}
        <p className="text-sm text-[#949CB2] leading-relaxed line-clamp-3">
          {game.short_description ||
            (game.slug === 'grand-theft-auto-vi'
              ? 'El regreso más esperado a Vice City. Vive una revolucionaria narrativa criminal en un mundo abierto hiperrealista de nueva generación.'
              : game.slug === 'cyberpunk-2077'
              ? 'Sumérgete en una odisea cyberpunk en Night City donde tus decisiones moldean el destino del último bastión humano.'
              : 'Explora este emocionante videojuego disponible ahora en la tienda oficial de ViniGames con entrega digital instantánea.')}
        </p>

        {/* Categories / Tags */}
        <div className="flex gap-2 flex-wrap">
          {game.developer && (
            <span className="bg-[#783DF2]/20 border border-[#783DF2]/40 text-xs font-semibold text-[#aa87ff] px-2.5 py-0.5 rounded-md">
              {game.developer}
            </span>
          )}
          <span className="bg-[#1A1C2B]/80 border border-[#2D3349] text-xs text-[#949CB2] px-2.5 py-0.5 rounded-md">
            Mundo Abierto
          </span>
          <span className="bg-[#1A1C2B]/80 border border-[#2D3349] text-xs text-[#949CB2] px-2.5 py-0.5 rounded-md">
            Acción & RPG
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#949CB2] uppercase font-bold tracking-wider">Precio de Lanzamiento</span>
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-[#1FD1EB]">
                    {formatPrice(game.final_price)}
                  </span>
                  <span className="text-xs text-[#949CB2] line-through">
                    {formatPrice(game.base_price)}
                  </span>
                  <span className="bg-[#10B981] text-[#F5F7FF] text-[9px] font-extrabold px-1.5 py-0.5 rounded ml-1">
                    {game.discount_percent}% OFF
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#F5F7FF]">
                  {formatPrice(game.base_price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link 
              href={`/games/${game.slug}`}
              className="bg-[#783DF2] hover:bg-[#783DF2]/80 text-[#F5F7FF] text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-[#783DF2]/20 flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Adquirir Ahora
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
