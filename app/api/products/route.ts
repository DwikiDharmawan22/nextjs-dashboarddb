import { NextResponse } from 'next/server';
import { fetchProducts, saveProducts, deleteProduct, syncAllProductsToShopProducts } from '@/app/lib/data2';

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const products = await request.json();
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }
    await saveProducts(products);
    return NextResponse.json({ message: 'Products saved successfully' });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    await deleteProduct(id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await syncAllProductsToShopProducts();
    return NextResponse.json({ message: 'All products synced to shop_products successfully' });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to sync products' }, { status: 500 });
  }
}