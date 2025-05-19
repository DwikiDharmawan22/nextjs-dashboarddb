// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { fetchProducts, saveProducts } from '@/app/lib/data2';

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const products = await request.json();
  await saveProducts(products);
  return NextResponse.json({ message: 'Products saved' });
}