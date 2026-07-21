import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';
import { ADMIN_EMAIL } from '@/lib/constants';

function getFromAddress() {
  return process.env.RESEND_FROM || 'Empaques & Fundas <noreply@empaquesyfundas.com>';
}

function ensureResendConfigured() {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    throw new Error('RESEND_API_KEY no configurada');
  }
}

async function sendEmail(to: string, subject: string, html: string) {
  ensureResendConfigured();

  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    subject,
    html,
  });

  if (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Error enviando email';
    throw new Error(message);
  }

  return data;
}

export async function sendWelcomeAccountEmail(params: {
  customerName: string;
  customerEmail: string;
}) {
  const template = emailTemplates.welcomeAccount(params);
  return sendEmail(params.customerEmail, template.subject, template.html);
}

export async function sendAdminNewAccountEmail(params: {
  customerName: string;
  customerEmail: string;
  userId: string;
  registeredAt: string;
}) {
  const template = emailTemplates.adminNewAccount(params);
  return sendEmail(ADMIN_EMAIL, template.subject, template.html);
}

export async function sendAccountVerifiedEmail(params: {
  customerName: string;
  customerEmail: string;
}) {
  const template = emailTemplates.accountVerified({ customerName: params.customerName });
  return sendEmail(params.customerEmail, template.subject, template.html);
}

export async function sendNewAccountEmails(params: {
  customerName: string;
  customerEmail: string;
  userId: string;
  registeredAt: string;
}) {
  await sendWelcomeAccountEmail(params);
  await sendAdminNewAccountEmail(params);
}
