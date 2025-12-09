'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Package, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  RefreshCw,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Smartphone,
  ZoomIn,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Move
} from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  status: string;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  items: any[];
  hasCustomDesigns: boolean;
  totalItems: number;
  createdAt: any;
  orderDate: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  customDesigns: number;
  avgOrderValue: number;
}

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    customDesigns: 0,
    avgOrderValue: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Verificar si es admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, loading, isAdmin, router]);

  // Cargar datos
  useEffect(() => {
    if (isAdmin && db) {
      loadOrders();
    }
  }, [isAdmin]);

  const loadOrders = async () => {
    if (!db) return;
    
    setLoadingData(true);
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(ordersQuery);
      const ordersData: Order[] = [];
      
      snapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });
      
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      
      // Calcular estadísticas
      const totalRevenue = ordersData.reduce((acc, order) => acc + (order.amountTotal || 0), 0);
      const pendingOrders = ordersData.filter(o => o.status === 'confirmed' || o.status === 'processing').length;
      const completedOrders = ordersData.filter(o => o.status === 'delivered').length;
      const customDesigns = ordersData.filter(o => o.hasCustomDesigns).length;
      
      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        customDesigns,
        avgOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0
      });
      
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Filtrar órdenes
  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!db) return;
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Actualizar estado local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert(`Estado actualizado a: ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'confirmed': 'Confirmado',
      'processing': 'En Proceso',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'confirmed': CheckCircle,
      'processing': Clock,
      'shipped': Truck,
      'delivered': Package,
      'cancelled': XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const toggleOrderExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString: string | any) => {
    if (!dateString) return 'N/A';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString.toDate?.() || new Date();
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading || loadingData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando panel de administración...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🛠️ Panel de Administración</h1>
            <p className="text-gray-600 mt-2">Gestiona todas las órdenes y visualiza estadísticas</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Órdenes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Con Diseños</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.customDesigns}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Promedio</p>
                  <p className="text-2xl font-bold text-blue-600">${stats.avgOrderValue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por email, orden..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="processing">En Proceso</option>
                  <option value="shipped">Enviados</option>
                  <option value="delivered">Entregados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
              
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No se encontraron órdenes
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <>
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleOrderExpanded(order.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {expandedOrders.has(order.id) ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  #{order.orderId?.slice(-8) || order.id.slice(-8)}
                                </p>
                                {order.hasCustomDesigns && (
                                  <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                                    <ImageIcon className="w-3 h-3" />
                                    Personalizado
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{order.customerName || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {order.totalItems || order.items?.length || 0} items
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-green-600">
                              ${order.amountTotal?.toFixed(2) || '0.00'} MXN
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(order.orderDate || order.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="confirmed">Confirmado</option>
                              <option value="processing">En Proceso</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                        
                        {/* Expanded Order Details */}
                        {expandedOrders.has(order.id) && (
                          <tr key={`${order.id}-details`}>
                            <td colSpan={7} className="px-6 py-6 bg-gradient-to-br from-gray-50 to-gray-100">
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    📦 Detalles del Pedido
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {order.items?.length || 0} producto(s)
                                  </span>
                                </div>
                                
                                {/* Items del pedido */}
                                <div className="space-y-4">
                                  {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                      {/* Header del item */}
                                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                          <Smartphone className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                          <h5 className="text-lg font-bold text-gray-900">{item.modelName || 'Modelo desconocido'}</h5>
                                          <p className="text-sm text-gray-500">ID: {item.modelId || item.id || 'N/A'}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                          <p className="text-xl font-bold text-green-600">${item.price || 0} MXN</p>
                                          <p className="text-sm text-gray-500">Cantidad: {item.quantity || 1}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Preview de la funda */}
                                        <div className="flex flex-col items-center">
                                          <p className="text-sm font-medium text-gray-700 mb-3">📱 Vista previa de la funda</p>
                                          <div className="w-32 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative shadow-lg">
                                            {item.colorURL && (
                                              <img
                                                src={item.colorURL}
                                                alt={item.modelName}
                                                className="absolute inset-0 w-full h-full object-contain"
                                              />
                                            )}
                                            {item.customImage && (
                                              <div 
                                                className="absolute inset-0"
                                                style={{
                                                  maskImage: item.maskURL ? `url(${item.maskURL})` : 'none',
                                                  WebkitMaskImage: item.maskURL ? `url(${item.maskURL})` : 'none',
                                                  maskSize: '100% 100%',
                                                  WebkitMaskSize: '100% 100%',
                                                }}
                                              >
                                                <img
                                                  src={item.customImage}
                                                  alt="Diseño personalizado"
                                                  className="w-full h-full object-cover"
                                                  style={{
                                                    transform: `
                                                      scale(${item.imageControls?.scale || 1})
                                                      rotate(${item.imageControls?.rotation || 0}deg)
                                                      scaleX(${item.imageControls?.flipX || 1})
                                                      scaleY(${item.imageControls?.flipY || 1})
                                                    `
                                                  }}
                                                />
                                              </div>
                                            )}
                                            {!item.customImage && (
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xs text-gray-400 text-center px-2">Sin personalización</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        {/* Imagen personalizada y controles */}
                                        {item.customImage ? (
                                          <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                              <ImageIcon className="w-5 h-5 text-purple-600" />
                                              <p className="text-sm font-medium text-gray-700">🎨 Imagen Personalizada</p>
                                            </div>
                                            
                                            {/* Imagen original subida */}
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                              <p className="text-xs text-gray-500 mb-2">Imagen original subida por el cliente:</p>
                                              <div className="relative">
                                                <img
                                                  src={item.customImage}
                                                  alt="Imagen personalizada"
                                                  className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
                                                />
                                              </div>
                                              
                                              {/* Botones de acción */}
                                              <div className="flex gap-2 mt-3">
                                                <button
                                                  onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = item.customImage;
                                                    link.download = `imagen-personalizada-${order.orderId?.slice(-8) || order.id.slice(-8)}-${idx + 1}.png`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                  }}
                                                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                  <Download className="w-4 h-4" />
                                                  Descargar imagen
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    const newWindow = window.open('', '_blank');
                                                    if (newWindow) {
                                                      newWindow.document.write(`
                                                        <html>
                                                          <head><title>Imagen Personalizada - ${item.modelName}</title></head>
                                                          <body style="margin:0;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;background:#1f2937;font-family:system-ui;">
                                                            <h2 style="color:white;margin-bottom:20px;">🎨 ${item.modelName}</h2>
                                                            <img src="${item.customImage}" style="max-width:90%;max-height:80vh;border-radius:12px;box-shadow:0 25px 50px rgba(0,0,0,0.5);" />
                                                            <p style="color:#9ca3af;margin-top:20px;font-size:14px;">Orden: #${order.orderId?.slice(-8) || order.id.slice(-8)}</p>
                                                          </body>
                                                        </html>
                                                      `);
                                                    }
                                                  }}
                                                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                                >
                                                  <Eye className="w-4 h-4" />
                                                  Ver completa
                                                </button>
                                              </div>
                                            </div>
                                            
                                            {/* Controles de personalización aplicados */}
                                            {item.imageControls && (
                                              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                                <p className="text-xs font-semibold text-purple-800 mb-3">⚙️ Ajustes aplicados por el cliente:</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                                                    <ZoomIn className="w-4 h-4 text-purple-600" />
                                                    <div>
                                                      <p className="text-xs text-gray-500">Escala</p>
                                                      <p className="text-sm font-bold text-gray-900">{(item.imageControls.scale || 1).toFixed(2)}x</p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                                                    <RotateCw className="w-4 h-4 text-purple-600" />
                                                    <div>
                                                      <p className="text-xs text-gray-500">Rotación</p>
                                                      <p className="text-sm font-bold text-gray-900">{item.imageControls.rotation || 0}°</p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                                                    <FlipHorizontal className="w-4 h-4 text-purple-600" />
                                                    <div>
                                                      <p className="text-xs text-gray-500">Volteo H</p>
                                                      <p className="text-sm font-bold text-gray-900">{item.imageControls.flipX === -1 ? '✅ Sí' : '❌ No'}</p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                                                    <FlipVertical className="w-4 h-4 text-purple-600" />
                                                    <div>
                                                      <p className="text-xs text-gray-500">Volteo V</p>
                                                      <p className="text-sm font-bold text-gray-900">{item.imageControls.flipY === -1 ? '✅ Sí' : '❌ No'}</p>
                                                    </div>
                                                  </div>
                                                  {item.imageControls.position && (
                                                    <div className="col-span-2 flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                                                      <Move className="w-4 h-4 text-purple-600" />
                                                      <div>
                                                        <p className="text-xs text-gray-500">Posición</p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                          X: {item.imageControls.position.x || 0}px, Y: {item.imageControls.position.y || 0}px
                                                        </p>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-center h-full">
                                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                              <p className="text-gray-500 text-sm">Sin imagen personalizada</p>
                                              <p className="text-gray-400 text-xs mt-1">El cliente no subió diseño</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Info adicional */}
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                  <p className="text-sm font-semibold text-gray-700 mb-3">📋 Información técnica</p>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-500 text-xs">ID de Stripe:</span>
                                      <p className="font-mono text-xs break-all text-gray-900">{order.orderId || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 text-xs">ID de Usuario:</span>
                                      <p className="font-mono text-xs break-all text-gray-900">{order.userId || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 text-xs">Estado de Pago:</span>
                                      <p className="capitalize text-gray-900 font-medium">{order.paymentStatus || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 text-xs">Moneda:</span>
                                      <p className="uppercase text-gray-900 font-medium">{order.currency || 'MXN'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

