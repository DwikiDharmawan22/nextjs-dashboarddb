import { NextResponse } from 'next/server';
import { fetchProducts, saveProducts, deleteProduct } from '@/app/lib/data2';

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const products = await request.json();
  await saveProducts(products);
  return NextResponse.json({ message: 'Products saved' });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }
  await deleteProduct(id);
  return NextResponse.json({ message: 'Product deleted' });
}