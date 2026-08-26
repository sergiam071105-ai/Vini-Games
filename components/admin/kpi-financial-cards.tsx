'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, Percent, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { FinancialKPIs } from '@/types/admin-sales.types';

interface KPIFinancialCardsProps {
  kpis: FinancialKPIs;
}

export function KPIFinancialCards({ kpis }: KPIFinancialCardsProps) {
  const cards = [
    {
      id: 'revenue',
      title: 'Ventas Totales del Mes',
      value: `Bs. ${kpis.totalRevenueMonthly.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `+${kpis.revenueGrowthPercent}% vs mes anterior`,
      icon: DollarSign,
      iconBg: 'bg-[#783DF2]/15 text-[#783DF2] border-[#783DF2]/30',
      accentGlow: 'hover:border-[#783DF2]/60 hover:shadow-[0_0_25px_rgba(120,61,242,0.25)]',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'ticket',
      title: 'Ticket Promedio',
      value: `Bs. ${kpis.averageTicket.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `+${kpis.averageTicketGrowthPercent}% vs período previo`,
      icon: TrendingUp,
      iconBg: 'bg-[#1FD1EB]/15 text-[#1FD1EB] border-[#1FD1EB]/30',
      accentGlow: 'hover:border-[#1FD1EB]/60 hover:shadow-[0_0_25px_rgba(31,209,235,0.2)]',
      badgeColor: 'text-[#1FD1EB] bg-[#1FD1EB]/10 border-[#1FD1EB]/30',
    },
    {
      id: 'transactions',
      title: 'Transacciones Exitosas',
      value: `${kpis.totalCompletedOrders} órdenes`,
      subtitle: `${kpis.conversionRate.toFixed(1)}% tasa de éxito`,
      icon: Receipt,
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      accentGlow: 'hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'discounts',
      title: 'Descuentos Otorgados',
      value: `Bs. ${kpis.totalDiscountsGiven.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Ahorro total para gamers',
      icon: Percent,
      iconBg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      accentGlow: 'hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-[#1A1C2B] border border-[#2E334A] rounded-2xl p-5 md:p-6 transition-all duration-300 ${card.accentGlow} flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                {card.value}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {card.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
