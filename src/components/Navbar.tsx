'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, Menu, Shield, X } from '@/components/icons';
import { useState } from 'react';
import AuthModal from './AuthModal';
import AnnouncementBar from './AnnouncementBar';
import EmailVerificationNotice from './EmailVerificationNotice';
import ModelSearchBox from './ModelSearchBox';
import { BRAND_LOGO, BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAdmin, emailVerified } = useAuth();
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
      {user && !emailVerified && <EmailVerificationNotice variant="banner" showResend={false} />}
      <header className="navbar">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 h-16">
            {/* Logo + navegación */}
            <div className="flex items-center min-w-0 gap-4 sm:gap-6 lg:gap-10">
              <Link href="/" className="flex-shrink-0 block">
                <Image
                  src={BRAND_LOGO}
                  alt={`${BRAND_NAME} - ${BRAND_TAGLINE}`}
                  width={160}
                  height={48}
                  className="h-8 sm:h-9 md:h-10 w-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] object-contain object-left"
                  priority
                />
              </Link>

              <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${isActive(link.href) ? 'active bg-brand-red-light text-brand-red font-semibold' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Búsqueda y acciones */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:block w-36 md:w-44 lg:w-56 xl:w-64">
                <ModelSearchBox variant="navbar" />
              </div>

              <Link
                href="/carrito"
                data-tour="cart-nav"
                className="relative p-2.5 text-gray-600 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all"
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
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all"
                    >
                      <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-red hover:bg-brand-red-light font-medium" onClick={() => setShowUserMenu(false)}>
                            <Shield className="w-4 h-4" /> Panel Admin
                          </Link>
                        )}
                        <Link href="/perfil" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Mi Perfil</Link>
                        <Link href="/ordenes" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Mis Órdenes</Link>
                        <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-brand-red hover:bg-brand-red-light">
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-brand-red text-white rounded-xl text-sm font-medium hover:bg-brand-red-dark hover:shadow-md transition-all"
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
                  className={`block px-4 py-3 rounded-lg font-medium ${isActive(link.href) ? 'bg-brand-red-light text-brand-red' : 'text-gray-700'}`}
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
