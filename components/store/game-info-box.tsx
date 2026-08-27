'use client';

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, ArrowRight, Check, Gamepad2 } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useLibrary } from "@/lib/context/library-context";

interface GameInfoBoxProps {
  gameId?: number;
  gameSlug?: string;
  coverUrl?: string;
  developer?: string;
  title: string;
  categories: { id: number; name: string }[];
  ratingAvg: number;
  ratingCount: number;
  shortDescription: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number | null;
}

export function GameInfoBox({
  gameId = 1,
  gameSlug = "neon-odyssey",
  coverUrl,
  developer = "Vini Studio",
  title,
  categories,
  ratingAvg,
  ratingCount,
  shortDescription,
  basePrice,
  discountPercent,
  finalPrice,
}: GameInfoBoxProps) {
  const { addItem, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isOwned } = useLibrary();

  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const owned = isOwned(gameId);
  const inCart = isInCart(gameId);
  const inWishlist = isInWishlist(gameId);

  const priceToDisplay = finalPrice ?? basePrice;
  const hasDiscount = discountPercent > 0;

  const handleBuyNow = async () => {
    if (owned) return;
    await addItem({
      id: gameId,
      title,
      slug: gameSlug,
      coverUrl,
      developer,
      basePrice,
      discountPercent,
      finalPrice: priceToDisplay,
    });
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2500);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist({
      id: gameId,
      title,
      slug: gameSlug,
      coverUrl,
      developer,
      basePrice,
      discountPercent,
      finalPrice: priceToDisplay,
      ratingAvg,
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
        <Star className="w-5 h-5 fill-[#1FD1EB] text-[#1FD1EB]" />
        <span className="text-white font-bold text-lg">{ratingAvg.toFixed(1)}</span>
        <span className="text-zinc-500 text-sm ml-1" suppressHydrationWarning>
          {ratingCount.toLocaleString('es-ES')} reseñas
        </span>
      </div>

      <p className="text-zinc-400 text-[15px] leading-relaxed mb-8 max-w-lg">
        {shortDescription}
      </p>

      <div className="mt-auto">
        {owned ? (
          /* Estado cuando el usuario ya compró el videojuego */
          <div className="bg-[#1FD1EB]/10 border border-[#1FD1EB]/40 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-[#1FD1EB] font-bold text-sm mb-1.5">
              <Check className="w-5 h-5 bg-[#1FD1EB] text-[#080A13] rounded-full p-0.5 shrink-0" />
              <span>Juego disponible en tu biblioteca</span>
            </div>
            <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
              Ya posees este título en tu cuenta de ViniGames. Puedes jugarlo o instalarlo cuando quieras.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/library"
                className="flex-1 bg-[#1FD1EB] hover:bg-[#18b5cc] text-[#080A13] py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1FD1EB]/20 uppercase tracking-wider text-xs cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" /> Ir a mi Biblioteca / Jugar
              </Link>
              <button
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? `Quitar ${title} de lista de deseos` : `Guardar ${title} en lista de deseos`}
                className={`w-12 h-12 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inWishlist
                    ? "bg-red-500/20 border-red-500/60 text-red-400"
                    : "border-[#2E334A] hover:border-[#783DF2] bg-[#1A1C2B] text-zinc-400"
                }`}
                title={inWishlist ? "Quitar de lista de deseos" : "Guardar en lista de deseos"}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-400" : ""}`} />
              </button>
            </div>
          </div>
        ) : (
          /* Estado regular de compra */
          <>
            <span className="text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-2 block">Precio</span>
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
              <button
                onClick={handleBuyNow}
                aria-label={`Comprar ${title} por ${priceToDisplay.toFixed(2)} Bolivianos y añadir al carrito`}
                className="flex-1 bg-[#783DF2] hover:bg-[#6A32DB] text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#783DF2]/30 uppercase tracking-wider cursor-pointer"
              >
                {inCart || isAddedFeedback ? (
                  <>
                    <Check className="w-5 h-5 text-[#10B981]" />
                    {inCart ? "En el Carrito" : "¡Añadido!"}
                  </>
                ) : (
                  <>
                    Comprar ahora <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? `Quitar ${title} de lista de deseos` : `Guardar ${title} en lista de deseos`}
                className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inWishlist
                    ? "bg-red-500/20 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                    : "border-[#2E334A] hover:border-[#783DF2] bg-[#1A1C2B] text-zinc-400 hover:text-pink-400"
                }`}
                title={inWishlist ? "Quitar de lista de deseos" : "Guardar en lista de deseos"}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? "fill-red-400" : "group-hover:fill-pink-400/20"}`} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
