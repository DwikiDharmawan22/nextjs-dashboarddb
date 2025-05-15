import { NextResponse } from 'next/server';
import { validateUser } from '@/app/lib/data2';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { isValid, role } = await validateUser(email, password);

    if (!isValid) {
      return NextResponse.json({ error: 'Email atau password tidak valid' }, { status: 401 });
    }

    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    console.error('Error validating user:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}