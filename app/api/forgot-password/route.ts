import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    // Validate email in database
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 400 });
    }

    // Store plain text password (development only, insecure)
    await sql`UPDATE users SET password = ${newPassword} WHERE email = ${email}`;

    return NextResponse.json({ message: 'Password berhasil direset' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Gagal mereset password' }, { status: 500 });
  }
}