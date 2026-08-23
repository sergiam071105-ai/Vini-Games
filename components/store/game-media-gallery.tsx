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
    <div className="flex flex-col gap-3">
      {/* Reproductor / Visor Principal */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-[#2E334A]">
        {activeMedia.type === "video" ? (
          <iframe
            src={
              activeMedia.url.includes("youtube.com/watch")
                ? activeMedia.url.replace("watch?v=", "embed/")
                : activeMedia.url
            }
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <img
            src={activeMedia.url}
            alt="Media principal del juego"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Carrusel de miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* Miniatura del Trailer */}
        {trailerUrl && (
          <button
            onClick={() => setActiveMedia({ url: trailerUrl, type: "video" })}
            className={cn(
              "relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
              activeMedia.url === trailerUrl
                ? "border-[#783DF2] ring-2 ring-[#783DF2]/30"
                : "border-transparent opacity-50 hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Play className="h-7 w-7 text-white" />
            </div>
            <img src={coverUrl} alt="Trailer" className="w-full h-full object-cover" />
          </button>
        )}

        {/* Miniatura de la portada */}
        <button
          onClick={() => setActiveMedia({ url: coverUrl, type: "image" })}
          className={cn(
            "relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
            activeMedia.url === coverUrl && activeMedia.type === "image"
              ? "border-[#783DF2] ring-2 ring-[#783DF2]/30"
              : "border-transparent opacity-50 hover:opacity-100"
          )}
        >
          <img src={coverUrl} alt="Portada" className="w-full h-full object-cover" />
        </button>

        {/* Miniaturas de la galería */}
        {gallery.map((media) => (
          <button
            key={media.id}
            onClick={() => setActiveMedia({ url: media.media_url, type: media.media_type })}
            className={cn(
              "relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
              activeMedia.url === media.media_url
                ? "border-[#783DF2] ring-2 ring-[#783DF2]/30"
                : "border-transparent opacity-50 hover:opacity-100"
            )}
          >
            {media.media_type === "video" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Play className="h-5 w-5 text-white" />
              </div>
            )}
            <img
              src={media.media_url}
              alt="Captura de pantalla"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
