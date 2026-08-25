"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartCrack, ShoppingCart, Loader2 } from "lucide-react";
import { toggleWishlistAction, moveToCartAction } from "@/app/actions/wishlist.actions";

interface WishlistItemProps {
  game: {
    id: number;
    title: string;
    slug: string;
    developer: string;
    base_price: number;
    discount_percent: number;
    final_price: number | null;
    cover_image_url: string;
  };
}

export function WishlistItem({ game }: WishlistItemProps) {
  const [isPendingRemove, startTransitionRemove] = useTransition();
  const [isPendingCart, startTransitionCart] = useTransition();

  const priceToDisplay = game.final_price ?? game.base_price;
  const hasDiscount = game.discount_percent > 0;

  const handleRemove = () => {
    startTransitionRemove(async () => {
      await toggleWishlistAction(game.id);
    });
  };

  const handleMoveToCart = () => {
    startTransitionCart(async () => {
      await moveToCartAction(game.id);
    });
  };

  return (
    <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-xl overflow-hidden flex flex-col sm:flex-row transition-all hover:border-[#783DF2]/50 group">
      {/* Carátula */}
      <Link href={`/games/${game.slug}`} className="relative sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-black block">
        <Image 
          src={game.cover_image_url || "/images/placeholder.jpg"} 
          alt={game.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge de Descuento flotante sobre la imagen */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#10B981] text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
            -{game.discount_percent}%
          </div>
        )}
      </Link>

      {/* Contenido e Info */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex justify-between items-start gap-4">
            <Link href={`/games/${game.slug}`}>
              <h3 className="text-xl font-bold text-white hover:text-[#1FD1EB] transition-colors line-clamp-1">
                {game.title}
              </h3>
            </Link>
            <div className="flex flex-col items-end">
              {hasDiscount && (
                <span className="text-sm text-zinc-500 line-through">
                  Bs. {game.base_price.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-white">
                Bs. {priceToDisplay.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-1">{game.developer}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center mt-auto justify-end">
          <button 
            onClick={handleRemove}
            disabled={isPendingRemove || isPendingCart}
            className="text-zinc-400 hover:text-pink-500 bg-[#131521] border border-[#2E334A] hover:border-pink-500/50 hover:bg-pink-500/10 p-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            title="Eliminar de la Wishlist"
          >
            {isPendingRemove ? <Loader2 className="w-5 h-5 animate-spin" /> : <HeartCrack className="w-5 h-5" />}
          </button>

          <button 
            onClick={handleMoveToCart}
            disabled={isPendingRemove || isPendingCart}
            className="flex-1 sm:flex-none bg-[#783DF2] hover:bg-[#6A32DB] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(120,61,242,0.4)]"
          >
            {isPendingCart ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Moviendo...</>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> Mover al Carrito</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
