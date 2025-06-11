'use client';

import { useEffect } from 'react';
import CenterNavOwner from '@/app/ui/dashboard/centernav-owner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FaFacebook, FaPinterest, FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.background = '#6A1E55';
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen relative">
        {/* Sidebar/Navbar */}
        <header className="w-full bg-[#A64D79] shadow-md">
          <div className="mx-auto h-full px-4">
            <CenterNavOwner />
          </div>
        </header>

        {/* Konten Utama */}
        <div className="flex-grow pt-6 pb-6 px-6 md:pt-8 md:px-12 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-white text-black text-sm mt-20 w-full">
          <div className="px-6 py-3 mx-auto md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-2 md:mb-0">
                <span className="font-semibold">Ikuti kami</span>
                <div className="flex gap-3 text-xl">
                  <a href="https://www.facebook.com/merryanti.edyanto.7" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                  <a href="https://www.pinterest.com/uajy" target="_blank" rel="noopener noreferrer">
                    <FaPinterest />
                  </a>
                  <a href="https://wa.me/6282297527617" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp />
                  </a>
                  <a href="https://www.instagram.com/uajy" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                </div>
              </div>
              <p>© 2025 Kemilau Topeng. All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}