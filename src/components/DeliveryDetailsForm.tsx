'use client';

import { MX_STATES, type ShippingDetailsInput } from '@/lib/shipping';

interface DeliveryDetailsFormProps {
  initialEmail: string;
  values: ShippingDetailsInput;
  errors: Record<string, string>;
  onChange: (field: keyof ShippingDetailsInput, value: string | boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading?: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}

export default function DeliveryDetailsForm({
  initialEmail,
  values,
  errors,
  onChange,
  onSubmit,
  loading = false,
}: DeliveryDetailsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Datos del comprador</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="firstName"
              value={values.firstName || ''}
              onChange={(e) => onChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              placeholder="Nombre"
              required
            />
            <FieldError message={errors.firstName} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Apellido
            </label>
            <input
              id="lastName"
              value={values.lastName || ''}
              onChange={(e) => onChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              placeholder="Apellido"
              required
            />
            <FieldError message={errors.lastName} />
          </div>
          <div>
            <label htmlFor="whatsApp" className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              id="whatsApp"
              inputMode="tel"
              value={values.whatsApp || ''}
              onChange={(e) => onChange('whatsApp', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              placeholder="10 dígitos"
              required
            />
            <FieldError message={errors.whatsApp} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={initialEmail}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Tomado de tu cuenta verificada</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Domicilio de entrega</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
              Calle y número
            </label>
            <input
              id="street"
              value={values.street || ''}
              onChange={(e) => onChange('street', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              placeholder="Ej. Av. Revolución 123"
              required
            />
            <FieldError message={errors.street} />
          </div>
          <div>
            <label htmlFor="neighborhood" className="block text-sm font-semibold text-gray-700 mb-2">
              Colonia
            </label>
            <input
              id="neighborhood"
              value={values.neighborhood || ''}
              onChange={(e) => onChange('neighborhood', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              required
            />
            <FieldError message={errors.neighborhood} />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
              Código postal
            </label>
            <input
              id="postalCode"
              inputMode="numeric"
              value={values.postalCode || ''}
              onChange={(e) => onChange('postalCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              placeholder="5 dígitos"
              required
            />
            <FieldError message={errors.postalCode} />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad / Municipio
            </label>
            <input
              id="city"
              value={values.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              required
            />
            <FieldError message={errors.city} />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="state"
              value={values.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red bg-white"
              required
            >
              <option value="">Selecciona un estado</option>
              {MX_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <FieldError message={errors.state} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="deliveryNotes" className="block text-sm font-semibold text-gray-700 mb-2">
              Referencias (opcional)
            </label>
            <textarea
              id="deliveryNotes"
              value={values.deliveryNotes || ''}
              onChange={(e) => onChange('deliveryNotes', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red min-h-[88px]"
              placeholder="Entre calles, color de fachada, etc."
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Contacto de entrega</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="recipientName" className="block text-sm font-semibold text-gray-700 mb-2">
              Persona a entregar
            </label>
            <input
              id="recipientName"
              value={values.recipientName || ''}
              onChange={(e) => onChange('recipientName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              required
            />
            <FieldError message={errors.recipientName} />
          </div>
          <div>
            <label htmlFor="secondaryPhone" className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono 2 a marcar (opcional)
            </label>
            <input
              id="secondaryPhone"
              inputMode="tel"
              value={values.secondaryPhone || ''}
              onChange={(e) => onChange('secondaryPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red"
              placeholder="10 dígitos"
            />
            <FieldError message={errors.secondaryPhone} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Identificación</h2>
        <p className="text-sm text-gray-600 mb-4">
          Para entregar tu pedido necesitas contar con INE vigente.
        </p>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-red">
            <input
              type="radio"
              name="hasValidIne"
              checked={values.hasValidIne === true}
              onChange={() => onChange('hasValidIne', true)}
              className="mt-1"
            />
            <span className="text-sm text-gray-800">Sí, cuento con INE vigente</span>
          </label>
          <label className="flex items-start gap-3 p-4 border border-red-200 rounded-xl cursor-pointer bg-red-50/40">
            <input
              type="radio"
              name="hasValidIne"
              checked={values.hasValidIne === false}
              onChange={() => onChange('hasValidIne', false)}
              className="mt-1"
            />
            <span className="text-sm text-gray-800">No cuento con INE vigente</span>
          </label>
        </div>
        <FieldError message={errors.hasValidIne} />
        {values.hasValidIne === false && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            No podrás completar la compra sin INE vigente. Si tienes dudas, contáctanos por WhatsApp.
          </div>
        )}
      </section>

      <button
        type="submit"
        disabled={loading || values.hasValidIne === false}
        className="w-full bg-brand-red text-white py-4 rounded-xl font-semibold hover:bg-brand-red-dark transition-all disabled:opacity-50"
      >
        {loading ? 'Redirigiendo a pago seguro...' : 'Continuar al pago'}
      </button>
    </form>
  );
}
