import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, Library } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { WishlistItem } from "@/components/store/wishlist-item";

export const metadata = {
  title: "Mi Lista de Deseos | ViniGames",
};

export default async function WishlistPage() {
  const supabase = await createClient();

  // Validar sesión
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Consultar la wishlist con los datos de los juegos
  const { data: wishlists, error } = await supabase
    .from("wishlists")
    .select(`
      id,
      games (
        id,
        title,
        slug,
        developer,
        base_price,
        discount_percent,
        final_price,
        cover_image_url
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando wishlist:", error);
  }

  const hasItems = wishlists && wishlists.length > 0;

  return (
    <div className="min-h-screen bg-[#080A13] pb-24">
      <div className="container mx-auto px-4 pt-10 max-w-5xl">
        <div className="flex items-center gap-3 mb-8 border-b border-[#2E334A] pb-6">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500/20" />
          <h1 className="text-3xl font-bold text-white">Mi Lista de Deseos</h1>
          {hasItems && (
            <span className="bg-[#1A1C2B] text-zinc-400 text-sm font-semibold px-3 py-1 rounded-full ml-2">
              {wishlists.length} juegos
            </span>
          )}
        </div>

        {hasItems ? (
          <div className="flex flex-col gap-5">
            {wishlists.map((item) => (
              item.games && (
                <WishlistItem 
                  key={item.id} 
                  // @ts-ignore - Supabase type casting
                  game={item.games} 
                />
              )
            ))}
          </div>
        ) : (
          <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-[#080A13] p-6 rounded-full mb-6 border border-[#2E334A]">
              <Heart className="w-16 h-16 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Tu lista de deseos está vacía</h2>
            <p className="text-zinc-400 max-w-md mb-8">
              Aún no has agregado ningún juego a tu lista. Explora nuestro catálogo y guarda los juegos que te interesen para más tarde.
            </p>
            <Link 
              href="/catalog" 
              className="bg-[#1FD1EB]/10 hover:bg-[#1FD1EB]/20 text-[#1FD1EB] border border-[#1FD1EB]/30 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
            >
              <Library className="w-5 h-5" />
              Explorar Catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
