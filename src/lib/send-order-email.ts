import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';
import { prepareOrderEmailData } from '@/lib/email-utils';
import type { ShippingDetails } from '@/lib/shipping';

export async function sendOrderEmail(
  type: 'order_confirmation' | 'order_processing' | 'order_shipped' | 'transfer_pending',
  orderData: {
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    items: Array<{
      modelName: string;
      quantity: number;
      price: number;
      customImage?: string | null;
    }>;
    date?: string;
    trackingNumber?: string;
    shippingCompany?: string;
    trackingUrl?: string;
    shippingDetails?: ShippingDetails;
  },
  customerEmail: string
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    throw new Error('RESEND_API_KEY no configurada');
  }

  const prepared = prepareOrderEmailData(orderData);

  let emailTemplate;
  switch (type) {
    case 'order_confirmation':
      emailTemplate = emailTemplates.orderConfirmation({
        ...prepared,
        shippingDetails: orderData.shippingDetails,
      });
      break;
    case 'order_processing':
      emailTemplate = emailTemplates.orderProcessing({
        orderNumber: prepared.orderNumber,
        customerName: prepared.customerName,
        items: prepared.items,
      });
      break;
    case 'order_shipped':
      emailTemplate = emailTemplates.orderShipped({
        orderNumber: prepared.orderNumber,
        customerName: prepared.customerName,
        trackingNumber: orderData.trackingNumber,
        shippingCompany: orderData.shippingCompany,
        trackingUrl: orderData.trackingUrl,
      });
      break;
    case 'transfer_pending':
      emailTemplate = emailTemplates.transferPending({
        orderNumber: orderData.id,
        customerName: prepared.customerName,
        total: prepared.total,
        date: prepared.date,
        items: prepared.items,
        shippingDetails: orderData.shippingDetails,
      });
      break;
    default:
      throw new Error('Invalid email type');
  }

  const skipAttachments = type === 'transfer_pending';
  const attachments = skipAttachments
    ? []
    : prepared.attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        content_id: att.cid,
      }));

  const { data, error } = await resend.emails.send({
    from: 'Empaques & Fundas <noreply@empaquesyfundas.com>',
    to: [customerEmail],
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}
