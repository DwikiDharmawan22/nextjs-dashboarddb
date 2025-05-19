import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { username, email, nomorTelp, password, captcha, serverCaptcha } = await request.json();

    // Validate captcha
    if (captcha !== serverCaptcha) {
      return NextResponse.json({ error: 'Captcha tidak valid' }, { status: 400 });
    }

    // Check for duplicate email
    const emailCheck = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Insert new user (plain text password, development only)
    await sql`
      INSERT INTO users (username, email, nomorTelp, password, role)
      VALUES (${username}, ${email}, ${nomorTelp}, ${password}, 'user')
    `;

    return NextResponse.json({ message: 'Registrasi berhasil' }, { status: 200 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'Gagal registrasi' }, { status: 500 });
  }
}