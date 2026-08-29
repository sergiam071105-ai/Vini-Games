'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserLibraryGamesAction } from '@/app/actions/library.actions';

interface LibraryContextType {
  ownedGameIds: number[];
  isOwned: (gameId: number) => boolean;
  refreshLibrary: () => Promise<void>;
  isLoading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [ownedGameIds, setOwnedGameIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshLibrary = useCallback(async () => {
    try {
      const items = await getUserLibraryGamesAction();
      if (Array.isArray(items)) {
        setOwnedGameIds(items.map((i) => Number(i.gameId)));
      }
    } catch (err) {
      console.warn('Error fetching owned games in LibraryProvider:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  const isOwned = useCallback(
    (gameId: number) => {
      return ownedGameIds.includes(Number(gameId));
    },
    [ownedGameIds]
  );

  return (
    <LibraryContext.Provider
      value={{
        ownedGameIds,
        isOwned,
        refreshLibrary,
        isLoading,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    return {
      ownedGameIds: [],
      isOwned: (_gameId: number) => false,
      refreshLibrary: async () => {},
      isLoading: false,
    };
  }
  return context;
}
