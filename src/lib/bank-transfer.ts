export interface BankTransferDetails {
  bankName: string;
  accountHolder: string;
  clabe: string;
  accountNumber: string;
}

/** Datos bancarios fijos para transferencias (BBVA). */
export const BANK_TRANSFER_DETAILS: BankTransferDetails = {
  bankName: 'BBVA',
  accountHolder: 'EFM LATAM Empaques y Fundas',
  clabe: '012180015103208822',
  accountNumber: '1510320882',
};

export function getBankTransferDetails(): BankTransferDetails {
  return BANK_TRANSFER_DETAILS;
}

export function formatClabe(clabe: string): string {
  const digits = clabe.replace(/\s/g, '');
  if (digits.length !== 18) return clabe;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 17)} ${digits.slice(17)}`;
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
