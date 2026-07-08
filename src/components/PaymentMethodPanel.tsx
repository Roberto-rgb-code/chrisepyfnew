'use client';

import { useRef, useState } from 'react';
import { Upload, CreditCard, Building2 } from '@/components/icons';
import { getBankTransferDetails, fileToDataUrl } from '@/lib/bank-transfer';

interface PaymentMethodPanelProps {
  total: number;
  onPayStripe: () => void;
  onPayTransfer: (receiptDataUrl: string) => Promise<void>;
  stripeLoading?: boolean;
  transferLoading?: boolean;
}

export default function PaymentMethodPanel({
  total,
  onPayStripe,
  onPayTransfer,
  stripeLoading = false,
  transferLoading = false,
}: PaymentMethodPanelProps) {
  const bank = getBankTransferDetails();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError('');
    if (file.size > 5 * 1024 * 1024) {
      setFileError('El archivo no debe superar 5 MB');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setFileError('Solo JPG, PNG, WEBP o PDF');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setReceiptDataUrl(dataUrl);
      setReceiptPreview(file.type === 'application/pdf' ? null : dataUrl);
    } catch {
      setFileError('No se pudo leer el archivo');
    }
  };

  const handleTransferSubmit = async () => {
    if (!receiptDataUrl) {
      setFileError('Sube el comprobante de tu transferencia');
      return;
    }
    await onPayTransfer(receiptDataUrl);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Método de pago</h2>
        <p className="text-sm text-gray-600 mb-4">
          Total a pagar: <strong className="text-green-600">${total} MXN</strong>
        </p>

        <button
          type="button"
          onClick={onPayStripe}
          disabled={stripeLoading || transferLoading}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-brand-red text-white py-4 rounded-xl font-semibold hover:bg-brand-red-dark transition-all disabled:opacity-50"
        >
          <CreditCard className="w-5 h-5" />
          {stripeLoading ? 'Redirigiendo a Stripe...' : 'Pagar con tarjeta (Stripe)'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">o paga por transferencia</span>
          </div>
        </div>

        <div className="bg-brand-red-light border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-brand-red" />
            <h3 className="font-semibold text-gray-900">Datos bancarios</h3>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><dt className="text-gray-500">Banco</dt><dd className="font-medium text-gray-900">{bank.bankName}</dd></div>
            <div><dt className="text-gray-500">Titular</dt><dd className="font-medium text-gray-900">{bank.accountHolder}</dd></div>
            <div className="sm:col-span-2"><dt className="text-gray-500">CLABE</dt><dd className="font-mono font-medium text-gray-900">{bank.clabe}</dd></div>
            <div><dt className="text-gray-500">No. cuenta</dt><dd className="font-mono font-medium text-gray-900">{bank.accountNumber}</dd></div>
            <div><dt className="text-gray-500">Monto exacto</dt><dd className="font-bold text-brand-red">${total} MXN</dd></div>
          </dl>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comprobante de transferencia
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-8 hover:border-brand-red hover:bg-brand-red-light/30 transition-colors"
          >
            <Upload className="w-5 h-5 text-brand-red" />
            <span className="text-sm font-medium text-gray-700">
              {receiptDataUrl ? 'Cambiar comprobante' : 'Subir ticket o captura de transferencia'}
            </span>
          </button>
          {fileError && <p className="text-xs text-red-600 mt-2">{fileError}</p>}
          {receiptPreview && (
            <img src={receiptPreview} alt="Vista previa comprobante" className="mt-3 max-h-48 rounded-lg border border-gray-200" />
          )}
          {receiptDataUrl && !receiptPreview && (
            <p className="mt-3 text-sm text-green-600 font-medium">✓ PDF cargado correctamente</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleTransferSubmit}
          disabled={transferLoading || stripeLoading || !receiptDataUrl}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-black transition-all disabled:opacity-50"
        >
          <Building2 className="w-5 h-5" />
          {transferLoading ? 'Enviando comprobante...' : 'Confirmar pedido con transferencia'}
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Validaremos tu comprobante en un plazo de 24 horas hábiles.
        </p>
      </section>
    </div>
  );
}
