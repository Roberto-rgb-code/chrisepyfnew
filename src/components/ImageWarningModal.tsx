'use client';

import React from 'react';
import { X, Image, Upload } from 'lucide-react';

interface ImageWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageWarningModal({ isOpen, onClose }: ImageWarningModalProps) {
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

        {/* Icono */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
            <Image className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          ¡Imagen Requerida!
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Por favor sube una imagen antes de agregar al carrito. Personaliza tu funda con tu diseño favorito.
        </p>

        {/* Botón */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-md flex items-center justify-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Subir Imagen</span>
        </button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">💡 Tips para mejor calidad:</p>
            <ul className="space-y-1 text-xs">
              <li>• Usa imágenes de alta resolución</li>
              <li>• Formato JPG o PNG recomendado</li>
              <li>• Evita imágenes muy oscuras</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
