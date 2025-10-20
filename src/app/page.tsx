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
import { uploadDesignImage } from '@/lib/uploadImage';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<PhoneModel>(phoneData.find(model => model.id === 'ip17promax') || phoneData[0]);
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
  const auth = useAuth();
  const { user } = auth || {};
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

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setUserImageSrc(null);
      return;
    }

    if (!user) {
      alert('Debes iniciar sesión para subir imágenes');
      return;
    }

    try {
      // Subir imagen a Firebase Storage
      const uploadResult = await uploadDesignImage(file, user.uid);
      
      if (uploadResult.success && uploadResult.url) {
        setUserImageSrc(uploadResult.url);
        setImageControls({
          scale: 1,
          rotation: 0,
          flipX: 1,
          flipY: 1,
          position: { x: 0, y: 0 }
        });
        console.log('Imagen subida exitosamente:', uploadResult.url);
      } else {
        console.error('Error subiendo imagen:', uploadResult.error);
        alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error en handleImageUpload:', error);
      alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    }
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

  const handleAddToCart = async () => {
    try {
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
        price: 599,
        quantity: 1,
        imageControls: { ...imageControls }
      };

      if (addToCart) {
        addToCart(cartItem);
        setShowCartSuccess(true);

        // Guardar la personalización en Firestore
        if (user && db) {
          try {
            await addDoc(collection(db, 'personalizations'), {
              userId: user.uid,
              userEmail: user.email,
              modelId: selectedModel.id,
              modelName: selectedModel.modelName,
              customImageUrl: userImageSrc,
              imageControls: imageControls,
              timestamp: serverTimestamp(),
              status: 'added_to_cart'
            });
            console.log('Personalización guardada en Firestore');
          } catch (firestoreError) {
            console.error('Error guardando personalización en Firestore:', firestoreError);
          }
        }
      } else {
        console.error('addToCart function not available');
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
    }
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

