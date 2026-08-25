'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { processOrderSchema, ProcessOrderInput } from '@/lib/schemas/order.schema';
import { CartGameItem, OrderSummary } from '@/types/order.types';
import { MOCK_GAMES } from '@/lib/mock-data/games';

/**
 * Obtiene los elementos actuales en el carrito del usuario autenticado.
 */
export async function getCartItemsAction(): Promise<CartGameItem[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: dbItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        game_id,
        created_at,
        games (
          id,
          title,
          slug,
          cover_image_url,
          developer,
          base_price,
          discount_percent,
          final_price
        )
      `)
      .eq('user_id', user.id);

    if (!error && dbItems && dbItems.length > 0) {
      return dbItems
        .map((item: any) => {
          const g = item.games;
          if (!g) return null;
          const base = Number(g.base_price);
          const discount = g.discount_percent || 0;
          const finalPrice = g.final_price ? Number(g.final_price) : Math.round(base * (1 - discount / 100));

          return {
            id: g.id,
            title: g.title,
            slug: g.slug,
            coverUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
            developer: g.developer || 'Estudio Gamer',
            basePrice: base,
            discountPercent: discount,
            finalPrice,
            addedAt: item.created_at,
          };
        })
        .filter(Boolean) as CartGameItem[];
    }
  } catch (err) {
    console.warn('Error fetching cart items from Supabase:', err);
  }

  return [];
}

/**
 * Agrega un videojuego al carrito del usuario en la base de datos.
 */
export async function addToCartAction(gameId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: true }; // En modo invitado, el estado se preserva en CartContext del cliente
    }

    // Verificar si el usuario ya posee el juego en su biblioteca
    const { data: inLibrary } = await supabase
      .from('user_library')
      .select('id')
      .eq('user_id', user.id)
      .eq('game_id', gameId)
      .maybeSingle();

    if (inLibrary) {
      return { success: false, error: 'Ya posees este videojuego en tu biblioteca personal.' };
    }

    // Insertar en cart_items
    const { error } = await supabase
      .from('cart_items')
      .upsert({ user_id: user.id, game_id: gameId }, { onConflict: 'user_id,game_id' });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al agregar al carrito' };
  }
}

/**
 * Remueve un videojuego del carrito.
 */
export async function removeFromCartAction(gameId: number): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', gameId);
    }

    revalidatePath('/cart');
    return { success: true };
  } catch {
    return { success: true };
  }
}

/**
 * Vacía la totalidad del carrito del usuario.
 */
export async function clearCartAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }

    revalidatePath('/cart');
    return { success: true };
  } catch {
    return { success: true };
  }
}

/**
 * Calcula los totales financieros (subtotal, descuento y total final) en el servidor.
 */
export async function getCartTotalAction(gameIds: number[]): Promise<{
  subtotal: number;
  discountTotal: number;
  total: number;
  itemCount: number;
}> {
  try {
    if (!gameIds || gameIds.length === 0) {
      return { subtotal: 0, discountTotal: 0, total: 0, itemCount: 0 };
    }

    const supabase = await createClient();
    const { data: dbGames } = await supabase
      .from('games')
      .select('id, base_price, discount_percent, final_price')
      .in('id', gameIds);

    let gamesToCalculate = [];

    if (dbGames && dbGames.length > 0) {
      gamesToCalculate = dbGames.map((g: any) => {
        const base = Number(g.base_price);
        const discount = g.discount_percent || 0;
        const finalPrice = g.final_price
          ? Number(g.final_price)
          : Math.round(base * (1 - discount / 100));
        return { basePrice: base, discountPercent: discount, finalPrice };
      });
    } else {
      gamesToCalculate = MOCK_GAMES.filter((g) => gameIds.includes(g.id)).map((g) => ({
        basePrice: Number(g.base_price),
        discountPercent: g.discount_percent || 0,
        finalPrice: Number(g.final_price),
      }));
    }

    const subtotal = gamesToCalculate.reduce((acc, g) => acc + g.basePrice, 0);
    const total = gamesToCalculate.reduce((acc, g) => acc + g.finalPrice, 0);
    const discountTotal = Math.max(0, subtotal - total);

    return {
      subtotal,
      discountTotal,
      total,
      itemCount: gamesToCalculate.length,
    };
  } catch (err) {
    console.warn('Error calculating cart total in server:', err);
    return { subtotal: 0, discountTotal: 0, total: 0, itemCount: 0 };
  }
}

/**
 * Procesa la compra simulada con pasarela virtual y genera el recibo digital TX-XXXX.
 */
export async function processSimulatedCheckoutAction(rawInput: ProcessOrderInput): Promise<{
  success: boolean;
  error?: string;
  order?: OrderSummary;
}> {
  try {
    const validation = processOrderSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues?.[0]?.message || 'Datos de orden inválidos',
      };
    }

    const { gameIds, paymentMethod } = validation.data;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión con tu cuenta de ViniGames para procesar la compra y guardar tus videojuegos.',
      };
    }

    const effectiveUserId = user.id;

    // 1. Obtener detalles de los juegos comprados
    let purchasedGames: {
      id: number;
      title: string;
      coverUrl?: string;
      basePrice: number;
      discountPercent: number;
      finalPrice: number;
    }[] = [];

    const { data: dbGames } = await supabase
      .from('games')
      .select('id, title, cover_image_url, base_price, discount_percent, final_price')
      .in('id', gameIds);

    if (dbGames && dbGames.length > 0) {
      purchasedGames = dbGames.map((g: any) => ({
        id: g.id,
        title: g.title,
        coverUrl: g.cover_image_url,
        basePrice: Number(g.base_price),
        discountPercent: g.discount_percent || 0,
        finalPrice: g.final_price ? Number(g.final_price) : Math.round(Number(g.base_price) * (1 - (g.discount_percent || 0) / 100)),
      }));
    } else {
      // Fallback a Mock Games
      purchasedGames = MOCK_GAMES.filter((g) => gameIds.includes(g.id)).map((g) => ({
        id: g.id,
        title: g.title,
        coverUrl: g.cover_image_url || undefined,
        basePrice: Number(g.base_price),
        discountPercent: g.discount_percent || 0,
        finalPrice: Number(g.final_price),
      }));
    }

    if (purchasedGames.length === 0) {
      return { success: false, error: 'No se encontraron los videojuegos seleccionados' };
    }

    // 1.1 Verificar si el usuario ya posee alguno de estos juegos en su biblioteca
    const { data: alreadyOwned } = await supabase
      .from('user_library')
      .select('game_id')
      .eq('user_id', user.id)
      .in('game_id', gameIds);

    if (alreadyOwned && alreadyOwned.length > 0) {
      const ownedIds = alreadyOwned.map((o) => o.game_id);
      const ownedTitles = purchasedGames
        .filter((g) => ownedIds.includes(g.id))
        .map((g) => `"${g.title}"`)
        .join(', ');

      return {
        success: false,
        error: `Ya posees ${ownedTitles} en tu biblioteca. No es necesario comprarlo de nuevo.`,
      };
    }

    // 2. Calcular totales financieros en Bolivianos (Bs.)
    const subtotal = purchasedGames.reduce((acc, g) => acc + g.basePrice, 0);
    const total = purchasedGames.reduce((acc, g) => acc + g.finalPrice, 0);
    const discountTotal = Math.max(0, subtotal - total);

    // 3. Generar código transaccional único TX-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `TX-${randomSuffix}`;

    const now = new Date().toISOString();
    const XP_PURCHASE_REWARD = 100;

    // 4. Si el usuario está autenticado en Supabase, persistir orden y biblioteca
    if (user) {
      // Cabecera de orden
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_code: orderCode,
          user_id: user.id,
          subtotal,
          discount_total: discountTotal,
          total,
          payment_method: paymentMethod,
          status: 'COMPLETED',
        })
        .select('id')
        .single();

      const orderId = orderData?.id;

      // Detalle de ítems
      if (orderId) {
        const orderItemsToInsert = purchasedGames.map((g) => ({
          order_id: orderId,
          game_id: g.id,
          unit_price: g.basePrice,
          discount_applied: g.discountPercent,
          final_price: g.finalPrice,
        }));
        await supabase.from('order_items').insert(orderItemsToInsert);
      }

      // Traspaso garantizado a user_library
      const libraryItemsToInsert = purchasedGames.map((g) => ({
        user_id: user.id,
        game_id: g.id,
        order_id: orderId || null,
        install_status: 'NOT_INSTALLED' as const,
        hours_played: 0.0,
      }));
      const { error: libError } = await supabase
        .from('user_library')
        .upsert(libraryItemsToInsert, { onConflict: 'user_id,game_id' });

      if (libError) {
        console.error('Error insertando en user_library:', libError);
      }

      // Vaciar carrito
      await supabase.from('cart_items').delete().eq('user_id', user.id);

      // Acreditar +100 XP en profiles
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('id', user.id)
        .maybeSingle();

      if (currentProfile) {
        await supabase
          .from('profiles')
          .update({
            total_xp: (currentProfile.total_xp || 0) + XP_PURCHASE_REWARD,
            updated_at: now,
          })
          .eq('id', user.id);
      }
    }

    revalidatePath('/cart');
    revalidatePath('/library');
    revalidatePath('/profile');
    revalidatePath('/gamification');

    const orderSummary: OrderSummary = {
      orderCode,
      userId: effectiveUserId,
      subtotal,
      discountTotal,
      total,
      paymentMethod,
      status: 'COMPLETED',
      createdAt: now,
      items: purchasedGames.map((g) => ({
        gameId: g.id,
        title: g.title,
        coverUrl: g.coverUrl,
        unitPrice: g.basePrice,
        discountApplied: g.discountPercent,
        finalPrice: g.finalPrice,
      })),
      xpAwarded: XP_PURCHASE_REWARD,
    };

    return {
      success: true,
      order: orderSummary,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Ocurrió un error al procesar el checkout simulado',
    };
  }
}
