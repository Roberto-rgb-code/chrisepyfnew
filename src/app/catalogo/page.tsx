'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneModel } from '@/data/phoneData';
import { phoneData } from '@/data/phoneData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function CatalogoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name-asc');

  // Filtrar y ordenar modelos
  const filteredModels = phoneData
    .filter(model => {
      const matchesSearch = model.modelName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || model.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.modelName.localeCompare(b.modelName);
        case 'name-desc':
          return b.modelName.localeCompare(a.modelName);
        case 'brand-asc':
          // Primero por marca, luego por nombre
          const brandCompare = a.brand.localeCompare(b.brand);
          if (brandCompare !== 0) return brandCompare;
          return a.modelName.localeCompare(b.modelName);
        case 'brand-desc':
          const brandCompareDesc = b.brand.localeCompare(a.brand);
          if (brandCompareDesc !== 0) return brandCompareDesc;
          return a.modelName.localeCompare(b.modelName);
        case 'newest':
          // Los iPhone 17 primero, luego iPhone 16, etc.
          return b.id.localeCompare(a.id);
        case 'oldest':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

  // Obtener marcas únicas y ordenarlas alfabéticamente
  const brands = ['all', ...Array.from(new Set(phoneData.map(model => model.brand))).sort()];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Catálogo de Fundas
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Más de 60 modelos de teléfonos disponibles
            </p>
            
            {/* Barra de búsqueda */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar modelo de teléfono..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-gray-800 text-lg focus:ring-4 focus:ring-white/20 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? 'Todas las marcas' : brand}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="brand-asc">Marca (A-Z)</option>
                <option value="brand-desc">Marca (Z-A)</option>
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
              </select>
            </div>

            {/* Vista */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredModels.length} modelos encontrados
              </span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de modelos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <ModelListItem key={model.id} model={model} />
            ))}
          </div>
        )}

        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron modelos
            </h3>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o filtros
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

// Componente de tarjeta para vista de cuadrícula
function ModelCard({ model }: { model: PhoneModel }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={model.colorURL}
          alt={model.modelName}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          {model.brand}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {model.modelName}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Funda personalizable disponible
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            $599 MXN
          </span>
          <Link
            href={`/?model=${model.id}`}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-sm"
          >
            Personalizar
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente de lista para vista de lista
function ModelListItem({ model }: { model: PhoneModel }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="flex">
        <div className="relative w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
          <Image
            src={model.colorURL}
            alt={model.modelName}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {model.brand}
                </span>
                <h3 className="font-bold text-lg text-gray-800">
                  {model.modelName}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Funda personalizable disponible con protección premium
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-600">
                $599 MXN
              </span>
              <Link
                href={`/?model=${model.id}`}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                Personalizar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
