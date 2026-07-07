'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, ArrowRight, Smartphone } from '@/components/icons';
import { PhoneModel } from '@/data/phoneData';
import {
  addToSearchHistory,
  clearSearchHistory,
  filterPhoneModels,
  filterSearchHistory,
  getSearchHistory,
  getPopularModels,
  removeFromSearchHistory,
} from '@/lib/model-search';

type Variant = 'navbar' | 'hero';

interface ModelSearchBoxProps {
  variant?: Variant;
  defaultValue?: string;
  /** Filtra en la misma página (catálogo) sin navegar */
  onSearch?: (query: string) => void;
  placeholder?: string;
}

type SuggestionItem =
  | { kind: 'history'; value: string }
  | { kind: 'model'; value: PhoneModel };

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-blue-600">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function ModelSearchBox({
  variant = 'navbar',
  defaultValue = '',
  onSearch,
  placeholder,
}: ModelSearchBoxProps) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);

  const isHero = variant === 'hero';
  const placeholderText = placeholder ?? (isHero ? 'Buscar modelo de teléfono...' : 'Buscar modelos...');

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const modelSuggestions = useMemo(
    () => (query.trim() ? filterPhoneModels(query, 6) : getPopularModels(6)),
    [query]
  );
  const historySuggestions = useMemo(
    () => filterSearchHistory(query, history).slice(0, 5),
    [query, history]
  );

  const flatItems: SuggestionItem[] = useMemo(() => {
    const items: SuggestionItem[] = [];
    historySuggestions.forEach((value) => items.push({ kind: 'history', value }));
    modelSuggestions.forEach((model) => items.push({ kind: 'model', value: model }));
    return items;
  }, [historySuggestions, modelSuggestions]);

  const showDropdown = isOpen && (historySuggestions.length > 0 || modelSuggestions.length > 0 || query.trim().length > 0);

  const refreshHistory = () => setHistory(getSearchHistory());

  const close = useCallback(() => {
    setIsOpen(false);
    setIsExpanded(false);
    setActiveIndex(-1);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsExpanded(true);
    refreshHistory();
  }, []);

  const navigateToCatalog = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      addToSearchHistory(trimmed);
      refreshHistory();
      if (onSearch) {
        onSearch(trimmed);
        close();
        return;
      }
      router.push(`/catalogo?q=${encodeURIComponent(trimmed)}`);
      close();
    },
    [close, onSearch, router]
  );

  const navigateToModel = useCallback(
    (model: PhoneModel) => {
      addToSearchHistory(model.modelName);
      refreshHistory();
      router.push(`/?model=${model.id}`);
      close();
    },
    [close, router]
  );

  const selectItem = useCallback(
    (item: SuggestionItem) => {
      if (item.kind === 'history') {
        setQuery(item.value);
        navigateToCatalog(item.value);
      } else {
        navigateToModel(item.value);
      }
    },
    [navigateToCatalog, navigateToModel]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && flatItems[activeIndex]) {
      selectItem(flatItems[activeIndex]);
      return;
    }
    navigateToCatalog(query);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(-1);
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && e.key === 'ArrowDown') {
      setIsOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      close();
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [close]);

  const inputClasses = isHero
    ? 'w-full pl-12 pr-10 py-4 rounded-2xl border-0 text-gray-800 text-base sm:text-lg focus:ring-4 focus:ring-white/20 focus:outline-none shadow-lg'
    : `bg-transparent text-sm outline-none transition-all duration-300 ${
        isExpanded ? 'w-full sm:w-56 md:w-64' : 'w-0 sm:w-28 opacity-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto sm:w-36'
      }`;

  const formClasses = isHero
    ? 'relative w-full'
    : `relative flex items-center transition-all duration-300 rounded-full border ${
        isExpanded
          ? 'bg-white border-gray-200 shadow-xl px-4 py-2.5 w-full sm:w-72 md:w-80 lg:w-96 z-[60]'
          : 'bg-gray-100 border-transparent px-3 py-2 w-10 sm:w-36 lg:w-44'
      }`;

  const mobileOverlay = !isHero && isExpanded;

  return (
    <>
      {mobileOverlay && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] lg:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      <div
        ref={containerRef}
        className={`relative ${isHero ? 'w-full' : mobileOverlay ? 'fixed left-3 right-3 top-[5.25rem] z-[60] sm:left-4 sm:right-4 lg:static lg:z-auto lg:top-auto' : 'z-50'}`}
      >
        <form onSubmit={handleSubmit} className={formClasses} role="search">
          <button
            type="button"
            onClick={() => {
              if (!isExpanded) {
                open();
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            className={`flex-shrink-0 ${isHero ? 'hidden' : ''}`}
            aria-label="Abrir búsqueda"
          >
            <Search className={`text-gray-500 ${isHero ? 'w-5 h-5' : 'w-4 h-4'}`} />
          </button>

          {isHero && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          )}

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={open}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className={inputClasses}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSearch?.('');
                inputRef.current?.focus();
              }}
              className={`flex-shrink-0 text-gray-400 hover:text-gray-600 ${isHero ? 'absolute right-4 top-1/2 -translate-y-1/2' : 'ml-2'}`}
              aria-label="Borrar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {showDropdown && (
          <div
            id={listId}
            role="listbox"
            className={`absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70] max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain ${
              isHero ? 'text-left' : ''
            }`}
          >
            {historySuggestions.length > 0 && (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Búsquedas recientes
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearSearchHistory();
                      refreshHistory();
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Borrar todo
                  </button>
                </div>
                {historySuggestions.map((item, idx) => {
                  const globalIdx = idx;
                  return (
                    <div
                      key={`h-${item}`}
                      role="option"
                      aria-selected={activeIndex === globalIdx}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                        activeIndex === globalIdx ? 'bg-blue-50' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectItem({ kind: 'history', value: item })}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-800 truncate">
                          <HighlightMatch text={item} query={query} />
                        </span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          removeFromSearchHistory(item);
                          refreshHistory();
                        }}
                        className="p-1 text-gray-300 hover:text-gray-500 rounded flex-shrink-0"
                        aria-label={`Eliminar ${item}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {modelSuggestions.length > 0 && (
              <div className={`py-2 ${historySuggestions.length > 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="px-4 py-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {query.trim() ? 'Sugerencias' : 'Modelos disponibles'}
                  </span>
                </div>
                {modelSuggestions.map((model, idx) => {
                  const globalIdx = historySuggestions.length + idx;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === globalIdx}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectItem({ kind: 'model', value: model })}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                        activeIndex === globalIdx ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="relative w-9 h-9 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image src={model.colorURL} alt="" fill className="object-contain p-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <HighlightMatch text={model.modelName} query={query} />
                        </p>
                        <p className="text-xs text-gray-500">{model.brand}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            {query.trim() && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => navigateToCatalog(query)}
                className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-100 text-left hover:bg-blue-50 transition-colors"
              >
                <Search className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Buscar <strong className="text-blue-600">&quot;{query.trim()}&quot;</strong> en catálogo
                </span>
              </button>
            )}

            {!query.trim() && history.length === 0 && modelSuggestions.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <Smartphone className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                Escribe para buscar iPhone, Samsung, Pixel...
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
