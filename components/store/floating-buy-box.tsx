"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";

interface FloatingBuyBoxProps {
  gameId: number;
  title: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number | null;
}

export function FloatingBuyBox({
  gameId,
  title,
  basePrice,
  discountPercent,
  finalPrice,
}: FloatingBuyBoxProps) {
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkIsWishlisted(gameId);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const priceToDisplay = finalPrice ?? basePrice;
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: gameId,
      title,
      base_price: basePrice,
      discount_percent: discountPercent,
      final_price: finalPrice,
    });
  };

  return (
    <div className="sticky top-8 bg-[#1A1C2B] border border-[#2E334A] rounded-xl overflow-hidden">
      {/* Portada pequeña en la caja */}
      <div className="p-6 flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-white">{title}</h2>

        {/* Bloque de precios */}
        <div className="flex items-center gap-3">
          {hasDiscount && (
            <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-base font-bold px-3 py-1 rounded-md">
              -{discountPercent}%
            </span>
          )}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-zinc-500 line-through">
                Bs. {basePrice.toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-bold text-white">
              Bs. {priceToDisplay.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <button
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              addedToCart
                ? "bg-[#10B981] text-white"
                : "bg-[#783DF2] hover:bg-[#6A32DB] text-white hover:shadow-[0_0_20px_rgba(120,61,242,0.4)]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5" /> ¡Agregado!
              </>
            ) : isAddingToCart ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Añadir al Carrito
              </>
            )}
          </button>

          <button
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 border ${
              isWishlisted
                ? "text-pink-400 bg-pink-500/10 border-pink-500/40 hover:bg-pink-500/20"
                : "text-zinc-300 border-[#2E334A] hover:border-[#783DF2]/50 hover:bg-[#1E2033]"
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            {isWishlisted ? "En tu Wishlist ♥" : "Añadir a Wishlist"}
          </button>
        </div>

        {/* Info adicional */}
        <div className="border-t border-[#2E334A] pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Plataforma</span>
            <span className="text-zinc-200">PC (Windows)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Idiomas</span>
            <span className="text-zinc-200">Español, Inglés, Portugués</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Almacenamiento</span>
            <span className="text-zinc-200">85 GB disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
