"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Agrega o elimina un juego de la wishlist del usuario autenticado en Supabase.
 */
export async function toggleWishlistAction(gameId: number) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true }; // En modo invitado, el estado se preserva en localStorage
    }

    // Verificar si ya existe en la wishlist
    const { data: existingEntry } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("game_id", gameId)
      .maybeSingle();

    if (existingEntry) {
      // Si existe, lo eliminamos
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", existingEntry.id);

      if (error) return { success: false, error: error.message };
    } else {
      // Si no existe, lo agregamos
      const { error } = await supabase.from("wishlists").insert({
        user_id: user.id,
        game_id: gameId,
      });

      if (error) return { success: false, error: error.message };
    }

    // Refrescar las rutas de la wishlist
    revalidatePath("/wishlist");
    revalidatePath(`/games`);
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error al actualizar la lista de deseos" };
  }
}

/**
 * Mueve un juego de la wishlist al carrito de compras en Supabase.
 */
export async function moveToCartAction(gameId: number) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true };
    }

    // 1. Insertar en el carrito (o verificar si ya está)
    const { error: cartError } = await supabase.from("cart_items").upsert(
      { user_id: user.id, game_id: gameId },
      { onConflict: "user_id, game_id" }
    );

    if (cartError && cartError.code !== "42P10" && cartError.code !== "23505") {
      // Continuar incluso si ya estaba en el carrito
    }

    // 2. Eliminar de la wishlist
    const { error: deleteError } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/wishlist");
    revalidatePath("/cart");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error al mover al carrito" };
  }
}
