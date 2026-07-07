'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseCustomizer, { ImageControls } from '@/components/CaseCustomizer';
import AuthModal from '@/components/AuthModal';
import CartSuccessModal from '@/components/CartSuccessModal';
import ImageWarningModal from '@/components/ImageWarningModal';
import ImageUploadSuccessModal from '@/components/ImageUploadSuccessModal';
import { phoneData, PhoneModel } from '@/data/phoneData';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { uploadDesignImage } from '@/lib/uploadImage';

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
         const [showImageUploadSuccess, setShowImageUploadSuccess] = useState(false);

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
    console.log('🖼️ handleImageUpload llamado con:', file);
    
    if (!file) {
      console.log('❌ No hay archivo');
      setUserImageSrc(null);
      return;
    }

    // Validar que sea una imagen
    if (!file.type || !file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.)');
      return;
    }

    console.log('📁 Archivo a subir:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    if (user) {
      console.log('✅ Usuario autenticado:', user.uid);
    } else {
      console.log('ℹ️ Usuario no autenticado - modo local (sin guardar en Firestore)');
    }

    try {
      // Convertir imagen a base64 (localmente, sin guardar en Firestore)
      console.log('🚀 Convirtiendo imagen a base64...');
      const uploadResult = await uploadDesignImage(file, user?.uid);
      
      console.log('📤 Resultado de subida:', uploadResult);
      
      if (uploadResult.success && uploadResult.url) {
        console.log('✅ Imagen subida exitosamente:', uploadResult.url.substring(0, 50) + '...');
        setUserImageSrc(uploadResult.url);
        setImageControls({
          scale: 1,
          rotation: 0,
          flipX: 1,
          flipY: 1,
          position: { x: 0, y: 0 }
        });
        setShowImageUploadSuccess(true);
      } else {
        const errorMessage = uploadResult.error || 'Error desconocido al subir la imagen';
        console.error('❌ Error subiendo imagen:', errorMessage);
        alert(`Error al subir la imagen: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('💥 Error en handleImageUpload:', error);
      const errorMessage = error?.message || error?.toString() || 'Error desconocido';
      alert(`Error al subir la imagen: ${errorMessage}`);
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
      // Requerir login para agregar al carrito
      if (!user) {
        setShowAuthModal(true);
        alert('Debes iniciar sesión para agregar productos al carrito');
        return;
      }

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

        if (user) {
          try {
            await fetch('/api/personalizations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.uid,
                userEmail: user.email,
                modelId: selectedModel.id,
                modelName: selectedModel.modelName,
                customImageUrl: userImageSrc,
                imageControls: imageControls,
              }),
            });
          } catch (dbError) {
            console.error('Error guardando personalización:', dbError);
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

             {/* Modal de éxito de subida de imagen */}
             <ImageUploadSuccessModal
               isOpen={showImageUploadSuccess}
               onClose={() => setShowImageUploadSuccess(false)}
             />
           </>
         );
       }

