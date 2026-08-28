'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Lock, Sparkles, X, Loader2, AlertCircle, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useLibrary } from '@/lib/context/library-context';
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
  const { isOwned, refreshLibrary } = useLibrary();

  const ownedItemsInCart = items.filter((item) => isOwned(item.id));

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
    if (error) setError(null);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiryDate(raw);
    if (error) setError(null);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(raw);
    if (error) setError(null);
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
      setError(validation.error.issues?.[0]?.message || 'Por favor completa todos los datos de la tarjeta.');
      return;
    }

    if (ownedItemsInCart.length > 0) {
      setError(`Ya posees ${ownedItemsInCart.map((g) => `"${g.title}"`).join(', ')} en tu biblioteca. Por favor elimínalo(s) de tu carrito antes de pagar.`);
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
        setError(res.error || 'No se pudo procesar el pago.');
        setIsProcessing(false);
        return;
      }

      // 1. Limpiar carrito local
      clearCart();

      // 2. Refrescar estado de biblioteca
      await refreshLibrary();

      // 3. Abrir comprobante
      setCompletedOrder(res.order);
      setIsReceiptOpen(true);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error inesperado durante la transacción.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B14]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#131521] border border-[#2E334A] rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#783DF2]/20 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Glow ambiental */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#783DF2]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#1FD1EB]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              disabled={isProcessing}
              aria-label="Cerrar modal de pasarela de pago"
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
                <div className="w-16 h-16 rounded-2xl bg-[#783DF2]/15 border border-[#783DF2]/40 flex items-center justify-center mx-auto mb-4 text-[#1FD1EB] shadow-lg shadow-[#783DF2]/15">
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
                    className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </Link>

                  <Link
                    href="/register?redirect=/cart"
                    onClick={onClose}
                    className="w-full bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-[#1FD1EB]" />
                    Crear Cuenta Gratis
                  </Link>

                  <button
                    onClick={onClose}
                    aria-label="Volver a la tienda sin iniciar sesión"
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
                    Pasarela de Pago Segura
                  </div>
                  <h2 className="text-xl font-bold text-[#F5F7FF]">Checkout de Compra</h2>
                  <p className="text-xs text-[#949CB2] mt-1">
                    Ingresa los datos de tu tarjeta para procesar la orden digital.
                  </p>
                </div>

                {/* Resumen Rápido de Orden */}
                <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-xl p-3.5 mb-5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[#949CB2] block">{items.length} {items.length === 1 ? 'videojuego' : 'videojuegos'}</span>
                    <span className="text-base font-bold text-[#1FD1EB]">Total: Bs. {total}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pago Seguro</span>
                  </div>
                </div>

                {ownedItemsInCart.length > 0 && (
                  <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-xl flex items-start gap-2 text-xs text-[#EF4444] animate-in fade-in">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Ya posees {ownedItemsInCart.map((g) => `"${g.title}"`).join(', ')} en tu biblioteca. Debes eliminarlo(s) de tu carrito antes de pagar.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-xl flex items-center gap-2 text-xs text-[#EF4444]">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Formulario de Tarjeta */}
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  
                  {/* Tarjeta Visual de Muestra */}
                  <div className="w-full bg-gradient-to-tr from-[#1C1730] via-[#2D1B4E] to-[#783DF2]/80 border border-[#783DF2]/40 rounded-2xl p-5 text-white shadow-xl shadow-[#783DF2]/15 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <CreditCard className="w-8 h-8 text-[#1FD1EB]" />
                      <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        ViniCard
                      </span>
                    </div>

                    <div className="font-mono text-sm sm:text-base tracking-[0.2em] font-bold mb-4 drop-shadow text-center">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end text-[10px]">
                      <div>
                        <span className="text-[#949CB2] block text-[8px] uppercase">Titular</span>
                        <span className="font-bold tracking-wider uppercase truncate block max-w-[160px]">
                          {cardHolder || 'NOMBRE APELLIDO'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#949CB2] block text-[8px] uppercase">Expira</span>
                        <span className="font-bold font-mono">
                          {expiryDate || 'MM/AA'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Número de Tarjeta */}
                  <div>
                    <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                      Número de Tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4532 8921 4019 9401"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={isProcessing}
                        maxLength={19}
                        className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-4 py-2.5 text-xs text-[#F5F7FF] placeholder-[#949CB2]/40 focus:outline-none transition-colors font-mono"
                      />
                      <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949CB2]" />
                    </div>
                  </div>

                  {/* Nombre en la Tarjeta */}
                  <div>
                    <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Eduardo Ribera"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value);
                        if (error) setError(null);
                      }}
                      disabled={isProcessing}
                      className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-4 py-2.5 text-xs text-[#F5F7FF] placeholder-[#949CB2]/40 focus:outline-none transition-colors uppercase"
                    />
                  </div>

                  {/* Fecha de Expiración y CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                        Expiración (MM/AA)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        disabled={isProcessing}
                        maxLength={5}
                        className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-4 py-2.5 text-xs text-[#F5F7FF] placeholder-[#949CB2]/40 focus:outline-none transition-colors font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#949CB2] mb-1">
                        Código CVV
                      </label>
                      <input
                        type="password"
                        placeholder="888"
                        value={cvv}
                        onChange={handleCvvChange}
                        disabled={isProcessing}
                        maxLength={4}
                        className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-4 py-2.5 text-xs text-[#F5F7FF] placeholder-[#949CB2]/40 focus:outline-none transition-colors font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Botón de Confirmación y Pago */}
                  <button
                    type="submit"
                    disabled={isProcessing || ownedItemsInCart.length > 0}
                    className="w-full mt-4 bg-gradient-to-r from-[#783DF2] to-[#6929e4] hover:from-[#8B4DFF] hover:to-[#783DF2] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Procesando Transacción...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#1FD1EB]" />
                        <span>Pagar Bs. {total}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-[#949CB2] mt-2">
                    Transacción cifrada SSL de 256 bits. Licencia digital añadida automáticamente a tu biblioteca.
                  </p>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* Modal de Comprobante / Recibo Digital Oficial */}
      {completedOrder && (
        <OrderReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => {
            setIsReceiptOpen(false);
            setCompletedOrder(null);
          }}
          order={completedOrder}
        />
      )}
    </>
  );
}
