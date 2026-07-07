import { EmailReadyItem } from './email-utils';

const brandGradient = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';

function renderProducts(items: EmailReadyItem[]) {
  return items
    .map(
      (item) => `
    <div style="border:1px solid #e5e7eb;padding:16px;margin:12px 0;border-radius:12px;background:#fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${
            item.imageCid
              ? `<td width="100" style="vertical-align:top;padding-right:16px;">
                  <img src="cid:${item.imageCid}" alt="Tu diseño personalizado" width="90" height="90" style="border-radius:10px;border:2px solid #3b82f6;object-fit:cover;display:block;" />
                  <p style="margin:6px 0 0;font-size:11px;color:#7c3aed;font-weight:bold;text-align:center;">🎨 Tu diseño</p>
                </td>`
              : ''
          }
          <td style="vertical-align:top;">
            <h4 style="margin:0 0 8px;color:#111827;font-size:16px;">${item.modelName}</h4>
            <p style="margin:4px 0;color:#6b7280;font-size:14px;">Cantidad: ${item.quantity}</p>
            <p style="margin:4px 0;color:#059669;font-size:15px;font-weight:bold;">$${item.price} MXN</p>
            ${item.hasCustomDesign ? '<p style="margin:8px 0 0;color:#7c3aed;font-size:13px;font-weight:600;">✨ Incluye tu imagen personalizada adjunta</p>' : ''}
          </td>
        </tr>
      </table>
    </div>`
    )
    .join('');
}

function emailShell(title: string, subtitle: string, body: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#374151;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
  <div style="background:${brandGradient};padding:32px;text-align:center;border-radius:16px 16px 0 0;">
    <h1 style="color:white;margin:0;font-size:26px;">${title}</h1>
    <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:15px;">${subtitle}</p>
  </div>
  <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;">
    ${body}
  </div>
  <div style="background:#f1f5f9;padding:20px;text-align:center;border-radius:0 0 16px 16px;border:1px solid #e5e7eb;border-top:none;">
    <p style="margin:0;color:#6b7280;font-size:13px;">© 2025 Empaques & Fundas · empaquesyfundas.com</p>
    <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">📧 soporte@empaquesyfundas.com · 📱 +52 33 1149 3852</p>
  </div>
</body>
</html>`;
}

export const emailTemplates = {
  orderConfirmation: (data: {
    orderNumber: string;
    customerName: string;
    total: number;
    date: string;
    items: EmailReadyItem[];
  }) => ({
    subject: `✅ Pedido confirmado #${data.orderNumber} — Empaques & Fundas`,
    html: emailShell(
      '🎉 ¡Pedido confirmado!',
      'Tu funda personalizada está en camino',
      `
      <h2 style="color:#111827;margin-top:0;">Hola ${data.customerName},</h2>
      <p>Gracias por tu compra. Adjuntamos la vista de tu diseño personalizado en este correo.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Pedido:</strong> #${data.orderNumber}</p>
        <p style="margin:0 0 8px;"><strong>Fecha:</strong> ${new Date(data.date).toLocaleDateString('es-MX', { dateStyle: 'long' })}</p>
        <p style="margin:0;font-size:20px;color:#059669;font-weight:bold;">Total: $${data.total} MXN</p>
      </div>
      <h3 style="color:#111827;">🛍️ Tu pedido</h3>
      ${renderProducts(data.items)}
      <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-top:24px;">
        <h3 style="color:#1d4ed8;margin-top:0;">📬 Próximos pasos</h3>
        <ul style="color:#1e40af;padding-left:20px;margin:0;">
          <li>Procesaremos tu diseño en 24 horas</li>
          <li>Te avisaremos cuando esté en producción</li>
          <li>Recibirás tracking cuando enviemos tu paquete</li>
        </ul>
      </div>`
    ),
  }),

  orderProcessing: (data: { orderNumber: string; customerName: string; items: EmailReadyItem[] }) => ({
    subject: `🔄 Pedido #${data.orderNumber} en producción`,
    html: emailShell(
      '⚡ Estamos fabricando tu funda',
      'Tu diseño está en manos de nuestro equipo',
      `
      <h2 style="color:#111827;margin-top:0;">Hola ${data.customerName},</h2>
      <p>Tu pedido <strong>#${data.orderNumber}</strong> está siendo producido.</p>
      ${data.items.some((i) => i.hasCustomDesign) ? renderProducts(data.items.filter((i) => i.hasCustomDesign)) : ''}
      <p style="color:#6b7280;">Tiempo estimado: 1-2 días hábiles.</p>`
    ),
  }),

  orderShipped: (data: {
    orderNumber: string;
    customerName: string;
    trackingNumber?: string;
    shippingCompany?: string;
    trackingUrl?: string;
  }) => ({
    subject: `🚚 Pedido #${data.orderNumber} enviado`,
    html: emailShell(
      '¡Tu funda va en camino!',
      'Rastrea tu paquete cuando quieras',
      `
      <h2 style="color:#111827;margin-top:0;">Hola ${data.customerName},</h2>
      <p>Tu pedido <strong>#${data.orderNumber}</strong> ha sido enviado.</p>
      <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 6px;"><strong>Guía:</strong> ${data.trackingNumber || 'Próximamente'}</p>
        <p style="margin:0;"><strong>Paquetería:</strong> ${data.shippingCompany || 'Paquetexpress'}</p>
      </div>
      ${data.trackingUrl ? `<p style="text-align:center;"><a href="${data.trackingUrl}" style="background:#059669;color:white;padding:14px 28px;text-decoration:none;border-radius:10px;font-weight:bold;display:inline-block;">Rastrear paquete</a></p>` : ''}`
    ),
  }),
};
