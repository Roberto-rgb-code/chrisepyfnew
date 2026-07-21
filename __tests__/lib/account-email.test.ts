import { emailTemplates } from '@/lib/email-templates';

describe('account email templates', () => {
  it('welcome email includes customer name', () => {
    const { subject, html } = emailTemplates.welcomeAccount({
      customerName: 'María',
      customerEmail: 'maria@test.com',
    });
    expect(subject).toContain('Bienvenido');
    expect(html).toContain('María');
    expect(html).toContain('maria@test.com');
  });

  it('admin new account email includes user details', () => {
    const { subject, html } = emailTemplates.adminNewAccount({
      customerName: 'Juan',
      customerEmail: 'juan@test.com',
      userId: 'firebase-uid-123',
      registeredAt: '2026-07-20T00:00:00.000Z',
    });
    expect(subject).toContain('juan@test.com');
    expect(html).toContain('firebase-uid-123');
    expect(html).toContain('/admin');
  });

  it('account verified email is warm and actionable', () => {
    const { subject, html } = emailTemplates.accountVerified({
      customerName: 'Ana',
    });
    expect(subject).toContain('verificada');
    expect(html).toContain('Ana');
  });
});
