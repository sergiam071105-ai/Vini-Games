"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Agrega o elimina un juego de la wishlist del usuario autenticado.
 */
export async function toggleWishlistAction(gameId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para usar la wishlist" };
  }

  // Verificar si ya existe en la wishlist
  const { data: existingEntry } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("game_id", gameId)
    .single();

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
}

/**
 * Mueve un juego de la wishlist al carrito de compras.
 */
export async function moveToCartAction(gameId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  // 1. Insertar en el carrito (o verificar si ya está)
  const { error: cartError } = await supabase.from("cart_items").upsert(
    { user_id: user.id, game_id: gameId },
    { onConflict: "user_id, game_id" } // asumiendo que hay un índice único compuesto
  );

  if (cartError) {
    // Si upsert falla por falta de índice compuesto, hacemos un insert seguro:
    if (cartError.code === '42P10' || cartError.code === '23505') {
       // Si el error es de conflicto (ya está en el carrito), igual lo borramos de la wishlist
    } else {
       return { success: false, error: cartError.message };
    }
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
}
