import { NextResponse } from 'next/server';
import { fetchCustomers, saveCustomers } from '@/app/lib/data2';

export async function GET() {
  try {
    const customers = await fetchCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const customers = await request.json();
    await saveCustomers(customers);
    return NextResponse.json({ message: 'Customers saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save customers' }, { status: 500 });
  }
}