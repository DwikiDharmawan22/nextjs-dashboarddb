'use client';

import { useEffect } from 'react';
import CenterNav from '@/app/ui/dashboard/centernav';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.background = 'linear-gradient(#6A1E55, #3B1C32, #1A1A1D)';
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen relative"> 
        {/* Sidebar/Navbar */}
        <header className="w-full bg-[#A64D79] sticky top-0 z-50 shadow-md mx-auto h-full px-4">
          <CenterNav /> {/* CenterNav mode horizontal */}
        </header>

        {/* Konten Utama */}
        <div className="flex-grow pt-6 pb-6 px-6 md:pt-8 md:px-12 overflow-y-auto"> 
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}