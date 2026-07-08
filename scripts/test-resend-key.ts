import { Resend } from 'resend';

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const target = process.argv[2] || 'admin@empaquesyfundas.com';

  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [target],
    subject: 'Prueba API key Resend — EFM',
    html: '<p>Si ves esto, la API key de Resend funciona correctamente.</p>',
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error('FAIL:', error?.message || error);
  process.exit(1);
});
