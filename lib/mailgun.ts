// lib/mailgun.ts
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_PRIVATE_API_KEY!,
  url: 'https://api.mailgun.net',
});

export async function sendOtpEmail(to: string, otp: string, purpose: string = 'Login'): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e40af;">ResQ247 Pharmacy - ${purpose} Code</h2>
      <p>Use the verification code below to sign in:</p>
      <div style="font-size: 48px; letter-spacing: 15px; font-weight: bold; color: #1e3a8a; background: #f8fafc; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #ef4444; font-weight: 600;">This code expires in 5 minutes.</p>
      <p>If you did not request this code, please ignore this email or contact support.</p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #64748b;">ResQ247 Pharmacy • Secure Pharmacist Platform</p>
    </div>
  `;

  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `ResQ247 Pharmacy <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: [to],
    subject: `Your ${purpose} Code - ResQ247 Pharmacy`,
    html,
  });
}