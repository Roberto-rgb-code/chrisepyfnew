'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DEFAULT_ANNOUNCEMENTS } from '@/lib/announcements';

interface AnnouncementRow {
  desktop: string;
  mobile: string;
  active: boolean;
}

export default function AdminAnnouncementsPanel() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<AnnouncementRow[]>([]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/announcements?userId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(
          (data.messages || []).map((m: AnnouncementRow) => ({
            desktop: m.desktop,
            mobile: m.mobile,
            active: m.active !== false,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const updateMessage = (index: number, field: keyof AnnouncementRow, value: string | boolean) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, [field]: value } : msg))
    );
  };

  const addMessage = () => {
    setMessages((prev) => [
      ...prev,
      { desktop: '✨ Nuevo anuncio aquí', mobile: '✨ Nuevo anuncio', active: true },
    ]);
  };

  const removeMessage = (index: number) => {
    if (messages.length <= 1) {
      showToast('Debe haber al menos un mensaje', 'error');
      return;
    }
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const restoreDefaults = () => {
    setMessages(
      DEFAULT_ANNOUNCEMENTS.map((m) => ({ ...m, active: true }))
    );
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, messages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Anuncios guardados', 'success');
      setMessages(
        (data.messages || []).map((m: AnnouncementRow) => ({
          desktop: m.desktop,
          mobile: m.mobile,
          active: m.active !== false,
        }))
      );
    } catch (e: any) {
      showToast(e.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
        Cargando anuncios...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Barra de anuncios</h2>
        <p className="text-sm text-gray-500 mt-1">
          Edita los mensajes que rotan arriba del sitio. Usa una versión corta para móvil.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {messages.map((msg, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Mensaje {index + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={msg.active}
                    onChange={(e) => updateMessage(index, 'active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  Activo
                </label>
                <button
                  type="button"
                  onClick={() => removeMessage(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Escritorio / tablet
                </label>
                <input
                  type="text"
                  value={msg.desktop}
                  onChange={(e) => updateMessage(index, 'desktop', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                  placeholder="Mensaje completo con emojis..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Móvil (corto)</label>
                <input
                  type="text"
                  value={msg.mobile}
                  onChange={(e) => updateMessage(index, 'mobile', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                  placeholder="Versión resumida..."
                />
              </div>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm text-center truncate">
              Vista previa: <span className="sm:hidden">{msg.mobile}</span>
              <span className="hidden sm:inline">{msg.desktop}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addMessage}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
        >
          + Agregar mensaje
        </button>
        <button
          type="button"
          onClick={restoreDefaults}
          className="px-4 py-2.5 text-blue-600 font-medium hover:underline"
        >
          Restaurar originales
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar anuncios'}
        </button>
      </div>
    </div>
  );
}
