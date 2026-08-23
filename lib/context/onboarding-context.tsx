'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type GamerDnaData = {
  exploration: number;
  competitive: number;
  narrative: number;
  collection: number;
};

export type OnboardingData = {
  // Paso 1
  avatarUrl: string;
  username: string;
  fullName: string;
  // Paso 2
  favoriteCategories: string[];
  // Paso 3
  gamerDna: GamerDnaData;
  // Paso 4
  email: string;
};

const STORAGE_KEY = 'vinigames_onboarding_draft';

const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  avatarUrl: 'cyber_ninja',
  username: '',
  fullName: '',
  favoriteCategories: ['action', 'rpg'],
  gamerDna: {
    exploration: 30,
    competitive: 30,
    narrative: 20,
    collection: 20,
  },
  email: '',
};

interface OnboardingContextType {
  data: OnboardingData;
  updateStep1: (payload: { avatarUrl: string; username: string; fullName?: string }) => void;
  updateStep2: (favoriteCategories: string[]) => void;
  updateStep3: (gamerDna: GamerDnaData) => void;
  updateStep4: (email: string) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar estado inicial desde sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch {
      // Ignorar si sessionStorage no está disponible
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Guardar en sessionStorage ante cualquier cambio
  const saveState = (updated: OnboardingData) => {
    setData(updated);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignorar
    }
  };

  const updateStep1 = (payload: { avatarUrl: string; username: string; fullName?: string }) => {
    saveState({
      ...data,
      avatarUrl: payload.avatarUrl,
      username: payload.username,
      fullName: payload.fullName || '',
    });
  };

  const updateStep2 = (favoriteCategories: string[]) => {
    saveState({
      ...data,
      favoriteCategories,
    });
  };

  const updateStep3 = (gamerDna: GamerDnaData) => {
    saveState({
      ...data,
      gamerDna,
    });
  };

  const updateStep4 = (email: string) => {
    saveState({
      ...data,
      email,
    });
  };

  const resetOnboarding = () => {
    setData(DEFAULT_ONBOARDING_DATA);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding debe utilizarse dentro de un OnboardingProvider');
  }
  return context;
}
