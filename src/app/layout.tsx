import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import ProductTour from '@/components/ProductTour';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Empaques & Fundas - Personaliza tu Funda',
  description: 'Fundas personalizadas de la más alta calidad. Protege tu dispositivo con estilo único.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} pb-20 sm:pb-0`} style={{ backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
              <WhatsAppWidget />
              <ProductTour />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

