interface GameMetadataProps {
  developer: string;
  publisher: string | null;
  releaseDate: string;
  ageRating: string | null;
}

export function GameMetadata({
  developer,
  publisher,
  releaseDate,
  ageRating,
}: GameMetadataProps) {
  const formattedDate = new Date(releaseDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[#151722] p-5 rounded-xl border border-transparent">
        <span className="text-zinc-500 text-xs font-semibold block mb-1">Desarrollador</span>
        <span className="text-white font-medium text-sm">{developer}</span>
      </div>
      
      <div className="bg-[#151722] p-5 rounded-xl border border-transparent">
        <span className="text-zinc-500 text-xs font-semibold block mb-1">Lanzamiento</span>
        <span className="text-white font-medium text-sm">{formattedDate}</span>
      </div>

      <div className="bg-[#151722] p-5 rounded-xl border border-transparent">
        <span className="text-zinc-500 text-xs font-semibold block mb-1">Plataforma</span>
        <span className="text-white font-medium text-sm">PC</span>
      </div>

      <div className="bg-[#151722] p-5 rounded-xl border border-transparent">
        <span className="text-zinc-500 text-xs font-semibold block mb-1">Clasificación</span>
        <span className="text-white font-medium text-sm">{ageRating || "+13"}</span>
      </div>
    </div>
  );
}
