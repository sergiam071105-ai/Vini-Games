'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, ExternalLink } from 'lucide-react';
import { ChatProductItem } from '@/types/chat.types';
import { useCart } from '@/lib/context/cart-context';

interface ChatProductCardProps {
  game: ChatProductItem;
}

export function ChatProductCard({ game }: ChatProductCardProps) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const alreadyInCart = isInCart(game.id);

  const handleAddToCart = async () => {
    if (alreadyInCart || isAdding) return;
    setIsAdding(true);

    try {
      await addItem({
        id: game.id,
        title: game.title,
        slug: game.slug,
        coverUrl: game.coverUrl,
        developer: game.developer,
        basePrice: game.basePrice,
        discountPercent: game.discountPercent,
        finalPrice: game.finalPrice,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-[#1A1C2B] border border-[#2E334A] hover:border-[#783DF2]/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 transition-all shadow-md group">
      
      {/* Información del Videojuego */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#090B14] flex-shrink-0 relative border border-[#2E334A]/80">
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#783DF2]">
              GAME
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/games/${game.slug}`}
            className="text-xs sm:text-sm font-bold text-[#F8FAFC] hover:text-[#1FD1EB] transition-colors truncate block"
          >
            {game.title}
          </Link>
          <span className="text-[11px] text-[#94A3B8] block truncate">{game.developer}</span>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-black text-[#1FD1EB]">
              Bs. {game.finalPrice}
            </span>
            {game.discountPercent > 0 && (
              <>
                <span className="text-[10px] text-[#94A3B8] line-through">
                  Bs. {game.basePrice}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#10B981]/20 text-[#10B981] text-[9px] font-extrabold">
                  -{game.discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2E334A]/50">
        <Link
          href={`/games/${game.slug}`}
          aria-label={`Ver ficha de producto de ${game.title}`}
          className="p-2 bg-[#131521] hover:bg-[#25283d] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg text-xs transition-colors border border-[#2E334A]"
          title="Ver ficha técnica"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={alreadyInCart || isAdding}
          aria-label={`Añadir ${game.title} al carrito de compras por Bs. ${game.finalPrice}`}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            alreadyInCart || added
              ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981]'
              : 'bg-[#783DF2] hover:bg-[#6929e4] text-[#F8FAFC] shadow-md shadow-[#783DF2]/25'
          }`}
        >
          {alreadyInCart || added ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
              <span>En Carrito</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>+ Añadir</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
