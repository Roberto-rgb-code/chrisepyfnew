'use client';

import { useState, useEffect } from 'react';

const messages = [
  {
    desktop: '🎉 ¡ENVÍO GRATIS en pedidos +$500 MXN! | 📱 +1000 fundas vendidas | ⭐ 4.9/5 estrellas',
    mobile: '🎉 Envío GRATIS +$500 · ⭐ 4.9/5',
  },
  {
    desktop: '🔥 ¡DESCUENTO 20% en tu primera compra! | 🎨 Diseña tu funda personalizada HOY',
    mobile: '🔥 20% primera compra · Diseña HOY',
  },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2.5 sm:py-2 px-3 text-xs sm:text-sm font-medium overflow-hidden relative">
      <div
        className={`transition-all duration-500 px-1 ${
          isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
        }`}
      >
        <span className="sm:hidden">{messages[currentIndex].mobile}</span>
        <span className="hidden sm:inline">{messages[currentIndex].desktop}</span>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1 pb-0.5">
        {messages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsAnimating(false);
              }, 300);
            }}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'
            }`}
            aria-label={`Ir al mensaje ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
