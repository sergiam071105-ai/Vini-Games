'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartGameItem } from '@/types/order.types';
import { addToCartAction, removeFromCartAction, clearCartAction } from '@/app/actions/cart.actions';

interface CartContextType {
  items: CartGameItem[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (game: {
    id: number;
    title: string;
    slug: string;
    coverUrl?: string;
    developer?: string;
    basePrice: number;
    discountPercent?: number;
    finalPrice?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (gameId: number, quantity: number) => void;
  removeItem: (gameId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (gameId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vinigames_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartGameItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar carrito desde LocalStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: CartGameItem[] = JSON.parse(stored);
        setItems(
          parsed.map((item) => ({
            ...item,
            quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
          }))
        );
      }
    } catch {
      // Ignorar errores de parseo
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar en LocalStorage cada vez que cambien los items
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar quota exceeded
    }
  }, [items, isInitialized]);

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.basePrice) * (item.quantity || 1),
    0
  );
  const total = items.reduce(
    (acc, item) => acc + Number(item.finalPrice) * (item.quantity || 1),
    0
  );
  const discountTotal = Math.max(0, subtotal - total);
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const isInCart = (gameId: number) => items.some((item) => item.id === gameId);

  const addItem = async (game: {
    id: number;
    title: string;
    slug: string;
    coverUrl?: string;
    developer?: string;
    basePrice: number;
    discountPercent?: number;
    finalPrice?: number;
  }) => {
    if (isInCart(game.id)) {
      updateQuantity(game.id, (items.find((i) => i.id === game.id)?.quantity || 1) + 1);
      setIsDrawerOpen(true);
      return { success: true };
    }

    const discount = game.discountPercent || 0;
    const base = Number(game.basePrice);
    const final = game.finalPrice !== undefined ? Number(game.finalPrice) : Math.round(base * (1 - discount / 100));

    const newItem: CartGameItem = {
      id: game.id,
      title: game.title,
      slug: game.slug,
      coverUrl: game.coverUrl || '/games/neon-odyssey.jpg',
      developer: game.developer || 'Estudio Gamer',
      basePrice: base,
      discountPercent: discount,
      finalPrice: final,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };

    // Actualizar estado local inmediatamente
    setItems((prev) => [...prev, newItem]);
    setIsDrawerOpen(true);

    // Sincronizar en segundo plano con Server Action
    try {
      const serverRes = await addToCartAction(game.id);
      if (!serverRes.success && serverRes.error) {
        return { success: false, error: serverRes.error };
      }
    } catch {
      // Si falla la red, el carrito local sigue funcionando
    }

    return { success: true };
  };

  const updateQuantity = (gameId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(gameId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === gameId
          ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) }
          : item
      )
    );
  };

  const removeItem = async (gameId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== gameId));
    try {
      await removeFromCartAction(gameId);
    } catch {
      // Sincronización silenciosa
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      await clearCartAction();
    } catch {
      // Sincronización silenciosa
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountTotal,
        total,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
}
