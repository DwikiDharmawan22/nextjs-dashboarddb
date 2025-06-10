import { NextResponse } from 'next/server';
import { getContactData } from '@/app/lib/data2';

export async function GET() {
  try {
    const data = await getContactData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kontak' }, { status: 500 });
  }
}