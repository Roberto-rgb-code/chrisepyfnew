'use client';

import { usePricing } from '@/contexts/PricingContext';

interface PriceDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function PriceDisplay({ size = 'md', showSubtitle = true }: PriceDisplayProps) {
  const { basePriceMxn, effectivePriceMxn, promo, loading, formattedEffective, formattedBase } =
    usePricing();

  const onSale = promo.active && effectivePriceMxn < basePriceMxn;
  const sizeClass =
    size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl';

  if (loading) {
    return (
      <div className="price-section">
        <div className="price-amount animate-pulse bg-gray-200 h-8 rounded-lg w-32 mx-auto" />
      </div>
    );
  }

  return (
    <div className="price-section">
      {onSale ? (
        <>
          <div className="text-sm text-gray-500 line-through mb-1">{formattedBase}</div>
          <div className={`price-amount text-green-600 ${sizeClass}`}>{formattedEffective}</div>
          {promo.title && (
            <div className="text-xs font-semibold text-brand-red mt-1">{promo.title}</div>
          )}
        </>
      ) : (
        <div className={`price-amount ${sizeClass}`}>{formattedEffective}</div>
      )}
      {showSubtitle && <div className="price-subtitle">Envío gratis incluido</div>}
    </div>
  );
}
