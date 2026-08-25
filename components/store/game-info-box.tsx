"use client";

import { useState, useTransition } from "react";
import { Star, ShoppingCart, Heart, ArrowRight, Loader2 } from "lucide-react";
import { toggleWishlistAction } from "@/app/actions/wishlist.actions";

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
  initialIsWishlisted = false,
}: GameInfoBoxProps) {
  const [isPending, startTransition] = useTransition();
  // Estado local optimista
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

  const priceToDisplay = finalPrice ?? basePrice;
  const hasDiscount = discountPercent > 0;

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted); // optimistic update
    startTransition(async () => {
      const result = await toggleWishlistAction(gameId);
      if (!result.success) {
        setIsWishlisted(isWishlisted); // revert on failure
        // Idealmente mostrar un toast de error si falla (ej. si no ha iniciado sesión)
        if (result.error === "Debes iniciar sesión para usar la wishlist") {
          alert("Debes iniciar sesión para agregar a la lista de deseos.");
        }
      }
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
          <button className="flex-1 bg-[#783DF2] hover:bg-[#6A32DB] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
            Comprar ahora <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleToggleWishlist}
            disabled={isPending}
            className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-all group disabled:opacity-50 ${
              isWishlisted 
                ? "bg-pink-500/10 border-pink-500/50 text-pink-500" 
                : "bg-[#1A1C2B] border-[#2E334A] text-zinc-400 hover:border-[#783DF2] hover:text-pink-400"
            }`}
          >
            {isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : "group-hover:fill-pink-400/20"}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
