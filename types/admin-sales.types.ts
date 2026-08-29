export type OrderStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'FAILED';
export type PaymentMethod = 'SIMULATED_CARD' | 'GAMECOINS' | 'WALLET';

export interface OrderItemDetail {
  id: number;
  gameId: number;
  title: string;
  slug: string;
  coverUrl: string;
  developer: string;
  unitPrice: number;
  discountApplied: number;
  finalPrice: number;
}

export interface AdminOrder {
  id: number;
  orderCode: string;
  userId: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  subtotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemDetail[];
}

export interface FinancialKPIs {
  totalRevenueMonthly: number;
  revenueGrowthPercent: number;
  averageTicket: number;
  averageTicketGrowthPercent: number;
  totalCompletedOrders: number;
  totalOrders: number;
  totalDiscountsGiven: number;
  conversionRate: number;
}

export type TimeRange = '7d' | '30d' | '1y';

export interface RevenueDataPoint {
  date: string;
  label: string;
  revenue: number;
  ordersCount: number;
}
