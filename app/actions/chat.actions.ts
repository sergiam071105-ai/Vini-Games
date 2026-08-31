'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ChatSession, ChatMessage, ChatProductItem, N8nChatPayload, N8nChatResponse } from '@/types/chat.types';
import { MOCK_GAMES } from '@/lib/mock-data/games';
import { sendChatMessageSchema } from '@/lib/schemas/chat.schema';

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
 * Crea una nueva sesión de chat.
 */
export async function createChatSessionAction(title?: string): Promise<ChatSession | null> {
  const sessionTitle = title || 'Nueva Consulta Gamer';
  const now = new Date().toISOString();

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        id: `guest-${Date.now()}`,
        userId: 'guest',
        title: sessionTitle,
        createdAt: now,
      };
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: sessionTitle,
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
    console.warn('Error creating chat session in DB:', err);
  }

  return {
    id: `local-${Date.now()}`,
    userId: 'guest',
    title: sessionTitle,
    createdAt: now,
  };
}

/**
 * Elimina una sesión de chat existente.
 */
export async function deleteChatSessionAction(sessionId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (!error) {
      revalidatePath('/chat');
      return true;
    }
  } catch (err) {
    console.warn('Error deleting chat session:', err);
  }
  return false;
}

/**
 * Obtiene los mensajes de una sesión de chat específica.
 */
export async function getChatMessagesAction(sessionId: string): Promise<ChatMessage[]> {
  if (!sessionId) return [];

  try {
    const supabase = await createClient();
    const { data: dbMessages, error } = await supabase
      .from('chat_messages')
      .select('id, session_id, sender, content, metadata_json, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && dbMessages && dbMessages.length > 0) {
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
 * Limpia y extrae el texto conversacional y los IDs recomendados,
 * eliminando bloques de formato ```json o estructuras JSON no deseadas del mensaje visible.
 */
function cleanAndExtractChatReply(rawInput: any): {
  reply: string;
  recommendedGameIds: number[];
} {
  if (!rawInput) {
    return {
      reply: '¡Hola! Soy ViniChat. ¿En qué videojuegos o aventuras puedo ayudarte hoy?',
      recommendedGameIds: [],
    };
  }

  let text = typeof rawInput === 'string' ? rawInput : (rawInput.reply || rawInput.output || rawInput.message || rawInput.content || JSON.stringify(rawInput));
  let recommendedIds: number[] = Array.isArray(rawInput.recommended_game_ids) ? rawInput.recommended_game_ids : [];

  // 1. Si contiene un bloque markdown con json: ```json { "reply": "...", ... } ```
  const jsonBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1]);
      if (parsed.reply && typeof parsed.reply === 'string') {
        text = parsed.reply;
      } else if (parsed.content && typeof parsed.content === 'string') {
        text = parsed.content;
      }
      if (Array.isArray(parsed.recommended_game_ids) && parsed.recommended_game_ids.length > 0) {
        recommendedIds = [...recommendedIds, ...parsed.recommended_game_ids];
      }
    } catch {
      // Ignorar fallo y continuar con regex
    }
  }

  // 2. Si es o contiene un objeto JSON plano {... "reply": "..." ...}
  const plainJsonMatch = text.match(/\{[\s\r\n]*"reply"[\s\S]*?\}/);
  if (plainJsonMatch) {
    try {
      const parsed = JSON.parse(plainJsonMatch[0]);
      if (parsed.reply && typeof parsed.reply === 'string') {
        text = parsed.reply;
      }
      if (Array.isArray(parsed.recommended_game_ids) && parsed.recommended_game_ids.length > 0) {
        recommendedIds = [...recommendedIds, ...parsed.recommended_game_ids];
      }
    } catch {
      // Continuar con regex de respaldo
    }
  }

  // 3. Extraer etiquetas [RECOMMENDED_IDS: 1, 2] si el LLM las generó
  const idMatch = text.match(/\[RECOMMENDED_IDS:\s*([\d,\s]+)\]/i);
  if (idMatch && idMatch[1]) {
    const extracted = idMatch[1]
      .split(',')
      .map((s: string) => parseInt(s.trim(), 10))
      .filter((n: number) => !isNaN(n) && n > 0);
    if (extracted.length > 0) {
      recommendedIds = [...recommendedIds, ...extracted];
    }
  }

  // 4. Limpieza estricta de cualquier residuo de formato ```json o JSON
  let cleanText = text
    .replace(/\[RECOMMENDED_IDS:\s*[\d,\s]+\]/gi, '')
    .replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/gi, '')
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();

  // Si tras la limpieza quedó alguna llave JSON huérfana o campo "reply":
  if (cleanText.includes('"reply":')) {
    const replyRegexMatch = cleanText.match(/"reply"\s*:\s*"([^"]+)"/);
    if (replyRegexMatch && replyRegexMatch[1]) {
      cleanText = replyRegexMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    }
  }

  // Desduplicar IDs válidos
  const uniqueIds = Array.from(
    new Set(
      recommendedIds
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0)
    )
  );

  return {
    reply: cleanText || '¡Hola! ¿En qué juego o género del catálogo puedo asesorarte?',
    recommendedGameIds: uniqueIds,
  };
}

