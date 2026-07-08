import { phoneData, PhoneModel } from '@/data/phoneData';

const STORAGE_KEY = 'efm_model_search_history';
const MAX_HISTORY = 10;

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string) {
  const q = query.trim();
  if (!q || typeof window === 'undefined') return;
  const history = getSearchHistory().filter((h) => h.toLowerCase() !== q.toLowerCase());
  history.unshift(q);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function removeFromSearchHistory(query: string) {
  if (typeof window === 'undefined') return;
  const history = getSearchHistory().filter((h) => h !== query);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearSearchHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function filterPhoneModels(query: string, limit = 8): PhoneModel[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = phoneData
    .map((model) => {
      const name = model.modelName.toLowerCase();
      const brand = model.brand.toLowerCase();
      const id = model.id.toLowerCase();
      let score = 0;

      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (name.includes(q)) score = 60;
      else if (brand.startsWith(q)) score = 50;
      else if (brand.includes(q)) score = 40;
      else if (id.includes(q)) score = 30;

      return { model, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.model.modelName.localeCompare(b.model.modelName, 'es', { sensitivity: 'base' }));

  return scored.slice(0, limit).map(({ model }) => model);
}

export function filterSearchHistory(query: string, history: string[]): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return history;
  return history.filter((item) => item.toLowerCase().includes(q));
}

export function getPopularModels(limit = 6): PhoneModel[] {
  return phoneData.slice(0, limit);
}
