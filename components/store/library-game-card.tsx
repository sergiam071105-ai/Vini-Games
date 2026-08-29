'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Download, Star, Trophy, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { LibraryGameItem, installGameAction, playGameAction } from '@/app/actions/library.actions';
import { CreateReviewModal } from '@/components/store/create-review-modal';

interface LibraryGameCardProps {
  game: LibraryGameItem;
  onRefresh?: () => void;
}

export function LibraryGameCard({ game, onRefresh }: LibraryGameCardProps) {
  const [status, setStatus] = useState(game.installStatus);
  const [hours, setHours] = useState(game.hoursPlayed);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleInstall = async () => {
    setIsLoading(true);
    try {
      const res = await installGameAction(game.gameId);
      if (res.success) {
        setStatus('INSTALLED');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    setIsLoading(true);
    setIsPlayingFeedback(true);
    try {
      const res = await playGameAction(game.gameId);
      if (res.success) {
        setHours((h) => Number((h + res.hoursAdded).toFixed(1)));
        setStatus('READY_TO_PLAY');
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsPlayingFeedback(false), 3000);
    }
  };

  const achievementsPercent = Math.round(
    (game.unlockedAchievementsCount / Math.max(1, game.totalAchievementsCount)) * 100
  );

  return (
    <div className="bg-[#131521] border border-[#2E334A] hover:border-[#783DF2]/50 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg group">
      
      {/* Portada y Estado Superior */}
      <div>
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#090B14] mb-4 border border-[#2E334A]/80">
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-[#783DF2]">
              VINI GAME
            </div>
          )}

          {/* Badge de Estado en Esquina */}
          <div className="absolute top-2.5 right-2.5">
            {status === 'NOT_INSTALLED' ? (
              <span className="px-2 py-1 rounded-md bg-[#090B14]/80 backdrop-blur-md border border-[#2E334A] text-[10px] font-bold text-[#949CB2]">
                No Instalado
              </span>
            ) : (
              <span className="px-2 py-1 rounded-md bg-[#10B981]/20 backdrop-blur-md border border-[#10B981]/50 text-[10px] font-bold text-[#10B981] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Instalado
              </span>
            )}
          </div>
        </div>

        {/* Título y Desarrollador */}
        <Link
          href={`/games/${game.slug}`}
          className="text-base font-bold text-[#F5F7FF] group-hover:text-[#1FD1EB] transition-colors line-clamp-1 block mb-1"
        >
          {game.title}
        </Link>
        <span className="text-xs text-[#949CB2] block mb-3">{game.developer}</span>

        {/* Métricas: Horas y Logros */}
        <div className="bg-[#1A1C2B] rounded-xl p-3 mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#949CB2]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1FD1EB]" />
              Tiempo de juego:
            </span>
            <span className="font-bold text-[#F5F7FF]">{hours} hrs</span>
          </div>

          <div className="space-y-1 pt-1 border-t border-[#2E334A]/50">
            <div className="flex items-center justify-between text-[11px] text-[#949CB2]">
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#783DF2]" />
                Logros ({game.unlockedAchievementsCount}/{game.totalAchievementsCount})
              </span>
              <span className="font-semibold text-[#783DF2]">{achievementsPercent}%</span>
            </div>
            <div className="w-full h-1 bg-[#090B14] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] rounded-full transition-all duration-500"
                style={{ width: `${achievementsPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de Sesión de Juego */}
      {isPlayingFeedback && (
        <div className="mb-3 p-2 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-center text-xs text-[#10B981] font-bold animate-in fade-in">
          🎮 ¡Sesión de juego iniciada! (+1.5 hrs sumadas)
        </div>
      )}

      {/* Botones de Acción Inferiores */}
      <div className="flex items-center gap-2 pt-2">
        {status === 'NOT_INSTALLED' ? (
          <button
            onClick={handleInstall}
            disabled={isLoading}
            className="flex-1 bg-[#783DF2] hover:bg-[#6929e4] disabled:opacity-50 text-[#F5F7FF] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#783DF2]/20 uppercase tracking-wider cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Instalar
          </button>
        ) : (
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-90 disabled:opacity-50 text-[#F5F7FF] font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#10B981]/25 uppercase tracking-wider cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            Jugar
          </button>
        )}

        <button
          onClick={() => setIsReviewModalOpen(true)}
          className="p-2.5 bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] text-[#949CB2] hover:text-[#1FD1EB] rounded-xl transition-colors cursor-pointer"
          title="Calificar y escribir reseña"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Modal de Reseña Verificada */}
      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        gameId={game.gameId}
        gameTitle={game.title}
        onReviewCreated={() => {
          if (onRefresh) onRefresh();
        }}
      />

    </div>
  );
}
