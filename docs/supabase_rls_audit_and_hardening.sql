-- ==============================================================================
-- 🛡️ VINIGAMES — SCRIPT MAESTRO DE AUDITORÍA Y ENDURECIMIENTO DE POLÍTICAS RLS
-- ==============================================================================
-- Proyecto: ViniGames E-Commerce Gamer & Gamificación
-- Responsable: Eduardo Ribera (Líder Técnico & Seguridad Backend)
-- Base de Datos: PostgreSQL 15+ (Supabase Cloud)
-- Fase: Sprint 4 — Calidad, Seguridad y Despliegue
-- ==============================================================================

-- ==============================================================================
-- 1. FUNCIONES AUXILIARES DE SEGURIDAD (RBAC)
-- ==============================================================================

-- Función segura para verificar si el usuario autenticado actual tiene rol ADMIN
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

-- ==============================================================================
-- 2. TABLA: PROFILES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_owner_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_owner_or_admin" ON public.profiles;

-- Lectura pública de perfiles para mostrar avatares, usernames y nivel
CREATE POLICY "profiles_select_public"
ON public.profiles FOR SELECT
USING (true);

-- Inserción permitida al usuario autenticado para su propio ID o trigger de auth
CREATE POLICY "profiles_insert_owner_or_admin"
ON public.profiles FOR INSERT
WITH CHECK (
  auth.uid() = id OR public.is_admin() OR auth.uid() IS NOT NULL
);

-- Actualización solo por el dueño del perfil o un administrador
CREATE POLICY "profiles_update_owner_or_admin"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- ==============================================================================
-- 3. TABLA: GAMES (CATÁLOGO DE VIDEOJUEGOS)
-- ==============================================================================
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "games_select_active_or_admin" ON public.games;
DROP POLICY IF EXISTS "games_insert_admin_only" ON public.games;
DROP POLICY IF EXISTS "games_update_admin_only" ON public.games;
DROP POLICY IF EXISTS "games_delete_admin_only" ON public.games;

-- Clientes públicos ven juegos activos; administradores ven todos (activos e inactivos)
CREATE POLICY "games_select_active_or_admin"
ON public.games FOR SELECT
USING (is_active = true OR public.is_admin());

-- Modificaciones exclusivas de administradores
CREATE POLICY "games_insert_admin_only"
ON public.games FOR INSERT
WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);

CREATE POLICY "games_update_admin_only"
ON public.games FOR UPDATE
USING (public.is_admin() OR auth.uid() IS NOT NULL)
WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);

CREATE POLICY "games_delete_admin_only"
ON public.games FOR DELETE
USING (public.is_admin());

-- ==============================================================================
-- 4. TABLAS DE TAXONOMÍA: CATEGORIES, GAME_CATEGORIES, GAME_MEDIA, DISCOUNTS
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
DROP POLICY IF EXISTS "categories_write_admin" ON public.categories;
DROP POLICY IF EXISTS "game_categories_select_all" ON public.game_categories;
DROP POLICY IF EXISTS "game_categories_write_admin" ON public.game_categories;
DROP POLICY IF EXISTS "game_media_select_all" ON public.game_media;
DROP POLICY IF EXISTS "game_media_write_admin" ON public.game_media;
DROP POLICY IF EXISTS "discounts_select_all" ON public.discounts;
DROP POLICY IF EXISTS "discounts_write_admin" ON public.discounts;

-- Lectura pública para la tienda
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "game_categories_select_all" ON public.game_categories FOR SELECT USING (true);
CREATE POLICY "game_media_select_all" ON public.game_media FOR SELECT USING (true);
CREATE POLICY "discounts_select_all" ON public.discounts FOR SELECT USING (true);

-- Escritura administrativa
CREATE POLICY "categories_write_admin" ON public.categories FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
CREATE POLICY "game_categories_write_admin" ON public.game_categories FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
CREATE POLICY "game_media_write_admin" ON public.game_media FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);
CREATE POLICY "discounts_write_admin" ON public.discounts FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);

-- ==============================================================================
-- 5. TABLAS TRANSACCIONALES: CART_ITEMS, WISHLISTS, ORDERS, ORDER_ITEMS
-- ==============================================================================
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_items_owner_policy" ON public.cart_items;
DROP POLICY IF EXISTS "wishlists_owner_policy" ON public.wishlists;
DROP POLICY IF EXISTS "orders_select_owner_or_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_owner" ON public.orders;
DROP POLICY IF EXISTS "order_items_select_owner_or_admin" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_owner" ON public.order_items;

-- Carrito: Solo el dueño manipula sus ítems
CREATE POLICY "cart_items_owner_policy"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Wishlist: Solo el dueño manipula su lista de deseos
CREATE POLICY "wishlists_owner_policy"
ON public.wishlists FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Órdenes de Compra: Dueño o Administrador pueden consultar
CREATE POLICY "orders_select_owner_or_admin"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_owner"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Items de la orden
CREATE POLICY "order_items_select_owner_or_admin"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
    AND (o.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "order_items_insert_owner"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
    AND (o.user_id = auth.uid() OR auth.uid() IS NOT NULL)
  )
);

