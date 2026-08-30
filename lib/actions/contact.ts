'use server'

import { revalidatePath } from 'next/cache'
import { getLocalDb, saveLocalDb, saveLocalRecord } from '@/lib/local-store'
import { sendContactEmail, getEffectiveSmtpConfig, SmtpConfig } from '@/lib/services/mail'
import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
  [key: string]: unknown
}

export async function sendContactMessage(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const { name, email, subject, message } = formData

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return { success: false, message: 'Harap lengkapi semua kolom formulir (Nama, Email, Subjek, dan Pesan).' }
    }

    // 1. Save message to database/local-store inbox
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    }

    const db = getLocalDb()
    if (!db.records) db.records = {}
    if (!db.records['contact_messages']) db.records['contact_messages'] = []
    db.records['contact_messages'].unshift(newMessage as Record<string, unknown>)
    saveLocalDb(db)

    // Save to Supabase if connected
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl && supabaseUrl.startsWith('http')) {
        const supabase = await createClient()
        await supabase.from('contact_messages').insert([
          {
            name: newMessage.name,
            email: newMessage.email,
            subject: newMessage.subject,
            message: newMessage.message,
            created_at: newMessage.created_at,
          },
        ])
      }
    } catch {}

    // 2. Send real email via Gmail SMTP
    const emailResult = await sendContactEmail({
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject,
      message: newMessage.message,
    })

    revalidatePath('/admin/kontak')

    if (!emailResult.success && emailResult.error) {
      return {
        success: true,
        message: 'Pesan Anda telah tersimpan di kotak masuk Admin. Catatan pengiriman email: ' + emailResult.message,
      }
    }

    return {
      success: true,
      message: 'Pesan Anda berhasil dikirimkan ke email sekretariat Aksara Dialogue!',
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
    return { success: false, message: `Gagal mengirim pesan: ${msg}` }
  }
}

export async function saveSmtpSettings(config: SmtpConfig) {
  try {
    saveLocalRecord('smtp_settings', config as unknown as Record<string, unknown>)
    revalidatePath('/admin/kontak')
    return { success: true, message: 'Konfigurasi Gmail SMTP berhasil disimpan!' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan pengaturan'
    return { success: false, message: msg }
  }
}

export async function testSmtpEmail(testRecipient: string) {
  try {
    const config = getEffectiveSmtpConfig()
    if (!config || !config.user || !config.pass) {
      return {
        success: false,
        message: 'Pengaturan Gmail SMTP belum diisi. Masukkan email Gmail dan Google App Password terlebih dahulu.',
      }
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass.replace(/\s+/g, ''),
      },
    })

    await transporter.sendMail({
      from: `"${config.from_name || 'Aksara Dialogue Test'}" <${config.user}>`,
      to: testRecipient || config.user,
      subject: '✅ Uji Coba Pengiriman Email Berhasil - Aksara Dialogue',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #ea580c; border-radius: 12px; max-width: 500px;">
          <h2 style="color: #ea580c; margin-top: 0;">Koneksi Gmail SMTP Berhasil! 🎉</h2>
          <p>Email uji coba ini mengonfirmasi bahwa website Aksara Dialogue sekarang dapat mengirim pesan langsung ke kotak masuk Gmail Anda.</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <p style="font-size: 12px; color: #737373;">Waktu Pengujian: ${new Date().toLocaleString('id-ID')}</p>
        </div>
      `,
    })

    return {
      success: true,
      message: `Email uji coba berhasil dikirim ke ${testRecipient || config.user}! Silakan periksa inbox Gmail Anda.`,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Koneksi gagal'
    return {
      success: false,
      message: `Gagal mengirim email uji coba: ${msg}. Pastikan Anda menggunakan Google App Password 16 digit dan verifikasi 2 langkah aktif di akun Google Anda.`,
    }
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const db = getLocalDb()
    if (db.records && db.records['contact_messages']) {
      db.records['contact_messages'] = (db.records['contact_messages'] as unknown as ContactMessage[])
        .filter((m) => m.id !== id)
        .map((m) => m as unknown as Record<string, unknown>)
      saveLocalDb(db)
    }
    revalidatePath('/admin/kontak')
    return { success: true, message: 'Pesan berhasil dihapus' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus pesan'
    return { success: false, message: msg }
  }
}

export async function markContactMessageRead(id: string) {
  try {
    const db = getLocalDb()
    if (db.records && db.records['contact_messages']) {
      const messages = db.records['contact_messages'] as unknown as ContactMessage[]
      const msg = messages.find((m) => m.id === id)
      if (msg) {
        msg.is_read = true
        saveLocalDb(db)
      }
    }
    revalidatePath('/admin/kontak')
    return { success: true }
  } catch {
    return { success: false }
  }
}
