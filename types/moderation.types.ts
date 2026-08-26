import type { Database } from "@/types/database.types";

/**
 * Estados reales disponibles actualmente
 * en la tabla reviews de Supabase.
 */
export type ReviewStatus =
  Database["public"]["Enums"]["review_status_type"];

/**
 * Rol utilizado para proteger las acciones administrativas.
 */
export type UserRole =
  Database["public"]["Enums"]["user_role"];

/**
 * Arquetipos utilizados para representar
 * la distribución Gamer DNA de la comunidad.
 */
export type GamerDnaArchetype =
  | "explorer"
  | "competitive"
  | "narrative"
  | "collector";

/**
 * Información resumida del usuario que
 * creó una reseña.
 */
export interface ModerationAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
  currentLevel: number;
}

/**
 * Información básica del videojuego asociado
 * a una reseña.
 */
export interface ModerationGame {
  id: number;
  title: string;
  coverImageUrl: string | null;
}

/**
 * Reseña enriquecida utilizada por ViniAdmin.
 *
 * Combina:
 * reviews
 * + profiles
 * + games
 */
export interface ModerationReview {
  id: number;
  userId: string;
  gameId: number;

  rating: number;
  title: string;
  content: string;

  status: ReviewStatus;
  isVerifiedPurchase: boolean;

  helpfulVotesCount: number;
  unhelpfulVotesCount: number;

  createdAt: string;

  author: ModerationAuthor;
  game: ModerationGame;
}

/**
 * Filtros visibles dentro de la cola
 * de moderación.
 */
export type ModerationFilter =
  | "ALL"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

/**
 * Acciones administrativas disponibles
 * para una reseña.
 */
export type ReviewModerationAction =
  | "REVIEW_APPROVED"
  | "REVIEW_REJECTED"
  | "REVIEW_HIDDEN";

/**
 * Información registrada en details
 * dentro de admin_audit_logs.
 */
export interface ReviewAuditDetails {
  previousStatus: ReviewStatus;
  newStatus?: ReviewStatus;
  reason?: string;
}

/**
 * Representación de un registro de auditoría.
 *
 * Importante:
 * la BD real utiliza entity_name y entity_id,
 * no target_entity y target_id.
 */
export interface AdminAuditLog {
  id: number;
  adminId: string;
  actionType: ReviewModerationAction;
  entityName: "reviews";
  entityId: string;
  details: ReviewAuditDetails | null;
  createdAt: string;
}

/**
 * Métricas principales de comunidad.
 */
export interface CommunityKpis {
  totalUsers: number;

  streakRetentionRate: number;

  totalReviews: number;
  approvedReviews: number;
  reviewApprovalRate: number;

  gameCoinsInCirculation: number;
}

/**
 * Elemento individual utilizado en
 * el gráfico Gamer DNA.
 */
export interface GamerDnaDistributionItem {
  archetype: GamerDnaArchetype;
  label: string;
  users: number;
  percentage: number;
}

/**
 * Resultado estándar de las Server Actions
 * de moderación.
 */
export interface ModerationActionResult {
  success: boolean;
  message: string;
}