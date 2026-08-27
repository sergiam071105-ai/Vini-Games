import {
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import ReviewModerationCard from "@/components/admin/review-moderation-card";
import ReviewModerationFilters from "@/components/admin/review-moderation-filters";
import KpiCommunityCards from "@/components/admin/kpi-community-cards";
import GamerDnaDistributionChart from "@/components/admin/gamer-dna-distribution-chart";

import type {
  CommunityKpis,
  GamerDnaArchetype,
  GamerDnaDistributionItem,
  ModerationFilter,
  ModerationReview,
} from "@/types/moderation.types";

interface AdminReviewsPageProps {
  searchParams?: Promise<{
    status?: string;
  }>;
}

const validFilters: ModerationFilter[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export default async function AdminReviewsPage({
  searchParams,
}: AdminReviewsPageProps) {
  const supabase = await createClient();

  /*
   * ================================
   * SEGURIDAD DEL PANEL ADMIN
   * ================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminProfile } =
    await supabase
      .from("profiles")
      .select("id, username, role")
      .eq("id", user.id)
      .single();

  if (
    !adminProfile ||
    adminProfile.role !== "ADMIN"
  ) {
    redirect("/");
  }

  /*
   * ================================
   * FILTRO ACTIVO
   * ================================
   */

  const params = await searchParams;

  const requestedStatus =
    params?.status?.toUpperCase();

  const activeFilter: ModerationFilter =
    validFilters.includes(
      requestedStatus as ModerationFilter
    )
      ? (requestedStatus as ModerationFilter)
      : "ALL";

  /*
   * ================================
   * RESEÑAS + PROFILE + GAME
   * ================================
   */

  let reviewsQuery = supabase
    .from("reviews")
    .select(`
      id,
      user_id,
      game_id,
      rating,
      title,
      content,
      status,
      is_verified_purchase,
      helpful_votes_count,
      unhelpful_votes_count,
      created_at,
      profiles!reviews_user_id_fkey (
        id,
        username,
        avatar_url,
        current_level
      ),
      games!reviews_game_id_fkey (
        id,
        title,
        cover_image_url
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (activeFilter !== "ALL") {
    reviewsQuery = reviewsQuery.eq(
      "status",
      activeFilter
    );
  }

  const {
    data: reviewsData,
    error: reviewsError,
  } = await reviewsQuery;

  if (reviewsError) {
    console.error(
      "Error cargando reseñas:",
      reviewsError
    );
  }

  const reviews: ModerationReview[] =
    (reviewsData ?? []).map((review) => ({
      id: review.id,
      userId: review.user_id,
      gameId: review.game_id,

      rating: review.rating,

      // En la BD title puede ser null.
      title:
        review.title ??
        "Reseña sin título",

      content: review.content,

      status: review.status,

      isVerifiedPurchase:
        review.is_verified_purchase,

      helpfulVotesCount:
        review.helpful_votes_count,

      unhelpfulVotesCount:
        review.unhelpful_votes_count,

      createdAt: review.created_at,

      author: {
        id: review.profiles.id,
        username:
          review.profiles.username,
        avatarUrl:
          review.profiles.avatar_url,
        currentLevel:
          review.profiles.current_level,
      },

      game: {
        id: review.games.id,
        title: review.games.title,
        coverImageUrl:
          review.games.cover_image_url,
      },
    }));

  /*
   * ================================
   * DATOS DE PERFILES PARA KPIs + DNA
   * ================================
   */

  const { data: profilesData } =
    await supabase
      .from("profiles")
      .select(`
        id,
        current_streak,
        gamecoins_balance,
        dna_exploration,
        dna_competitive,
        dna_narrative,
        dna_collection
      `);

  const profiles = profilesData ?? [];

  /*
   * ================================
   * TODAS LAS RESEÑAS PARA KPIs
   * ================================
   */

  const { data: allReviewsData } =
    await supabase
      .from("reviews")
      .select("id, status");

  const allReviews =
    allReviewsData ?? [];

  /*
   * DEBUG TEMPORAL:
   * Nos permite comprobar qué estado
   * viene realmente desde Supabase.
   */
  console.log(
    "ESTADOS REALES DE REVIEWS:",
    allReviews
  );

  /*
   * ================================
   * KPIs
   * ================================
   */

  const totalUsers = profiles.length;

  const usersWithActiveStreak =
    profiles.filter(
      (profile) =>
        profile.current_streak >= 1
    ).length;

  const streakRetentionRate =
    totalUsers > 0
      ? Math.round(
          (usersWithActiveStreak /
            totalUsers) *
            100
        )
      : 0;

  const totalReviews =
    allReviews.length;

  const approvedReviews =
    allReviews.filter(
      (review) =>
        review.status === "APPROVED"
    ).length;

  const reviewApprovalRate =
    totalReviews > 0
      ? Math.round(
          (approvedReviews /
            totalReviews) *
            100
        )
      : 0;

  const gameCoinsInCirculation =
    profiles.reduce(
      (total, profile) =>
        total +
        profile.gamecoins_balance,
      0
    );

  const kpis: CommunityKpis = {
    totalUsers,
    streakRetentionRate,

    totalReviews,
    approvedReviews,
    reviewApprovalRate,

    gameCoinsInCirculation,
  };

  /*
   * ================================
   * CONTADORES DE FILTROS
   * ================================
   */

  const filterCounts: Record<
    ModerationFilter,
    number
  > = {
    ALL: totalReviews,

    PENDING: allReviews.filter(
      (review) =>
        review.status === "PENDING"
    ).length,

    APPROVED: approvedReviews,

    REJECTED: allReviews.filter(
      (review) =>
        review.status === "REJECTED"
    ).length,
  };

  /*
   * ================================
   * GAMER DNA DE LA COMUNIDAD
   * ================================
   */

  const dnaCounters: Record<
    GamerDnaArchetype,
    number
  > = {
    explorer: 0,
    competitive: 0,
    narrative: 0,
    collector: 0,
  };

  profiles.forEach((profile) => {
    const dnaValues: {
      archetype: GamerDnaArchetype;
      value: number;
    }[] = [
      {
        archetype: "explorer",
        value:
          profile.dna_exploration,
      },
      {
        archetype: "competitive",
        value:
          profile.dna_competitive,
      },
      {
        archetype: "narrative",
        value:
          profile.dna_narrative,
      },
      {
        archetype: "collector",
        value:
          profile.dna_collection,
      },
    ];

    const dominant =
      dnaValues.reduce((highest, item) =>
        item.value > highest.value
          ? item
          : highest
      );

    dnaCounters[
      dominant.archetype
    ] += 1;
  });

  const dnaLabels: Record<
    GamerDnaArchetype,
    string
  > = {
    explorer: "Explorador",
    competitive: "Competitivo",
    narrative: "Narrativo",
    collector: "Coleccionista",
  };

  const dnaArchetypes:
    GamerDnaArchetype[] = [
      "explorer",
      "competitive",
      "narrative",
      "collector",
    ];

  const gamerDnaDistribution:
    GamerDnaDistributionItem[] =
    dnaArchetypes.map(
      (archetype) => {
        const users =
          dnaCounters[archetype];

        const percentage =
          totalUsers > 0
            ? Math.round(
                (users /
                  totalUsers) *
                  100
              )
            : 0;

        return {
          archetype,
          label:
            dnaLabels[archetype],
          users,
          percentage,
        };
      }
    );

  /*
   * ================================
   * UI
   * ================================
   */

  return (
    <main className="min-h-screen bg-[#090B14] text-white">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        

        <KpiCommunityCards
          kpis={kpis}
        />

        <GamerDnaDistributionChart
          data={gamerDnaDistribution}
        />

        <section className="space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-[#783DF2]" />

                <h2 className="text-xl font-bold">
                  Cola de moderación
                </h2>
              </div>

              <p className="mt-2 text-sm text-[#949CB2]">
                Revisa y administra las
                publicaciones realizadas
                por la comunidad.
              </p>
            </div>

            <ReviewModerationFilters
              activeFilter={
                activeFilter
              }
              counts={filterCounts}
            />
          </div>

          {reviews.length > 0 ? (
            <div className="grid gap-5">
              {reviews.map((review) => (
                <ReviewModerationCard
                  key={review.id}
                  review={review}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2E334A] bg-[#1A1C2B] px-6 py-12 text-center">
              <MessageSquareWarning className="mx-auto h-9 w-9 text-[#5D6378]" />

              <h3 className="mt-4 font-bold text-white">
                No hay reseñas
              </h3>

              <p className="mt-2 text-sm text-[#949CB2]">
                No existen reseñas para
                el filtro seleccionado.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
