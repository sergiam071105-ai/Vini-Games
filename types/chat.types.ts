export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatProductItem {
  id: number;
  title: string;
  slug: string;
  coverUrl: string;
  developer: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  recommendedGameIds?: number[];
  recommendedGames?: ChatProductItem[];
  createdAt: string;
}

// Aliases para compatibilidad de tipos
export type ChatMessageItem = ChatMessage;
export type ChatSessionItem = ChatSession;

/**
 * Payload enviado al Webhook de n8n para procesamiento con DeepSeek.
 */
export interface N8nChatPayload {
  session_id: string;
  user_id?: string;
  message: string;
  user_profile?: {
    username: string | null;
    total_xp: number;
    current_level: number;
    gamer_dna: {
      exploration: number;
      competitive: number;
      narrative: number;
      collection: number;
    };
  };
  owned_games?: Array<{
    id: number;
    title: string;
  }>;
  available_games_catalog?: Array<{
    id: number;
    title: string;
    slug: string;
    developer: string;
    base_price: number;
    discount_percent: number;
    final_price: number;
    categories: string[];
  }>;
}

/**
 * Respuesta estructurada devuelta por el workflow de n8n / DeepSeek.
 */
export interface N8nChatResponse {
  reply: string;
  recommended_game_ids?: number[];
  intent?: 'recommendation' | 'support' | 'general_chat' | 'order_status';
  confidence?: number;
}

export interface SendChatMessageResult {
  success: boolean;
  userMessage?: ChatMessage;
  assistantMessage?: ChatMessage;
  recommendedGames?: ChatProductItem[];
  error?: string;
}
