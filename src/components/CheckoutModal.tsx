'use client';

import React, { useState } from 'react';
import { X, CreditCard, Lock, Shield, Truck, Check } from 'lucide-react';
import CasePreview from './CasePreview';
import { CartItem } from '@/contexts/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onConfirmPayment: () => void;
  loading?: boolean;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onConfirmPayment,
  loading = false 
}: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [saveData, setSaveData] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Empaques y Fundas LATAM</h1>
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                TEST MODE
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Product Details */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Funda Personalizada - {items[0]?.modelName || 'iPhone'}
            </h2>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              MXN {total.toLocaleString()}.00
            </p>
            <p className="text-gray-600 mb-6">Con diseño personalizado</p>

            {/* Product Images */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <CasePreview 
                      item={item} 
                      className="w-20 h-40" 
                      showControls={true}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.modelName}</h3>
                      <p className="text-sm text-gray-600">Cantidad {item.quantity}</p>
                      <p className="text-sm text-gray-600">MXN {item.price}.00 unidad</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:w-1/2 p-6">
            {/* Pay with Link Button */}
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Pagar con Link</span>
            </button>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">O bien</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de pago</h3>
              
              {/* Card Information */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Información de la tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="1234 1234 1234 1234"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                    <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center">M</div>
                    <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">A</div>
                  </div>
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/AA"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    placeholder="CVC"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-3 border border-gray-400 rounded text-xs flex items-center justify-center">
                      123
                    </div>
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="mb-4">
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del titular de tarjeta"
                />
              </div>

              {/* Country */}
              <div className="mb-4">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="MX">México</option>
                  <option value="US">Estados Unidos</option>
                  <option value="CA">Canadá</option>
                </select>
              </div>
            </div>

            {/* Save Data Option */}
            <div className="mb-6">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={saveData}
                  onChange={(e) => setSaveData(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Guardar mis datos para un proceso de compra más rápido</p>
                  <p className="text-xs mt-1">
                    Paga de forma segura en Empaques y Fundas LATAM y en todos los comercios que acepten Link.
                  </p>
                </div>
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={onConfirmPayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Pagar'}
            </button>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Powered by stripe</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a href="#" className="hover:underline">Condiciones</a>
                <a href="#" className="hover:underline">Privacidad</a>
              </div>
            </div>

            {/* Security Icons */}
            <div className="flex items-center justify-center space-x-6 mt-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span className="text-xs">Pago seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Protegido</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span className="text-xs">Envío gratis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
