'use client';

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Receipt, CreditCard } from 'lucide-react';
import { AdminOrder } from '@/types/admin-sales.types';
import { getAvatarUrl } from '@/lib/utils/avatar-helper';

interface SalesTableProps {
  orders: AdminOrder[];
  onSelectOrder: (order: AdminOrder) => void;
}

export function SalesTable({ orders, onSelectOrder }: SalesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(orders.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            COMPLETADA
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            PENDIENTE
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-500/15 text-red-400 border border-red-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            CANCELADA
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1A1C2B] border border-[#2D3349] rounded-2xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      {/* Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#101321] border-b border-[#2D3349] text-[11px] uppercase font-black text-[#949CB2] tracking-wider">
            <tr>
              <th className="py-4 px-5">Código</th>
              <th className="py-4 px-5">Fecha y Hora</th>
              <th className="py-4 px-5">Comprador</th>
              <th className="py-4 px-5 text-center">Juegos</th>
              <th className="py-4 px-5">Método de Pago</th>
              <th className="py-4 px-5 text-right">Total (Bs.)</th>
              <th className="py-4 px-5 text-center">Estado</th>
              <th className="py-4 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D3349]/60">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-[#252A40]/60 transition-colors cursor-pointer group"
                >
                  {/* Código */}
                  <td className="py-4 px-5">
                    <span className="font-mono font-bold text-xs text-[#1FD1EB] bg-[#1FD1EB]/10 border border-[#1FD1EB]/30 px-2.5 py-1 rounded-lg shadow-sm group-hover:border-[#1FD1EB]/60 transition-all">
                      {order.orderCode}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-5 text-[#949CB2] text-xs whitespace-nowrap font-medium">
                    {new Date(order.createdAt).toLocaleString('es-BO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  {/* Comprador */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#783DF2] bg-[#1C1730] shrink-0 shadow-md">
                        <img
                          src={getAvatarUrl(order.avatarUrl, order.username)}
                          alt={order.username}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAvatarUrl(null, order.username);
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[#F5F7FF] font-bold text-xs truncate">
                          @{order.username}
                        </div>
                        <div className="text-[#949CB2] text-[11px] truncate">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Juegos */}
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#0D101D] border border-[#2D3349] text-zinc-300 text-xs px-2.5 py-1 rounded-lg font-bold">
                      {order.items.length} {order.items.length === 1 ? 'juego' : 'juegos'}
                    </span>
                  </td>

                  {/* Método de Pago */}
                  <td className="py-4 px-5 text-[#949CB2] text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-[#783DF2]" />
                      {order.paymentMethod === 'SIMULATED_CARD' ? 'Tarjeta Virtual' : order.paymentMethod}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="font-mono font-black text-[#F5F7FF] text-sm">
                      Bs. {order.total.toFixed(2)}
                    </div>
                    {order.discountTotal > 0 && (
                      <div className="text-[10px] text-emerald-400 font-bold">
                        Desc. -Bs. {order.discountTotal.toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-5 text-center whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Botón Ver Detalle */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      aria-label={`Ver desglose detallado de la transacción ${order.orderCode}`}
                      className="p-2 text-[#949CB2] hover:text-white bg-[#0D101D] hover:bg-[#783DF2] border border-[#2D3349] hover:border-[#783DF2] rounded-xl transition-all shadow-sm hover:shadow-[0_0_15px_rgba(120,61,242,0.5)] cursor-pointer"
                      title="Inspeccionar detalle de la orden"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-14 text-center text-[#949CB2]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0D101D] border border-[#2D3349] flex items-center justify-center text-[#949CB2]">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">No se encontraron órdenes</div>
                    <div className="text-xs text-[#949CB2] max-w-sm">
                      No hay transacciones registradas que coincidan con los filtros seleccionados.
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3349] bg-[#101321] text-xs">
          <span className="text-[#949CB2] font-medium">
            Página <strong className="text-white font-bold">{currentPage}</strong> de <strong className="text-white font-bold">{totalPages}</strong> ({orders.length} órdenes en total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Página anterior de transacciones"
              className="p-2 rounded-lg bg-[#0D101D] border border-[#2D3349] text-[#949CB2] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Ir a la página ${page}`}
                className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#783DF2] text-white shadow-[0_0_12px_rgba(120,61,242,0.5)]'
                    : 'bg-[#0D101D] border border-[#2D3349] text-[#949CB2] hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente de transacciones"
              className="p-2 rounded-lg bg-[#0D101D] border border-[#2D3349] text-[#949CB2] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
