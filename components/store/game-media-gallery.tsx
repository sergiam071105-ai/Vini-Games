"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Media {
  id: number;
  media_type: string;
  media_url: string;
}

interface GameMediaGalleryProps {
  coverUrl: string;
  trailerUrl: string | null;
  gallery: Media[];
}

export function GameMediaGallery({ coverUrl, trailerUrl, gallery }: GameMediaGalleryProps) {
  const initialMedia = trailerUrl 
    ? { url: trailerUrl, type: "video" } 
    : { url: coverUrl, type: "image" };

  const [activeMedia, setActiveMedia] = useState(initialMedia);

  return (
    <div className="flex flex-col gap-4">
      {/* Reproductor / Visor Principal */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800">
        {activeMedia.type === "video" ? (
          <iframe
            src={activeMedia.url.includes("youtube") ? activeMedia.url.replace("watch?v=", "embed/") : activeMedia.url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <Image
            src={activeMedia.url}
            alt="Media principal"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Carrusel de miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {trailerUrl && (
          <button
            onClick={() => setActiveMedia({ url: trailerUrl, type: "video" })}
            className={cn(
              "relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
              activeMedia.url === trailerUrl ? "border-purple-600 ring-2 ring-purple-600/20" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <Play className="h-8 w-8 text-white opacity-80" />
            </div>
            <Image src={coverUrl} alt="Trailer" fill className="object-cover" />
          </button>
        )}

        <button
          onClick={() => setActiveMedia({ url: coverUrl, type: "image" })}
          className={cn(
            "relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
            activeMedia.url === coverUrl ? "border-purple-600 ring-2 ring-purple-600/20" : "border-transparent opacity-60 hover:opacity-100"
          )}
        >
          <Image src={coverUrl} alt="Cover" fill className="object-cover" />
        </button>

        {gallery.map((media) => (
          <button
            key={media.id}
            onClick={() => setActiveMedia({ url: media.media_url, type: media.media_type })}
            className={cn(
              "relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
              activeMedia.url === media.media_url ? "border-purple-600 ring-2 ring-purple-600/20" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            {media.media_type === "video" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <Play className="h-6 w-6 text-white" />
              </div>
            )}
            <Image src={media.media_type === "image" ? media.media_url : coverUrl} alt="Gallery item" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
