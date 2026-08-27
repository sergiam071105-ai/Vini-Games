# 🛡️ Informe de Auditoría y Endurecimiento de Seguridad (RLS) — Sprint 4

> **Proyecto**: ViniGames — Plataforma E-Commerce Gamer, Gamificación & Asistencia IA  
> **Responsable**: Eduardo Ribera (Líder Técnico & Seguridad / Backend)  
> **Módulo**: Seguridad de Datos, Row Level Security (RLS) & Control de Acceso Basado en Roles (RBAC)  
> **Universidad**: Universidad Tecnológica Privada de Santa Cruz (UTEPSA) | Gestión 2026  
> **Docente Guía**: Ing. Bryana Ojopi Banegas  

---

## 📌 1. Resumen Ejecutivo de Seguridad

Como parte de los entregables del **Sprint 4**, se realizó una auditoría exhaustiva sobre el esquema relacional de **20 tablas en PostgreSQL (Supabase Cloud)**. El objetivo primordial fue garantizar el principio de **privilegio mínimo (*Least Privilege*)**, el aislamiento estricto de datos privados entre jugadores y la protección perimetral del panel administrativo **ViniAdmin** mediante políticas **Row Level Security (RLS)** y control **RBAC**.

---

## 📊 2. Matriz de Control de Acceso por Tabla (20 Entidades)

| # | Tabla | `SELECT` | `INSERT` | `UPDATE` | `DELETE` | Cláusula de Seguridad |
| :-: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | `profiles` | Público | Dueño / Trigger | Dueño / Admin | ❌ Denegado | `auth.uid() = id OR is_admin()` |
| **2** | `games` | Público / Admin | Admin | Admin | Admin | `is_active = true OR is_admin()` |
| **3** | `categories` | Público | Admin | Admin | Admin | `is_admin()` |
| **4** | `game_categories` | Público | Admin | Admin | Admin | `is_admin()` |
| **5** | `game_media` | Público | Admin | Admin | Admin | `is_admin()` |
| **6** | `discounts` | Público | Admin | Admin | Admin | `is_admin()` |
| **7** | `cart_items` | Dueño | Dueño | Dueño | Dueño | `auth.uid() = user_id` |
| **8** | `wishlists` | Dueño | Dueño | Dueño | Dueño | `auth.uid() = user_id` |
| **9** | `orders` | Dueño / Admin | Dueño | ❌ Denegado | ❌ Denegado | `auth.uid() = user_id OR is_admin()` |
| **10** | `order_items` | Dueño / Admin | Dueño | ❌ Denegado | ❌ Denegado | `EXISTS (SELECT 1 FROM orders ...)` |
| **11** | `user_library` | Dueño / Admin | Dueño / Admin | Dueño / Admin | ❌ Denegado | `auth.uid() = user_id OR is_admin()` |
| **12** | `playtime_logs` | Dueño / Admin | Dueño / Admin | Dueño / Admin | ❌ Denegado | `auth.uid() = user_id OR is_admin()` |
| **13** | `reviews` | Aprobadas / Dueño / Admin | Autenticado | Dueño / Admin | Dueño / Admin | `status = 'APPROVED' OR auth.uid() = user_id OR is_admin()` |
| **14** | `review_votes` | Público | Autenticado | Dueño | Dueño | `auth.uid() = user_id` |
| **15** | `chat_sessions` | Dueño / Invitado | Dueño / Invitado | Dueño / Invitado | Dueño | `auth.uid() = user_id OR user_id = 'guest'` |
| **16** | `chat_messages` | Dueño / Invitado | Dueño / Invitado | ❌ Denegado | ❌ Denegado | `EXISTS (SELECT 1 FROM chat_sessions ...)` |
| **17** | `streak_logs` | Dueño | Dueño / Sistema | ❌ Denegado | ❌ Denegado | `auth.uid() = user_id` |
| **18** | `achievements` | Público | Admin / Sistema | Admin | Admin | `true` para lectura |
| **19** | `user_achievements` | Público / Dueño | Dueño / Sistema | ❌ Denegado | ❌ Denegado | `auth.uid() = user_id` |
| **20** | `admin_audit_logs`| Solo Admin | Admin / Servidor | ❌ Denegado | ❌ Denegado | `is_admin()` |

---

## 🔒 3. Vulnerabilidades Detectadas y Mitigadas

### 🔴 1. Aislamiento de Carritos y Listas de Deseos
* **Riesgo:** Si un atacante interceptaba un ID ajeno, podría visualizar o vaciar los ítems del carrito de otro usuario.
* **Mitigación:** Se forzó la política `cart_items_owner_policy` y `wishlists_owner_policy` con verificación estricta de `auth.uid() = user_id` tanto en `USING` como en `WITH CHECK`.

### 🔴 2. Moderación de Reseñas y Eliminación de Opiniones Rechazadas
* **Riesgo:** Usuarios no autorizados podían ver opiniones en estado `REJECTED` o alterar el estado de moderación.
* **Mitigación:** La política `reviews_select_approved_or_owner_or_admin` garantiza que la tienda pública solo sirva reseñas con `status = 'APPROVED'`. La modificación del estado `status` queda restringida a usuarios con rol `ADMIN`.

### 🔴 3. Protección de Bajas Lógicas en Catálogo (`games`)
* **Riesgo:** Videojuegos despublicados o marcados con `is_active = false` podían ser consultados o comprados por enlaces directos.
* **Mitigación:** La política `games_select_active_or_admin` filtra automáticamente los títulos inactivos para visitantes y compradores, permitiendo su visualización únicamente al panel de administración.

### 🔴 4. Trazabilidad de Auditoría (`admin_audit_logs`)
* **Riesgo:** Acceso no autorizado a registros históricos de acciones administrativas.
* **Mitigación:** La política `admin_audit_logs_select_admin` impide que cualquier usuario sin rol `ADMIN` acceda a la tabla de logs.

---

## 🚀 4. Guía de Ejecución en Supabase Cloud

Para aplicar este esquema de políticas en la base de datos de producción:

1. Ingresa a tu panel de **Supabase**: [https://supabase.com/dashboard/project/rjtjzuvpdqnaxfenwsot](https://supabase.com/dashboard/project/rjtjzuvpdqnaxfenwsot)
2. En el menú lateral izquierdo, abre el **SQL Editor**.
3. Abre y copia el contenido del script maestro:
   📂 [`docs/supabase_rls_audit_and_hardening.sql`](file:///c:/Users/Eduardo/Desktop/ViniGames/vinigames/docs/supabase_rls_audit_and_hardening.sql)
4. Pega el código en el editor y presiona **"Run"** (Ctrl + Enter).
5. Verifica el mensaje de éxito: `Success. No rows returned`.
