'use server';

import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password tidak cocok' };
  }

  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (result.rows.length === 0) {
    return { error: 'Email tidak terdaftar' };
  }

  await sql`UPDATE users SET password = ${newPassword} WHERE email = ${email}`;
  redirect('/auth/login');
}