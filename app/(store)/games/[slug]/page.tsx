import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameMediaGallery } from "@/components/store/game-media-gallery";
import { GameInfoBox } from "@/components/store/game-info-box";
import { GameMetadata } from "@/components/store/game-metadata";
import { GameReviews } from "@/components/store/game-reviews";
import { GameRequirements } from "@/components/store/game-requirements";
import { MOCK_GAMES } from "@/lib/mock-data/games";

interface GameDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const MOCK_GALLERY = [
  { id: 1, media_type: "image", media_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" },
  { id: 2, media_type: "image", media_url: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80" },
];

const MOCK_RELATED = [
  { id: 2, title: "VOID RUNNER", price: 59 },
  { id: 3, title: "DARK REALM", price: 119 },
  { id: 4, title: "PIXEL WARS", price: 39 },
];

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;

  let gameData: any = null;

  try {
    const supabase = await createClient();
    const { data: dbGame } = await supabase
      .from("games")
      .select(`
        id,
        title,
        slug,
        description,
        short_description,
        cover_image_url,
        banner_image_url,
        trailer_url,
        developer,
        publisher,
        release_date,
        base_price,
        discount_percent,
        final_price,
        rating_avg,
        rating_count,
        age_rating
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (dbGame) {
      gameData = {
        id: dbGame.id,
        title: dbGame.title,
        slug: dbGame.slug,
        description: dbGame.description || dbGame.short_description || "Explora un mundo interactivo lleno de aventuras.",
        basePrice: Number(dbGame.base_price),
        discountPercent: dbGame.discount_percent || 0,
        finalPrice: dbGame.final_price ? Number(dbGame.final_price) : Number(dbGame.base_price),
        coverUrl: dbGame.cover_image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
        trailerUrl: dbGame.trailer_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        developer: dbGame.developer || "Estudio Gamer",
        publisher: dbGame.publisher || "ViniGames Publishing",
        releaseDate: dbGame.release_date || "2026-08-18",
        ageRating: dbGame.age_rating || "+13",
        ratingAvg: Number(dbGame.rating_avg) || 4.8,
        ratingCount: dbGame.rating_count || 1284,
      };
    }
  } catch {
    // Continuar con fallback local
  }

  // Fallback con MOCK_GAMES si no existe en la base de datos
  if (!gameData) {
    const matched = MOCK_GAMES.find((g) => g.slug === slug || g.slug.includes(slug) || slug.includes(g.slug));
    const fallback = matched || MOCK_GAMES[0];

    gameData = {
      id: fallback.id,
      title: fallback.title,
      slug: fallback.slug,
      description: fallback.description || fallback.short_description,
      basePrice: Number(fallback.base_price),
      discountPercent: fallback.discount_percent || 0,
      finalPrice: Number(fallback.final_price),
      coverUrl: fallback.cover_image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      trailerUrl: fallback.trailer_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      developer: fallback.developer || "Vini Studio",
      publisher: fallback.publisher || "Vini Games",
      releaseDate: fallback.release_date || "2026-08-18",
      ageRating: fallback.age_rating || "+13",
      ratingAvg: Number(fallback.rating_avg) || 4.8,
      ratingCount: fallback.rating_count || 1284,
    };
  }

  const categories = [
    { id: 1, name: "Acción" },
    { id: 2, name: "RPG" },
    { id: 3, name: "Aventura" },
  ];

  return (
    <div className="min-h-screen bg-[#080A13] pb-24">
      
      {/* Container principal para alinear todo al centro con max-width */}
      <div className="container mx-auto px-4 pt-10 max-w-7xl">
        
        {/* TOP SECTION: Galería y Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Izquierda: Media Gallery (Ocupa 7 de 12 columnas) */}
          <div className="lg:col-span-7">
            <GameMediaGallery
              coverUrl={gameData.coverUrl}
              trailerUrl={gameData.trailerUrl}
              gallery={MOCK_GALLERY}
            />
          </div>
          
          {/* Derecha: Info & Buy Box (Ocupa 5 de 12 columnas) */}
          <div className="lg:col-span-5 pt-4">
            <GameInfoBox
              gameId={gameData.id}
              gameSlug={gameData.slug}
              coverUrl={gameData.coverUrl}
              developer={gameData.developer}
              title={gameData.title}
              categories={categories}
              ratingAvg={gameData.ratingAvg}
              ratingCount={gameData.ratingCount}
              shortDescription={gameData.description}
              basePrice={gameData.basePrice}
              discountPercent={gameData.discountPercent}
              finalPrice={gameData.finalPrice}
            />
          </div>
        </div>

        {/* MIDDLE SECTION 1: Acerca del juego */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Acerca del juego</h2>
          <GameMetadata
            developer={gameData.developer}
            publisher={gameData.publisher}
            releaseDate={gameData.releaseDate}
            ageRating={gameData.ageRating}
          />
        </div>

        {/* MIDDLE SECTION 2: Requisitos del sistema */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Requisitos del sistema</h2>
          <GameRequirements />
        </div>

        {/* MIDDLE SECTION 3: Reseñas */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Reseñas de la comunidad</h2>
          <GameReviews gameId={gameData.id} gameTitle={gameData.title} />
        </div>

        {/* BOTTOM SECTION: También te puede gustar */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">También te puede gustar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {MOCK_RELATED.map((game) => (
              <div key={game.id} className="bg-[#151722] rounded-xl overflow-hidden border border-transparent hover:border-[#783DF2]/50 transition-colors cursor-pointer group">
                <div className="aspect-[4/3] bg-[#1A1C2B] w-full" />
                <div className="p-5">
                  <h3 className="text-white font-bold text-sm mb-2 group-hover:text-[#1FD1EB] transition-colors">{game.title}</h3>
                  <div className="text-[#1FD1EB] font-bold text-sm">Bs. {game.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
