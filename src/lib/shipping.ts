export const MX_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
] as const;

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  whatsApp: string;
  email: string;
  street: string;
  neighborhood: string;
  postalCode: string;
  city: string;
  state: string;
  deliveryNotes?: string;
  recipientName: string;
  secondaryPhone?: string;
  hasValidIne: boolean;
}

export interface ShippingDetailsInput {
  firstName?: string;
  lastName?: string;
  whatsApp?: string;
  email?: string;
  street?: string;
  neighborhood?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  deliveryNotes?: string;
  recipientName?: string;
  secondaryPhone?: string;
  hasValidIne?: boolean | string;
}

export function normalizeMexicanPhone(value: string): string {
  return value.replace(/\D/g, '').slice(-10);
}

export function isValidMexicanPhone(value: string): boolean {
  const digits = normalizeMexicanPhone(value);
  return /^\d{10}$/.test(digits);
}

export function isValidPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.replace(/\D/g, ''));
}

export function parseHasValidIne(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === 'yes' || value === 'si';
  return false;
}

export function validateShippingDetails(input: ShippingDetailsInput): {
  valid: boolean;
  errors: Record<string, string>;
  data?: ShippingDetails;
} {
  const errors: Record<string, string> = {};

  const firstName = input.firstName?.trim() || '';
  const lastName = input.lastName?.trim() || '';
  const whatsApp = normalizeMexicanPhone(input.whatsApp || '');
  const email = input.email?.trim() || '';
  const street = input.street?.trim() || '';
  const neighborhood = input.neighborhood?.trim() || '';
  const postalCode = input.postalCode?.replace(/\D/g, '') || '';
  const city = input.city?.trim() || '';
  const state = input.state?.trim() || '';
  const deliveryNotes = input.deliveryNotes?.trim() || '';
  const recipientName = input.recipientName?.trim() || '';
  const secondaryPhoneRaw = input.secondaryPhone?.trim() || '';
  const secondaryPhone = secondaryPhoneRaw ? normalizeMexicanPhone(secondaryPhoneRaw) : '';
  const hasValidIne = parseHasValidIne(input.hasValidIne);

  if (!firstName) errors.firstName = 'Ingresa tu nombre';
  if (!lastName) errors.lastName = 'Ingresa tu apellido';
  if (!isValidMexicanPhone(whatsApp)) errors.whatsApp = 'Ingresa un WhatsApp de 10 dígitos';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Correo no válido';
  if (!street) errors.street = 'Ingresa calle y número';
  if (!neighborhood) errors.neighborhood = 'Ingresa la colonia';
  if (!isValidPostalCode(postalCode)) errors.postalCode = 'Ingresa un CP de 5 dígitos';
  if (!city) errors.city = 'Ingresa la ciudad o municipio';
  if (!state || !MX_STATES.includes(state as (typeof MX_STATES)[number])) errors.state = 'Selecciona un estado';
  if (!recipientName) errors.recipientName = 'Ingresa quién recibe el paquete';
  if (secondaryPhoneRaw && !isValidMexicanPhone(secondaryPhone)) {
    errors.secondaryPhone = 'Ingresa un teléfono de 10 dígitos';
  }
  if (!hasValidIne) errors.hasValidIne = 'Necesitas INE vigente para completar la compra';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors,
    data: {
      firstName,
      lastName,
      whatsApp,
      email,
      street,
      neighborhood,
      postalCode,
      city,
      state,
      deliveryNotes: deliveryNotes || undefined,
      recipientName,
      secondaryPhone: secondaryPhone || undefined,
      hasValidIne,
    },
  };
}

export function formatShippingAddress(details: ShippingDetails): string {
  const lines = [
    `${details.street}, Col. ${details.neighborhood}`,
    `CP ${details.postalCode}, ${details.city}, ${details.state}`,
    `Entregar a: ${details.recipientName}`,
    `WhatsApp: ${details.whatsApp}`,
  ];

  if (details.secondaryPhone) lines.push(`Tel. alterno: ${details.secondaryPhone}`);
  if (details.deliveryNotes) lines.push(`Referencias: ${details.deliveryNotes}`);

  return lines.join('\n');
}

export function shippingDetailsToOrderData(details: ShippingDetails) {
  return {
    customerName: `${details.firstName} ${details.lastName}`.trim(),
    shippingFirstName: details.firstName,
    shippingLastName: details.lastName,
    shippingWhatsApp: details.whatsApp,
    shippingStreet: details.street,
    shippingNeighborhood: details.neighborhood,
    shippingPostalCode: details.postalCode,
    shippingCity: details.city,
    shippingState: details.state,
    shippingNotes: details.deliveryNotes || null,
    shippingRecipient: details.recipientName,
    shippingPhone2: details.secondaryPhone || null,
    hasValidIne: details.hasValidIne,
  };
}

export function shippingDetailsToMetadata(details: ShippingDetails): Record<string, string> {
  return {
    shipFirstName: details.firstName,
    shipLastName: details.lastName,
    shipWhatsApp: details.whatsApp,
    shipStreet: details.street,
    shipNeighborhood: details.neighborhood,
    shipPostalCode: details.postalCode,
    shipCity: details.city,
    shipState: details.state,
    shipNotes: details.deliveryNotes || '',
    shipRecipient: details.recipientName,
    shipPhone2: details.secondaryPhone || '',
    hasValidIne: details.hasValidIne ? 'true' : 'false',
  };
}

export function orderToShippingDetails(order: {
  customerEmail: string;
  shippingFirstName?: string | null;
  shippingLastName?: string | null;
  shippingWhatsApp?: string | null;
  shippingStreet?: string | null;
  shippingNeighborhood?: string | null;
  shippingPostalCode?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingNotes?: string | null;
  shippingRecipient?: string | null;
  shippingPhone2?: string | null;
  hasValidIne?: boolean | null;
}): ShippingDetails | null {
  if (!order.shippingStreet || !order.shippingFirstName || !order.shippingWhatsApp) {
    return null;
  }

  return {
    firstName: order.shippingFirstName,
    lastName: order.shippingLastName || '',
    whatsApp: order.shippingWhatsApp,
    email: order.customerEmail,
    street: order.shippingStreet,
    neighborhood: order.shippingNeighborhood || '',
    postalCode: order.shippingPostalCode || '',
    city: order.shippingCity || '',
    state: order.shippingState || '',
    deliveryNotes: order.shippingNotes || undefined,
    recipientName: order.shippingRecipient || `${order.shippingFirstName} ${order.shippingLastName || ''}`.trim(),
    secondaryPhone: order.shippingPhone2 || undefined,
    hasValidIne: order.hasValidIne ?? true,
  };
}

export function metadataToShippingDetails(metadata: Record<string, string | undefined>): ShippingDetails | null {
  const input: ShippingDetailsInput = {
    firstName: metadata.shipFirstName,
    lastName: metadata.shipLastName,
    whatsApp: metadata.shipWhatsApp,
    email: metadata.customerEmail,
    street: metadata.shipStreet,
    neighborhood: metadata.shipNeighborhood,
    postalCode: metadata.shipPostalCode,
    city: metadata.shipCity,
    state: metadata.shipState,
    deliveryNotes: metadata.shipNotes,
    recipientName: metadata.shipRecipient,
    secondaryPhone: metadata.shipPhone2,
    hasValidIne: metadata.hasValidIne,
  };

  const result = validateShippingDetails(input);
  return result.data || null;
}
