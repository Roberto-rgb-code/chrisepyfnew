export interface BankTransferDetails {
  bankName: string;
  accountHolder: string;
  clabe: string;
  accountNumber: string;
}

export function getBankTransferDetails(): BankTransferDetails {
  return {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || process.env.BANK_NAME || 'BBVA México',
    accountHolder:
      process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER ||
      process.env.BANK_ACCOUNT_HOLDER ||
      'EFM LATAM Empaques y Fundas',
    clabe: process.env.NEXT_PUBLIC_BANK_CLABE || process.env.BANK_CLABE || '012180001234567890',
    accountNumber:
      process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ||
      process.env.BANK_ACCOUNT_NUMBER ||
      '0123456789',
  };
}

const ALLOWED_RECEIPT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

export function validateTransferReceipt(dataUrl: string): { valid: boolean; error?: string } {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return { valid: false, error: 'Debes subir el comprobante de transferencia' };
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return { valid: false, error: 'Formato de comprobante no válido' };
  }

  const mimeType = match[1];
  const base64 = match[2];

  if (!ALLOWED_RECEIPT_TYPES.includes(mimeType)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG, WEBP o PDF' };
  }

  const sizeBytes = Math.ceil((base64.length * 3) / 4);
  if (sizeBytes > MAX_RECEIPT_BYTES) {
    return { valid: false, error: 'El archivo no debe superar 5 MB' };
  }

  return { valid: true };
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}
