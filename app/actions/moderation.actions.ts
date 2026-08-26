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

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Debes iniciar sesión.");
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error(
      "No se pudo verificar el perfil."
    );
  }

  if (profile.role !== "ADMIN") {
    throw new Error(
      "No tienes permisos para realizar acciones de moderación."
    );
  }

  return {
    supabase,
    adminId: user.id,
  };
}

async function getCurrentReviewStatus(
  reviewId: number
): Promise<ReviewStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("status")
    .eq("id", reviewId)
    .single();

  if (error || !data) {
    throw new Error(
      "No se encontró la reseña."
    );
  }

  return data.status;
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
    console.error(
      "AUDIT LOG ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      `No se pudo registrar la auditoría: ${error.message}`
    );
  }
}

export async function approveReviewAction(
  reviewId: number
): Promise<ModerationActionResult> {
  try {
    const validReviewId =
      reviewIdSchema.parse(reviewId);

    const { supabase, adminId } =
      await requireAdmin();

    const previousStatus =
      await getCurrentReviewStatus(
        validReviewId
      );

    if (
      previousStatus === "APPROVED"
    ) {
      return {
        success: false,
        message:
          "La reseña ya está aprobada.",
      };
    }

    const { error: updateError } =
      await supabase
        .from("reviews")
        .update({
          status: "APPROVED",
        })
        .eq("id", validReviewId);

    if (updateError) {
      console.error(
        "REVIEW APPROVE ERROR:",
        updateError
      );

      throw new Error(
        "No se pudo aprobar la reseña."
      );
    }

    await registerAuditLog({
      adminId,
      actionType: "REVIEW_APPROVED",
      reviewId: validReviewId,
      details: {
        previous_status:
          previousStatus,
        new_status: "APPROVED",
      },
    });

    revalidatePath(
      "/admin/reviews"
    );

    return {
      success: true,
      message:
        "Reseña aprobada correctamente.",
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
      rejectionReasonSchema.parse(
        reason
      );

    const { supabase, adminId } =
      await requireAdmin();

    const previousStatus =
      await getCurrentReviewStatus(
        validReviewId
      );

    if (
      previousStatus === "REJECTED"
    ) {
      return {
        success: false,
        message:
          "La reseña ya está rechazada.",
      };
    }

    const { error: updateError } =
      await supabase
        .from("reviews")
        .update({
          status: "REJECTED",
        })
        .eq("id", validReviewId);

    if (updateError) {
      console.error(
        "REVIEW REJECT ERROR:",
        updateError
      );

      throw new Error(
        "No se pudo rechazar la reseña."
      );
    }

    await registerAuditLog({
      adminId,
      actionType: "REVIEW_REJECTED",
      reviewId: validReviewId,
      details: {
        previous_status:
          previousStatus,
        new_status: "REJECTED",
        reason: validReason,
      },
    });

    revalidatePath(
      "/admin/reviews"
    );

    return {
      success: true,
      message:
        "Reseña rechazada correctamente.",
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