'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];

  useEffect(() => {
    if (!isLoggedIn && !publicPaths.includes(pathname)) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, router, pathname]);

  if (isLoggedIn || publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return null;
}