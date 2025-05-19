import { NextResponse } from 'next/server';
import { fetchProductById } from '@/app/lib/data2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const product = await fetchProductById(id);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('API Error:', error);
    if (error.message === 'Product not found') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}