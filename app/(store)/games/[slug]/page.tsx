import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameMediaGallery } from "@/components/store/game-media-gallery";
import { FloatingBuyBox } from "@/components/store/floating-buy-box";
import { GameMetadata } from "@/components/store/game-metadata";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // Consultar datos del juego, medios y categorías relacionadas
  const { data: game, error } = await supabase
    .from("games")
    .select(`
      *,
      game_media (
        id,
        media_type,
        media_url,
        sort_order
      ),
      game_categories (
        categories (
          id,
          name
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !game) {
    notFound();
  }

  // Ordenar la galería por sort_order
  const gallery = [...(game.game_media || [])].sort((a, b) => a.sort_order - b.sort_order);
  
  // Extraer las categorías de la relación N:M
  const categories = (game.game_categories || [])
    // @ts-ignore - Tipo complejo de supabase
    .map(gc => gc.categories)
    .filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda (Principal) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Título (visible en móvil, oculto en desktop donde va en la caja flotante) */}
          <h1 className="text-3xl font-bold text-foreground lg:hidden">{game.title}</h1>

          <GameMediaGallery 
            coverUrl={game.cover_image_url} 
            trailerUrl={game.trailer_url} 
            gallery={gallery} 
          />

          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Acerca de este juego</h2>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {game.description}
            </div>
          </div>

          <GameMetadata 
            developer={game.developer}
            publisher={game.publisher}
            releaseDate={game.release_date}
            ageRating={game.age_rating}
            categories={categories}
          />
        </div>

        {/* Columna Derecha (Caja de Compra Flotante) */}
        <div className="lg:col-span-1">
          <FloatingBuyBox 
            gameId={game.id}
            title={game.title}
            basePrice={game.base_price}
            discountPercent={game.discount_percent}
            finalPrice={game.final_price}
          />
        </div>

      </div>
    </div>
  );
}
