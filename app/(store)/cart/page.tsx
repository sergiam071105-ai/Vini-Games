'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, ArrowLeft, ShieldCheck, Sparkles, Lock, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useLibrary } from '@/lib/context/library-context';
import { CheckoutModal } from '@/components/store/checkout-modal';

export default function CartPage() {
  const { items, itemCount, subtotal, discountTotal, total, removeItem, clearCart } = useCart();
  const { isOwned } = useLibrary();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const ownedItemsInCart = items.filter((item) => isOwned(item.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E334A] pb-6">
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs text-[#949CB2] hover:text-[#1FD1EB] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la tienda
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F7FF] flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-[#783DF2]" />
            Mi Carrito de Compras
          </h1>
          <p className="text-xs text-[#949CB2] mt-1">
            Revisa tus títulos seleccionados antes de confirmar tu compra digital.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => clearCart()}
            className="self-start sm:self-auto px-4 py-2 bg-[#1A1C2B] hover:bg-[#EF4444]/10 border border-[#2E334A] hover:border-[#EF4444]/40 text-[#949CB2] hover:text-[#EF4444] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar Carrito
          </button>
        )}
      </div>

      {/* Alerta de duplicados si el usuario ya posee algún juego */}
      {ownedItemsInCart.length > 0 && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#F5F7FF] animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-[#EF4444] text-sm mb-0.5">Atención: Videojuegos ya adquiridos</span>
            <span className="text-[#949CB2]">
              Ya posees {ownedItemsInCart.map((g) => `"${g.title}"`).join(', ')} en tu biblioteca personal. Te recomendamos eliminarlo(s) de tu carrito antes de pagar para evitar compras duplicadas.
            </span>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        /* Carrito Vacío */
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-xl">
          <div className="w-20 h-20 rounded-full bg-[#1A1C2B] border border-[#2E334A] flex items-center justify-center mb-4 text-[#949CB2]">
            <ShoppingBag className="w-10 h-10 opacity-60" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F7FF] mb-2">No tienes videojuegos en tu carrito</h2>
          <p className="text-xs text-[#949CB2] max-w-sm mb-6 leading-relaxed">
            Descubre mundos increíbles, ofertas exclusivas y suma puntos de experiencia para subir de nivel.
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 uppercase tracking-wider flex items-center gap-2"
          >
            Explorar el Catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Layout en 2 Columnas */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Listado de Juegos (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 md:p-6 divide-y divide-[#2E334A]/60">
              {items.map((item) => {
                const itemAlreadyOwned = isOwned(item.id);
                return (
                  <div
                    key={item.id}
                    className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      itemAlreadyOwned ? 'opacity-90' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#090B14] flex-shrink-0 relative border border-[#2E334A]">
                        {item.coverUrl ? (
                          <Image
                            src={item.coverUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#783DF2]">
                            GAME
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/games/${item.slug}`}
                          className="text-base font-bold text-[#F5F7FF] hover:text-[#1FD1EB] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-[#949CB2] mt-0.5">{item.developer}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.discountPercent > 0 && (
                            <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] text-[10px] font-extrabold">
                              -{item.discountPercent}% OFF
                            </span>
                          )}
                          {itemAlreadyOwned ? (
                            <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-[10px] font-extrabold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Ya en tu Biblioteca
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#949CB2]">Entrega Digital</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2E334A]/40">
                      <div className="text-left sm:text-right">
                        <div className="text-base font-bold text-[#1FD1EB]">Bs. {item.finalPrice}</div>
                        {item.discountPercent > 0 && (
                          <div className="text-xs text-[#949CB2] line-through">Bs. {item.basePrice}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-2 text-xs text-[#949CB2] hover:text-[#EF4444] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Resumen Financiero (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-6 shadow-xl sticky top-28">
              <h3 className="text-base font-bold text-[#F5F7FF] mb-4 pb-3 border-b border-[#2E334A]">
                Resumen del Pedido
              </h3>

              <div className="space-y-2.5 text-xs text-[#949CB2] mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'juego' : 'juegos'}):</span>
                  <span className="text-[#F5F7FF]">Bs. {subtotal}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-[#10B981]">
                    <span>Descuento aplicado:</span>
                    <span className="font-semibold">- Bs. {discountTotal}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Impuestos e IVA:</span>
                  <span className="text-[#10B981] font-semibold">Incluidos</span>
                </div>
                <div className="pt-3 border-t border-[#2E334A] flex justify-between items-end text-sm text-[#F5F7FF] font-bold">
                  <span>Total Final:</span>
                  <span className="text-xl text-[#1FD1EB]">Bs. {total}</span>
                </div>
              </div>

              {/* Banner Recompensa XP */}
              <div className="bg-gradient-to-r from-[#783DF2]/15 to-[#1FD1EB]/15 border border-[#783DF2]/40 rounded-xl p-3.5 mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#783DF2] flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#F5F7FF] block">+100 XP por compra</span>
                  <span className="text-[11px] text-[#949CB2]">Desbloquea recompensas de nivel gamer.</span>
                </div>
              </div>

              {/* Botón Checkout */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Proceder al Checkout (Bs. {total})
              </button>

              {/* Sellos de Confianza */}
              <div className="mt-4 pt-4 border-t border-[#2E334A] flex items-center justify-center gap-2 text-[11px] text-[#949CB2]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Simulación Segura • Entrega Digital Inmediata</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
}
