import { fetchProfile } from '@/app/lib/data2';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const profile = await fetchProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}