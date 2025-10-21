'use client';

import { useState, useRef, useEffect } from 'react';
import { PhoneModel } from '@/data/phoneData';
import { Crosshair } from 'lucide-react';
import Image from 'next/image';
import AuthWarningModal from './AuthWarningModal';

export interface ImageControls {
  scale: number;
  rotation: number;
  flipX: number;
  flipY: number;
  position: { x: number; y: number };
}

interface CaseCustomizerProps {
  selectedModel: PhoneModel;
  onModelChange: (model: PhoneModel) => void;
  models: PhoneModel[];
  userImageSrc: string | null;
  onImageUpload: (file: File | null) => void;
  onImageClear: () => void;
  imageControls: ImageControls;
  onImageControlsChange: (controls: ImageControls) => void;
  onAddToCart: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export default function CaseCustomizer({
  selectedModel,
  onModelChange,
  models,
  userImageSrc,
  onImageUpload,
  onImageClear,
  imageControls,
  onImageControlsChange,
  onAddToCart,
  isAuthenticated,
  onLoginClick
}: CaseCustomizerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!userImageSrc) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMove('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMove('down');
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleScale(0.1);
          break;
        case '-':
          e.preventDefault();
          handleScale(-0.1);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotation(90);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userImageSrc, imageControls]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Pasar el objeto File directamente a onImageUpload
      onImageUpload(file);
    }
  };

  const handleScale = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, imageControls.scale + delta));
    onImageControlsChange({ ...imageControls, scale: newScale });
  };

  const handleRotation = (angle: number) => {
    const newRotation = (imageControls.rotation + angle) % 360;
    onImageControlsChange({ ...imageControls, rotation: newRotation });
  };

  const handleFlip = (axis: 'x' | 'y') => {
    if (axis === 'x') {
      onImageControlsChange({ ...imageControls, flipX: imageControls.flipX * -1 });
    } else {
      onImageControlsChange({ ...imageControls, flipY: imageControls.flipY * -1 });
    }
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    const STEP = 10;
    const newPosition = { ...imageControls.position };

    switch (direction) {
      case 'up':
        newPosition.y -= STEP;
        break;
      case 'down':
        newPosition.y += STEP;
        break;
      case 'left':
        newPosition.x -= STEP;
        break;
      case 'right':
        newPosition.x += STEP;
        break;
    }

    onImageControlsChange({ ...imageControls, position: newPosition });
  };

  const resetTransform = () => {
    onImageControlsChange({
      scale: 1,
      rotation: 0,
      flipX: 1,
      flipY: 1,
      position: { x: 0, y: 0 }
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (userImageSrc) {
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setInitialPos({ ...imageControls.position });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && userImageSrc) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      onImageControlsChange({
        ...imageControls,
        position: {
          x: initialPos.x + deltaX,
          y: initialPos.y + deltaY
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (userImageSrc) {
      setIsDragging(true);
      const touch = e.touches[0];
      setStartPos({ x: touch.clientX, y: touch.clientY });
      setInitialPos({ ...imageControls.position });
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && userImageSrc) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.x;
      const deltaY = touch.clientY - startPos.y;

      onImageControlsChange({
        ...imageControls,
        position: {
          x: initialPos.x + deltaX,
          y: initialPos.y + deltaY
        }
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleAddToCartClick = () => {
    try {
      if (!isAuthenticated) {
        setShowAuthWarning(true);
        return;
      }
      if (onAddToCart) {
        onAddToCart();
      } else {
        console.error('onAddToCart function not available');
      }
    } catch (error) {
      console.error('Error in handleAddToCartClick:', error);
    }
  };

  const handleLoginFromWarning = () => {
    setShowAuthWarning(false);
    onLoginClick();
  };

  const customImageStyle = {
    transform: `translate(${imageControls.position.x}px, ${imageControls.position.y}px) scale(${imageControls.scale * imageControls.flipX}, ${imageControls.scale * imageControls.flipY}) rotate(${imageControls.rotation}deg)`,
    transformOrigin: 'center'
  };

  const maskStyle = {
    maskImage: `url(${selectedModel.maskURL})`,
    WebkitMaskImage: `url(${selectedModel.maskURL})`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center'
  };

  return (
    <div className="main-content">
      {/* Sidebar Izquierdo */}
      <div className="sidebar-left fade-in">
        <h2 className="sidebar-title">📱 Selecciona tu Modelo</h2>
        <select
          className="model-select"
          value={selectedModel.modelName}
          onChange={(e) => {
            const model = models.find(m => m.modelName === e.target.value);
            if (model) onModelChange(model);
          }}
        >
          {models.map(model => (
            <option key={model.id} value={model.modelName}>
              {model.modelName}
            </option>
          ))}
        </select>

        <h2 className="sidebar-title upload-title">🖼️ Sube tu Imagen</h2>
        <label className="upload-area">
          <span className="upload-icon">📤</span>
          <span className="upload-text">Arrastra tu imagen aquí</span>
          <input
            ref={fileInputRef}
            type="file"
            className="upload-input"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </label>

        {userImageSrc && (
          <div className="image-preview-container">
            <img src={userImageSrc} alt="Preview" className="image-preview" />
            <button onClick={onImageClear} className="primary-button clear-button">
              🗑️ Limpiar Imagen
            </button>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <div className="text-xs text-blue-800">
              <p className="font-semibold">Tips para mejor calidad:</p>
              <ul className="mt-1 space-y-1">
                <li>• Usa imágenes de alta resolución</li>
                <li>• Formato JPG o PNG recomendado</li>
                <li>• Evita imágenes muy oscuras</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Preview Central */}
      <div className="case-preview fade-in">
        <div
          className="case-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={selectedModel.colorURL}
            alt="Modelo Base"
            className="base-image"
          />
          {userImageSrc && (
            <div className="custom-image-container">
              <div className="custom-image-wrapper" style={maskStyle}>
                <img
                  src={userImageSrc}
                  alt="Custom Design"
                  className="custom-image"
                  style={customImageStyle}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span>🛡️</span>
            <span>Protección Premium</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🚚</span>
            <span>Envío 24-48h</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🏆</span>
            <span>Garantía 2 años</span>
          </div>
        </div>
      </div>

      {/* Sidebar Derecho */}
      <div className="sidebar-right fade-in">
        <div className="price-section">
          <div className="price-amount">$599 MXN</div>
          <div className="price-subtitle">Envío gratis incluido</div>
        </div>

        <button onClick={handleAddToCartClick} className="primary-button add-to-cart-button">
          🛒 Agregar al Carrito
        </button>

        {userImageSrc && (
          <>
            <div className="control-section">
              <h3 className="control-title">🔍 Escala</h3>
              <div className="control-buttons">
                <button onClick={() => handleScale(-0.1)} className="control-button">−</button>
                <button onClick={() => handleScale(0.1)} className="control-button">+</button>
              </div>
            </div>

            <div className="control-section">
              <h3 className="control-title">🔄 Rotación</h3>
              <div className="control-buttons">
                <button onClick={() => handleRotation(-90)} className="control-button">↺</button>
                <button onClick={() => handleRotation(90)} className="control-button">↻</button>
              </div>
            </div>

            <div className="control-section">
              <h3 className="control-title">↔️ Voltear</h3>
              <div className="control-buttons">
                <button onClick={() => handleFlip('x')} className="control-button">⇄</button>
                <button onClick={() => handleFlip('y')} className="control-button">⇅</button>
              </div>
            </div>

            <div className="control-section">
              <h3 className="control-title">📍 Posición</h3>
              <div className="move-controls">
                <div></div>
                <button onClick={() => handleMove('up')} className="move-button">↑</button>
                <div></div>
                <button onClick={() => handleMove('left')} className="move-button">←</button>
                <div className="move-center">
                  <Crosshair className="w-3 h-3 text-gray-500" />
                </div>
                <button onClick={() => handleMove('right')} className="move-button">→</button>
                <div></div>
                <button onClick={() => handleMove('down')} className="move-button">↓</button>
                <div></div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Usa las flechas del teclado</p>
            </div>

            <button
              onClick={resetTransform}
              className="primary-button"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', marginTop: '0.5rem' }}
            >
              🔄 Resetear Posición
            </button>

            <button onClick={onImageClear} className="primary-button remove-button">
              🗑️ Eliminar Imagen
            </button>
          </>
        )}

        <div className="mt-auto p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
          <div className="text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span className="text-green-800 font-medium">Garantía de satisfacción</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔄</span>
              <span className="text-blue-800 font-medium">Cambios y devoluciones</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🛡️</span>
              <span className="text-purple-800 font-medium">Pago 100% seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de advertencia de autenticación */}
      <AuthWarningModal
        isOpen={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
        onLogin={handleLoginFromWarning}
      />
    </div>
  );
}

