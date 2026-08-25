'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { voteReviewAction } from '@/app/actions/reviews.actions';

interface ReviewVoteButtonsProps {
  reviewId: number;
  helpfulVotesCount: number;
  unhelpfulVotesCount: number;
  userVote?: boolean | null;
}

export function ReviewVoteButtons({
  reviewId,
  helpfulVotesCount: initialHelpful,
  unhelpfulVotesCount: initialUnhelpful,
  userVote: initialVote,
}: ReviewVoteButtonsProps) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [unhelpfulCount, setUnhelpfulCount] = useState(initialUnhelpful);
  const [currentVote, setCurrentVote] = useState<boolean | null>(initialVote ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVote = async (isHelpful: boolean) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);

    // Optimistic UI update
    const previousVote = currentVote;
    const prevHelpful = helpfulCount;
    const prevUnhelpful = unhelpfulCount;

    if (currentVote === isHelpful) {
      // Toggle off
      setCurrentVote(null);
      if (isHelpful) setHelpfulCount((c) => Math.max(0, c - 1));
      else setUnhelpfulCount((c) => Math.max(0, c - 1));
    } else {
      // Vote or change vote
      if (currentVote !== null) {
        if (currentVote) setHelpfulCount((c) => Math.max(0, c - 1));
        else setUnhelpfulCount((c) => Math.max(0, c - 1));
      }
      setCurrentVote(isHelpful);
      if (isHelpful) setHelpfulCount((c) => c + 1);
      else setUnhelpfulCount((c) => c + 1);
    }

    try {
      const res = await voteReviewAction(reviewId, isHelpful);
      if (!res.success) {
        // Rollback
        setCurrentVote(previousVote);
        setHelpfulCount(prevHelpful);
        setUnhelpfulCount(prevUnhelpful);
        setErrorMsg(res.error || 'Debes iniciar sesión para votar');
      } else {
        if (res.helpfulCount !== undefined) setHelpfulCount(res.helpfulCount);
        if (res.unhelpfulCount !== undefined) setUnhelpfulCount(res.unhelpfulCount);
        if (res.currentVote !== undefined) setCurrentVote(res.currentVote);
      }
    } catch {
      // Rollback
      setCurrentVote(previousVote);
      setHelpfulCount(prevHelpful);
      setUnhelpfulCount(prevUnhelpful);
      setErrorMsg('Error de red al votar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#949CB2] mr-1 hidden sm:inline">¿Te resultó útil?</span>
        
        {/* Botón Útil */}
        <button
          onClick={() => handleVote(true)}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            currentVote === true
              ? 'bg-[#1FD1EB]/10 border-[#1FD1EB] text-[#1FD1EB] shadow-[0_0_8px_rgba(31,209,235,0.3)]'
              : 'bg-[#1A1C2B] border-[#2E334A] text-[#949CB2] hover:text-[#F5F7FF] hover:border-[#1FD1EB]/50'
          }`}
          title="Marcar como reseña útil"
        >
          {isLoading && currentVote === true ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ThumbsUp className={`w-3.5 h-3.5 ${currentVote === true ? 'fill-[#1FD1EB]' : ''}`} />
          )}
          <span>{helpfulCount}</span>
        </button>

        {/* Botón No Útil */}
        <button
          onClick={() => handleVote(false)}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            currentVote === false
              ? 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.3)]'
              : 'bg-[#1A1C2B] border-[#2E334A] text-[#949CB2] hover:text-[#F5F7FF] hover:border-[#EF4444]/50'
          }`}
          title="Marcar como reseña no útil"
        >
          {isLoading && currentVote === false ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ThumbsDown className={`w-3.5 h-3.5 ${currentVote === false ? 'fill-[#EF4444]' : ''}`} />
          )}
          <span>{unhelpfulCount}</span>
        </button>
      </div>

      {errorMsg && (
        <span className="text-[10px] text-[#EF4444] animate-in fade-in">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
