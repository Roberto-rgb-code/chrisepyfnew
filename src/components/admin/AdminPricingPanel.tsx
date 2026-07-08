'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { generatePromoCode } from '@/lib/pricing';
import { DollarSign, RefreshCw } from '@/components/icons';

interface StoreSettings {
  basePriceMxn: number;
  promoActive: boolean;
  promoTitle: string | null;
  promoDiscountType: 'percent' | 'fixed' | null;
  promoDiscountValue: number | null;
}

interface PromoCodeRow {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  active: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  stripePromotionCodeId: string | null;
}

export default function AdminPricingPanel() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    basePriceMxn: 599,
    promoActive: false,
    promoTitle: '',
    promoDiscountType: 'percent',
    promoDiscountValue: 10,
  });
  const [promoCodes, setPromoCodes] = useState<PromoCodeRow[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [newDiscountValue, setNewDiscountValue] = useState(10);
  const [newMaxUses, setNewMaxUses] = useState('');
  const [creatingCode, setCreatingCode] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [pricingRes, codesRes] = await Promise.all([
        fetch(`/api/admin/pricing?userId=${user.uid}`),
        fetch(`/api/admin/promo-codes?userId=${user.uid}`),
      ]);
      if (pricingRes.ok) {
        const data = await pricingRes.json();
        setSettings({
          basePriceMxn: data.settings.basePriceMxn,
          promoActive: data.settings.promoActive,
          promoTitle: data.settings.promoTitle || '',
          promoDiscountType: data.settings.promoDiscountType || 'percent',
          promoDiscountValue: data.settings.promoDiscountValue ?? 10,
        });
      }
      if (codesRes.ok) {
        const data = await codesRes.json();
        setPromoCodes(data.promoCodes || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const savePricing = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          basePriceMxn: settings.basePriceMxn,
          promoActive: settings.promoActive,
          promoTitle: settings.promoTitle,
          promoDiscountType: settings.promoActive ? settings.promoDiscountType : null,
          promoDiscountValue: settings.promoActive ? settings.promoDiscountValue : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Precios y promoción guardados', 'success');
    } catch (e: any) {
      showToast(e.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const createPromoCode = async (autoGenerate = false) => {
    if (!user) return;
    setCreatingCode(true);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          code: autoGenerate ? undefined : newCode,
          autoGenerate,
          discountType: newDiscountType,
          discountValue: Number(newDiscountValue),
          maxUses: newMaxUses ? Number(newMaxUses) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`Código ${data.promoCode.code} creado en Stripe`, 'success');
      setNewCode('');
      await loadData();
    } catch (e: any) {
      showToast(e.message || 'Error al crear código', 'error');
    } finally {
      setCreatingCode(false);
    }
  };

  const toggleCode = async (id: string, active: boolean) => {
    if (!user) return;
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid, active }),
    });
    if (res.ok) {
      showToast(active ? 'Código activado' : 'Código desactivado', 'info');
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
        Cargando configuración de precios...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Precio base (MXN)</h2>
            <p className="text-sm text-gray-500">Aplica a todas las fundas personalizadas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Precio por funda</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min={1}
                max={99999}
                value={settings.basePriceMxn}
                onChange={(e) =>
                  setSettings({ ...settings, basePriceMxn: Number(e.target.value) })
                }
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">MXN</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mb-6">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={settings.promoActive}
              onChange={(e) => setSettings({ ...settings, promoActive: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600"
            />
            <span className="font-semibold text-gray-800">Activar promoción global en la tienda</span>
          </label>

          {settings.promoActive && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
              <input
                type="text"
                placeholder="Nombre promoción (ej. Hot Sale)"
                value={settings.promoTitle || ''}
                onChange={(e) => setSettings({ ...settings, promoTitle: e.target.value })}
                className="px-4 py-2.5 border border-gray-200 rounded-xl"
              />
              <select
                value={settings.promoDiscountType || 'percent'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    promoDiscountType: e.target.value as 'percent' | 'fixed',
                  })
                }
                className="px-4 py-2.5 border border-gray-200 rounded-xl"
              >
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Monto fijo (MXN)</option>
              </select>
              <input
                type="number"
                min={1}
                value={settings.promoDiscountValue ?? 10}
                onChange={(e) =>
                  setSettings({ ...settings, promoDiscountValue: Number(e.target.value) })
                }
                className="px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          )}
        </div>

        <button
          onClick={savePricing}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar precios y promoción'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Códigos promocionales</h2>
        <p className="text-sm text-gray-500 mb-6">
          Se crean en Stripe automáticamente. Los clientes los aplican en el carrito.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            placeholder="Código (ej. VERANO20)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            className="px-4 py-2.5 border border-gray-200 rounded-xl uppercase"
          />
          <select
            value={newDiscountType}
            onChange={(e) => setNewDiscountType(e.target.value as 'percent' | 'fixed')}
            className="px-4 py-2.5 border border-gray-200 rounded-xl"
          >
            <option value="percent">% descuento</option>
            <option value="fixed">MXN descuento</option>
          </select>
          <input
            type="number"
            min={1}
            placeholder="Valor"
            value={newDiscountValue}
            onChange={(e) => setNewDiscountValue(Number(e.target.value))}
            className="px-4 py-2.5 border border-gray-200 rounded-xl"
          />
          <input
            type="number"
            min={1}
            placeholder="Usos máx. (opcional)"
            value={newMaxUses}
            onChange={(e) => setNewMaxUses(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => createPromoCode(false)}
            disabled={creatingCode || !newCode.trim()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50"
          >
            {creatingCode ? 'Creando...' : 'Crear código'}
          </button>
          <button
            onClick={() => createPromoCode(true)}
            disabled={creatingCode}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Generar automático
          </button>
          <button
            type="button"
            onClick={() => setNewCode(generatePromoCode())}
            className="text-sm text-blue-600 font-medium px-2"
          >
            Sugerir código
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="py-3 pr-4">Código</th>
                <th className="py-3 pr-4">Descuento</th>
                <th className="py-3 pr-4">Usos</th>
                <th className="py-3 pr-4">Stripe</th>
                <th className="py-3 pr-4">Estado</th>
                <th className="py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No hay códigos creados
                  </td>
                </tr>
              ) : (
                promoCodes.map((code) => (
                  <tr key={code.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-mono font-bold">{code.code}</td>
                    <td className="py-3 pr-4">
                      {code.discountType === 'percent'
                        ? `${code.discountValue}%`
                        : `$${code.discountValue} MXN`}
                    </td>
                    <td className="py-3 pr-4">
                      {code.usedCount}
                      {code.maxUses != null ? ` / ${code.maxUses}` : ''}
                    </td>
                    <td className="py-3 pr-4">
                      {code.stripePromotionCodeId ? (
                        <span className="text-green-600 font-medium">✓ Sincronizado</span>
                      ) : (
                        <span className="text-red-500">Sin sync</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          code.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {code.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleCode(code.id, !code.active)}
                        className="text-blue-600 hover:underline"
                      >
                        {code.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
