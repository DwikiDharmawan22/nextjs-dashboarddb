import { NextResponse } from 'next/server';

export async function GET() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const captcha = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  return NextResponse.json({ captcha });
}