import { GameMediaGallery } from "@/components/store/game-media-gallery";
import { GameInfoBox } from "@/components/store/game-info-box";
import { GameMetadata } from "@/components/store/game-metadata";
import { GameReviews } from "@/components/store/game-reviews";
import { GameRequirements } from "@/components/store/game-requirements";

// =====================================================================
// DATOS DE DEMOSTRACIÓN (Mock Data)
// =====================================================================
const MOCK_GAME = {
  id: 1,
  title: "Neon Odyssey",
  slug: "neon-odyssey",
  description: "Explora una ciudad futurista, descubre sus secretos y construye tu propia historia en un mundo lleno de aventuras.",
  basePrice: 111.25,
  discountPercent: 20,
  finalPrice: 89,
  coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  developer: "Vini Studio",
  publisher: "Vini Games",
  releaseDate: "2026-08-18",
  ageRating: "+13",
  ratingAvg: 4.8,
  ratingCount: 1284,
};

const MOCK_CATEGORIES = [
  { id: 1, name: "Acción" },
  { id: 2, name: "RPG" },
  { id: 3, name: "Aventura" },
];

const MOCK_GALLERY = [
  { id: 1, media_type: "image", media_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80" },
  { id: 2, media_type: "image", media_url: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80" },
];

const MOCK_RELATED = [
  { id: 2, title: "VOID RUNNER", price: 59 },
  { id: 3, title: "DARK REALM", price: 119 },
  { id: 4, title: "PIXEL WARS", price: 39 },
];

export default async function GameDetailPage() {
  return (
    <div className="min-h-screen bg-[#080A13] pb-24">
      
      {/* Container principal para alinear todo al centro con max-width */}
      <div className="container mx-auto px-4 pt-10 max-w-7xl">
        
        {/* TOP SECTION: Galería y Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Izquierda: Media Gallery (Ocupa 7 de 12 columnas) */}
          <div className="lg:col-span-7">
            <GameMediaGallery
              coverUrl={MOCK_GAME.coverUrl}
              trailerUrl={MOCK_GAME.trailerUrl}
              gallery={MOCK_GALLERY}
            />
          </div>
          
          {/* Derecha: Info & Buy Box (Ocupa 5 de 12 columnas) */}
          <div className="lg:col-span-5 pt-4">
            <GameInfoBox
              title={MOCK_GAME.title}
              categories={MOCK_CATEGORIES}
              ratingAvg={MOCK_GAME.ratingAvg}
              ratingCount={MOCK_GAME.ratingCount}
              shortDescription={MOCK_GAME.description}
              basePrice={MOCK_GAME.basePrice}
              discountPercent={MOCK_GAME.discountPercent}
              finalPrice={MOCK_GAME.finalPrice}
            />
          </div>
        </div>

        {/* MIDDLE SECTION 1: Acerca del juego */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Acerca del juego</h2>
          <GameMetadata
            developer={MOCK_GAME.developer}
            publisher={MOCK_GAME.publisher}
            releaseDate={MOCK_GAME.releaseDate}
            ageRating={MOCK_GAME.ageRating}
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
          <GameReviews />
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
