'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  Coins,
  Smartphone,
  CheckCircle2,
  Lock,
  Sparkles,
  Gamepad2,
  AlertTriangle,
} from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useLibrary } from '@/lib/context/library-context';
import { createClient } from '@/lib/supabase/client';
import { purchaseGamesAction } from '@/app/actions/library.actions';

type PaymentMethod = 'qr' | 'card' | 'gamecoins' | 'tigo';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountTotal, total, removeItem, clearCart } = useCart();
  const { refreshLibrary } = useLibrary();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userGameCoins, setUserGameCoins] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcular GameCoins requeridos para la orden (10 GameCoins = 1 Bs.)
  const requiredGameCoins = Math.ceil(Number(total || 0) * 10);
  const hasEnoughGameCoins = userGameCoins >= requiredGameCoins;

  // Verificar estado de autenticación y cargar saldo de GameCoins del usuario
  useEffect(() => {
    const checkAuthAndBalance = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsAuthenticated(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('gamecoins_balance')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            setUserGameCoins(Number(profile.gamecoins_balance || 0));
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuthAndBalance();
  }, []);

  const handleProcessOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (paymentMethod === 'gamecoins' && !hasEnoughGameCoins) {
      setErrorMessage(`Saldo insuficiente de GameCoins. Necesitas ${requiredGameCoins} GC y cuentas con ${userGameCoins} GC.`);
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const gameIds = items.map((i) => Number(i.id));
      const res = await purchaseGamesAction(gameIds, paymentMethod, Number(total || 0));

      if (!res.success) {
        setErrorMessage(res.error || 'No se pudo procesar la compra.');
        setIsProcessing(false);
        return;
      }

      if (res.newBalance !== undefined) {
        setUserGameCoins(res.newBalance);
      }

      await refreshLibrary();
      await clearCart();
      const generatedCode = `VINI-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedCode);
      setIsProcessing(false);
      setOrderCompleted(true);
    } catch {
      setErrorMessage('Ocurrió un error inesperado al conectar con el servidor.');
      setIsProcessing(false);
    }
  };

  // Pantalla de confirmación de pedido completado
  if (orderCompleted) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            ¡Compra Exitosa!
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            ¡Gracias por tu compra en ViniGames!
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Tu pedido ha sido procesado correctamente. Los juegos ya están disponibles en tu biblioteca.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <span className="text-slate-400 text-sm">Número de Orden:</span>
            <span className="text-amber-400 font-mono font-bold text-base">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <span className="text-slate-400 text-sm">Método de Pago:</span>
            <span className="text-white font-medium text-sm capitalize">
              {paymentMethod === 'qr' && 'QR Simple Bolivia'}
              {paymentMethod === 'card' && 'Tarjeta Débito / Crédito'}
              {paymentMethod === 'gamecoins' && `Saldo GameCoins (-${requiredGameCoins} GC)`}
              {paymentMethod === 'tigo' && 'Tigo Money'}
            </span>
          </div>
          {paymentMethod === 'gamecoins' && (
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400 text-sm">Nuevo Saldo GameCoins:</span>
              <span className="text-amber-400 font-mono font-bold text-sm">{userGameCoins} GC</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Recompensa XP:</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> +150 XP añadidos a tu perfil
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/library"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" /> Ver en Mi Biblioteca
          </Link>
          <Link
            href="/catalog"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition flex items-center justify-center gap-2"
          >
            Explorar más juegos
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla de Carrito Vacío
  if (items.length === 0) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
          <p className="text-slate-400 text-sm">
            No tienes videojuegos seleccionados para comprar en este momento.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition shadow-lg shadow-violet-500/20"
        >
          Explorar Catálogo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-2 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
          <Lock className="w-4 h-4" /> Pasarela de Pago Segura
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Checkout y Finalización de Compra
        </h1>
        <p className="text-slate-400 text-sm">
          Revisa los detalles de tu compra y selecciona tu método de pago preferido.
        </p>
      </div>

      {/* Mensaje de Error Global */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Resumen del Pedido y Lista de Juegos */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-400" /> Resumen del Pedido
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {items.length} {items.length === 1 ? 'juego' : 'juegos'}
              </span>
            </div>

            {/* Lista de productos */}
            <div className="divide-y divide-slate-800/80">
              {items.map((item) => {
                const itemUnitPrice = Number(item.finalPrice ?? item.basePrice ?? 0);
                const itemQty = Number(item.quantity ?? 1);
                const itemTotal = itemUnitPrice * itemQty;

                return (
                  <div key={item.id} className="py-4 flex gap-4 items-center group">
                    {/* Carátula */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/50">
                      <Image
                        src={item.coverUrl || '/placeholder.png'}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-violet-300 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Precio unitario: <span className="text-slate-300 font-semibold">Bs. {itemUnitPrice.toFixed(2)}</span>
                      </p>

                      {/* Licencia Digital y Botón Eliminar */}
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                          1 Licencia Digital
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition p-1 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Total por juego */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                        Bs. {itemUnitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Métodos de Pago y Desglose de Totales */}
        <div className="lg:col-span-5 space-y-6">
          {/* Métodos de Pago */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-violet-400" /> Método de Pago
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* QR Simple */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('qr'); setErrorMessage(null); }}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                  paymentMethod === 'qr'
                    ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-xs font-bold leading-tight">QR Simple</p>
                  <p className="text-[10px] text-slate-400">Banco / BNB / BCP</p>
                </div>
              </button>

              {/* Tarjeta */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('card'); setErrorMessage(null); }}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs font-bold leading-tight">Tarjeta</p>
                  <p className="text-[10px] text-slate-400">Débito / Crédito</p>
                </div>
              </button>

              {/* GameCoins */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('gamecoins'); setErrorMessage(null); }}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                  paymentMethod === 'gamecoins'
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Coins className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs font-bold leading-tight">GameCoins</p>
                  <p className="text-[10px] text-slate-400">Saldo: {userGameCoins} GC</p>
                </div>
              </button>

              {/* Tigo Money */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('tigo'); setErrorMessage(null); }}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                  paymentMethod === 'tigo'
                    ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold leading-tight">Tigo Money</p>
                  <p className="text-[10px] text-slate-400">Billetera móvil</p>
                </div>
              </button>
            </div>

            {/* Paneles de Información y Datos según el Método de Pago Seleccionado */}
            <div className="pt-3 border-t border-slate-800 animate-in fade-in duration-200">
              {/* 1. Panel QR Simple */}
              {paymentMethod === 'qr' && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4" /> QR Simple Bolivia
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Válido 10:00 min
                    </span>
                  </div>

                  {/* Visualización del Código QR */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0B0D18] p-4 rounded-xl border border-slate-800 text-center sm:text-left">
                    <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <div className="w-full h-full border-4 border-slate-900 grid grid-cols-5 grid-rows-5 gap-1 p-1 bg-white">
                        <div className="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                        <div className="bg-slate-900 col-start-4 col-span-2 row-span-2 rounded-sm" />
                        <div className="bg-slate-900 col-span-2 row-start-4 row-span-2 rounded-sm" />
                        <div className="bg-violet-600 col-start-3 row-start-3 rounded-full animate-pulse" />
                        <div className="bg-slate-900 col-start-3 row-start-1" />
                        <div className="bg-slate-900 col-start-5 row-start-3" />
                        <div className="bg-slate-900 col-start-4 row-start-4" />
                        <div className="bg-slate-900 col-start-3 row-start-5" />
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-white font-bold">Monto exacto: Bs. {Number(total || 0).toFixed(2)}</p>
                      <p className="text-[11px] text-slate-400">
                        Compatible con apps bancarias: <span className="text-slate-300 font-medium">BCP, BNB, Banco Unión, Mercantil, Bisa, Ganadero</span>.
                      </p>
                      <p className="text-[10px] text-emerald-400 flex items-center justify-center sm:justify-start gap-1 pt-1">
                        <CheckCircle2 className="w-3 h-3" /> Acreditación e instalación automática
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Panel Tarjeta de Débito / Crédito */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> Datos de la Tarjeta
                    </span>
                    <span className="text-[10px] text-slate-400">Visa / Mastercard / Red Enlace</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Número de Tarjeta</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4500 •••• •••• 9010"
                          defaultValue="4500 8921 4410 9012"
                          maxLength={19}
                          className="w-full bg-[#0B0D18] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500 text-xs"
                        />
                        <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                          <span className="text-[9px] font-bold text-blue-400 px-1 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">VISA</span>
                          <span className="text-[9px] font-bold text-amber-400 px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">MC</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nombre del Titular</label>
                      <input
                        type="text"
                        placeholder="JUAN PEREZ GAMER"
                        defaultValue="GAMER PROOF TITULAR"
                        className="w-full bg-[#0B0D18] border border-slate-700 rounded-lg px-3 py-2 text-white uppercase placeholder:text-slate-600 focus:outline-none focus:border-violet-500 text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Vencimiento (MM/AA)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          defaultValue="08/29"
                          maxLength={5}
                          className="w-full bg-[#0B0D18] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">CVV / CVC</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="•••"
                            defaultValue="888"
                            maxLength={4}
                            className="w-full bg-[#0B0D18] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500 text-xs"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Panel GameCoins */}
              {paymentMethod === 'gamecoins' && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Coins className="w-4 h-4" /> Billetera GameCoins
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      Tu Saldo: {userGameCoins} GC
                    </span>
                  </div>

                  <div className="p-3 bg-[#0B0D18] rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Costo de la orden:</span>
                      <span className="text-amber-400 font-bold font-mono">{requiredGameCoins} GC (Bs. {Number(total || 0).toFixed(2)})</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Tu saldo disponible:</span>
                      <span className="text-white font-bold font-mono">{userGameCoins} GC</span>
                    </div>

                    {hasEnoughGameCoins ? (
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Saldo suficiente. Saldo restante tras compra: <b>{userGameCoins - requiredGameCoins} GC</b>.</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] flex items-center gap-1.5 mt-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>Saldo insuficiente. Te faltan <b>{requiredGameCoins - userGameCoins} GC</b> para comprar con este método.</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Tasa oficial de cambio:</span>
                      <span>10 GC = Bs. 1.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Panel Tigo Money */}
              {paymentMethod === 'tigo' && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" /> Pago con Tigo Money
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium">Bolivia</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Número de Celular Tigo</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-700 bg-[#0B0D18] text-slate-400 text-xs font-mono">
                          +591
                        </span>
                        <input
                          type="tel"
                          placeholder="77123456"
                          defaultValue="77123456"
                          maxLength={8}
                          className="w-full bg-[#0B0D18] border border-slate-700 rounded-r-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Recibirás una notificación en tu app Tigo Money o un mensaje USSD en tu teléfono para autorizar el pago de <span className="text-white font-bold">Bs. {Number(total || 0).toFixed(2)}</span> con tu PIN.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desglose de Precios */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Desglose de Pago
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold font-mono">Bs. {Number(subtotal || 0).toFixed(2)}</span>
              </div>
              {(discountTotal || 0) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Descuento aplicado</span>
                  <span className="font-semibold font-mono">- Bs. {Number(discountTotal || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Impuestos / IVA</span>
                <span>Incluido</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total a Pagar</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  Bs. {Number(total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botón de Confirmación */}
            <button
              type="button"
              onClick={handleProcessOrder}
              disabled={isProcessing || (paymentMethod === 'gamecoins' && !hasEnoughGameCoins)}
              className={`w-full py-4 rounded-xl font-black text-base transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                paymentMethod === 'gamecoins' && !hasEnoughGameCoins
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Procesando compra segura...
                </>
              ) : isAuthenticated === false ? (
                <>
                  <Lock className="w-5 h-5" /> Iniciar Sesión para Pagar
                </>
              ) : paymentMethod === 'gamecoins' && !hasEnoughGameCoins ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400" /> Saldo Insuficiente de GameCoins
                </>
              ) : paymentMethod === 'gamecoins' ? (
                <>
                  <Coins className="w-5 h-5" /> Pagar {requiredGameCoins} GameCoins
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Confirmar y Pagar Bs. {Number(total || 0).toFixed(2)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              Garantía de activación instantánea y soporte oficial ViniGames
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
