'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneModel } from '@/data/phoneData';
import { phoneData } from '@/data/phoneData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, Tag, Star, Zap, Gift, TrendingUp } from 'lucide-react';

export default function OfertasPage() {
  const [selectedOffer, setSelectedOffer] = useState('all');

  // Ofertas especiales
  const specialOffers = [
    {
      id: 'bundle-3',
      title: 'Pack de 3 Fundas',
      description: 'Ahorra 20% comprando 3 fundas personalizadas',
      discount: '20%',
      originalPrice: 897,
      salePrice: 717,
      icon: <Gift className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'first-time',
      title: 'Primera Compra',
      description: 'Descuento especial para nuevos clientes',
      discount: '15%',
      originalPrice: 599,
      salePrice: 254,
      icon: <Star className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'flash-sale',
      title: 'Oferta Relámpago',
      description: 'Solo por tiempo limitado - ¡No te la pierdas!',
      discount: '30%',
      originalPrice: 599,
      salePrice: 209,
      icon: <Zap className="w-8 h-8" />,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200'
    }
  ];

  // Modelos en oferta
  const featuredModels = phoneData.slice(0, 8);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Tag className="w-5 h-5" />
              <span className="font-semibold">OFERTAS ESPECIALES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¡Ofertas Imperdibles!
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Ahorra hasta 30% en fundas personalizadas
            </p>
          </div>
        </div>
      </div>

      {/* Ofertas Especiales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ofertas Especiales
          </h2>
          <p className="text-gray-600 text-lg">
            Aprovecha estas ofertas limitadas en tiempo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-gradient-to-br ${offer.bgColor} rounded-2xl p-8 border-2 ${offer.borderColor} hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
            >
              {/* Badge de descuento */}
              <div className={`absolute top-4 right-4 bg-gradient-to-r ${offer.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                -{offer.discount}
              </div>

              {/* Icono */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${offer.color} text-white mb-6`}>
                {offer.icon}
              </div>

              {/* Contenido */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {offer.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {offer.description}
              </p>

              {/* Precios */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-800">
                  ${offer.salePrice} MXN
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${offer.originalPrice} MXN
                </span>
              </div>

              {/* Botón */}
              <button className={`w-full bg-gradient-to-r ${offer.color} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}>
                Aprovechar Oferta
              </button>

              {/* Tiempo limitado */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Tiempo limitado</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modelos Destacados */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Modelos en Oferta
            </h2>
            <p className="text-gray-600 text-lg">
              Los modelos más populares con descuentos especiales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredModels.map((model) => (
              <div key={model.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image
                    src={model.colorURL}
                    alt={model.modelName}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge de oferta */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -15%
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {model.brand}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.9</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {model.modelName}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      $254 MXN
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      $599 MXN
                    </span>
                  </div>
                  
                  <Link
                    href={`/?model=${model.id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-sm text-center block"
                  >
                    Personalizar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Beneficios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¿Por qué elegir nuestras ofertas?
          </h2>
          <p className="text-gray-600 text-lg">
            Calidad premium con precios increíbles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Mejores Precios
            </h3>
            <p className="text-gray-600">
              Ofertas exclusivas que no encontrarás en ningún otro lugar
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Envío Gratis
            </h3>
            <p className="text-gray-600">
              Envío gratuito en pedidos superiores a $500 MXN
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white mb-4">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Calidad Premium
            </h3>
            <p className="text-gray-600">
              Materiales de la más alta calidad con garantía de 2 años
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
