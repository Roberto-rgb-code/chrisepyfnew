'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = '3311493852';
  const message = 'Hola! Me interesa personalizar una funda para mi teléfono. ¿Podrían ayudarme?';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/52${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleCallClick = () => {
    window.open(`tel:+52${phoneNumber}`, '_self');
    setIsOpen(false);
  };

  return (
    <>
      {/* Widget flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Botón principal */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* Menú desplegable */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">¡Hola! 👋</h3>
                  <p className="text-sm text-gray-600">¿En qué podemos ayudarte?</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opciones de contacto */}
            <div className="space-y-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl flex items-center space-x-3 transition-all duration-300 hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-sm opacity-90">Chatea con nosotros</div>
                </div>
              </button>

              {/* Llamada */}
              <button
                onClick={handleCallClick}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center space-x-3 transition-all duration-300 hover:shadow-lg"
              >
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Llamar</div>
                  <div className="text-sm opacity-90">+52 33 1149 3852</div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Horario de atención: Lun - Vie 9:00 - 18:00
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
