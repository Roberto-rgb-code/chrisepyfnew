'use client';

import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ImageUploadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageUploadSuccessModal({ isOpen, onClose }: ImageUploadSuccessModalProps) {
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

        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce-in" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Imagen Subida Exitosamente!</h2>
          <p className="text-gray-600 mb-6">
            Tu diseño ha sido cargado y está listo para personalizar tu funda.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
