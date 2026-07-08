'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface PricingPromo {
  active: boolean;
  title?: string;
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
}

interface PricingState {
  basePriceMxn: number;
  effectivePriceMxn: number;
  formattedBase: string;
  formattedEffective: string;
  promo: PricingPromo;
  loading: boolean;
}

const defaultState: PricingState = {
  basePriceMxn: 599,
  effectivePriceMxn: 599,
  formattedBase: '$599 MXN',
  formattedEffective: '$599 MXN',
  promo: { active: false },
  loading: true,
};

const PricingContext = createContext<PricingState & { refresh: () => Promise<void> }>({
  ...defaultState,
  refresh: async () => {},
});

export function usePricing() {
  return useContext(PricingContext);
}

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [pricing, setPricing] = useState<PricingState>(defaultState);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/pricing', { cache: 'no-store' });
      if (!res.ok) throw new Error('pricing fetch failed');
      const data = await res.json();
      setPricing({
        basePriceMxn: data.basePriceMxn,
        effectivePriceMxn: data.effectivePriceMxn,
        formattedBase: data.formattedBase,
        formattedEffective: data.formattedEffective,
        promo: data.promo,
        loading: false,
      });
    } catch {
      setPricing((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PricingContext.Provider value={{ ...pricing, refresh }}>
      {children}
    </PricingContext.Provider>
  );
}
