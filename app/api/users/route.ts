import { NextResponse } from 'next/server';
import { fetchUsersByRole } from '@/app/lib/data2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  if (!role) {
    return NextResponse.json({ error: 'Role is required' }, { status: 400 });
  }

  const users = await fetchUsersByRole(role);
  return NextResponse.json(users); // Kembalikan array langsung
}