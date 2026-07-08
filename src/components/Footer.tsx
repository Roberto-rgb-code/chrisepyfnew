import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Send } from '@/components/icons';
import { BRAND_LOGO, BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="bg-white rounded-lg p-2 inline-block mb-4">
              <Image
                src={BRAND_LOGO}
                alt={`${BRAND_NAME} - ${BRAND_TAGLINE}`}
                width={200}
                height={58}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Fundas personalizadas de la más alta calidad. Protege tu dispositivo con estilo único.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-brand-red cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-brand-red cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-brand-red cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Fundas iPhone</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Fundas Samsung</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Fundas Gaming</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Protectores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Garantía</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Recibe ofertas exclusivas y nuevos diseños
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-l-lg text-sm border border-gray-800"
              />
              <button className="px-4 py-2 bg-brand-red hover:bg-brand-red-dark rounded-r-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs sm:text-sm text-gray-400 px-2">
          <p className="leading-relaxed">
            &copy; 2025 {BRAND_NAME}. Todos los derechos reservados.
          </p>
          <p className="mt-1">Política de Privacidad · Términos de Servicio</p>
        </div>
      </div>
    </footer>
  );
}
