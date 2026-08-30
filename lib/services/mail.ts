import nodemailer from 'nodemailer'
import { getLocalRecord } from '@/lib/local-store'

export interface SmtpConfig {
  host?: string
  port?: number
  secure?: boolean
  user: string
  pass: string
  from_name?: string
  receiver_email?: string
}

export function getEffectiveSmtpConfig(): SmtpConfig | null {
  // 1. Check local-store settings configured from admin UI
  try {
    const local = getLocalRecord<SmtpConfig>('smtp_settings')
    if (local && local.user && local.pass) {
      return local
    }
  } catch {}

  // 2. Check environment variables
  const user = process.env.SMTP_USER || process.env.GMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD

  if (user && pass) {
    return {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE === 'true' || true,
      user,
      pass,
      from_name: process.env.SMTP_FROM_NAME || 'Aksara Dialogue Web',
      receiver_email: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_RECEIVER || user,
    }
  }

  return null
}

export async function sendContactEmail(params: {
  name: string
  email: string
  subject: string
  message: string
  receiverEmail?: string
}): Promise<{ success: boolean; message: string; error?: string }> {
  const config = getEffectiveSmtpConfig()

  if (!config || !config.user || !config.pass) {
    // If SMTP is not configured yet, record it with clear explanation
    return {
      success: true,
      message:
        'Pesan berhasil disimpan di sistem dan kotak masuk Admin. Untuk pengiriman langsung ke inbox Gmail, silakan lengkapi pengaturan Gmail SMTP di menu Admin Kontak.',
    }
  }

  try {
    const isGmail =
      !config.host ||
      config.host.includes('gmail') ||
      config.user.toLowerCase().endsWith('@gmail.com')

    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: 'gmail',
            auth: {
              user: config.user,
              pass: config.pass.replace(/\s+/g, ''), // remove spaces from Google app passwords
            },
          }
        : {
            host: config.host || 'smtp.gmail.com',
            port: config.port || 465,
            secure: config.port === 465,
            auth: {
              user: config.user,
              pass: config.pass,
            },
          }
    )

    const destination =
      params.receiverEmail ||
      config.receiver_email ||
      config.user

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background-color: #ea580c; padding: 24px 32px; text-align: left;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
            AKSARA DIALOGUE
          </h1>
          <p style="color: #ffedd5; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
            Pesan Masuk dari Formulir Website
          </p>
        </div>

        <!-- Body Content -->
        <div style="padding: 32px; color: #171717;">
          <h2 style="font-size: 18px; margin-top: 0; margin-bottom: 20px; color: #0a0a0a; border-bottom: 2px solid #f97316; padding-bottom: 8px;">
            ${escapeHtml(params.subject)}
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #737373; width: 140px; font-weight: 600;">Nama Pengirim:</td>
              <td style="padding: 8px 0; color: #171717; font-weight: bold;">${escapeHtml(params.name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373; font-weight: 600;">Email Pengirim:</td>
              <td style="padding: 8px 0; color: #ea580c; font-weight: bold;">
                <a href="mailto:${escapeHtml(params.email)}" style="color: #ea580c; text-decoration: none;">${escapeHtml(params.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373; font-weight: 600;">Waktu Diterima:</td>
              <td style="padding: 8px 0; color: #525252;">${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}</td>
            </tr>
          </table>

          <div style="background-color: #fafafa; border: 1px solid #f5f5f5; border-left: 4px solid #ea580c; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #737373; letter-spacing: 0.5px;">
              Isi Pesan:
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #262626; white-space: pre-wrap;">
${escapeHtml(params.message)}
            </p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${escapeHtml(params.email)}?subject=Re: ${encodeURIComponent(params.subject)}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
              Balas Pesan Ini Langsung
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0a0a0a; padding: 20px 32px; text-align: center; color: #a3a3a3; font-size: 12px;">
          <p style="margin: 0;">Email otomatis dikirim dari sistem website <strong>Aksara Dialogue</strong></p>
          <p style="margin: 4px 0 0 0; color: #737373;">Jl. Dialogue No. 12, Jakarta Selatan, Indonesia</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"${config.from_name || 'Aksara Dialogue Web'}" <${config.user}>`,
      to: destination,
      replyTo: `"${params.name}" <${params.email}>`,
      subject: `[Aksara Dialogue] ${params.subject} - dari ${params.name}`,
      text: `Pesan baru dari ${params.name} (${params.email})\nSubjek: ${params.subject}\n\nIsi Pesan:\n${params.message}`,
      html: htmlContent,
    })

    return {
      success: true,
      message: 'Pesan berhasil terkirim ke Gmail Sekretariat!',
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Gagal mengirim email via SMTP'
    return {
      success: false,
      message: `Gagal mengirim email ke Gmail: ${errMsg}`,
      error: errMsg,
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
