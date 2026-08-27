import Link from "next/link";
import { MOCK_GAMES } from "@/lib/mock-data/games";

export default function GamesPage() {
  const games = MOCK_GAMES.filter((game) => game.is_active);

  return (
    <div className="min-h-screen bg-[#080A13] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Catálogo de videojuegos</h1>

          <p className="mt-2 text-[#949CB2]">
            Explora nuestro catálogo y encuentra tu próxima aventura.
          </p>

          <p className="mt-2 text-sm text-[#1FD1EB]">
            {games.length} juegos disponibles
          </p>
        </div>

        {/* Catálogo */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => {
            const hasDiscount = game.discount_percent > 0;

            return (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group overflow-hidden rounded-xl border border-[#2D3349] bg-[#151722] transition-all hover:-translate-y-1 hover:border-[#783DF2]"
              >
                {/* Portada */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1C2B]">
                  <img
                    src={game.cover_image_url}
                    alt={`Portada de ${game.title}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Descuento */}
                  {hasDiscount && (
                    <div className="absolute left-3 top-3 rounded-md bg-[#783DF2] px-2.5 py-1 text-xs font-bold text-white">
                      -{game.discount_percent}%
                    </div>
                  )}

                  {/* Destacado */}
                  {game.is_featured && (
                    <div className="absolute right-3 top-3 rounded-md bg-[#1FD1EB] px-2.5 py-1 text-xs font-bold text-[#080A13]">
                      DESTACADO
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="p-4">
                  <h2 className="mb-2 line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-[#1FD1EB]">
                    {game.title}
                  </h2>

                  <p className="mb-3 line-clamp-2 min-h-10 text-sm text-[#949CB2]">
                    {game.short_description}
                  </p>

                  {/* Categorías */}
                  <div className="mb-4 flex min-h-6 flex-wrap gap-1.5">
                    {game.categories?.slice(0, 3).map((category) => (
                      <span
                        key={category.id}
                        className="rounded-md bg-[#1A1C2B] px-2 py-1 text-[10px] font-semibold text-[#949CB2]"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2 text-sm">
                    <span className="text-yellow-400">★</span>

                    <span className="font-semibold text-white">
                      {Number(game.rating_avg).toFixed(1)}
                    </span>

                    <span className="text-[#949CB2]">
                      ({game.rating_count})
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      {hasDiscount && (
                        <p className="text-xs text-[#949CB2] line-through">
                          Bs. {Number(game.base_price).toFixed(2)}
                        </p>
                      )}

                      <p className="text-lg font-bold text-[#1FD1EB]">
                        Bs. {Number(game.final_price).toFixed(2)}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-[#949CB2] transition-colors group-hover:text-white">
                      Ver juego →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}