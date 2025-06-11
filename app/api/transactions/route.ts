import { NextResponse } from 'next/server';
import { fetchTransactions, deleteTransaction } from '@/app/lib/data2';

export async function GET() {
  try {
    console.log('[GET /api/transactions] Fetching transactions at', new Date().toISOString());
    const transactions = await fetchTransactions();
    console.log(`[GET /api/transactions] Successfully fetched ${transactions.length} transactions at`, new Date().toISOString());
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('[GET /api/transactions] Error:', error);
    return NextResponse.json({ message: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id'); // Ambil ID dari query parameter

  try {
    console.log(`[DELETE /api/transactions] Request received at ${new Date().toISOString()} for ID: ${id}`);
    if (!id) {
      console.warn('[DELETE /api/transactions] Missing transaction ID');
      return NextResponse.json({ message: 'Transaction ID is required' }, { status: 400 });
    }
    await deleteTransaction(id);
    console.log(`[DELETE /api/transactions] Transaction deleted successfully at ${new Date().toISOString()} for ID: ${id}`);
    return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`[DELETE /api/transactions] Error at ${new Date().toISOString()} for ID: ${id}:`, error);
    const status = error.message.includes('Transaction not found') ? 404 : 500;
    const message = error.message || 'Failed to delete transaction due to server error';
    return NextResponse.json({ message }, { status });
  }
}