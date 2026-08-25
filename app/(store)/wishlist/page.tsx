import { createClient } from "@/lib/supabase/server";
import { WishlistClientView } from "@/components/store/wishlist-client-view";

export const metadata = {
  title: "Mi Lista de Deseos | ViniGames",
  description: "Tus videojuegos favoritos guardados en ViniGames con alertas de ofertas y descuentos.",
};

export default async function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#080A13] pb-24">
      <WishlistClientView />
    </div>
  );
}
