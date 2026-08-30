'use client';

import { useState, useEffect } from 'react';
import { Star, ShieldCheck, Sparkles, User, ShoppingBag, LogIn } from 'lucide-react';
import Link from 'next/link';
import { ReviewItem } from '@/types/review.types';
import { getGameReviewsAction, checkUserCanReviewAction } from '@/app/actions/reviews.actions';
import { CreateReviewModal } from '@/components/store/create-review-modal';
import { ReviewVoteButtons } from '@/components/store/review-vote-buttons';

interface GameReviewsProps {
  gameId?: number;
  gameTitle?: string;
}

export function GameReviews({ gameId = 1, gameTitle = 'Cyberpunk 2077: Phantom Liberty' }: GameReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState({
    ratingAvg: 4.8,
    ratingCount: 1284,
    recommendedPercent: 92,
  });
  const [canReviewState, setCanReviewState] = useState<{
    isAuthenticated: boolean;
    isPurchased: boolean;
    canReview: boolean;
    hasExistingReview: boolean;
  }>({
    isAuthenticated: false,
    isPurchased: false,
    canReview: false,
    hasExistingReview: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviewsAndStatus = async () => {
    setIsLoading(true);
    try {
      const [reviewsData, statusData] = await Promise.all([
        getGameReviewsAction(gameId),
        checkUserCanReviewAction(gameId),
      ]);

      setReviews(reviewsData.reviews);
      setStats(reviewsData.stats);
      setCanReviewState(statusData);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsAndStatus();
  }, [gameId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Caja Izquierda: Score y Métricas */}
      <div className="lg:col-span-3 bg-[#131521] border border-[#2E334A] rounded-2xl p-6 flex flex-col justify-center shadow-lg shadow-black/20">
        <div className="text-[3.5rem] font-extrabold text-[#F5F7FF] leading-none mb-3">
          {stats.ratingAvg.toFixed(1)}
        </div>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(stats.ratingAvg)
                  ? 'fill-[#1FD1EB] text-[#1FD1EB] drop-shadow-[0_0_6px_rgba(31,209,235,0.4)]'
                  : 'fill-transparent text-[#2E334A]'
              }`}
            />
          ))}
        </div>
        <div className="text-[#F5F7FF] font-bold text-sm mb-1">
          {stats.ratingAvg >= 4.5
            ? '¡Excelente!'
            : stats.ratingAvg >= 4.0
            ? 'Muy Bueno'
            : stats.ratingAvg >= 3.0
            ? 'Favorable'
            : 'Mixto'}
        </div>
        <div className="text-[#949CB2] text-xs">
          {stats.recommendedPercent}% lo recomienda ({stats.ratingCount} valoraciones)
        </div>

        {/* Mini barra de satisfacción */}
        <div className="w-full h-1.5 bg-[#1A1C2B] rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] rounded-full"
            style={{ width: `${stats.recommendedPercent}%` }}
          />
        </div>
      </div>

      {/* Medio: Feed de Reseñas */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#783DF2] mb-2 opacity-80" />
            <p className="text-sm font-semibold text-[#F5F7FF] mb-1">Aún no hay reseñas para este juego</p>
            <p className="text-xs text-[#949CB2]">Sé el primer gamer en compartir tu experiencia verificada.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#131521] border border-[#2E334A] hover:border-[#783DF2]/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-md"
            >
              {/* Header de Reseña: Autor, Badge Verificado, Estrellas */}
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#783DF2] flex items-center justify-center text-xs font-bold text-[#F5F7FF] flex-shrink-0">
                    {review.author.username?.substring(0, 2).toUpperCase() || 'G'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F5F7FF]">@{review.author.username}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1C2B] text-[#783DF2] font-semibold">
                        LVL {review.author.currentLevel}
                      </span>
                    </div>
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10B981]">
                        <ShieldCheck className="w-3 h-3" />
                        Compra Verificada
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? 'fill-[#1FD1EB] text-[#1FD1EB]'
                          : 'fill-transparent text-[#2E334A]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Título y Contenido */}
              {review.title && (
                <h4 className="text-sm font-bold text-[#F5F7FF] mb-1.5">
                  "{review.title}"
                </h4>
              )}
              <p className="text-xs text-[#949CB2] leading-relaxed mb-4">
                {review.content}
              </p>

              {/* Footer con fecha y votación comunitaria */}
              <div className="flex justify-between items-center pt-2 border-t border-[#1A1C2B]">
                <span className="text-[10px] text-[#949CB2]/60">
                  {new Date(review.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <ReviewVoteButtons
                  reviewId={review.id}
                  helpfulVotesCount={review.helpfulVotesCount}
                  unhelpfulVotesCount={review.unhelpfulVotesCount}
                  userVote={review.userVote}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Caja Derecha: CTA Escribir Reseña */}
      <div className="lg:col-span-3 bg-[#131521] border border-[#2E334A] rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-black/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#783DF2] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#1FD1EB]" />
            Comunidad Gamer
          </div>
          <h3 className="text-[#F5F7FF] font-bold text-base mb-2">¿Ya jugaste {gameTitle}?</h3>
          <p className="text-[#949CB2] text-xs leading-relaxed mb-4">
            {canReviewState.hasExistingReview
              ? 'Ya has dejado tu reseña para este videojuego. ¡Gracias por contribuir a la comunidad!'
              : canReviewState.canReview
              ? 'Comparte tu opinión con otros jugadores y gana +50 XP y +25 GameCoins automáticamente.'
              : !canReviewState.isAuthenticated
              ? 'Inicia sesión con tu cuenta para calificar y dejar tu opinión de este videojuego.'
              : 'Solo los usuarios que hayan adquirido este videojuego en su biblioteca pueden redactar una reseña verificada.'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1A1C2B]">
          {canReviewState.hasExistingReview ? (
            <div className="w-full bg-[#10B981]/10 border border-[#10B981]/40 text-[#10B981] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Reseña Registrada
            </div>
          ) : canReviewState.canReview ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-white" />
              Escribir Reseña
            </button>
          ) : !canReviewState.isAuthenticated ? (
            <Link
              href="/login"
              className="w-full bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] text-[#F5F7FF] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-4 h-4 text-[#1FD1EB]" />
              Iniciar Sesión
            </Link>
          ) : (
            <Link
              href="/catalog"
              className="w-full bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] text-[#949CB2] hover:text-[#F5F7FF] font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#783DF2]" />
              Comprar Videojuego
            </Link>
          )}
        </div>
      </div>

      {/* Modal de Creación de Reseña */}
      <CreateReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameId={gameId}
        gameTitle={gameTitle}
        onReviewCreated={() => {
          fetchReviewsAndStatus();
        }}
      />

    </div>
  );
}
