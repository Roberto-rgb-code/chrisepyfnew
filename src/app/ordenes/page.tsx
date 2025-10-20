'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Calendar, CreditCard } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  // TODO: Aquí integrarías con Firestore para obtener las órdenes reales del usuario
  // Por ahora mostramos un mensaje de que no hay órdenes

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">📦 Mis Órdenes</h1>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No tienes órdenes aún</h2>
          <p className="text-gray-600 mb-8">
            Cuando realices tu primera compra, aparecerá aquí
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Comenzar a Personalizar
          </button>
        </div>

        {/* Ejemplo de cómo se verían las órdenes (comentado para futuro) */}
        {/*
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Orden #12345</h3>
                <p className="text-sm text-gray-600">Realizada el 20 de octubre, 2025</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Completada
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Productos</p>
                  <p className="font-semibold">2 fundas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold">$598 MXN</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Entrega estimada</p>
                  <p className="font-semibold">22 de octubre, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
      <Footer />
    </>
  );
}

