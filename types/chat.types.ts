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
