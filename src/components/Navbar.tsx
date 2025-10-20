'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Smartphone, Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';
import { useState } from 'react';
import AuthModal from './AuthModal';
import AnnouncementBar from './AnnouncementBar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <>
      {/* Barra de promoción dinámica */}
      <AnnouncementBar />

      {/* Navbar */}
      <header className="navbar">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y marca */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span className="logo-text">Empaques & Fundas</span>
              </Link>
            </div>

            {/* Navegación principal */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="nav-link active">Personalizar</Link>
              <Link href="/catalogo" className="nav-link">Catálogo</Link>
              <Link href="/ofertas" className="nav-link">Ofertas</Link>
            </div>

            {/* Acciones del usuario */}
            <div className="flex items-center space-x-4">
              {/* Búsqueda */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar modelos..."
                  className="bg-transparent text-sm outline-none w-32"
                />
              </div>

              {/* Favoritos */}
              <button className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="cart-badge">0</span>
              </button>

              {/* Carrito */}
              <Link href="/carrito" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="cart-badge">{getCartCount()}</span>
              </Link>

                    {/* Usuario */}
                    <div className="relative">
                      {user ? (
                        <>
                          <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <User className="w-5 h-5" />
                            <span className="hidden sm:block text-sm font-medium">
                              ¡Bienvenido, {user.displayName || user.email?.split('@')[0] || 'Usuario'}!
                            </span>
                          </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                        <Link
                          href="/perfil"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mi Perfil
                        </Link>
                        <Link
                          href="/ordenes"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mis Órdenes
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Menú móvil */}
              <button className="md:hidden p-2 text-gray-600">
                <Menu className="w-5 h-5" />
              </button>
        </div>
      </div>
    </nav>

    {/* Auth Modal */}
    <AuthModal 
      isOpen={showAuthModal} 
      onClose={() => setShowAuthModal(false)}
      initialMode={authMode}
    />
  </header>

    </>
  );
}

