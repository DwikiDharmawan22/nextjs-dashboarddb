import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Query user by email
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 400 });
    }

    const user = result.rows[0];
    // Compare plain text password (development only, insecure)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Password tidak sesuai' }, { status: 400 });
    }

    // Return user role for client-side routing
    return NextResponse.json({ message: 'Login berhasil', role: user.role }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 });
  }
}