'use client';

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Receipt, CreditCard } from 'lucide-react';
import { AdminOrder } from '@/types/admin-sales.types';

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            COMPLETADA
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            PENDIENTE
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            CANCELADA
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-2xl overflow-hidden flex flex-col">
      {/* Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131521] border-b border-[#2E334A] text-[11px] uppercase font-bold text-zinc-400 tracking-wider">
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
          <tbody className="divide-y divide-[#2E334A]/60">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-[#23273A]/60 transition-colors cursor-pointer group"
                >
                  {/* Código */}
                  <td className="py-4 px-5 font-mono font-bold text-[#1FD1EB] group-hover:text-white transition-colors">
                    {order.orderCode}
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-5 text-zinc-300 text-xs whitespace-nowrap">
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
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#783DF2] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {order.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold text-xs truncate">
                          @{order.username}
                        </div>
                        <div className="text-zinc-500 text-[11px] truncate">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Juegos */}
                  <td className="py-4 px-5 text-center">
                    <span className="bg-[#090B14] border border-[#2E334A] text-zinc-300 text-xs px-2.5 py-1 rounded-lg font-semibold">
                      {order.items.length} {order.items.length === 1 ? 'juego' : 'juegos'}
                    </span>
                  </td>

                  {/* Método de Pago */}
                  <td className="py-4 px-5 text-zinc-400 text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#783DF2]" />
                      {order.paymentMethod === 'SIMULATED_CARD' ? 'Tarjeta Virtual' : order.paymentMethod}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="font-bold text-white text-sm">
                      Bs. {order.total.toFixed(2)}
                    </div>
                    {order.discountTotal > 0 && (
                      <div className="text-[10px] text-emerald-400 font-semibold">
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
                      className="p-2 text-zinc-400 hover:text-white bg-[#090B14] hover:bg-[#783DF2] border border-[#2E334A] hover:border-[#783DF2] rounded-xl transition-all"
                      title="Inspeccionar detalle de la orden"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#090B14] border border-[#2E334A] flex items-center justify-center text-zinc-600">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-white">No se encontraron órdenes</div>
                    <div className="text-xs text-zinc-500 max-w-sm">
                      No hay transacciones registradas que coincidan con los filtros o el término de búsqueda ingresado.
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2E334A] bg-[#131521] text-xs">
          <span className="text-zinc-400">
            Página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong> ({orders.length} órdenes en total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-[#090B14] border border-[#2E334A] text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold transition-all ${
                  currentPage === page
                    ? 'bg-[#783DF2] text-white shadow-[0_0_10px_rgba(120,61,242,0.4)]'
                    : 'bg-[#090B14] border border-[#2E334A] text-zinc-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-[#090B14] border border-[#2E334A] text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
