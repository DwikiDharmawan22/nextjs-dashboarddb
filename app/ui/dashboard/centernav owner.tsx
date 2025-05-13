'use client';
import Link from 'next/link';
import NavLinksOwner from '@/app/ui/dashboard/nav-links owner';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { irishGrover } from '@/app/ui/fonts';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CenterNavOwner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  // Type the ref as HTMLDivElement or null
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout click with event typing
  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowLogoutPopup(true);
    setIsOpen(false);
  };

  // Confirm logout and navigate
  const confirmLogout = () => {
    setShowLogoutPopup(false);
    router.push('/');
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="flex items-center justify-between w-full bg-[#A64D79]">
      {/* Logo - Pojok Kiri */}
      <div className="flex-shrink-0 z-50">
        <Link href="/" className="flex items-center h-20">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={180}
            height={80}
            className="object-contain h-full w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigasi - Tengah */}
      <div className="hidden md:flex flex-1 justify-center mx-4">
        <NavLinksOwner />
      </div>

      {/* Pegawai - Pojok Kanan */}
      <div className={`${irishGrover.className} relative z-50`} ref={dropdownRef}>
        <div
          className="flex items-center gap-2 p-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
        >
          <Image
            src="/dwiki.png"
            alt="Profile"
            width={50}
            height={50}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <span className="text-white">Pegawai</span>
          <ChevronDownIcon
            className={`w-4 text-white transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <div
            className="absolute right-0 w-48 bg-white rounded-md shadow-lg"
            onMouseLeave={() => setIsOpen(false)}
          >
            <Link
              href="/dashboardowner/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profil
            </Link>
            <a
              href="/auth"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
              Logout
            </a>
          </div>
        )}
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-end justify-center bg-white bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-t-lg shadow-lg w-full p-4">
            <p className="text-center text-lg font-semibold py-4 border-b border-gray-300 uppercase">
              Anda yakin ingin LOGOUT?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={confirmLogout}
                className="w-full py-4 text-red-500 border-b border-gray-300 hover:bg-gray-100 uppercase"
              >
                Logout
              </button>
              <button
                onClick={cancelLogout}
                className="w-full py-4 text-black hover:bg-gray-100 uppercase"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}