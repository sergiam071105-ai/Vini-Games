import { WishlistClientView } from "@/components/store/wishlist-client-view";

export const metadata = {
  title: "Mi Lista de Deseos | ViniGames",
  description: "Tus videojuegos guardados y seguimiento de precios en ViniGames",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#080A13] pb-24">
      <WishlistClientView />
    </div>
  );
}
