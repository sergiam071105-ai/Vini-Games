'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Lock, Sparkles, X, Loader2, AlertCircle, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { processSimulatedCheckoutAction } from '@/app/actions/cart.actions';
import { checkoutCardSchema } from '@/lib/schemas/order.schema';
import { OrderSummary } from '@/types/order.types';
import { OrderReceiptModal } from '@/components/store/order-receipt-modal';
import { createClient } from '@/lib/supabase/client';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();

  const [cardNumber, setCardNumber] = useState('4532 8921 4019 9401');
  const [cardHolder, setCardHolder] = useState('Gamer Master');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderSummary | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Verificar estado de sesión cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsCheckingAuth(true);

    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted) {
          setIsAuthenticated(!!user);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen && !isReceiptOpen) return null;

  const handleFillTestData = () => {
    setCardNumber('4532 8921 4019 9401');
    setCardHolder('Gamer Master');
    setExpiryDate('12/28');
    setCvv('888');
    setError(null);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    const validation = checkoutCardSchema.safeParse({
      cardNumber: cleanCard,
      cardHolder,
      expiryDate,
      cvv,
    });

    if (!validation.success) {
      setError(validation.error.issues?.[0]?.message || 'Datos de tarjeta inválidos');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await processSimulatedCheckoutAction({
        gameIds: items.map((i) => i.id),
        paymentMethod: 'SIMULATED_CARD',
        cardData: {
          cardNumber: cleanCard,
          cardHolder,
          expiryDate,
          cvv,
        },
      });

      if (!res.success || !res.order) {
        setError(res.error || 'No se pudo procesar el pago simulado.');
      } else {
        setCompletedOrder(res.order);
        await clearCart();
        onClose();
        setIsReceiptOpen(true);
      }
    } catch {
      setError('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B14]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#131521] border border-[#2E334A] rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#783DF2]/15 overflow-hidden">
            
            {/* Glow de fondo */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#783DF2]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#949CB2] hover:text-[#F5F7FF] hover:bg-[#1A1C2B] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isCheckingAuth ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-[#783DF2] animate-spin mb-3" />
                <p className="text-xs text-[#949CB2]">Verificando credenciales de usuario...</p>
              </div>
            ) : !isAuthenticated ? (
              /* Bloque de Autenticación Requerida */
              <div className="text-center py-2 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-[#783DF2]/15 border border-[#783DF2]/40 flex items-center justify-center mx-auto mb-4 text-[#1FD1EB]">
                  <Lock className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-[#F5F7FF] mb-2">
                  Inicia sesión para completar tu compra
                </h3>
                
                <p className="text-xs text-[#949CB2] max-w-sm mx-auto mb-6 leading-relaxed">
                  Para guardar los videojuegos adquiridos en tu biblioteca personal, ganar puntos de experiencia (+100 XP) y registrar tus horas de juego, necesitas ingresar con tu cuenta gamer.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/login?redirect=/cart"
                    onClick={onClose}
                    className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </Link>

                  <Link
                    href="/register?redirect=/cart"
                    onClick={onClose}
                    className="w-full bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    <UserPlus className="w-4 h-4 text-[#1FD1EB]" />
                    Crear Cuenta Gratis
                  </Link>

                  <button
                    onClick={onClose}
                    className="text-xs text-[#949CB2] hover:text-[#F5F7FF] pt-2 transition-colors cursor-pointer"
                  >
                    Volver a la tienda
                  </button>
                </div>
              </div>
            ) : (
              /* Formulario de Checkout para Usuario Autenticado */
              <>
                {/* Encabezado */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#783DF2] uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    Pasarela de Pago Simulada
                  </div>
                  <h2 className="text-xl font-bold text-[#F5F7FF]">Checkout de Compra</h2>
                  <p className="text-xs text-[#949CB2] mt-1">
                    Simula tu compra con tarjeta virtual de prueba. Cero cargos reales.
                  </p>
                </div>

                {/* Resumen Rápido de Orden */}
                <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-xl p-3.5 mb-5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[#949CB2] block">{items.length} {items.length === 1 ? 'videojuego' : 'videojuegos'}</span>
                    <span className="text-base font-bold text-[#1FD1EB]">Total: Bs. {total}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillTestData}
                    className="px-3 py-1.5 bg-[#783DF2]/10 hover:bg-[#783DF2]/20 border border-[#783DF2]/40 rounded-lg text-xs font-bold text-[#783DF2] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1FD1EB]" />
                    Autocompletar Prueba
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-xl flex items-center gap-2 text-xs text-[#EF4444]">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Formulario de Tarjeta */}
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  
                  {/* Tarjeta Visual de Muestra */}
                  <div className="relative bg-gradient-to-tr from-[#1A1C2E] via-[#2E1E5B] to-[#783DF2] rounded-xl p-5 border border-[#783DF2]/50 shadow-lg text-white mb-2 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold tracking-widest uppercase text-white/80">ViniGames Virtual Card</span>
                      <CreditCard className="w-6 h-6 text-[#1FD1EB]" />
                    </div>
                    <div className="font-mono text-base tracking-widest mb-3 font-semibold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-white/60 block">Titular</span>
                        <span className="font-bold tracking-wide">{cardHolder || 'TITULAR GAMER'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-white/60 block">Expira</span>
                        <span className="font-bold">{expiryDate || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Número de Tarjeta */}
                  <div>
                    <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                      Número de Tarjeta Virtual:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 8921 4019 9401"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#1A1C2B] border border-[#2E334A] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder-[#949CB2]/60 focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/40 transition-all font-mono"
                    />
                  </div>

                  {/* Input Titular */}
                  <div>
                    <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                      Nombre del Titular:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Gamer Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-[#1A1C2B] border border-[#2E334A] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder-[#949CB2]/60 focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/40 transition-all"
                    />
                  </div>

                  {/* Inputs Expiración y CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                        Expiración (MM/YY):
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        maxLength={5}
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full bg-[#1A1C2B] border border-[#2E334A] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder-[#949CB2]/60 focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/40 transition-all text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                        CVV:
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="888"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-[#1A1C2B] border border-[#2E334A] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F7FF] placeholder-[#949CB2]/60 focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/40 transition-all text-center font-mono"
                      />
                    </div>
                  </div>

                  {/* Botón de Confirmación */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isProcessing || items.length === 0}
                      className="w-full bg-[#783DF2] hover:bg-[#6929e4] disabled:opacity-50 text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Procesando Compra...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pagar Bs. {total} (+100 XP)
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* Recibo Transaccional Emitido */}
      <OrderReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={completedOrder}
      />
    </>
  );
}
