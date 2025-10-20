'use client';

import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface AuthWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function AuthWarningModal({ isOpen, onClose, onLogin }: AuthWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icono de advertencia */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Acceso Requerido
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Debes iniciar sesión para agregar al carrito. Por favor inicia sesión desde el menú.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onLogin}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
