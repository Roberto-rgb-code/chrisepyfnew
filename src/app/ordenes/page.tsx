'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasePreview from '@/components/CasePreview';
import { Package, Calendar, CreditCard, ChevronDown, ChevronUp } from '@/components/icons';
import { formatOrderNumber } from '@/lib/email-utils';

interface OrderItem {
  id: string;
  modelName: string;
  colorURL: string;
  maskURL: string;
  customImage?: string;
  price: number;
  quantity: number;
  imageControls?: object;
}

interface Order {
  id: string;
  orderId: string;
  status: string;
  amountTotal: number;
  totalItems: number;
  orderDate: string;
  createdAt: string;
  items: OrderItem[];
  hasCustomDesigns: boolean;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) router.push('/login?returnUrl=/ordenes');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.uid}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading || loadingOrders) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis órdenes</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Historial de tus compras y diseños</p>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sin órdenes aún</h2>
            <p className="text-gray-600 mb-6">Cuando compres, verás aquí tu diseño y el estado del envío.</p>
            <button onClick={() => router.push('/')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
              Personalizar mi funda
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => {
                    const next = new Set(expanded);
                    next.has(order.id) ? next.delete(order.id) : next.add(order.id);
                    setExpanded(next);
                  }}
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Pedido #{formatOrderNumber(order.orderId)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate || order.createdAt).toLocaleDateString('es-MX', { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-green-600">${order.amountTotal} MXN</span>
                    {expanded.has(order.id) ? <ChevronUp className="w-5 h-5 text-gray-400 ml-auto sm:ml-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 ml-auto sm:ml-0" />}
                  </div>
                </button>

                {expanded.has(order.id) && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" /> {order.totalItems} producto(s)
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="w-4 h-4" /> ${order.amountTotal} MXN
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(order.items as OrderItem[])?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                          {item.customImage && (
                            <CasePreview item={{ ...item, customImage: item.customImage, imageControls: item.imageControls as any || { scale: 1, rotation: 0, flipX: 1, flipY: 1, position: { x: 0, y: 0 } } }} />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{item.modelName}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                            {item.customImage && <p className="text-xs text-purple-600 font-medium mt-1">🎨 Con tu diseño</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
