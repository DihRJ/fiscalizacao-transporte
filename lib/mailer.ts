import nodemailer from 'nodemailer';

export async function sendMail(to: string, subject: string, html: string){
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT||'0') || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'no-reply@example.com';
  if (!host || !user || !pass) return { ok:false, skipped: true };

  const transport = nodemailer.createTransport({ host, port, secure: port===465, auth: { user, pass } });
  await transport.sendMail({ from, to, subject, html });
  return { ok:true };
}
