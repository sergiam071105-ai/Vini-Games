'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Receipt, Calendar, User, Mail, CreditCard, ShieldCheck, Tag } from 'lucide-react';
import { AdminOrder } from '@/types/admin-sales.types';
import { getAvatarUrl } from '@/lib/utils/avatar-helper';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#1A1C2B] border border-[#2D3349] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D3349] bg-[#101321]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#783DF2] to-[#1FD1EB] flex items-center justify-center text-white shadow-[0_0_15px_rgba(120,61,242,0.4)]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-black text-white tracking-wider">
                  {order.orderCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  aria-label="Copiar código de orden al portapapeles"
                  className="p-1 text-[#949CB2] hover:text-white rounded transition-colors cursor-pointer"
                  title="Copiar código"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-xs text-[#949CB2]">
                Auditoría de Comprobante Transaccional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <button
              onClick={onClose}
              aria-label="Cerrar modal de detalle de orden"
              className="p-2 text-[#949CB2] hover:text-white rounded-xl bg-[#1A1C2B] border border-[#2D3349] hover:border-[#783DF2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadatos del Comprador y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#0D101D] rounded-xl border border-[#2D3349]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#783DF2] bg-[#1C1730] shrink-0 shadow-md">
                <img
                  src={getAvatarUrl(order.avatarUrl, order.username)}
                  alt={order.username}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAvatarUrl(null, order.username);
                  }}
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] text-[#949CB2] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1FD1EB]" /> Usuario Comprador
                </span>
                <div className="text-sm font-bold text-white truncate">@{order.username}</div>
                <div className="text-xs text-[#949CB2] flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-zinc-500" /> {order.email}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#949CB2] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#783DF2]" /> Fecha y Hora
              </span>
              <div className="text-sm font-bold text-white">
                {new Date(order.createdAt).toLocaleString('es-BO', {
                  dateStyle: 'long',
                  timeStyle: 'medium',
                })}
              </div>
              <div className="text-xs text-[#949CB2] flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-zinc-500" /> Método: {order.paymentMethod === 'SIMULATED_CARD' ? 'Tarjeta Virtual' : order.paymentMethod}
              </div>
            </div>
          </div>

          {/* Desglose de Videojuegos Adquiridos */}
          <div>
            <h3 className="text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#1FD1EB]" /> Videojuegos en la Orden ({order.items.length})
            </h3>

            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 bg-[#101321] border border-[#2D3349] rounded-xl hover:border-[#783DF2]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-14 h-14 rounded-lg object-cover bg-black border border-[#2D3349] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{item.title}</div>
                      <div className="text-xs text-[#949CB2]">{item.developer}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {item.discountApplied > 0 && (
                      <div className="text-xs text-[#949CB2] line-through font-mono">
                        Bs. {item.unitPrice.toFixed(2)}
                      </div>
                    )}
                    <div className="text-sm font-mono font-black text-[#1FD1EB]">
                      Bs. {item.finalPrice.toFixed(2)}
                    </div>
                    {item.discountApplied > 0 && (
                      <span className="inline-block text-[10px] text-emerald-400 font-bold">
                        Ahorro: -Bs. {item.discountApplied.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen Financiero */}
          <div className="border-t border-[#2D3349] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#949CB2] font-medium">
              <span>Subtotal Base</span>
              <span className="font-mono">Bs. {order.subtotal.toFixed(2)}</span>
            </div>

            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Descuento Promocional Total</span>
                <span className="font-mono">-Bs. {order.discountTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-bold text-white pt-2 border-t border-[#2D3349]/60">
              <span className="text-[#F5F7FF]">Total Liquidado</span>
              <span className="text-2xl font-mono font-black text-[#1FD1EB] drop-shadow-[0_0_10px_rgba(31,209,235,0.4)]">
                Bs. {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2D3349] bg-[#101321] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#783DF2] hover:bg-[#6A32DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(120,61,242,0.4)] cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