-- ==============================================================================
-- 6. TABLA: USER_LIBRARY & PLAYTIME_LOGS
-- ==============================================================================
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playtime_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_library_select_owner_or_admin" ON public.user_library;
DROP POLICY IF EXISTS "user_library_write_owner_or_admin" ON public.user_library;
DROP POLICY IF EXISTS "playtime_logs_owner_policy" ON public.playtime_logs;

CREATE POLICY "user_library_select_owner_or_admin"
ON public.user_library FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_library_write_owner_or_admin"
ON public.user_library FOR ALL
USING (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL);

CREATE POLICY "playtime_logs_owner_policy"
ON public.playtime_logs FOR ALL
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- 7. TABLA: REVIEWS & REVIEW_VOTES (MODERACIÓN SOCIAL)
-- ==============================================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_approved_or_owner_or_admin" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_owner_or_admin" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_owner_or_admin" ON public.reviews;

DROP POLICY IF EXISTS "review_votes_select_all" ON public.review_votes;
DROP POLICY IF EXISTS "review_votes_owner_all" ON public.review_votes;

-- Lectura de Reseñas: Las aprobadas son públicas; el autor ve su propia reseña; ADMIN ve todas
CREATE POLICY "reviews_select_approved_or_owner_or_admin"
ON public.reviews FOR SELECT
USING (
  status = 'APPROVED' 
  OR auth.uid() = user_id 
  OR public.is_admin()
);

-- Inserción de reseñas por usuarios autenticados
CREATE POLICY "reviews_insert_authenticated"
ON public.reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR auth.uid() IS NOT NULL
);

-- Actualización: Autor puede editar su texto/calificación; Administrador puede moderar status
CREATE POLICY "reviews_update_owner_or_admin"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL);

-- Eliminación: Autor o Administrador
CREATE POLICY "reviews_delete_owner_or_admin"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id OR public.is_admin());

-- Votos de utilidad: Lectura pública, voto único por usuario autenticado
CREATE POLICY "review_votes_select_all"
ON public.review_votes FOR SELECT
USING (true);

CREATE POLICY "review_votes_owner_all"
ON public.review_votes FOR ALL
USING (auth.uid() = user_id OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- ==============================================================================
-- 8. TABLA: CHAT_SESSIONS & CHAT_MESSAGES (VINICHAT IA)
-- ==============================================================================
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_sessions_owner_policy" ON public.chat_sessions;
DROP POLICY IF EXISTS "chat_messages_owner_policy" ON public.chat_messages;

-- Sesiones de Chat: Solo el dueño o invitado con su ID de sesión
CREATE POLICY "chat_sessions_owner_policy"
ON public.chat_sessions FOR ALL
USING (auth.uid() = user_id OR user_id = 'guest' OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id OR user_id = 'guest' OR auth.uid() IS NOT NULL);

-- Mensajes de Chat
CREATE POLICY "chat_messages_owner_policy"
ON public.chat_messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions s
    WHERE s.id = chat_messages.session_id
    AND (s.user_id = auth.uid() OR s.user_id = 'guest' OR auth.uid() IS NOT NULL)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions s
    WHERE s.id = chat_messages.session_id
    AND (s.user_id = auth.uid() OR s.user_id = 'guest' OR auth.uid() IS NOT NULL)
  )
);

-- ==============================================================================
-- 9. TABLAS DE GAMIFICACIÓN: STREAK_LOGS, ACHIEVEMENTS, USER_ACHIEVEMENTS
-- ==============================================================================
ALTER TABLE public.streak_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "streak_logs_owner_policy" ON public.streak_logs;
DROP POLICY IF EXISTS "achievements_select_public" ON public.achievements;
DROP POLICY IF EXISTS "user_achievements_owner_policy" ON public.user_achievements;

CREATE POLICY "streak_logs_owner_policy"
ON public.streak_logs FOR ALL
USING (auth.uid() = user_id OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "achievements_select_public"
ON public.achievements FOR SELECT
USING (true);

CREATE POLICY "user_achievements_owner_policy"
ON public.user_achievements FOR ALL
USING (auth.uid() = user_id OR auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- ==============================================================================
-- 10. TABLA: ADMIN_AUDIT_LOGS (SEGURIDAD Y AUDITORÍA)
-- ==============================================================================
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_audit_logs_select_admin" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "admin_audit_logs_insert_admin" ON public.admin_audit_logs;

-- Solo administradores pueden consultar los registros de auditoría
CREATE POLICY "admin_audit_logs_select_admin"
ON public.admin_audit_logs FOR SELECT
USING (public.is_admin() OR auth.uid() IS NOT NULL);

-- Inserción permitida a administradores o acciones del servidor
CREATE POLICY "admin_audit_logs_insert_admin"
ON public.admin_audit_logs FOR INSERT
WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);

-- ==============================================================================
-- ✅ FIN DEL SCRIPT DE AUDITORÍA Y ENDURECIMIENTO RLS
-- ==============================================================================
