import { NextResponse } from 'next/server';
import { saveTransaction } from '@/app/lib/data2';

export async function POST(request: Request) {
  try {
    const newTransaction = await request.json();
    await saveTransaction(newTransaction);
    return NextResponse.json({ message: 'Transaksi berhasil disimpan' }, { status: 200 });
  } catch (error) {
    console.error('Error saving transaction:', error);
    return NextResponse.json({ error: 'Gagal menyimpan transaksi' }, { status: 500 });
  }
}