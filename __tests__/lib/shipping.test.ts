import {
  isValidMexicanPhone,
  isValidPostalCode,
  normalizeMexicanPhone,
  parseHasValidIne,
  validateShippingDetails,
} from '@/lib/shipping';

describe('shipping validation', () => {
  const validPayload = {
    firstName: 'Juan',
    lastName: 'Pérez',
    whatsApp: '33 1149 3852',
    email: 'juan@example.com',
    street: 'Av. Revolución 123',
    neighborhood: 'Centro',
    postalCode: '44100',
    city: 'Guadalajara',
    state: 'Jalisco',
    recipientName: 'María Pérez',
    secondaryPhone: '3312345678',
    hasValidIne: true,
  };

  it('normalizes mexican phone numbers', () => {
    expect(normalizeMexicanPhone('(33) 1149-3852')).toBe('3311493852');
    expect(isValidMexicanPhone('33 1149 3852')).toBe(true);
  });

  it('validates postal code', () => {
    expect(isValidPostalCode('44100')).toBe(true);
    expect(isValidPostalCode('4410')).toBe(false);
  });

  it('accepts valid shipping details', () => {
    const result = validateShippingDetails(validPayload);
    expect(result.valid).toBe(true);
    expect(result.data?.whatsApp).toBe('3311493852');
  });

  it('blocks checkout without valid INE', () => {
    const result = validateShippingDetails({ ...validPayload, hasValidIne: false });
    expect(result.valid).toBe(false);
    expect(result.errors.hasValidIne).toBeTruthy();
  });

  it('requires whatsapp with 10 digits', () => {
    const result = validateShippingDetails({ ...validPayload, whatsApp: '123' });
    expect(result.valid).toBe(false);
    expect(result.errors.whatsApp).toBeTruthy();
  });

  it('parses hasValidIne from string', () => {
    expect(parseHasValidIne('true')).toBe(true);
    expect(parseHasValidIne('false')).toBe(false);
  });
});
