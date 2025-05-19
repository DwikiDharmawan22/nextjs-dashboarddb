import { fetchBlogProducts } from '@/app/lib/data2';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await fetchBlogProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog products' }, { status: 500 });
  }
}