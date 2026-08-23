import { createClient } from "@/lib/supabase/server";

// Página temporal para verificar los slugs disponibles en la base de datos
export default async function TestGamesPage() {
  const supabase = await createClient();

  const { data: games, error } = await supabase
    .from("games")
    .select("id, title, slug, is_active")
    .order("id", { ascending: true });

  if (error) {
    return (
      <div className="p-8 text-red-400">
        <h1 className="text-2xl font-bold mb-4">Error al consultar la base de datos</h1>
        <pre className="bg-zinc-900 p-4 rounded">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Juegos disponibles en Supabase ({games?.length ?? 0})
      </h1>
      {games && games.length > 0 ? (
        <ul className="space-y-2">
          {games.map((game) => (
            <li key={game.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
              <a
                href={`/games/${game.slug}`}
                className="text-purple-400 hover:text-purple-300 font-semibold text-lg"
              >
                {game.title}
              </a>
              <span className="text-zinc-500 ml-3 text-sm">
                slug: <code className="text-cyan-400">{game.slug}</code>
              </span>
              <span className={`ml-3 text-xs ${game.is_active ? "text-emerald-400" : "text-red-400"}`}>
                {game.is_active ? "● Activo" : "● Inactivo"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-400">
          No hay juegos en la base de datos aún. Necesitamos cargar datos de prueba (Seed Data).
        </p>
      )}
    </div>
  );
}
