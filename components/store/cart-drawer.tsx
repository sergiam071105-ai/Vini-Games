'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useLibrary } from '@/lib/context/library-context';
import { CheckoutModal } from '@/components/store/checkout-modal';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discountTotal,
    total,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { isOwned } = useLibrary();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isDrawerOpen) return null;

  const handleOpenCheckout = () => {
    closeDrawer();
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 z-50 bg-[#090B14]/80 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Drawer Lateral */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#131521] border-l border-[#2E334A] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header del Drawer */}
        <div className="flex items-center justify-between p-5 border-b border-[#2E334A] bg-[#0B0D18]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#783DF2]/20 border border-[#783DF2]/50 flex items-center justify-center text-[#1FD1EB]">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5F7FF]">Carrito de Compras</h3>
              <span className="text-[11px] text-[#949CB2]">{itemCount} {itemCount === 1 ? 'juego' : 'juegos'} añadidos</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={() => clearCart()}
                aria-label="Vaciar todos los juegos del carrito"
                className="p-1.5 text-[#949CB2] hover:text-[#EF4444] rounded-lg transition-colors text-xs flex items-center gap-1"
                title="Vaciar carrito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeDrawer}
              aria-label="Cerrar panel lateral de carrito"
              className="p-1.5 text-[#949CB2] hover:text-[#F5F7FF] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Juegos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#1A1C2B] border border-[#2E334A] flex items-center justify-center mb-3 text-[#949CB2]">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h4 className="text-base font-bold text-[#F5F7FF] mb-1">Tu carrito está vacío</h4>
              <p className="text-xs text-[#949CB2] max-w-xs mb-6">
                Explora nuestro catálogo y añade los mejores videojuegos a tu colección gamer.
              </p>
              <Link
                href="/catalog"
                onClick={closeDrawer}
                aria-label="Ir a explorar catálogo de juegos"
                className="px-6 py-2.5 rounded-xl bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] text-xs font-bold transition-all"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const itemAlreadyOwned = isOwned(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 bg-[#1A1C2B] border rounded-xl group transition-all ${
                    itemAlreadyOwned
                      ? 'border-[#EF4444]/50 hover:border-[#EF4444]'
                      : 'border-[#2E334A] hover:border-[#783DF2]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#090B14] flex-shrink-0 relative">
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
                      <h4 className="text-xs font-bold text-[#F5F7FF] line-clamp-1 group-hover:text-[#1FD1EB] transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-[#949CB2] block">{item.developer}</span>
                      
                      {itemAlreadyOwned ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#EF4444] mt-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Ya en tu biblioteca
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-[#1FD1EB]">
                            Bs. {item.finalPrice * (item.quantity || 1)}
                          </span>
                          {(item.quantity || 1) > 1 && (
                            <span className="text-[10px] text-[#949CB2]">
                              (Bs. {item.finalPrice} c/u)
                            </span>
                          )}
                          {item.discountPercent > 0 && (
                            <span className="text-[10px] text-[#949CB2] line-through">
                              Bs. {item.basePrice * (item.quantity || 1)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.title} del carrito de compras`}
                      className="p-1.5 text-[#949CB2] hover:text-[#EF4444] hover:bg-[#2E334A]/50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Controles de Cantidad (+ / -) */}
                    <div className="flex items-center gap-1 bg-[#090B14] border border-[#2E334A] rounded-lg p-0.5" aria-label="Controles de cantidad">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        aria-label="Disminuir cantidad"
                        className="w-5 h-5 flex items-center justify-center rounded bg-[#1A1C2B] text-[#949CB2] hover:text-white hover:bg-[#2E334A] text-xs font-bold transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="text-[11px] font-bold text-[#F5F7FF] px-1.5 min-w-[20px] text-center" aria-label="cantidad">
                        {item.quantity || 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        aria-label="Aumentar cantidad"
                        className="w-5 h-5 flex items-center justify-center rounded bg-[#1A1C2B] text-[#949CB2] hover:text-white hover:bg-[#2E334A] text-xs font-bold transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[9px] text-[#64748B]">cantidad: {item.quantity || 1}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Financiero */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#2E334A] bg-[#0B0D18]/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#949CB2]">
                <span>Subtotal:</span>
                <span>Bs. {subtotal}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-[#10B981]">
                  <span>Ahorro total:</span>
                  <span>- Bs. {discountTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-[#F5F7FF] font-bold text-sm pt-1 border-t border-[#2E334A]">
                <span>Total:</span>
                <span className="text-[#1FD1EB] text-base">Bs. {total}</span>
              </div>
            </div>

            <button
              onClick={handleOpenCheckout}
              aria-label={`Proceder al pago de la orden por un total de ${total} Bolivianos`}
              className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#1FD1EB]" />
              Proceder al Checkout (Bs. {total})
            </button>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full text-center text-xs text-[#949CB2] hover:text-[#1FD1EB] font-semibold transition-colors py-1"
            >
              Ver página de carrito completa →
            </Link>
          </div>
        )}

      </div>

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
