'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// @ts-ignore
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Sparkles, ArrowRight, Library, ShieldCheck, X, Check } from 'lucide-react';
import { OrderSummary } from '@/types/order.types';

interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderSummary | null;
}

export function OrderReceiptModal({ isOpen, onClose, order }: OrderReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      // Disparo de ráfaga de confeti gamer con tokens de Figma
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.6 },
          colors: ['#783DF2', '#1FD1EB', '#10B981', '#F59E0B', '#FFFFFF'],
          zIndex: 9999,
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch (err) {
        console.warn('Confetti effect failed gracefully:', err);
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B14]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#131521] border border-[#2E334A] rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#783DF2]/20 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Glow ambiental con acentos Figma */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#783DF2]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar comprobante de compra"
          className="absolute top-4 right-4 p-2 text-[#949CB2] hover:text-[#F5F7FF] hover:bg-[#1A1C2B] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabecera del Recibo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto mb-3 text-[#10B981] shadow-lg shadow-[#10B981]/20">
            <CheckCircle2 className="w-7 h-7 animate-in zoom-in-50 duration-300" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold uppercase tracking-wider mb-2 border border-[#10B981]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Transacción Completada
          </div>
          <h2 className="text-2xl font-black text-[#F5F7FF]">¡Gracias por tu Compra!</h2>
          <p className="text-xs text-[#949CB2] mt-1">
            Los títulos ya se encuentran disponibles en tu biblioteca personal.
          </p>
        </div>

        {/* Código de Transacción TX-XXXX */}
        <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-xl p-3.5 mb-4 flex items-center justify-between shadow-inner">
          <div>
            <span className="text-[10px] text-[#949CB2] uppercase tracking-wider block">Código de Comprobante</span>
            <span className="text-base font-mono font-bold text-[#1FD1EB]">{order.orderCode}</span>
          </div>
          <button
            onClick={handleCopyCode}
            aria-label="Copiar código de comprobante al portapapeles"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131521] hover:bg-[#25283d] border border-[#2E334A] hover:border-[#1FD1EB]/50 rounded-lg text-xs font-semibold text-[#F5F7FF] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#1FD1EB]" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Recompensa XP Destacada */}
        <div className="bg-gradient-to-r from-[#783DF2]/20 to-[#1FD1EB]/20 border border-[#783DF2]/40 rounded-xl p-3.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#783DF2]" />
            <div>
              <p className="text-xs font-bold text-[#F5F7FF]">¡Recompensa Desbloqueada!</p>
              <p className="text-[11px] text-[#949CB2]">Sumaste puntos de experiencia a tu perfil gamer.</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#783DF2] text-[#F5F7FF] font-black text-xs rounded-lg shadow-md shadow-[#783DF2]/40">
            +{order.xpAwarded} XP
          </div>
        </div>

        {/* Listado de Juegos (Scrollable) */}
        <div className="overflow-y-auto pr-1 flex-1 mb-4 space-y-2 max-h-36 scrollbar-none">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-[#1A1C2B]/60 rounded-xl border border-[#2E334A]/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#090B14] flex-shrink-0 relative border border-[#2E334A]">
                  {item.coverUrl ? (
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#783DF2]">
                      GAME
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FF] line-clamp-1">{item.title}</h4>
                  <span className="text-[10px] text-[#10B981] font-semibold">Listo para instalar</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#1FD1EB]">Bs. {item.finalPrice}</span>
                {item.discountApplied > 0 && (
                  <span className="text-[10px] text-[#949CB2] line-through block">Bs. {item.unitPrice}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen Financiero */}
        <div className="border-t border-[#2E334A] pt-3 mb-5 space-y-1.5 text-xs">
          <div className="flex justify-between text-[#949CB2]">
            <span>Subtotal:</span>
            <span>Bs. {order.subtotal}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-[#10B981]">
              <span>Descuento aplicado:</span>
              <span>- Bs. {order.discountTotal}</span>
            </div>
          )}
          <div className="flex justify-between text-[#F5F7FF] font-bold text-sm pt-1 border-t border-[#2E334A]/50">
            <span>Total Pagado:</span>
            <span className="text-[#1FD1EB] text-base font-black">Bs. {order.total}</span>
          </div>
        </div>

        {/* Botones de Navegación */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/library"
            onClick={onClose}
            className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            <Library className="w-4 h-4" />
            Ir a mi Biblioteca
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-[#1A1C2B] hover:bg-[#25283d] text-[#949CB2] hover:text-[#F5F7FF] font-semibold rounded-xl transition-colors text-xs cursor-pointer"
          >
            Seguir Comprando
          </button>
        </div>

      </div>
    </div>
  );
}
