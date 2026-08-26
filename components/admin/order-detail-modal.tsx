'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Receipt, Calendar, User, Mail, CreditCard, ShieldCheck, Tag } from 'lucide-react';
import { AdminOrder } from '@/types/admin-sales.types';

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            COMPLETADA
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            PENDIENTE
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            CANCELADA
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#1A1C2B] border border-[#2E334A] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2E334A] bg-[#131521]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#783DF2]/20 border border-[#783DF2]/40 flex items-center justify-center text-[#783DF2]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-white tracking-wider">
                  {order.orderCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 text-zinc-400 hover:text-white rounded transition-colors"
                  title="Copiar código"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-xs text-zinc-400">
                Auditoría de Comprobante Transaccional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl bg-[#1A1C2B] border border-[#2E334A] hover:border-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadatos del Comprador y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#090B14] rounded-xl border border-[#2E334A]">
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1FD1EB]" /> Usuario Comprador
              </span>
              <div className="text-sm font-bold text-white">@{order.username}</div>
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <Mail className="w-3 h-3 text-zinc-500" /> {order.email}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#783DF2]" /> Fecha y Hora
              </span>
              <div className="text-sm font-medium text-white">
                {new Date(order.createdAt).toLocaleString('es-BO', {
                  dateStyle: 'long',
                  timeStyle: 'medium',
                })}
              </div>
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-zinc-500" /> Método: {order.paymentMethod}
              </div>
            </div>
          </div>

          {/* Desglose de Videojuegos Adquiridos */}
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#1FD1EB]" /> Videojuegos en la Orden ({order.items.length})
            </h3>

            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 bg-[#131521] border border-[#2E334A] rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-14 h-14 rounded-lg object-cover bg-black border border-[#2E334A] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{item.title}</div>
                      <div className="text-xs text-zinc-400">{item.developer}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {item.discountApplied > 0 && (
                      <div className="text-xs text-zinc-500 line-through">
                        Bs. {item.unitPrice.toFixed(2)}
                      </div>
                    )}
                    <div className="text-sm font-bold text-[#1FD1EB]">
                      Bs. {item.finalPrice.toFixed(2)}
                    </div>
                    {item.discountApplied > 0 && (
                      <span className="inline-block text-[10px] text-emerald-400 font-semibold">
                        Ahorro: -Bs. {item.discountApplied.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen Financiero */}
          <div className="border-t border-[#2E334A] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal Base</span>
              <span>Bs. {order.subtotal.toFixed(2)}</span>
            </div>

            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Descuento Promocional Total</span>
                <span>-Bs. {order.discountTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-bold text-white pt-2 border-t border-[#2E334A]/60">
              <span className="text-zinc-200">Total Liquidado</span>
              <span className="text-2xl font-black text-[#1FD1EB]">
                Bs. {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2E334A] bg-[#131521] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#783DF2] hover:bg-[#6A32DB] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(120,61,242,0.4)]"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
