'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Smartphone, ShoppingCart, User, Menu, Shield, X } from '@/components/icons';
import { useState } from 'react';
import AuthModal from './AuthModal';
import AnnouncementBar from './AnnouncementBar';
import ModelSearchBox from './ModelSearchBox';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const navLinks = [
    { href: '/', label: 'Personalizar' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/carrito', label: 'Carrito' },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <AnnouncementBar />
      <header className="navbar">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="logo-text hidden sm:inline">Empaques & Fundas</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link px-4 py-2 rounded-lg transition-colors ${isActive(link.href) ? 'active bg-blue-50 text-blue-700' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-4 flex-1 justify-end min-w-0">
              <div className="min-w-0 hidden sm:block sm:flex-1 sm:max-w-xs md:max-w-sm lg:max-w-md">
                <ModelSearchBox variant="navbar" />
              </div>

              <Link
                href="/carrito"
                data-tour="cart-nav"
                className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>

              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 font-medium" onClick={() => setShowUserMenu(false)}>
                            <Shield className="w-4 h-4" /> Panel Admin
                          </Link>
                        )}
                        <Link href="/perfil" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Mi Perfil</Link>
                        <Link href="/ordenes" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Mis Órdenes</Link>
                        <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Entrar</span>
                  </button>
                )}
              </div>

              <button className="md:hidden p-2 text-gray-600" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
              <div className="px-2">
                <ModelSearchBox variant="navbar" />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg font-medium ${isActive(link.href) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode={authMode} />
      </header>
    </>
  );
}
