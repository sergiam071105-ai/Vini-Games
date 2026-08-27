import { z } from 'zod';

export const salesTimeSeriesSchema = z.object({
  range: z.enum(['7d', '30d', '1y']),
});

export const logAdminAuditSchema = z.object({
  action: z.string().min(2, { message: 'La acción de auditoría es requerida' }),
  resource: z.string().min(2, { message: 'El recurso es requerido' }),
  details: z.record(z.string(), z.any()).optional(),
});

export const adminAuditLogsQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  actionFilter: z.string().optional(),
});

export type SalesTimeSeriesInput = z.infer<typeof salesTimeSeriesSchema>;
export type LogAdminAuditSchemaInput = z.infer<typeof logAdminAuditSchema>;
export type AdminAuditLogsQueryInput = z.infer<typeof adminAuditLogsQuerySchema>;
