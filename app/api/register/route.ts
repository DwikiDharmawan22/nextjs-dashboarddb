import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { username, email, nomorTelp, password, captcha, serverCaptcha } = await request.json();

    // Validasi captcha
    if (captcha !== serverCaptcha) {
      return NextResponse.json({ error: 'Captcha tidak valid' }, { status: 400 });
    }

    // Mulai transaksi secara manual menggunakan query berurutan
    await sql.query('BEGIN');

    try {
      // Periksa duplikasi email di tabel users
      const emailCheck = await sql.query('SELECT * FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        throw new Error('Email sudah terdaftar');
      }

      // Periksa duplikasi username di tabel customers
      const usernameCheck = await sql.query('SELECT * FROM customers WHERE username = $1', [username]);
      if (usernameCheck.rows.length > 0) {
        throw new Error('Username sudah digunakan');
      }

      // Masukkan data ke tabel users
      await sql.query(
        'INSERT INTO users (username, email, nomorTelp, password, role) VALUES ($1, $2, $3, $4, $5)',
        [username, email, nomorTelp, password, 'user']
      );

      // Masukkan data ke tabel customers dengan transaksi kosong
      await sql.query(
        'INSERT INTO customers (username, email, phone, transactions) VALUES ($1, $2, $3, $4)',
        [username, email, nomorTelp, '{}']
      );

      // Komit transaksi
      await sql.query('COMMIT');

      return NextResponse.json({ message: 'Registrasi berhasil' }, { status: 200 });
    } catch (error) {
      // Rollback jika ada error
      await sql.query('ROLLBACK');
      throw error;
    }
  } catch (error: any) {
    console.error('Error selama registrasi:', error);
    return NextResponse.json({ error: error.message || 'Gagal registrasi' }, { status: 500 });
  }
}