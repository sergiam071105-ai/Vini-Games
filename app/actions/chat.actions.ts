'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ChatSession, ChatMessage, ChatProductItem } from '@/types/chat.types';
import { MOCK_GAMES } from '@/lib/mock-data/games';

/**
 * Obtiene los detalles de una lista de videojuegos por sus IDs.
 */
async function getGamesByIds(gameIds: number[]): Promise<ChatProductItem[]> {
  if (!gameIds || gameIds.length === 0) return [];

  try {
    const supabase = await createClient();
    const { data: dbGames } = await supabase
      .from('games')
      .select('id, title, slug, cover_image_url, developer, base_price, discount_percent, final_price')
      .in('id', gameIds);

    if (dbGames && dbGames.length > 0) {
      return dbGames.map((g: any) => {
        const base = Number(g.base_price);
        const discount = g.discount_percent || 0;
        const finalPrice = g.final_price
          ? Number(g.final_price)
          : Math.round(base * (1 - discount / 100));

        return {
          id: g.id,
          title: g.title,
          slug: g.slug,
          coverUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
          developer: g.developer || 'Estudio Gamer',
          basePrice: base,
          discountPercent: discount,
          finalPrice,
        };
      });
    }
  } catch (err) {
    console.warn('Error fetching games in getGamesByIds:', err);
  }

  // Fallback a MOCK_GAMES
  return MOCK_GAMES.filter((g) => gameIds.includes(g.id)).map((g) => ({
    id: g.id,
    title: g.title,
    slug: g.slug,
    coverUrl: g.cover_image_url || '/games/neon-odyssey.jpg',
    developer: g.developer || 'Estudio Gamer',
    basePrice: Number(g.base_price),
    discountPercent: g.discount_percent || 0,
    finalPrice: Number(g.final_price),
  }));
}

/**
 * Obtiene todas las sesiones de chat del usuario actual.
 */
export async function getChatSessionsAction(): Promise<ChatSession[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Sesión predeterminada para invitados
      return [
        {
          id: 'guest-session-default',
          userId: 'guest',
          title: 'Consultas Gamer de Bienvenida',
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, user_id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((s: any) => ({
        id: s.id,
        userId: s.user_id,
        title: s.title || 'Conversación Gamer',
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));
    }
  } catch (err) {
    console.warn('Error loading chat sessions:', err);
  }

  return [];
}

/**
 * Crea una nueva sesión de chat en Supabase.
 */
export async function createChatSessionAction(title: string = 'Nueva Consulta Gamer'): Promise<ChatSession> {
  const defaultSession: ChatSession = {
    id: `session-${Date.now()}`,
    userId: 'guest',
    title,
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return defaultSession;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title,
      })
      .select('id, user_id, title, created_at')
      .single();

    if (!error && data) {
      revalidatePath('/chat');
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        createdAt: data.created_at,
      };
    }
  } catch (err) {
    console.warn('Error creating chat session:', err);
  }

  return defaultSession;
}

/**
 * Obtiene los mensajes de una sesión específica.
 */