/**
 * Genera una respuesta gamer inteligente de contingencia basada en el texto del usuario.
 */
function generateLocalAssistantReply(userQuery: string): {
  content: string;
  recommendedGameIds: number[];
} {
  const query = userQuery.toLowerCase();

  // Exploración & Mundos Abiertos
  if (
    query.includes('explora') ||
    query.includes('mundo abierto') ||
    query.includes('open world') ||
    query.includes('descubr') ||
    query.includes('viaje')
  ) {
    return {
      content: `¡La pasión por descubrir nuevos horizontes es incomparable! 🗺️✨\n\nSi buscas exploración libre, secretos ocultos y paisajes impresionantes, te recomiendo totalmente estos títulos destacados de nuestro catálogo:`,
      recommendedGameIds: [27, 28, 2], // Zelda Tears of the Kingdom, Super Mario Odyssey, Elden Ring
    };
  }

  // Juegos de Nintendo
  if (
    query.includes('nintendo') ||
    query.includes('zelda') ||
    query.includes('mario') ||
    query.includes('switch') ||
    query.includes('pokemon') ||
    query.includes('smash')
  ) {
    return {
      content: `¡El universo mágico de **Nintendo** está disponible en ViniGames! 🍄⭐\n\nAquí tienes las obras maestras más aclamadas por la crítica con diversión garantizada para un jugador o en multijugador local:`,
      recommendedGameIds: [27, 29, 30], // Zelda, Super Smash Bros Ultimate, Mario Kart 8
    };
  }

  // RPG & Rol
  if (
    query.includes('rpg') ||
    query.includes('rol') ||
    query.includes('fantasia') ||
    query.includes('magia') ||
    query.includes('witcher') ||
    query.includes('baldur')
  ) {
    return {
      content: `¡Los juegos de rol ofrecen las historias y mecánicas más profundas! 🧙‍♂️⚔️\n\nTe recomiendo sumergirte en estas epopeyas donde cada decisión y combate forjan tu propio destino:`,
      recommendedGameIds: [5, 21, 2], // Baldur's Gate 3, The Witcher 3, Elden Ring
    };
  }

  // Acción & Disparos & Superhéroes
  if (
    query.includes('accion') ||
    query.includes('combate') ||
    query.includes('lucha') ||
    query.includes('dispar') ||
    query.includes('shooter') ||
    query.includes('doom') ||
    query.includes('spiderman') ||
    query.includes('gta')
  ) {
    return {
      content: `¡Pura adrenalina, reflejos al límite y acción desenfrenada! 💥🎮\n\nEstos son los títulos de acción y combate más espectaculares disponibles en ViniGames:`,
      recommendedGameIds: [19, 20, 25], // GTA VI, Marvel's Spider-Man 2, DOOM The Dark Ages
    };
  }

  // Terror & Supervivencia
  if (
    query.includes('terror') ||
    query.includes('miedo') ||
    query.includes('horror') ||
    query.includes('supervivencia') ||
    query.includes('survival') ||
    query.includes('zombie')
  ) {
    return {
      content: `¡Prepárate para la tensión constante y la atmósfera inquietante! 🧟🔦\n\nEstos videojuegos de terror psicológico y supervivencia te mantendrán al borde del asiento:`,
      recommendedGameIds: [13, 14], // Resident Evil 4, Silent Hill 2
    };
  }

  // Carreras & Velocidad
  if (
    query.includes('carrera') ||
    query.includes('auto') ||
    query.includes('carro') ||
    query.includes('velocidad') ||
    query.includes('conducir') ||
    query.includes('forza')
  ) {
    return {
      content: `¡Ajusta tu cinturón y prepárate para la pista! 🏎️💨\n\nTe sugiero estos títulos de velocidad y conducción de primer nivel:`,
      recommendedGameIds: [30, 16], // Mario Kart 8 Deluxe, Forza Horizon 5
    };
  }

  // Indies & Roguelikes
  if (
    query.includes('indie') ||
    query.includes('rogue') ||
    query.includes('metroid') ||
    query.includes('hades') ||
    query.includes('hollow')
  ) {
    return {
      content: `¡Joyas independientes con arte deslumbrante y jugabilidad magistral! 🗡️✨\n\nEstos títulos indie galardonados te ofrecerán desafíos únicos y rejugabilidad infinita:`,
      recommendedGameIds: [3, 18, 32], // Hollow Knight, Hades II, Metroid Dread
    };
  }

  // Ofertas & Descuentos
  if (
    query.includes('oferta') ||
    query.includes('descuento') ||
    query.includes('barato') ||
    query.includes('promocion') ||
    query.includes('precio')
  ) {
    return {
      content: `¡Modo cazador de ofertas activado! 🏷️🔥\n\nEstos son los títulos con los **mayores descuentos activos** en la tienda en este momento. ¡Aprovecha antes de que finalice la promoción!`,
      recommendedGameIds: [21, 3, 20], // The Witcher 3 (60%), Hollow Knight (50%), Spider-Man 2 (-25%)
    };
  }

  // Cooperativo & Amigos
  if (
    query.includes('coop') ||
    query.includes('amigo') ||
    query.includes('multijugador') ||
    query.includes('equipo') ||
    query.includes('online')
  ) {
    return {
      content: `¡Nada mejor que jugar en escuadrón y compartir la victoria! 👥⚔️\n\nTe recomiendo estos videojuegos cooperativos y multijugador para dominar las partidas en equipo:`,
      recommendedGameIds: [5, 11, 29], // Baldur's Gate 3, GTA V, Super Smash Bros Ultimate
    };
  }

  // Estrategia & Simulación
  if (
    query.includes('estrategia') ||
    query.includes('tactica') ||
    query.includes('gestion') ||
    query.includes('simulac') ||
    query.includes('stardew')
  ) {
    return {
      content: `Para estrategas y constructores de imperios 🌌♟️\n\nAquí tienes las mejores opciones de estrategia y simulación disponibles en ViniGames:`,
      recommendedGameIds: [22, 23, 24], // Civilization VI, Age of Empires IV, Stardew Valley
    };
  }

  // ADN Gamer & Recomendaciones generales
  if (query.includes('adn') || query.includes('recomiend') || query.includes('perfil') || query.includes('favorito')) {
    return {
      content: `Analizando tu **ADN Gamer** y preferencias de juego... 🧬⚡\n\nDetecto una afinidad por experiencias inmersivas y mundos épicos. Aquí tienes mis títulos recomendados del catálogo:`,
      recommendedGameIds: [1, 2], // Cyberpunk 2077, Elden Ring
    };
  }

  return {
    content: `He explorado el catálogo de **ViniGames** para responder a tu consulta sobre *"${userQuery}"*.\n\nTe sugiero echarle un vistazo a estos títulos destacados que se adaptan a lo que buscas:`,
    recommendedGameIds: [27, 1, 2], // Zelda Tears of the Kingdom, Cyberpunk 2077, Elden Ring
  };
}

