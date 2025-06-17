import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/data2';

export async function GET() {
  try {
    const data = await sql`
      SELECT COUNT(*) AS total
      FROM product_details
    `;
    return NextResponse.json({ total: Number(data[0].total) });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Gagal menghitung jumlah produk' }, { status: 500 });
  }
}