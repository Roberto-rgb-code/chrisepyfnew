'use client';

import React from 'react';
import { CartItem } from '@/contexts/CartContext';

interface CasePreviewProps {
  item: CartItem;
  className?: string;
  showControls?: boolean;
}

export default function CasePreview({ item, className = "w-24 h-48", showControls = false }: CasePreviewProps) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* Imagen base del teléfono */}
      <img
        src={item.colorURL}
        alt={item.modelName}
        className="w-full h-full object-contain"
      />
      
      {/* Imagen personalizada con máscara */}
      {item.customImage && (
        <div
          className="absolute inset-0"
          style={{
            maskImage: `url(${item.maskURL})`,
            WebkitMaskImage: `url(${item.maskURL})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        >
          <img
            src={item.customImage}
            alt="Diseño personalizado"
            className="w-full h-full object-cover"
            style={{
              transform: `
                scale(${item.imageControls.scale}) 
                rotate(${item.imageControls.rotation}deg) 
                scaleX(${item.imageControls.flipX}) 
                scaleY(${item.imageControls.flipY})
                translate(${item.imageControls.position.x}px, ${item.imageControls.position.y}px)
              `,
              transformOrigin: 'center center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      {/* Indicador de personalización */}
      {item.customImage && showControls && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          🎨 Personalizado
        </div>
      )}
    </div>
  );
}
