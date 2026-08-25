"use client";

import { Star, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";

interface GameInfoBoxProps {
  gameId: number;
  title: string;
  categories: { id: number; name: string }[];
  ratingAvg: number;
  ratingCount: number;
  shortDescription: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number | null;
  initialIsWishlisted?: boolean;
}

export function GameInfoBox({
  gameId,
  title,
  categories,
  ratingAvg,
  ratingCount,
  shortDescription,
  basePrice,
  discountPercent,
  finalPrice,
}: GameInfoBoxProps) {
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkIsWishlisted(gameId);

  const priceToDisplay = finalPrice ?? basePrice;
  const hasDiscount = discountPercent > 0;

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: gameId,
      title,
      base_price: basePrice,
      discount_percent: discountPercent,
      final_price: finalPrice,
      short_description: shortDescription,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
      
      <div className="flex items-center gap-2 text-sm text-[#1FD1EB] font-semibold mb-4">
        {categories.map((cat, index) => (
          <span key={cat.id}>
            {cat.name}
            {index < categories.length - 1 && <span className="text-zinc-500 mx-2">•</span>}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 fill-white text-white" />
        <span className="text-white font-bold text-lg">{ratingAvg.toFixed(1)}</span>
        <span className="text-zinc-500 text-sm ml-1">{ratingCount.toLocaleString()} reseñas</span>
      </div>

      <p className="text-zinc-400 text-[15px] leading-relaxed mb-8 max-w-lg">
        {shortDescription}
      </p>

      <div className="mt-auto">
        <span className="text-zinc-500 text-xs uppercase font-semibold tracking-wider mb-2 block">Precio</span>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-white">
            Bs. {priceToDisplay.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="bg-[#783DF2] text-white text-sm font-bold px-3 py-1 rounded-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex-1 bg-[#783DF2] hover:bg-[#6A32DB] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(120,61,242,0.4)] active:scale-[0.99]">
            Comprar ahora <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? 'Quitar de lista de deseos' : 'Añadir a lista de deseos'}
            className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-all duration-200 group active:scale-95 ${
              isWishlisted 
                ? "bg-pink-500/20 border-pink-500/70 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]" 
                : "bg-[#1A1C2B] border-[#2E334A] text-zinc-400 hover:border-[#783DF2] hover:text-white"
            }`}
          >
            <Heart className={`w-6 h-6 transition-transform duration-200 ${isWishlisted ? "fill-current scale-110" : "group-hover:scale-110"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
