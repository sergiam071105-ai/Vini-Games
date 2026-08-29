'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toggleWishlistAction, moveToCartAction } from '@/app/actions/wishlist.actions';

export interface WishlistGame {
  id: number;
  title: string;
  slug: string;
  developer?: string;
  base_price: number;
  discount_percent: number;
  final_price: number | null;
  cover_image_url: string;
}

interface WishlistContextType {
  wishlistItems: WishlistGame[];
  wishlistCount: number;
  count: number;
  isWishlisted: (gameId: number) => boolean;
  isInWishlist: (gameId: number) => boolean;
  toggleWishlist: (game: any) => Promise<boolean>;
  removeFromWishlist: (gameId: number) => Promise<void>;
  moveToCart: (gameId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'vinigames_wishlist_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistGame[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar una única vez al montar el componente en el navegador
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading wishlist from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage únicamente cuando el usuario modifique la lista después de cargar
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
      } catch (e) {
        console.error('Error saving wishlist to localStorage:', e);
      }
    }
  }, [wishlistItems, isLoaded]);

  const isWishlisted = useCallback((gameId: number) => {
    return wishlistItems.some((item) => Number(item.id) === Number(gameId));
  }, [wishlistItems]);

  const toggleWishlist = useCallback(async (game: any): Promise<boolean> => {
    const gameId = Number(game.id);
    let willAdd = false;

    setWishlistItems((prev) => {
      const exists = prev.some((item) => Number(item.id) === gameId);
      if (exists) {
        willAdd = false;
        return prev.filter((item) => Number(item.id) !== gameId);
      } else {
        willAdd = true;
        const gameToAdd: WishlistGame = {
          id: gameId,
          title: game.title || 'Videojuego',
          slug: game.slug || `game-${gameId}`,
          developer: game.developer || 'ViniGames Studio',
          base_price: Number(game.base_price || game.basePrice || 99),
          discount_percent: Number(game.discount_percent || game.discountPercent || 0),
          final_price: game.final_price !== undefined ? Number(game.final_price) : Number(game.finalPrice ?? game.base_price ?? 99),
          cover_image_url: game.cover_image_url || game.coverUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        };
        return [gameToAdd, ...prev.filter((item) => Number(item.id) !== gameId)];
      }
    });

    // Sincronizar en segundo plano con Supabase si existe backend
    try {
      await toggleWishlistAction(gameId);
    } catch {
      // Ignorar en desarrollo local
    }

    return willAdd;
  }, []);

  const removeFromWishlist = useCallback(async (gameId: number) => {
    const id = Number(gameId);
    setWishlistItems((prev) => prev.filter((item) => Number(item.id) !== id));
    try {
      await toggleWishlistAction(id);
    } catch {
      // Ignorar
    }
  }, []);

  const moveToCart = useCallback(async (gameId: number) => {
    const id = Number(gameId);
    setWishlistItems((prev) => prev.filter((item) => Number(item.id) !== id));
    try {
      await moveToCartAction(id);
    } catch {
      // Ignorar
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        count: wishlistItems.length,
        isWishlisted,
        isInWishlist: isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlistItems: [],
      wishlistCount: 0,
      count: 0,
      isWishlisted: (_gameId: number) => false,
      isInWishlist: (_gameId: number) => false,
      toggleWishlist: async (_game: any) => false,
      removeFromWishlist: async (_gameId: number) => {},
      moveToCart: async (_gameId: number) => {},
    };
  }
  return context;
}
