'use client';

import React from 'react';
import { X, CheckCircle, ShoppingCart, ArrowRight } from 'lucide-react';

interface CartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
  onContinueShopping: () => void;
}

export default function CartSuccessModal({
  isOpen,
  onClose,
  onGoToCart,
  onContinueShopping
}: CartSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icono de éxito */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          ¡Producto Agregado!
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Tu funda personalizada ha sido agregada al carrito exitosamente.
        </p>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={onGoToCart}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-md flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Ir al Carrito</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onContinueShopping}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Seguir Comprando
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Tu carrito se guarda automáticamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
