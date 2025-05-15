// app/ClientWrapper.tsx
'use client';

import { AuthProvider } from '@/app/lib/auth-context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-right" theme="dark" style={{ zIndex: 50 }} />
    </AuthProvider>
  );
}