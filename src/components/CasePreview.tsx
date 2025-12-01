'use client';

import React from 'react';
import { CartItem } from '@/contexts/CartContext';

interface CasePreviewProps {
  item: CartItem;
  className?: string;
  showControls?: boolean;
}

/**
 * Preview compacto para el carrito.
 * IMPORTANTE: reutiliza la MISMA estructura visual del CaseCustomizer,
 * pero escalada para que se vea igual, solo más pequeño.
 */
export default function CasePreview({
  item,
  className = '',
  showControls = false
}: CasePreviewProps) {
  // Misma lógica que en CaseCustomizer, pero usando los valores guardados en el carrito
  const customImageStyle: React.CSSProperties = {
    transform: `translate(${item.imageControls?.position.x || 0}px, ${
      item.imageControls?.position.y || 0
    }px) scale(${(item.imageControls?.scale || 1) * (item.imageControls?.flipX || 1)}, ${
      (item.imageControls?.scale || 1) * (item.imageControls?.flipY || 1)
    }) rotate(${item.imageControls?.rotation || 0}deg)`,
    transformOrigin: 'center'
  };

  const maskStyle: React.CSSProperties = {
    maskImage: `url(${item.maskURL})`,
    WebkitMaskImage: `url(${item.maskURL})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center'
  } as React.CSSProperties;

  // Escala para el preview en el carrito (mismo diseño, más pequeño)
  const SCALE = 0.32; // 32% del tamaño original (320x640)
  const baseWidth = 320;
  const baseHeight = 640;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: baseWidth * SCALE,
        height: baseHeight * SCALE,
        overflow: 'hidden'
      }}
    >
      {/* Contenedor escalado que reutiliza EXACTAMENTE la estructura del personalizador */}
      <div
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          width: baseWidth,
          height: baseHeight,
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <div className="case-container">
          {/* Imagen base del modelo */}
          <img
            src={item.colorURL}
            alt={item.modelName}
            className="base-image"
          />

          {/* Imagen personalizada con máscara */}
          {item.customImage && (
            <div className="custom-image-container">
              <div className="custom-image-wrapper" style={maskStyle}>
                <img
                  src={item.customImage}
                  alt="Custom Design"
                  className="custom-image"
                  style={customImageStyle}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de personalización */}
      {item.customImage && showControls && (
        <span className="absolute -top-2 -left-2 z-30 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow">
          ✨ Personalizado
        </span>
      )}
    </div>
  );
}