/**
 * Invocación directa a NVIDIA AI Foundation Endpoints (NVIDIA NIM / build.nvidia.com)
 * Compatible con modelos como meta/llama-3.3-70b-instruct, deepseek-ai/deepseek-r1, etc.
 */
async function callNvidiaAiEndpoint(
  userQuery: string,
  userProfile?: any,
  ownedGames?: any[]
): Promise<{ reply: string; recommendedGameIds: number[] } | null> {
  const apiKey = process.env.NVIDIA_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) return null;

  try {
    const catalogSummary = MOCK_GAMES.map(
      (g) => `ID ${g.id}: ${g.title} (${g.categories.map((c) => c.name).join(', ')}) - Bs. ${g.final_price}`
    ).join('\n');

    const systemPrompt = `Eres ViniChat, el copiloto gamer y asistente de inteligencia artificial oficial de la plataforma de videojuegos ViniGames.
Tu misión es asesorar a los jugadores con entusiasmo, recomendar videojuegos del catálogo según sus gustos, resolver dudas y ayudarles con ofertas.
Responde de manera natural y conversacional en español con formato Markdown atractivo, emojis gamer y tono amigable.
IMPORTANTE: NO devuelvas bloques de código JSON con \`\`\`json. Responde directamente con texto conversacional.
Si recomiendas juegos específicos del catálogo, menciona sus títulos claramente.
Al final de tu respuesta, en una línea separada, incluye SIEMPRE la etiqueta: [RECOMMENDED_IDS: 1, 2] con los IDs numéricos de los juegos que recomendaste (máximo 3 IDs de la lista).

Catálogo disponible en ViniGames:
${catalogSummary}
${userProfile ? `Perfil del usuario: Nivel ${userProfile.current_level}` : ''}
${ownedGames && ownedGames.length > 0 ? `Juegos en biblioteca del usuario: ${ownedGames.map((g) => g.title).join(', ')}` : ''}`;

    const modelName = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\nConsulta del usuario gamer: ${userQuery}` },
        ],
        temperature: 0.5,
        max_tokens: 350,
      }),
    });

    if (!res.ok) {
      console.warn('NVIDIA API returned error status:', res.status);
      return null;
    }

    const data = await res.json();
    const rawReply = data.choices?.[0]?.message?.content || '';

    return cleanAndExtractChatReply(rawReply);
  } catch (err) {
    console.warn('Error calling NVIDIA AI API:', err);
    return null;
  }
}

/**
 * Envía un mensaje en la sesión de chat, invoca el webhook n8n/DeepSeek/NVIDIA o fallback, y persiste en Supabase.
 */
export async function sendChatMessageAction(input: {
  sessionId: string;
  content?: string;
  message?: string;
}): Promise<{
  success: boolean;
  userMessage?: ChatMessage;
  assistantMessage?: ChatMessage;
  recommendedGames?: ChatProductItem[];
  error?: string;
}> {
  try {
    const rawMessage = input.content || input.message || '';
    const parsed = sendChatMessageSchema.safeParse({
      sessionId: input.sessionId,
      message: rawMessage.trim(),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Mensaje inválido.' };
    }

    const { sessionId, message: userContent } = parsed.data;
    const now = new Date().toISOString();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Mensaje del Usuario
    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sessionId,
      role: 'user',
      content: userContent,
      createdAt: now,
    };

    // 2. Extraer contexto del usuario para n8n (Gamer DNA & Biblioteca)
    let replyContent: string;
    let recommendedGameIds: number[] = [];

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_VINICHAT_WEBHOOK_URL;
    let n8nSuccess = false;

    if (n8nWebhookUrl) {
      try {
        let userProfileData = undefined;
        let ownedGamesData = undefined;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, total_xp, current_level, dna_exploration, dna_competitive, dna_narrative, dna_collection')
            .eq('id', user.id)
            .single();

          if (profile) {
            userProfileData = {
              username: profile.username,
              total_xp: profile.total_xp || 0,
              current_level: profile.current_level || 1,
              gamer_dna: {
                exploration: profile.dna_exploration || 25,
                competitive: profile.dna_competitive || 25,
                narrative: profile.dna_narrative || 25,
                collection: profile.dna_collection || 25,
              },
            };
          }

          const { data: library } = await supabase
            .from('user_library')
            .select('game_id, games ( id, title )')
            .eq('user_id', user.id);

          if (library) {
            ownedGamesData = library.map((l: any) => ({
              id: l.game_id,
              title: l.games?.title || `Juego #${l.game_id}`,
            }));
          }
        }

        const payload: N8nChatPayload = {
          session_id: sessionId,
          user_id: user?.id,
          message: userContent,
          user_profile: userProfileData,
          owned_games: ownedGamesData,
          available_games_catalog: MOCK_GAMES.map((g) => ({
            id: g.id,
            title: g.title,
            slug: g.slug,
            developer: g.developer,
            base_price: g.base_price,
            discount_percent: g.discount_percent,
            final_price: g.final_price,
            categories: g.categories.map((c) => c.name),
          })),
        };

        const controller = new AbortController();
        // Aumentamos el timeout a 25 segundos para permitir que n8n y los LLMs procesen respuestas completas
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const res = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const n8nData: any = await res.json();
          if (n8nData) {
            const rawContent = n8nData.reply || n8nData.output || n8nData.message || n8nData.content || (typeof n8nData === 'string' ? n8nData : null);
            if (rawContent) {
              const cleaned = cleanAndExtractChatReply(rawContent);
              replyContent = cleaned.reply;
              // Si n8n trajo IDs en el objeto raíz, combinarlos con los extraídos del texto
              if (Array.isArray(n8nData.recommended_game_ids) && n8nData.recommended_game_ids.length > 0) {
                recommendedGameIds = Array.from(new Set([...cleaned.recommendedGameIds, ...n8nData.recommended_game_ids]));
              } else {
                recommendedGameIds = cleaned.recommendedGameIds;
              }
              n8nSuccess = true;
            }
          }
        }
      } catch (webhookErr) {
        console.warn('n8n webhook timeout or unreachable, attempting AI direct fallback:', webhookErr);
      }
    }

    // Si n8n no respondió, intentar directamente con la API de NVIDIA si está configurada
    if (!n8nSuccess && (process.env.NVIDIA_API_KEY || process.env.AI_API_KEY)) {
      try {
        const nvidiaResult = await callNvidiaAiEndpoint(
          userContent,
          user ? { current_level: 2, gamer_dna: { exploration: 25, competitive: 25 } } : undefined
        );
        if (nvidiaResult && nvidiaResult.reply) {
          replyContent = nvidiaResult.reply;
          recommendedGameIds = nvidiaResult.recommendedGameIds;
          n8nSuccess = true;
        }
      } catch (nvidiaErr) {
        console.warn('Error with NVIDIA AI fallback:', nvidiaErr);
      }
    }

    if (!n8nSuccess) {
      const fallback = generateLocalAssistantReply(userContent);
      replyContent = fallback.content;
      recommendedGameIds = fallback.recommendedGameIds;
    }

    const recommendedGames = await getGamesByIds(recommendedGameIds);

    const assistantMsgId = `assistant-${Date.now() + 1}`;
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      sessionId,
      role: 'assistant',
      content: replyContent!,
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

        await supabase
          .from('chat_sessions')
          .update({
            title: userContent.slice(0, 35) + (userContent.length > 35 ? '...' : ''),
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
      recommendedGames,
    };
  } catch (err: any) {
    console.error('Error in sendChatMessageAction:', err);
    return {
      success: false,
      error: err?.message || 'Ocurrió un error inesperado al procesar el mensaje.',
    };
  }
}