export async function getChatMessagesAction(sessionId: string): Promise<ChatMessage[]> {
  try {
    const supabase = await createClient();
    const { data: dbMessages, error } = await supabase
      .from('chat_messages')
      .select('id, session_id, sender, content, metadata_json, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && dbMessages && dbMessages.length > 0) {
      // Recopilar todos los IDs de juegos recomendados desde metadata_json
      const allGameIds = Array.from(
        new Set(
          dbMessages.flatMap((m: any) => {
            const meta = m.metadata_json;
            if (meta && typeof meta === 'object' && Array.isArray(meta.recommended_game_ids)) {
              return meta.recommended_game_ids;
            }
            return [];
          })
        )
      );

      const gamesMap = new Map<number, ChatProductItem>();
      if (allGameIds.length > 0) {
        const gamesList = await getGamesByIds(allGameIds);
        gamesList.forEach((g) => gamesMap.set(g.id, g));
      }

      return dbMessages.map((m: any) => {
        const meta = m.metadata_json;
        const gameIds: number[] =
          meta && typeof meta === 'object' && Array.isArray(meta.recommended_game_ids)
            ? meta.recommended_game_ids
            : [];

        const recGames = gameIds
          .map((id) => gamesMap.get(id))
          .filter(Boolean) as ChatProductItem[];

        const senderStr = m.sender || 'ASSISTANT';
        const role = senderStr.toLowerCase() as 'user' | 'assistant' | 'system';

        return {
          id: String(m.id),
          sessionId: m.session_id,
          role,
          content: m.content,
          recommendedGameIds: gameIds,
          recommendedGames: recGames,
          createdAt: m.created_at,
        };
      });
    }
  } catch (err) {
    console.warn('Error fetching chat messages:', err);
  }

  // Mensaje de bienvenida inicial por defecto si la sesión está vacía
  return [
    {
      id: 'welcome-msg',
      sessionId,
      role: 'assistant',
      content: `¡Hola, **Gamer**! 🎮 Soy **ViniChat**, tu copiloto de Inteligencia Artificial en **ViniGames**.\n\nPuedo recomendarte videojuegos según tus géneros favoritos, encontrar ofertas exclusivas o ayudarte a armar tu próxima colección.\n\n¿Qué tipo de aventura buscas hoy?`,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Genera una respuesta inteligente gamer basada en el texto del usuario.
 */
function generateAssistantReply(userQuery: string): {
  content: string;
  recommendedGameIds: number[];
} {
  const query = userQuery.toLowerCase();

  if (query.includes('adn') || query.includes('recomiend') || query.includes('perfil') || query.includes('favorito')) {
    return {
      content: `Analizando tu **ADN Gamer** y preferencias de juego... 🧬⚡\n\nDetecto una afinidad por experiencias inmersivas de alta intensidad y mundos futuristas. Aquí tienes mis títulos recomendados del catálogo:`,
      recommendedGameIds: [1, 2], // Neon Odyssey, Cyber Rush 2077
    };
  }

  if (query.includes('oferta') || query.includes('descuento') || query.includes('barato') || query.includes('promocion')) {
    return {
      content: `¡Modo cazador de ofertas activado! 🏷️🔥\n\nEstos son los títulos con los **mayores descuentos activos** en la tienda en este momento. ¡Aprovecha antes de que finalice la promoción!`,
      recommendedGameIds: [1, 3], // Neon Odyssey (30%), Shadow Blade (25%)
    };
  }

  if (query.includes('coop') || query.includes('amigo') || query.includes('multijugador') || query.includes('equipo')) {
    return {
      content: `¡Nada mejor que jugar en escuadrón! 👥⚔️\n\nTe recomiendo estos videojuegos cooperativos y multijugador para dominar las partidas en equipo:`,
      recommendedGameIds: [4, 5], // Galactic Tactics, Dragon's Legacy
    };
  }

  if (query.includes('estrategia') || query.includes('sci-fi') || query.includes('espaci') || query.includes('tactica')) {
    return {
      content: `Para comandantes y mentes tácticas del cosmos 🌌♟️\n\nAquí tienes las mejores opciones de estrategia y ciencia ficción disponibles en ViniGames:`,
      recommendedGameIds: [4, 1], // Galactic Tactics, Neon Odyssey
    };
  }

  if (query.includes('rpg') || query.includes('rol') || query.includes('fantasia') || query.includes('magia')) {
    return {
      content: `Embarcate en una epopeya legendaria 🐉✨\n\nEste videojuego te ofrece cientos de horas de exploración, árboles de habilidades y combate épico:`,
      recommendedGameIds: [5, 2], // Dragon's Legacy, Cyber Rush 2077
    };
  }

  // Respuesta general de catálogo
  return {
    content: `He explorado el catálogo de **ViniGames** para responder a tu consulta sobre *"${userQuery}"*.\n\nTe sugiero echarle un vistazo a estos títulos destacados que se adaptan a lo que buscas:`,
    recommendedGameIds: [1, 2],
  };
}

/**
 * Envía un mensaje en la sesión de chat, genera la respuesta del asistente y la persiste.
 */
export async function sendChatMessageAction(input: {
  sessionId: string;
  content: string;
}): Promise<{
  success: boolean;
  userMessage?: ChatMessage;
  assistantMessage?: ChatMessage;
  error?: string;
}> {
  try {
    const { sessionId, content } = input;
    if (!content.trim()) {
      return { success: false, error: 'El mensaje no puede estar vacío.' };
    }

    const now = new Date().toISOString();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Mensaje del Usuario
    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sessionId,
      role: 'user',
      content: content.trim(),
      createdAt: now,
    };

    // 2. Generar Respuesta Asistente
    const { content: replyContent, recommendedGameIds } = generateAssistantReply(content);
    const recommendedGames = await getGamesByIds(recommendedGameIds);

    const assistantMsgId = `assistant-${Date.now() + 1}`;
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      sessionId,
      role: 'assistant',
      content: replyContent,
      recommendedGameIds,
      recommendedGames,
      createdAt: new Date(Date.now() + 100).toISOString(),
    };

    // 3. Persistir en Supabase si el usuario está autenticado y la sesión es válida (UUID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId);

    if (user && isUuid) {
      try {
        await supabase.from('chat_messages').insert([
          {
            session_id: sessionId,
            sender: 'USER' as const,
            content: userMessage.content,
            metadata_json: {},
          },
          {
            session_id: sessionId,
            sender: 'ASSISTANT' as const,
            content: assistantMessage.content,
            metadata_json: { recommended_game_ids: recommendedGameIds },
          },
        ]);

        // Actualizar título de sesión si es el primer mensaje
        await supabase
          .from('chat_sessions')
          .update({
            title: content.slice(0, 35) + (content.length > 35 ? '...' : ''),
            updated_at: now,
          })
          .eq('id', sessionId);
      } catch (dbErr) {
        console.warn('Error saving chat message to Supabase:', dbErr);
      }
    }

    revalidatePath('/chat');

    return {
      success: true,
      userMessage,
      assistantMessage,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Error al procesar el mensaje en ViniChat',
    };
  }
}

/**
 * Elimina una sesión de chat.
 */
export async function deleteChatSessionAction(sessionId: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('chat_sessions').delete().eq('id', sessionId).eq('user_id', user.id);
    }

    revalidatePath('/chat');
    return { success: true };
  } catch {
    return { success: true };
  }
}
