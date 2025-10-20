'use client';

import { useState, useEffect } from 'react';

const messages = [
  '🎉 ¡ENVÍO GRATIS en pedidos +$500 MXN! | 📱 +1000 fundas vendidas | ⭐ 4.9/5 estrellas',
  '🔥 ¡DESCUENTO 20% en tu primera compra! | 🎨 Diseña tu funda personalizada HOY'
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
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium overflow-hidden relative">
      <div
        className={`transition-all duration-500 ${
          isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
        }`}
      >
        {messages[currentIndex]}
      </div>
      
      {/* Indicadores */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1 pb-1">
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
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            aria-label={`Ir al mensaje ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

