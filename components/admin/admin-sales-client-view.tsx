'use client';

import React, { useState, useMemo } from 'react';
import { Download, RefreshCw, ShieldCheck, DollarSign, FileSpreadsheet } from 'lucide-react';
import { AdminOrder, FinancialKPIs } from '@/types/admin-sales.types';
import { KPIFinancialCards } from './kpi-financial-cards';
import { RevenueChart } from './revenue-chart';
import { SalesFilters, SalesFilterState } from './sales-filters';
import { SalesTable } from './sales-table';
import { OrderDetailModal } from './order-detail-modal';
import { exportOrdersToCSV, OrderExportRow } from '@/lib/utils/csv-exporter';

interface AdminSalesClientViewProps {
  initialOrders: AdminOrder[];
  initialKPIs: FinancialKPIs;
}

const DEFAULT_FILTERS: SalesFilterState = {
  searchQuery: '',
  status: 'ALL',
  datePreset: 'ALL',
  sortBy: 'newest',
};

export function AdminSalesClientView({
  initialOrders,
  initialKPIs,
}: AdminSalesClientViewProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [filters, setFilters] = useState<SalesFilterState>(DEFAULT_FILTERS);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filtrado reactivo en el cliente
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Filtro por término de búsqueda (código, username, email)
        if (filters.searchQuery.trim() !== '') {
          const query = filters.searchQuery.toLowerCase().trim();
          const matchCode = order.orderCode.toLowerCase().includes(query);
          const matchUser = order.username.toLowerCase().includes(query);
          const matchEmail = order.email.toLowerCase().includes(query);
          if (!matchCode && !matchUser && !matchEmail) return false;
        }

        // Filtro por estado
        if (filters.status !== 'ALL' && order.status !== filters.status) {
          return false;
        }

        // Filtro por rango de fecha
        if (filters.datePreset !== 'ALL') {
          const orderDate = new Date(order.createdAt).getTime();
          const now = Date.now();
          if (filters.datePreset === '7d' && now - orderDate > 1000 * 60 * 60 * 24 * 7) {
            return false;
          }
          if (filters.datePreset === '30d' && now - orderDate > 1000 * 60 * 60 * 24 * 30) {
            return false;
          }
          if (filters.datePreset === 'month') {
            const currentMonth = new Date().getMonth();
            const orderMonth = new Date(order.createdAt).getMonth();
            if (currentMonth !== orderMonth) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'highest_price') {
          return b.total - a.total;
        }
        if (filters.sortBy === 'lowest_price') {
          return a.total - b.total;
        }
        // Por defecto: newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [orders, filters]);

  // Manejador de exportación a CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const exportRows: OrderExportRow[] = filteredOrders.map((o) => ({
        orderCode: o.orderCode,
        createdAt: o.createdAt,
        username: o.username,
        email: o.email,
        gamesCount: o.items.length,
        gamesList: o.items.map((i) => i.title).join(' | '),
        subtotal: o.subtotal,
        discountTotal: o.discountTotal,
        total: o.total,
        paymentMethod: o.paymentMethod,
        status: o.status,
      }));

      exportOrdersToCSV(exportRows, 'auditoria_ventas_vinigames');
    } catch (err) {
      console.error('Error exportando CSV:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header Principal de la Sección de Ventas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2E334A] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-[#783DF2]/15 border border-[#783DF2]/40 flex items-center justify-center text-[#783DF2]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Auditoría de Ventas y Finanzas
              </h1>
              <p className="text-xs md:text-sm text-zinc-400">
                Monitoreo comercial en vivo, registro de ingresos en Bolivianos (Bs.) y exportación
              </p>
            </div>
          </div>
        </div>

        {/* Botón de Exportación CSV */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting || filteredOrders.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>Exportar a CSV ({filteredOrders.length})</span>
          </button>
        </div>
      </div>

      {/* 1. Tarjetas de KPIs Financieros */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Indicadores Clave de Rendimiento (KPIs)
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Moneda: Bolivianos (Bs.)</span>
        </div>
        <KPIFinancialCards kpis={initialKPIs} />
      </section>

      {/* 2. Gráfico Interactivo de Ingresos en el Tiempo */}
      <section>
        <RevenueChart initialRange="7d" />
      </section>

      {/* 3. Filtros y Búsqueda de Órdenes */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Registro Histórico de Transacciones
          </h2>
          <span className="text-xs text-zinc-400">
            {filteredOrders.length} transacciones registradas
          </span>
        </div>

        <SalesFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          totalFiltered={filteredOrders.length}
        />

        {/* 4. Tabla de Auditoría */}
        <SalesTable
          orders={filteredOrders}
          onSelectOrder={(order) => setSelectedOrder(order)}
        />
      </section>

      {/* Modal de Desglose de Orden */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
