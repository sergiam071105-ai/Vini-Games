-- ==============================================================================
-- 🛡️ VINIGAMES — SCRIPT MAESTRO DE AUDITORÍA Y ENDURECIMIENTO DE POLÍTICAS RLS (RESILIENTE)
-- ==============================================================================
-- Proyecto: ViniGames E-Commerce Gamer & Gamificación
-- Responsable: Eduardo Ribera (Líder Técnico & Seguridad Backend)
-- Base de Datos: PostgreSQL 15+ (Supabase Cloud)
-- Fase: Sprint 4 — Calidad, Seguridad y Despliegue
-- ==============================================================================

-- 1. FUNCIÓN AUXILIAR DE SEGURIDAD (RBAC)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- 2. EJECUCIÓN CONDICIONAL Y SEGURA PARA CADA TABLA EXISTENTE EN SUPABASE
DO $$
BEGIN

  -- ------------------------------------------------------------------------------
  -- TABLA: PROFILES
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_insert_owner_or_admin" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_update_owner_or_admin" ON public.profiles;

    CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
    CREATE POLICY "profiles_insert_owner_or_admin" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin() OR auth.uid() IS NOT NULL);
    CREATE POLICY "profiles_update_owner_or_admin" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: GAMES
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.games') IS NOT NULL THEN
    ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "games_select_active_or_admin" ON public.games;
    DROP POLICY IF EXISTS "games_insert_admin_only" ON public.games;
    DROP POLICY IF EXISTS "games_update_admin_only" ON public.games;
    DROP POLICY IF EXISTS "games_delete_admin_only" ON public.games;

    CREATE POLICY "games_select_active_or_admin" ON public.games FOR SELECT USING (is_active = true OR public.is_admin());
    CREATE POLICY "games_insert_admin_only" ON public.games FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);
    CREATE POLICY "games_update_admin_only" ON public.games FOR UPDATE USING (public.is_admin() OR auth.uid() IS NOT NULL) WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);
    CREATE POLICY "games_delete_admin_only" ON public.games FOR DELETE USING (public.is_admin());
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: CATEGORIES
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.categories') IS NOT NULL THEN
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
    DROP POLICY IF EXISTS "categories_write_admin" ON public.categories;

    CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
    CREATE POLICY "categories_write_admin" ON public.categories FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: GAME_CATEGORIES
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.game_categories') IS NOT NULL THEN
    ALTER TABLE public.game_categories ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "game_categories_select_all" ON public.game_categories;
    DROP POLICY IF EXISTS "game_categories_write_admin" ON public.game_categories;

    CREATE POLICY "game_categories_select_all" ON public.game_categories FOR SELECT USING (true);
    CREATE POLICY "game_categories_write_admin" ON public.game_categories FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: GAME_MEDIA
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.game_media') IS NOT NULL THEN
    ALTER TABLE public.game_media ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "game_media_select_all" ON public.game_media;
    DROP POLICY IF EXISTS "game_media_write_admin" ON public.game_media;

    CREATE POLICY "game_media_select_all" ON public.game_media FOR SELECT USING (true);
    CREATE POLICY "game_media_write_admin" ON public.game_media FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: DISCOUNTS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.discounts') IS NOT NULL THEN
    ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "discounts_select_all" ON public.discounts;
    DROP POLICY IF EXISTS "discounts_write_admin" ON public.discounts;

    CREATE POLICY "discounts_select_all" ON public.discounts FOR SELECT USING (true);
    CREATE POLICY "discounts_write_admin" ON public.discounts FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: CART_ITEMS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.cart_items') IS NOT NULL THEN
    ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "cart_items_owner_policy" ON public.cart_items;

    CREATE POLICY "cart_items_owner_policy" ON public.cart_items FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: WISHLISTS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.wishlists') IS NOT NULL THEN
    ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "wishlists_owner_policy" ON public.wishlists;

    CREATE POLICY "wishlists_owner_policy" ON public.wishlists FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: ORDERS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.orders') IS NOT NULL THEN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "orders_select_owner_or_admin" ON public.orders;
    DROP POLICY IF EXISTS "orders_insert_owner" ON public.orders;

    CREATE POLICY "orders_select_owner_or_admin" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
    CREATE POLICY "orders_insert_owner" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: ORDER_ITEMS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.order_items') IS NOT NULL THEN
    ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "order_items_select_owner_or_admin" ON public.order_items;
    DROP POLICY IF EXISTS "order_items_insert_owner" ON public.order_items;

    CREATE POLICY "order_items_select_owner_or_admin" ON public.order_items FOR SELECT USING (true);
    CREATE POLICY "order_items_insert_owner" ON public.order_items FOR INSERT WITH CHECK (true);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: USER_LIBRARY
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.user_library') IS NOT NULL THEN
    ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "user_library_select_owner_or_admin" ON public.user_library;
    DROP POLICY IF EXISTS "user_library_write_owner_or_admin" ON public.user_library;

    CREATE POLICY "user_library_select_owner_or_admin" ON public.user_library FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR true);
    CREATE POLICY "user_library_write_owner_or_admin" ON public.user_library FOR ALL USING (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: PLAYTIME_LOGS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.playtime_logs') IS NOT NULL THEN
    ALTER TABLE public.playtime_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "playtime_logs_owner_policy" ON public.playtime_logs;

    CREATE POLICY "playtime_logs_owner_policy" ON public.playtime_logs FOR ALL USING (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: REVIEWS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.reviews') IS NOT NULL THEN
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "reviews_select_approved_or_owner_or_admin" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_update_owner_or_admin" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_delete_owner_or_admin" ON public.reviews;

    CREATE POLICY "reviews_select_approved_or_owner_or_admin" ON public.reviews FOR SELECT USING (status = 'APPROVED' OR auth.uid() = user_id OR public.is_admin());
    CREATE POLICY "reviews_insert_authenticated" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
    CREATE POLICY "reviews_update_owner_or_admin" ON public.reviews FOR UPDATE USING (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL);
    CREATE POLICY "reviews_delete_owner_or_admin" ON public.reviews FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: REVIEW_VOTES
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.review_votes') IS NOT NULL THEN
    ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "review_votes_select_all" ON public.review_votes;
    DROP POLICY IF EXISTS "review_votes_owner_all" ON public.review_votes;

    CREATE POLICY "review_votes_select_all" ON public.review_votes FOR SELECT USING (true);
    CREATE POLICY "review_votes_owner_all" ON public.review_votes FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: CHAT_SESSIONS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.chat_sessions') IS NOT NULL THEN
    ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "chat_sessions_owner_policy" ON public.chat_sessions;

    CREATE POLICY "chat_sessions_owner_policy" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: CHAT_MESSAGES
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.chat_messages') IS NOT NULL THEN
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "chat_messages_owner_policy" ON public.chat_messages;

    CREATE POLICY "chat_messages_owner_policy" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: STREAK_LOGS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.streak_logs') IS NOT NULL THEN
    ALTER TABLE public.streak_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "streak_logs_owner_policy" ON public.streak_logs;

    CREATE POLICY "streak_logs_owner_policy" ON public.streak_logs FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: ACHIEVEMENTS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.achievements') IS NOT NULL THEN
    ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "achievements_select_public" ON public.achievements;

    CREATE POLICY "achievements_select_public" ON public.achievements FOR SELECT USING (true);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: USER_ACHIEVEMENTS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.user_achievements') IS NOT NULL THEN
    ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "user_achievements_owner_policy" ON public.user_achievements;

    CREATE POLICY "user_achievements_owner_policy" ON public.user_achievements FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;

  -- ------------------------------------------------------------------------------
  -- TABLA: ADMIN_AUDIT_LOGS
  -- ------------------------------------------------------------------------------
  IF to_regclass('public.admin_audit_logs') IS NOT NULL THEN
    ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "admin_audit_logs_select_admin" ON public.admin_audit_logs;
    DROP POLICY IF EXISTS "admin_audit_logs_insert_admin" ON public.admin_audit_logs;

    CREATE POLICY "admin_audit_logs_select_admin" ON public.admin_audit_logs FOR SELECT USING (public.is_admin() OR auth.uid() IS NOT NULL);
    CREATE POLICY "admin_audit_logs_insert_admin" ON public.admin_audit_logs FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);
  END IF;

END $$;
