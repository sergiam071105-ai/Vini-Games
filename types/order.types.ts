export interface CartGameItem {
  id: number;
  title: string;
  slug: string;
  coverUrl: string;
  developer: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  quantity?: number;
  addedAt: string;
}

export interface OrderSummary {
  orderCode: string;
  orderId?: number;
  userId: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: 'SIMULATED_CARD' | 'GAMECOINS' | 'WALLET';
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  items: {
    gameId: number;
    title: string;
    coverUrl?: string;
    unitPrice: number;
    discountApplied: number;
    finalPrice: number;
    quantity?: number;
  }[];
  xpAwarded: number;
}
