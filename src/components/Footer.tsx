import Link from 'next/link';
import { Smartphone, Facebook, Instagram, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Empaques & Fundas</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Fundas personalizadas de la más alta calidad. Protege tu dispositivo con estilo único.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white">Fundas iPhone</Link></li>
              <li><Link href="/" className="hover:text-white">Fundas Samsung</Link></li>
              <li><Link href="/" className="hover:text-white">Fundas Gaming</Link></li>
              <li><Link href="/" className="hover:text-white">Protectores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white">Centro de Ayuda</Link></li>
              <li><Link href="/" className="hover:text-white">Envíos y Devoluciones</Link></li>
              <li><Link href="/" className="hover:text-white">Garantía</Link></li>
              <li><Link href="/" className="hover:text-white">Contacto</Link></li>
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
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-lg text-sm"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Empaques & Fundas. Todos los derechos reservados. | Política de Privacidad | Términos de Servicio</p>
        </div>
      </div>
    </footer>
  );
}

