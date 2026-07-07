'use client';

import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import CaseCustomizer, { ImageControls } from '@/components/CaseCustomizer';
import AuthModal from '@/components/AuthModal';
import CartSuccessModal from '@/components/CartSuccessModal';
import ImageWarningModal from '@/components/ImageWarningModal';
import ImageUploadSuccessModal from '@/components/ImageUploadSuccessModal';
import CheckoutSteps from '@/components/CheckoutSteps';
import { phoneData, PhoneModel } from '@/data/phoneData';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { uploadDesignImage } from '@/lib/uploadImage';

function HomeContent() {
  const searchParams = useSearchParams();
  const modelParam = searchParams.get('model');

  const [selectedModel, setSelectedModel] = useState<PhoneModel>(
    phoneData.find((m) => m.id === modelParam) || phoneData.find((m) => m.id === 'ip17promax') || phoneData[0]
  );
  const [userImageSrc, setUserImageSrc] = useState<string | null>(null);
  const [imageControls, setImageControls] = useState<ImageControls>({
    scale: 1,
    rotation: 0,
    flipX: 1,
    flipY: 1,
    position: { x: 0, y: 0 },
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [showImageWarning, setShowImageWarning] = useState(false);
  const [showImageUploadSuccess, setShowImageUploadSuccess] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (modelParam) {
      const model = phoneData.find((m) => m.id === modelParam);
      if (model) setSelectedModel(model);
    }
  }, [modelParam]);

  const handleModelChange = (model: PhoneModel) => {
    setSelectedModel(model);
    setImageControls({ scale: 1, rotation: 0, flipX: 1, flipY: 1, position: { x: 0, y: 0 } });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setUserImageSrc(null);
      return;
    }

    if (!file.type?.startsWith('image/')) {
      showToast('Selecciona una imagen válida (JPG, PNG)', 'error');
      return;
    }

    try {
      const uploadResult = await uploadDesignImage(file, user?.uid);
      if (uploadResult.success && uploadResult.url) {
        setUserImageSrc(uploadResult.url);
        setImageControls({ scale: 1, rotation: 0, flipX: 1, flipY: 1, position: { x: 0, y: 0 } });
        setShowImageUploadSuccess(true);
      } else {
        showToast(uploadResult.error || 'Error al subir la imagen', 'error');
      }
    } catch {
      showToast('Error al procesar la imagen', 'error');
    }
  };

  const handleImageClear = () => {
    setUserImageSrc(null);
    setImageControls({ scale: 1, rotation: 0, flipX: 1, flipY: 1, position: { x: 0, y: 0 } });
  };

  const handleAddToCart = async () => {
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
      imageControls: { ...imageControls },
    };

    addToCart(cartItem);
    setShowCartSuccess(true);
    showToast('¡Funda agregada al carrito!', 'success');

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
            imageControls,
          }),
        });
      } catch {
        /* non-blocking */
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CheckoutSteps current={1} />
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Diseña tu funda en minutos
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Elige tu modelo, sube tu foto y ajusta el diseño. Paga cuando estés listo.
            </p>
          </div>
        </div>
      </div>

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
        onLoginClick={() => setShowAuthModal(true)}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="login" />
      <CartSuccessModal
        isOpen={showCartSuccess}
        onClose={() => setShowCartSuccess(false)}
        onGoToCart={() => { setShowCartSuccess(false); router.push('/carrito'); }}
        onContinueShopping={() => { setShowCartSuccess(false); handleImageClear(); }}
      />
      <ImageWarningModal isOpen={showImageWarning} onClose={() => setShowImageWarning(false)} />
      <ImageUploadSuccessModal isOpen={showImageUploadSuccess} onClose={() => setShowImageUploadSuccess(false)} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen message="Cargando personalizador..." submessage="Preparando tu experiencia" />}>
        <HomeContent />
      </Suspense>
      <Footer />
    </>
  );
}
