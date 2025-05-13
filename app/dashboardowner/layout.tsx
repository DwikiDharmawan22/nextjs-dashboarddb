'use client';
import { useEffect } from "react";
import CenterNavOwner from '@/app/ui/dashboard/centernav owner';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.background = "#6A1E55";
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative"> {/* Tambahkan relative */}
      {/* Sidebar/Navbar */}
      <header className="w-full bg-[#A64D79]  shadow-md">
        <div className=" mx-auto h-full px-4">
          <CenterNavOwner /> {/* Pastikan CenterNav mendukung mode horizontal */}
        </div>
      </header>

      {/* Konten Utama */}
      <div className="flex-grow pt-6 pb-6 px-6 md:pt-8 md:px-12 overflow-y-auto"> {/* Tambahkan relative dan z-0 */}
        {children}
      </div>
    </div>
  );
}