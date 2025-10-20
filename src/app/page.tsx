'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseCustomizer, { ImageControls } from '@/components/CaseCustomizer';
import AuthModal from '@/components/AuthModal';
import { phoneData, PhoneModel } from '@/data/phoneData';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<PhoneModel>(phoneData[0]);
  const [userImageSrc, setUserImageSrc] = useState<string | null>(null);
  const [imageControls, setImageControls] = useState<ImageControls>({
    scale: 1,
    rotation: 0,
    flipX: 1,
    flipY: 1,
    position: { x: 0, y: 0 }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleModelChange = (model: PhoneModel) => {
    setSelectedModel(model);
    // Reiniciar controles al cambiar modelo
    setImageControls({
      scale: 1,
      rotation: 0,
      flipX: 1,
      flipY: 1,
      position: { x: 0, y: 0 }
    });
  };

  const handleImageUpload = (imageSrc: string) => {
    setUserImageSrc(imageSrc);
    setImageControls({
      scale: 1,
      rotation: 0,
      flipX: 1,
      flipY: 1,
      position: { x: 0, y: 0 }
    });
  };

  const handleImageClear = () => {
    setUserImageSrc(null);
    setImageControls({
      scale: 1,
      rotation: 0,
      flipX: 1,
      flipY: 1,
      position: { x: 0, y: 0 }
    });
  };

  const handleAddToCart = () => {
    if (!userImageSrc) {
      alert('Por favor sube una imagen antes de agregar al carrito.');
      return;
    }

    const cartItem = {
      id: `${selectedModel.id}-${Date.now()}`,
      modelName: selectedModel.modelName,
      colorURL: selectedModel.colorURL,
      maskURL: selectedModel.maskURL,
      customImage: userImageSrc,
      price: 299,
      quantity: 1,
      imageControls: { ...imageControls }
    };

    addToCart(cartItem);
    alert('¡Producto agregado al carrito!');
    
    // Preguntar si quiere ir al carrito o seguir comprando
    if (confirm('¿Deseas ir al carrito para finalizar tu compra?')) {
      router.push('/carrito');
    } else {
      // Limpiar para que pueda personalizar otra funda
      handleImageClear();
    }
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <Navbar />
      <CaseCustomizer
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        models={phoneData}
        userImageSrc={userImageSrc}
        onImageUpload={handleImageUpload}
        onImageClear={handleImageClear}
        imageControls={imageControls}
        onImageControlsChange={setImageControls}
        onAddToCart={handleAddToCart}
        isAuthenticated={!!user}
        onLoginClick={handleLoginClick}
      />
      <Footer />
      
      {/* Modal de autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
}

