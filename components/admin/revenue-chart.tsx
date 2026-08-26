'use client';

import React, { useState } from 'react';
import { TimeRange, RevenueDataPoint } from '@/types/admin-sales.types';
import { getRevenueChartData } from '@/lib/mock-data/sales';
import { TrendingUp, Calendar, Zap, Sparkles } from 'lucide-react';

interface RevenueChartProps {
  initialRange?: TimeRange;
}

export function RevenueChart({ initialRange = '7d' }: RevenueChartProps) {
  const [range, setRange] = useState<TimeRange>(initialRange);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data: RevenueDataPoint[] = getRevenueChartData(range);

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);
  const totalPeriodRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.ordersCount, 0);
  const avgRevenue = data.length > 0 ? totalPeriodRevenue / data.length : 0;

  // Encontrar el punto máximo
  const peakPoint = [...data].sort((a, b) => b.revenue - a.revenue)[0];

  const rangeButtons: { id: TimeRange; label: string }[] = [
    { id: '7d', label: 'Últimos 7 Días' },
    { id: '30d', label: 'Últimos 30 Días' },
    { id: '1y', label: 'Histórico Anual' },
  ];

  return (
    <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-2xl p-6 flex flex-col gap-6">
      {/* Header del Gráfico con Selector de Período */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1FD1EB] animate-pulse" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Evolución de Ingresos y Facturación
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Monitoreo en tiempo real de volumen transaccional en Bolivianos (Bs.)
          </p>
        </div>

        {/* Pestañas selectoras */}
        <div className="flex items-center bg-[#090B14] p-1 rounded-xl border border-[#2E334A] self-start sm:self-auto">
          {rangeButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                setRange(btn.id);
                setHoveredIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                range === btn.id
                  ? 'bg-[#783DF2] text-white shadow-[0_0_15px_rgba(120,61,242,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1A1C2B]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas Resumen del Período */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#090B14]/80 rounded-xl border border-[#2E334A]/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#783DF2]/15 text-[#783DF2] border border-[#783DF2]/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">Total del Período</span>
            <div className="text-base font-bold text-white">
              Bs. {totalPeriodRevenue.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1FD1EB]/15 text-[#1FD1EB] border border-[#1FD1EB]/30 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">
              {range === '1y' ? 'Promedio Mensual' : 'Promedio Diario'}
            </span>
            <div className="text-base font-bold text-white">
              Bs. {avgRevenue.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 uppercase font-semibold">Pico Máximo</span>
            <div className="text-base font-bold text-emerald-400">
              Bs. {peakPoint ? peakPoint.revenue.toLocaleString('es-BO', { minimumFractionDigits: 2 }) : '0.00'}
              <span className="text-[10px] text-zinc-500 font-normal ml-1">({peakPoint?.label})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico Visual Interactivo */}
      <div className="relative pt-6 pb-2">
        {/* Tooltip flotante si está en hover */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="absolute top-0 right-4 bg-[#0B0D18] border border-[#783DF2] rounded-lg px-3 py-1.5 shadow-[0_0_20px_rgba(120,61,242,0.4)] z-20 pointer-events-none flex items-center gap-3 text-xs animate-in fade-in zoom-in-95">
            <span className="text-zinc-300 font-medium">{data[hoveredIndex].label}</span>
            <span className="text-[#1FD1EB] font-bold">
              Bs. {data[hoveredIndex].revenue.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
            </span>
            <span className="bg-[#783DF2]/30 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">
              {data[hoveredIndex].ordersCount} {data[hoveredIndex].ordersCount === 1 ? 'orden' : 'órdenes'}
            </span>
          </div>
        )}

        {/* Barras y Área SVG estilizada */}
        <div className="h-56 md:h-64 flex items-end justify-between gap-2 md:gap-3 px-2 border-b border-[#2E334A] pb-2">
          {data.map((item, index) => {
            const heightPercent = Math.max((item.revenue / maxRevenue) * 100, 6);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Indicador de valor superior */}
                <div
                  className={`text-[10px] font-bold mb-1 transition-opacity duration-200 truncate ${
                    isHovered ? 'text-[#1FD1EB] opacity-100' : 'text-zinc-500 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  Bs. {item.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(1)}k` : item.revenue.toFixed(0)}
                </div>

                {/* Barra de progreso interactiva con degradado */}
                <div className="w-full max-w-[48px] bg-[#090B14] rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 relative ${
                      isHovered
                        ? 'bg-gradient-to-t from-[#783DF2] via-[#9D68FF] to-[#1FD1EB] shadow-[0_0_20px_rgba(31,209,235,0.6)]'
                        : 'bg-gradient-to-t from-[#783DF2]/80 to-[#1FD1EB]/80 group-hover:from-[#783DF2] group-hover:to-[#1FD1EB]'
                    }`}
                  >
                    {/* Línea de brillo en la cima */}
                    <div className="w-full h-1 bg-white/40 rounded-t" />
                  </div>
                </div>

                {/* Etiqueta del Eje X */}
                <div className="mt-2 text-[10px] md:text-xs text-zinc-400 font-medium truncate w-full text-center group-hover:text-white transition-colors">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
