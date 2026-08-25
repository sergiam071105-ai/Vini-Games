"use client";

import Link from "next/link";
import { Heart, Library } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";
import { WishlistItem } from "@/components/store/wishlist-item";

export function WishlistClientView() {
  const { wishlistItems, wishlistCount } = useWishlist();

  const hasItems = wishlistItems && wishlistItems.length > 0;

  return (
    <div className="container mx-auto px-4 pt-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4 mb-8 border-b border-[#2E334A] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Mi Lista de Deseos</h1>
            <p className="text-zinc-400 text-xs mt-0.5">Juegos guardados y alertas de ofertas</p>
          </div>
        </div>

        {hasItems && (
          <span className="bg-[#1A1C2B] text-zinc-300 border border-[#2E334A] text-xs font-bold px-3.5 py-1.5 rounded-full">
            {wishlistCount} {wishlistCount === 1 ? "juego" : "juegos"}
          </span>
        )}
      </div>

      {hasItems ? (
        <div className="flex flex-col gap-4">
          {wishlistItems.map((item) => (
            <WishlistItem key={item.id} game={item} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-[#080A13] p-6 rounded-2xl mb-6 border border-[#2E334A]">
            <Heart className="w-14 h-14 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-zinc-400 max-w-md text-sm mb-8">
            Aún no has guardado ningún juego. Explora nuestro catálogo y presiona el corazón en tus títulos favoritos para no perderte ninguna oferta.
          </p>
          <Link 
            href="/catalog" 
            className="bg-[#783DF2] hover:bg-[#6A32DB] text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(120,61,242,0.4)] active:scale-95"
          >
            <Library className="w-5 h-5" />
            Explorar Catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
