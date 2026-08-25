'use client';

import { useState } from 'react';
import { Star, X, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createReviewAction } from '@/app/actions/reviews.actions';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: number;
  gameTitle: string;
  onReviewCreated?: () => void;
}

const RATING_LABELS = [
  '',
  'Malo 👎',
  'Regular 😐',
  'Bueno 👍',
  'Muy Bueno 🔥',
  '¡Excelente! 🏆',
];

export function CreateReviewModal({
  isOpen,
  onClose,
  gameId,
  gameTitle,
  onReviewCreated,
}: CreateReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rewardsEarned, setRewardsEarned] = useState<{ xp: number; gc: number } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await createReviewAction({
        gameId,
        rating,
        title,
        content,
      });

      if (!res.success) {
        setError(res.error || 'No se pudo publicar la reseña.');
      } else {
        setSuccess(true);
        setRewardsEarned({
          xp: res.xpEarned || 50,
          gc: res.gamecoinsEarned || 25,
        });
        if (onReviewCreated) {
          onReviewCreated();
        }
      }
    } catch {
      setError('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setError(null);
    setSuccess(false);
    setRewardsEarned(null);
    setTitle('');
    setContent('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B14]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#131521] border border-[#2E334A] rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#783DF2]/10 overflow-hidden">
        
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#783DF2]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-[#949CB2] hover:text-[#F5F7FF] hover:bg-[#1A1C2B] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* Vista de Éxito */
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mb-4 text-[#10B981] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F7FF] mb-2">¡Reseña Publicada con Éxito!</h3>
            <p className="text-sm text-[#949CB2] mb-6">
              Tu opinión ha sido verificada y añadida a la comunidad de <span className="text-[#1FD1EB] font-semibold">{gameTitle}</span>.
            </p>

            {rewardsEarned && (
              <div className="w-full bg-[#1A1C2B] border border-[#783DF2]/40 rounded-xl p-4 mb-6 flex justify-around items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#783DF2]" />
                  <span className="text-sm font-bold text-[#F5F7FF]">+{rewardsEarned.xp} XP</span>
                </div>
                <div className="h-6 w-px bg-[#2E334A]" />
                <div className="flex items-center gap-2">
                  <span className="text-[#1FD1EB] font-bold text-base">◈</span>
                  <span className="text-sm font-bold text-[#F5F7FF]">+{rewardsEarned.gc} GameCoins</span>
                </div>
              </div>
            )}

            <button
              onClick={handleResetAndClose}
              className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30"
            >
              Aceptar y Cerrar
            </button>
          </div>
        ) : (
          /* Formulario de Reseña */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#783DF2] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-[#1FD1EB]" />
                Reseña Verificada
              </div>
              <h2 className="text-xl font-bold text-[#F5F7FF]">
                Calificar <span className="text-[#1FD1EB]">{gameTitle}</span>
              </h2>
              <p className="text-xs text-[#949CB2] mt-1">
                Comparte tu experiencia de juego con otros miembros de la comunidad gamer.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-xl flex items-center gap-2 text-xs text-[#EF4444]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Selector de Estrellas */}
              <div>
                <label className="block text-xs font-semibold text-[#949CB2] mb-2">
                  Tu Puntuación General:
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = hoverRating ? star <= hoverRating : star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active
                                ? 'fill-[#1FD1EB] text-[#1FD1EB] drop-shadow-[0_0_8px_rgba(31,209,235,0.5)]'
                                : 'fill-transparent text-[#2E334A]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-[#F5F7FF] ml-2">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Título de la Reseña */}
              <div>
                <label htmlFor="review-title" className="block text-xs font-semibold text-[#949CB2] mb-1">
                  Título Resumen:
                </label>
                <input
                  id="review-title"
                  type="text"
                  required
                  placeholder="Ej: ¡Excelente juego, combate impecable!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1A1C2B] border border-[#2E334A] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder-[#949CB2]/60 focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/40 transition-all"
                />
              </div>

              {/* Contenido / Opinión */}
              <div>
                <label htmlFor="review-content" className="block text-xs font-semibold text-[#949CB2] mb-1">
                  Tu Opinión Detallada:
                </label>
                <textarea
                  id="review-content"
                  required
                  rows={4}
                  placeholder="Cuéntanos qué te pareció la jugabilidad, los gráficos, la historia y si lo recomiendas..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#1A1C2B] border border-[#2E334A] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder-[#949CB2]/60 focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/40 transition-all resize-none"
                />
                <div className="flex justify-between items-center text-[10px] text-[#949CB2] mt-1">
                  <span>Mínimo 10 caracteres</span>
                  <span>{content.length}/2000</span>
                </div>
              </div>

              {/* Recompensa Banner */}
              <div className="bg-[#1A1C2B]/60 border border-[#2E334A] rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#949CB2]">
                  <Sparkles className="w-4 h-4 text-[#783DF2]" />
                  <span>Recompensa al publicar:</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#F5F7FF]">
                  <span className="text-[#783DF2]">+50 XP</span>
                  <span className="text-[#1FD1EB]">+25 GC</span>
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 bg-[#1A1C2B] hover:bg-[#1A1C2B]/80 text-[#949CB2] hover:text-[#F5F7FF] font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || content.trim().length < 10 || title.trim().length < 3}
                  className="flex-1 bg-[#783DF2] hover:bg-[#6929e4] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F7FF] font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/20 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar Reseña'
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
