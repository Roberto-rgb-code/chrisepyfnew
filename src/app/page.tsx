'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseCustomizer, { ImageControls } from '@/components/CaseCustomizer';
import AuthModal from '@/components/AuthModal';
import CartSuccessModal from '@/components/CartSuccessModal';
import ImageWarningModal from '@/components/ImageWarningModal';
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
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [showImageWarning, setShowImageWarning] = useState(false);

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
      setShowImageWarning(true);
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
    setShowCartSuccess(true);
  };

  const handleGoToCart = () => {
    setShowCartSuccess(false);
    router.push('/carrito');
  };

  const handleContinueShopping = () => {
    setShowCartSuccess(false);
    handleImageClear();
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

      {/* Modal de éxito del carrito */}
      <CartSuccessModal
        isOpen={showCartSuccess}
        onClose={() => setShowCartSuccess(false)}
        onGoToCart={handleGoToCart}
        onContinueShopping={handleContinueShopping}
      />

      {/* Modal de advertencia de imagen */}
      <ImageWarningModal
        isOpen={showImageWarning}
        onClose={() => setShowImageWarning(false)}
      />
    </>
  );
}

