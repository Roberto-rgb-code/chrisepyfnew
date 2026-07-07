'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { HelpCircle } from '@/components/icons';

const TOUR_KEY = 'efm_tour_completed';

export function startProductTour(force = false) {
  if (typeof window === 'undefined') return;
  if (!force && localStorage.getItem(TOUR_KEY)) return;

  const isMobile = window.innerWidth < 640;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(15, 23, 42, 0.75)',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: '¡Listo!',
    progressText: '{{current}} de {{total}}',
    steps: [
      {
        element: '[data-tour="model-select"]',
        popover: {
          title: '📱 Elige tu modelo',
          description: 'Selecciona el modelo exacto de tu teléfono. Tenemos iPhone, Samsung y Google Pixel.',
          side: isMobile ? 'bottom' : 'right',
        },
      },
      {
        element: '[data-tour="upload"]',
        popover: {
          title: '🖼️ Sube tu imagen',
          description: 'Arrastra o selecciona la foto que quieres en tu funda. JPG y PNG hasta 4 MB.',
          side: isMobile ? 'bottom' : 'right',
        },
      },
      {
        element: '[data-tour="preview"]',
        popover: {
          title: '👀 Vista previa en vivo',
          description: 'Aquí ves cómo quedará tu funda. Puedes arrastrar la imagen para posicionarla.',
          side: isMobile ? 'bottom' : 'left',
        },
      },
      {
        element: '[data-tour="controls"]',
        popover: {
          title: '🎛️ Ajusta tu diseño',
          description: 'Escala, rota y voltea tu imagen. Usa las flechas del teclado para moverla con precisión.',
          side: isMobile ? 'bottom' : 'left',
        },
      },
      {
        element: '[data-tour="add-cart"]',
        popover: {
          title: '🛒 Agrega al carrito',
          description: 'Cuando estés listo, agrégala al carrito. Solo necesitas iniciar sesión al pagar.',
          side: 'top',
        },
      },
      {
        element: '[data-tour="cart-nav"]',
        popover: {
          title: '✅ Finaliza tu compra',
          description: 'Revisa tu carrito y paga de forma segura con Stripe. Te enviaremos un correo con tu diseño.',
          side: 'bottom',
        },
      },
    ],
    onDestroyed: () => {
      localStorage.setItem(TOUR_KEY, 'true');
    },
  });

  driverObj.drive();
}

export default function ProductTour() {
  useEffect(() => {
    const timer = setTimeout(() => startProductTour(), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={() => startProductTour(true)}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:border-blue-300 transition-all text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 bottom-safe max-w-[calc(100vw-5rem)]"
      title="Ver tour guiado"
    >
      <HelpCircle className="w-5 h-5" />
      <span className="hidden sm:inline">Tour guiado</span>
    </button>
  );
}
