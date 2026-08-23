import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameMetadataProps {
  developer: string;
  publisher: string | null;
  releaseDate: string;
  ageRating: string | null;
  categories: { id: number; name: string }[];
}

export function GameMetadata({
  developer,
  publisher,
  releaseDate,
  ageRating,
  categories,
}: GameMetadataProps) {
  const formattedDate = new Date(releaseDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Ficha Técnica</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
        <div className="flex flex-col">
          <span className="text-zinc-500 uppercase text-xs font-semibold tracking-wider">Desarrollador</span>
          <span className="text-foreground">{developer}</span>
        </div>

        {publisher && (
          <div className="flex flex-col">
            <span className="text-zinc-500 uppercase text-xs font-semibold tracking-wider">Editor</span>
            <span className="text-foreground">{publisher}</span>
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-zinc-500 uppercase text-xs font-semibold tracking-wider">Fecha de lanzamiento</span>
          <span className="text-foreground">{formattedDate}</span>
        </div>

        {ageRating && (
          <div className="flex flex-col">
            <span className="text-zinc-500 uppercase text-xs font-semibold tracking-wider">Clasificación</span>
            <span className="text-foreground font-mono bg-zinc-800 w-fit px-2 py-0.5 rounded mt-1">{ageRating}</span>
          </div>
        )}

        <div className="col-span-2 mt-2">
          <span className="text-zinc-500 uppercase text-xs font-semibold tracking-wider block mb-2">Géneros</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge key={cat.id} variant="outline" className="border-zinc-700 text-zinc-300">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
