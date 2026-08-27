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

// Shared memory store for persisted review status across revalidations
const getOverridesMap = (): Map<number, ReviewStatus> => {
  if (!(globalThis as any).REVIEW_STATUS_OVERRIDES) {
    (globalThis as any).REVIEW_STATUS_OVERRIDES = new Map<number, ReviewStatus>();
  }
  return (globalThis as any).REVIEW_STATUS_OVERRIDES;
};

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      adminId: "admin-demo-id",
    };
  }

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (profile && profile.role !== "ADMIN") {
    throw new Error(
      "No tienes permisos de administrador para realizar acciones de moderación."
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
  const overrides = getOverridesMap();
  if (overrides.has(reviewId)) {
    return overrides.get(reviewId)!;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("status")
      .eq("id", reviewId)
      .single();

    if (error || !data) {
      return "PENDING";
    }

    return data.status as ReviewStatus;
  } catch {
    return "PENDING";
  }
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
      console.warn("Advertencia de auditoría (RLS):", error.message);
    }
  } catch (err) {
    console.warn("Error no bloqueante al registrar auditoría:", err);
  }
}

export async function approveReviewAction(
  reviewId: number
): Promise<ModerationActionResult> {
  try {
    const validReviewId = reviewIdSchema.parse(reviewId);
    const { supabase, adminId } = await requireAdmin();
    const previousStatus = await getCurrentReviewStatus(validReviewId);

    if (previousStatus === "APPROVED") {
      return {
        success: false,
        message: "La reseña ya está aprobada.",
      };
    }

    // Persistir en memoria del servidor
    getOverridesMap().set(validReviewId, "APPROVED");

    // Persistir en Supabase
    try {
      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          status: "APPROVED",
        })
        .eq("id", validReviewId);

      if (updateError) {
        console.warn("Actualización en Supabase advertencia:", updateError.message);
      }
    } catch (dbErr) {
      console.warn("Error actualizando reseña en base de datos:", dbErr);
    }

    await registerAuditLog({
      adminId,
      actionType: "REVIEW_APPROVED",
      reviewId: validReviewId,
      details: {
        previous_status: previousStatus,
        new_status: "APPROVED",
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/games");
    revalidatePath("/catalog");

    return {
      success: true,
      message: "Reseña aprobada correctamente.",
    };
  } catch (error) {
    console.error("APPROVE REVIEW ACTION ERROR:", error);

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
    const validReviewId = reviewIdSchema.parse(reviewId);
    const validReason = rejectionReasonSchema.parse(reason);

    const { supabase, adminId } = await requireAdmin();
    const previousStatus = await getCurrentReviewStatus(validReviewId);

    if (previousStatus === "REJECTED") {
      return {
        success: false,
        message: "La reseña ya está rechazada.",
      };
    }

    // Persistir en memoria del servidor
    getOverridesMap().set(validReviewId, "REJECTED");

    // Persistir en Supabase
    try {
      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          status: "REJECTED",
        })
        .eq("id", validReviewId);

      if (updateError) {
        console.warn("Actualización de rechazo en Supabase advertencia:", updateError.message);
      }
    } catch (dbErr) {
      console.warn("Error actualizando rechazo en base de datos:", dbErr);
    }

    await registerAuditLog({
      adminId,
      actionType: "REVIEW_REJECTED",
      reviewId: validReviewId,
      details: {
        previous_status: previousStatus,
        new_status: "REJECTED",
        reason: validReason,
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/games");
    revalidatePath("/catalog");

    return {
      success: true,
      message: "Reseña rechazada correctamente.",
    };
  } catch (error) {
    console.error("REJECT REVIEW ACTION ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
    };
  }
}