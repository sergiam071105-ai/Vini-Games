"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  Star,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";

import {
  approveReviewAction,
  rejectReviewAction,
} from "@/app/actions/moderation.actions";

import type { ModerationReview } from "@/types/moderation.types";

interface ReviewModerationCardProps {
  review: ModerationReview;
}

export default function ReviewModerationCard({
  review,
}: ReviewModerationCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ModerationReview["status"]>(review.status);

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [reason, setReason] = useState("");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleApprove = () => {
    setFeedback(null);

    startTransition(async () => {
      const result =
        await approveReviewAction(review.id);

      if (result.success) {
        setStatus("APPROVED");
        router.refresh();
      }

      setFeedback({
        type: result.success
          ? "success"
          : "error",
        message: result.message,
      });
    });
  };

  const handleReject = () => {
    if (!reason.trim()) {
      setFeedback({
        type: "error",
        message:
          "Debes ingresar un motivo de rechazo.",
      });

      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const result =
        await rejectReviewAction(
          review.id,
          reason
        );

      if (result.success) {
        setStatus("REJECTED");
        setShowRejectModal(false);
        setReason("");
        router.refresh();

        setFeedback({
          type: "success",
          message: result.message,
        });

        return;
      }

      setFeedback({
        type: "error",
        message: result.message,
      });
    });
  };

  const handleCloseRejectModal = () => {
    if (isPending) {
      return;
    }

    setShowRejectModal(false);
    setReason("");
    setFeedback(null);
  };

  return (
    <>
      <article className="rounded-2xl border border-[#2E334A] bg-[#1A1C2B] p-5 shadow-lg">
        <div className="flex flex-col gap-5">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#783DF2]/40 bg-[#783DF2]/10 text-sm font-bold text-[#A879FF]">
                {review.author.username
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-white">
                    @{review.author.username}
                  </p>

                  <span className="rounded-full bg-[#783DF2]/15 px-2 py-0.5 text-xs font-semibold text-[#A879FF]">
                    Nivel{" "}
                    {review.author.currentLevel}
                  </span>

                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-xs font-semibold text-[#10B981]">
                      <BadgeCheck className="h-3.5 w-3.5" />

                      Compra verificada
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-[#949CB2]">
                  {review.game.title}
                </p>
              </div>
            </div>

            <ReviewStatusBadge
              status={status}
            />
          </header>

          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {Array.from({
                length: 5,
              }).map((_, index) => {
                const active =
                  index < review.rating;

                return (
                  <Star
                    key={index}
                    className={[
                      "h-4 w-4",
                      active
                        ? "fill-[#FBBF24] text-[#FBBF24]"
                        : "text-[#4B526B]",
                    ].join(" ")}
                  />
                );
              })}

              <span className="ml-2 text-sm font-semibold text-white">
                {review.rating}/5
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {review.title}
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#C4C8D6]">
                {review.content}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-[#2E334A] pt-4">
            <div className="flex items-center gap-1.5 text-sm text-[#10B981]">
              <ThumbsUp className="h-4 w-4" />

              <span>
                {review.helpfulVotesCount}{" "}
                Helpful
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-[#EF4444]">
              <ThumbsDown className="h-4 w-4" />

              <span>
                {
                  review.unhelpfulVotesCount
                }{" "}
                Unhelpful
              </span>
            </div>

            <span className="text-xs text-[#6F758C]">
              {new Date(
                review.createdAt
              ).toLocaleDateString(
                "es-BO"
              )}
            </span>
          </div>

          {feedback &&
            !showRejectModal && (
              <div
                className={[
                  "rounded-lg border px-4 py-3 text-sm font-medium",
                  feedback.type ===
                  "success"
                    ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
                    : "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#F87171]",
                ].join(" ")}
              >
                {feedback.message}
              </div>
            )}

          <div className="flex flex-col gap-3 border-t border-[#2E334A] pt-4 sm:flex-row">
            <button
              type="button"
              disabled={
                isPending ||
                status ===
                  "APPROVED"
              }
              onClick={handleApprove}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-bold text-[#07120E] transition hover:bg-[#34D399] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle2 className="h-4 w-4" />

              {isPending
                ? "Procesando..."
                : "Aprobar reseña"}
            </button>

            <button
              type="button"
              disabled={
                isPending ||
                status ===
                  "REJECTED"
              }
              onClick={() => {
                setFeedback(null);

                setShowRejectModal(
                  true
                );
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-2.5 text-sm font-bold text-[#F87171] transition hover:bg-[#EF4444]/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <XCircle className="h-4 w-4" />

              Rechazar reseña
            </button>
          </div>
        </div>
      </article>

      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2E334A] bg-[#1A1C2B] p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">
              Rechazar reseña
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#949CB2]">
              Indica el motivo de
              rechazo. Esta información
              quedará registrada en la
              auditoría administrativa.
            </p>

            <textarea
              value={reason}
              onChange={(event) => {
                setReason(
                  event.target.value
                );

                if (feedback) {
                  setFeedback(null);
                }
              }}
              maxLength={300}
              rows={5}
              placeholder="Ejemplo: lenguaje ofensivo, contenido no relacionado..."
              className="mt-5 w-full resize-none rounded-xl border border-[#2E334A] bg-[#090B14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#5D6378] focus:border-[#783DF2]"
            />

            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-[#6F758C]">
                Mínimo 3 caracteres
              </p>

              <p className="text-xs text-[#6F758C]">
                {reason.length}/300
              </p>
            </div>

            {feedback && (
              <div
                className={[
                  "mt-4 rounded-lg border px-3 py-2 text-sm font-medium",
                  feedback.type ===
                  "success"
                    ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
                    : "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#F87171]",
                ].join(" ")}
              >
                {feedback.message}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={
                  handleCloseRejectModal
                }
                className="rounded-lg border border-[#2E334A] px-4 py-2 text-sm font-semibold text-[#C4C8D6] transition hover:bg-[#25283A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  isPending ||
                  reason.trim().length <
                    3
                }
                onClick={handleReject}
                className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? "Rechazando..."
                  : "Confirmar rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReviewStatusBadge({
  status,
}: {
  status: ModerationReview["status"];
}) {
  const styles = {
    PENDING:
      "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FBBF24]",

    APPROVED:
      "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]",

    REJECTED:
      "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#F87171]",
  };

  const labels = {
    PENDING: "Pendiente",
    APPROVED: "Aprobada",
    REJECTED: "Rechazada",
  };

  return (
    <span
      className={`self-start rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}