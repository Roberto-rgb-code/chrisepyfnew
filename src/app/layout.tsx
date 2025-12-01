import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Empaques & Fundas - Personaliza tu Funda',
  description: 'Fundas personalizadas de la más alta calidad. Protege tu dispositivo con estilo único.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

