"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";
import type {
  ModerationActionResult,
  ReviewStatus,
} from "@/types/moderation.types";

const reviewIdSchema = z.number().int().positive();

const rejectionReasonSchema = z
  .string()
  .trim()
  .min(3, "El motivo debe tener al menos 3 caracteres.")
  .max(300, "El motivo no puede superar los 300 caracteres.");

/**
 * Estados temporales para reseñas demo/mock.
 * También permiten reflejar inmediatamente la moderación
 * en la ficha pública durante la sesión.
 */
const getOverridesMap = (): Map<
  number,
  ReviewStatus
> => {
  if (!(globalThis as any).REVIEW_STATUS_OVERRIDES) {
    (globalThis as any).REVIEW_STATUS_OVERRIDES =
      new Map<number, ReviewStatus>();
  }

  return (globalThis as any)
    .REVIEW_STATUS_OVERRIDES;
};

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Debes iniciar sesión como administrador."
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error(
      "No se pudo verificar el perfil del administrador."
    );
  }

  if (profile.role !== "ADMIN") {
    throw new Error(
      "No tienes permisos de administrador para realizar acciones de moderación."
    );
  }

  return {
    supabase,
    adminId: user.id,
  };
}

/**
 * Comprueba si la reseña existe realmente en Supabase.
 */
async function getDatabaseReview(
  reviewId: number
): Promise<{
  exists: boolean;
  status: ReviewStatus;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("id, status")
    .eq("id", reviewId)
    .maybeSingle();

  if (error) {
    console.error(
      "Error consultando reseña:",
      error
    );

    throw new Error(
      "No se pudo consultar la reseña."
    );
  }

  if (!data) {
    return {
      exists: false,
      status: "PENDING",
    };
  }

  return {
    exists: true,
    status: data.status as ReviewStatus,
  };
}

async function registerAuditLog({
  adminId,
  actionType,
  reviewId,
  details,
}: {
  adminId: string;
  actionType:
    | "REVIEW_APPROVED"
    | "REVIEW_REJECTED";
  reviewId: number;
  details: Json;
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("admin_audit_logs")
      .insert({
        admin_id: adminId,
        action_type: actionType,
        entity_name: "reviews",
        entity_id: String(reviewId),
        details,
      });

    if (error) {
      console.warn(
        "Advertencia de auditoría (RLS):",
        error.message
      );
    }
  } catch (error) {
    console.warn(
      "Error no bloqueante al registrar auditoría:",
      error
    );
  }
}

function revalidateReviewPages() {
  revalidatePath("/admin/reviews");
  revalidatePath("/games");
  revalidatePath("/catalog");

  // También refresca las fichas dinámicas /games/[slug].
  revalidatePath("/games/[slug]", "page");
}

export async function approveReviewAction(
  reviewId: number
): Promise<ModerationActionResult> {
  try {
    const validReviewId =
      reviewIdSchema.parse(reviewId);

    const { supabase, adminId } =
      await requireAdmin();

    const databaseReview =
      await getDatabaseReview(validReviewId);

    const overrides = getOverridesMap();

    const previousStatus = databaseReview.exists
      ? databaseReview.status
      : overrides.get(validReviewId) ??
        "PENDING";

    if (previousStatus === "APPROVED") {
      return {
        success: false,
        message: "La reseña ya está aprobada.",
      };
    }

    /*
     * RESEÑA REAL DE SUPABASE
     */
    if (databaseReview.exists) {
      const { error: updateError } =
        await supabase
          .from("reviews")
          .update({
            status: "APPROVED",
          })
          .eq("id", validReviewId);

      if (updateError) {
        console.error(
          "Error aprobando reseña:",
          updateError
        );

        return {
          success: false,
          message:
            "No se pudo aprobar la reseña en la base de datos.",
        };
      }

      // Verificar que realmente cambió.
      const {
        data: verifiedReview,
        error: verificationError,
      } = await supabase
        .from("reviews")
        .select("status")
        .eq("id", validReviewId)
        .maybeSingle();

      if (
        verificationError ||
        !verifiedReview ||
        verifiedReview.status !== "APPROVED"
      ) {
        console.error(
          "No se pudo verificar la aprobación:",
          verificationError
        );

        return {
          success: false,
          message:
            "No se pudo verificar que la reseña haya sido aprobada.",
        };
      }
    }

    /*
     * Una vez confirmado el cambio real, o si es una
     * reseña demo, actualizamos el estado temporal.
     */
    overrides.set(validReviewId, "APPROVED");

    await registerAuditLog({
      adminId,
      actionType: "REVIEW_APPROVED",
      reviewId: validReviewId,
      details: {
        previous_status: previousStatus,
        new_status: "APPROVED",
        source: databaseReview.exists
          ? "database"
          : "demo",
      },
    });

    revalidateReviewPages();

    return {
      success: true,
      message: "Reseña aprobada correctamente.",
    };
  } catch (error) {
    console.error(
      "APPROVE REVIEW ACTION ERROR:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
    };
  }
}

export async function rejectReviewAction(
  reviewId: number,
  reason: string
): Promise<ModerationActionResult> {
  try {
    const validReviewId =
      reviewIdSchema.parse(reviewId);

    const validReason =
      rejectionReasonSchema.parse(reason);

    const { supabase, adminId } =
      await requireAdmin();

    const databaseReview =
      await getDatabaseReview(validReviewId);

    const overrides = getOverridesMap();

    const previousStatus = databaseReview.exists
      ? databaseReview.status
      : overrides.get(validReviewId) ??
        "PENDING";

    if (previousStatus === "REJECTED") {
      return {
        success: false,
        message: "La reseña ya está rechazada.",
      };
    }

    /*
     * RESEÑA REAL DE SUPABASE
     */
    if (databaseReview.exists) {
      const { error: updateError } =
        await supabase
          .from("reviews")
          .update({
            status: "REJECTED",
          })
          .eq("id", validReviewId);

      if (updateError) {
        console.error(
          "Error rechazando reseña:",
          updateError
        );

        return {
          success: false,
          message:
            "No se pudo rechazar la reseña en la base de datos.",
        };
      }

      // Verificar que realmente quedó REJECTED.
      const {
        data: verifiedReview,
        error: verificationError,
      } = await supabase
        .from("reviews")
        .select("status")
        .eq("id", validReviewId)
        .maybeSingle();

      if (
        verificationError ||
        !verifiedReview ||
        verifiedReview.status !== "REJECTED"
      ) {
        console.error(
          "No se pudo verificar el rechazo:",
          verificationError
        );

        return {
          success: false,
          message:
            "No se pudo verificar que la reseña haya sido rechazada.",
        };
      }
    }

    /*
     * Solo guardamos el override después de confirmar
     * el cambio real. Para mocks actúa como persistencia demo.
     */
    overrides.set(validReviewId, "REJECTED");

    await registerAuditLog({
      adminId,
      actionType: "REVIEW_REJECTED",
      reviewId: validReviewId,
      details: {
        previous_status: previousStatus,
        new_status: "REJECTED",
        reason: validReason,
        source: databaseReview.exists
          ? "database"
          : "demo",
      },
    });

    revalidateReviewPages();

    return {
      success: true,
      message: "Reseña rechazada correctamente.",
    };
  } catch (error) {
    console.error(
      "REJECT REVIEW ACTION ERROR:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
    };
  }
}