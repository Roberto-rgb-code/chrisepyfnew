'use client';

import { useState, useEffect } from 'react';

interface AnnouncementItem {
  desktop: string;
  mobile: string;
  active: boolean;
}

const FALLBACK: AnnouncementItem[] = [
  {
    desktop: '🎉 ¡ENVÍO GRATIS en pedidos +$500 MXN! | 📱 +1000 fundas vendidas | ⭐ 4.9/5 estrellas',
    mobile: '🎉 Envío GRATIS +$500 · ⭐ 4.9/5',
    active: true,
  },
  {
    desktop: '🔥 ¡DESCUENTO 20% en tu primera compra! | 🎨 Diseña tu funda personalizada HOY',
    mobile: '🔥 20% primera compra · Diseña HOY',
    active: true,
  },
];

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<AnnouncementItem[]>(FALLBACK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch('/api/announcements', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const active = (data.messages || []).filter((m: AnnouncementItem) => m.active !== false);
        if (active.length > 0) setMessages(active);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    if (currentIndex >= messages.length) setCurrentIndex(0);
  }, [messages.length, currentIndex]);

  const current = messages[currentIndex];
  if (!current) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2.5 sm:py-2 px-3 text-xs sm:text-sm font-medium overflow-hidden relative">
      <div
        className={`transition-all duration-500 px-1 max-w-full ${
          isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <span className="sm:hidden block truncate">{current.mobile}</span>
        <span className="hidden sm:block truncate">{current.desktop}</span>
      </div>

      {messages.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 pb-0.5">
          {messages.map((_, index) => (
            <button
              key={index}
              type="button"
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
      )}
    </div>
  );
}
