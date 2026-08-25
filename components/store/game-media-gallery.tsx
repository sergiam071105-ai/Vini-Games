"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, RefreshCw, Film, Volume2 } from "lucide-react";
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

// Video de gameplay cyberpunk de respaldo garantizado en formato HTML5 de alta disponibilidad
const DEFAULT_GAMEPLAY_TRAILER = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

function parseVideoSource(url: string | null) {
  if (!url) {
    return {
      isYouTube: false,
      isDirect: true,
      embedUrl: DEFAULT_GAMEPLAY_TRAILER,
      rawUrl: DEFAULT_GAMEPLAY_TRAILER,
    };
  }

  const trimmed = url.trim();

  // YouTube Parser
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    return {
      isYouTube: true,
      isDirect: false,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
      rawUrl: trimmed,
    };
  }

  // Vimeo Parser
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isYouTube: false,
      isDirect: false,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      rawUrl: trimmed,
    };
  }

  // HTML5 Direct Video (.mp4, .webm, .ogg o CDN)
  return {
    isYouTube: false,
    isDirect: true,
    embedUrl: trimmed,
    rawUrl: trimmed,
  };
}

export function GameMediaGallery({ coverUrl, trailerUrl, gallery }: GameMediaGalleryProps) {
  const effectiveTrailer = trailerUrl || DEFAULT_GAMEPLAY_TRAILER;

  const [activeType, setActiveType] = useState<"video" | "image">("video");
  const [activeImageUrl, setActiveImageUrl] = useState<string>(coverUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const videoMeta = parseVideoSource(effectiveTrailer);

  const handleSelectThumbnail = (mediaUrl: string, type: "video" | "image") => {
    if (type === "video") {
      setActiveType("video");
      setIsPlaying(true);
      setHasVideoError(false);
    } else {
      setActiveType("image");
      setActiveImageUrl(mediaUrl);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Reproductor / Visor Principal */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#090B14] border border-[#2E334A] shadow-2xl">
        {activeType === "video" ? (
          !isPlaying ? (
            /* Poster interactivo con botón Play antes de reproducir */
            <div className="relative w-full h-full group">
              <img
                src={coverUrl}
                alt="Portada del videojuego"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-[#090B14]/40 to-transparent flex flex-col items-center justify-center p-6">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-[#783DF2] hover:bg-[#6929e4] text-white flex items-center justify-center shadow-[0_0_30px_rgba(120,61,242,0.7)] hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
                  title="Reproducir tráiler"
                >
                  <Play className="w-9 h-9 fill-white ml-1.5 transition-transform group-hover/btn:scale-110" />
                </button>
                <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#090B14]/80 border border-[#2E334A] text-xs font-bold text-[#1FD1EB] backdrop-blur-md">
                  <Film className="w-3.5 h-3.5" />
                  VER TRÁILER OFICIAL
                </div>
              </div>
            </div>
          ) : hasVideoError ? (
            /* Fallback en caso de bloqueo de embed por YouTube/Red */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090B14] text-[#F5F7FF]">
              <div className="w-16 h-16 rounded-full bg-[#1A1C2B] border border-[#2E334A] flex items-center justify-center mb-3 text-[#783DF2]">
                <Film className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold mb-1">Tráiler Oficial</h4>
              <p className="text-xs text-[#949CB2] max-w-sm mb-4 leading-relaxed">
                El navegador bloqueó la incrustación automática. Puedes ver el video en alta definición en una pestaña nueva o reintentar la reproducción.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={videoMeta.rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-[#783DF2]/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir Video
                </a>
                <button
                  type="button"
                  onClick={() => setHasVideoError(false)}
                  className="px-4 py-2 bg-[#1A1C2B] hover:bg-[#25283d] text-[#949CB2] hover:text-[#F5F7FF] rounded-xl text-xs font-semibold border border-[#2E334A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reintentar
                </button>
              </div>
            </div>
          ) : videoMeta.isDirect ? (
            <video
              src={videoMeta.embedUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onError={() => setHasVideoError(true)}
            />
          ) : (
            <iframe
              src={videoMeta.embedUrl}
              title="Tráiler oficial de videojuego"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setHasVideoError(true)}
            />
          )
        ) : (
          <img
            src={activeImageUrl}
            alt="Captura del juego"
            className="w-full h-full object-cover animate-in fade-in duration-300"
          />
        )}
      </div>

      {/* Carrusel de miniaturas */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {/* Miniatura del Trailer */}
        <button
          type="button"
          onClick={() => handleSelectThumbnail(effectiveTrailer, "video")}
          className={cn(
            "relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer group",
            activeType === "video"
              ? "border-[#783DF2] ring-2 ring-[#783DF2]/40 shadow-lg shadow-[#783DF2]/20 opacity-100"
              : "border-[#2E334A] opacity-60 hover:opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-[#090B14]/60 group-hover:bg-[#090B14]/30 flex items-center justify-center z-10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#783DF2]/90 flex items-center justify-center text-white shadow-md">
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </div>
          </div>
          <img src={coverUrl} alt="Trailer" className="w-full h-full object-cover" />
        </button>

        {/* Miniatura de la portada */}
        <button
          type="button"
          onClick={() => handleSelectThumbnail(coverUrl, "image")}
          className={cn(
            "relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer",
            activeType === "image" && activeImageUrl === coverUrl
              ? "border-[#783DF2] ring-2 ring-[#783DF2]/40 shadow-lg shadow-[#783DF2]/20 opacity-100"
              : "border-[#2E334A] opacity-60 hover:opacity-100"
          )}
        >
          <img src={coverUrl} alt="Portada" className="w-full h-full object-cover" />
        </button>

        {/* Miniaturas de la galería */}
        {gallery.map((media) => (
          <button
            key={media.id}
            type="button"
            onClick={() => handleSelectThumbnail(media.media_url, media.media_type as any)}
            className={cn(
              "relative h-[72px] w-[128px] flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer group",
              activeType === "image" && activeImageUrl === media.media_url
                ? "border-[#783DF2] ring-2 ring-[#783DF2]/40 shadow-lg shadow-[#783DF2]/20 opacity-100"
                : "border-[#2E334A] opacity-60 hover:opacity-100"
            )}
          >
            {media.media_type === "video" && (
              <div className="absolute inset-0 bg-[#090B14]/60 group-hover:bg-[#090B14]/30 flex items-center justify-center z-10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#783DF2]/90 flex items-center justify-center text-white">
                  <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                </div>
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
