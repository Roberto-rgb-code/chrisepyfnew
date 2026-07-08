import { validateTransferReceipt } from '@/lib/bank-transfer';

describe('validateTransferReceipt', () => {
  it('rejects empty receipt', () => {
    expect(validateTransferReceipt('').valid).toBe(false);
  });

  it('accepts valid png data url', () => {
    const tinyPng =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    expect(validateTransferReceipt(tinyPng).valid).toBe(true);
  });

  it('rejects invalid mime type', () => {
    expect(validateTransferReceipt('data:text/plain;base64,YWJj').valid).toBe(false);
  });
});
