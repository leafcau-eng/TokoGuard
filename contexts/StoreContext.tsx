'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { StoreFilter } from '@/lib/types';

interface StoreContextValue {
  store: StoreFilter;
  setStore: (s: StoreFilter) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreFilter>('all');
  return <StoreContext.Provider value={{ store, setStore }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
