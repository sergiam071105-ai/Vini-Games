export interface AdminDashboardMetrics {
  totalUsers: number;
  activeGames: number;
  monthlySalesBolivianos: number;
  pendingReviews: number;
  totalRevenue: number;
  totalOrders: number;
  streakRetentionRate: number;
  averageOrderValue: number;
  changes: {
    usersChangePercent: number;
    gamesChangePercent: number;
    salesChangePercent: number;
    reviewsChangePercent: number;
  };
}

export type SalesTimeSeriesRange = '7d' | '30d' | '1y';

export interface SalesTimeSeriesPoint {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface AdminAuditLogItem {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  details: Record<string, any> | null;
  createdAt: string;
  adminEmail?: string;
}

export interface LogAdminAuditInput {
  action: string;
  resource: string;
  details?: Record<string, any>;
}

export interface AdminAuditLogsResult {
  logs: AdminAuditLogItem[];
  total: number;
}
