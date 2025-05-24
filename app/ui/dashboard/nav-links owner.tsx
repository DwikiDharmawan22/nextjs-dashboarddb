'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { irishGrover } from '@/app/ui/fonts';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/lib/auth-context';

const links = [
  { name: 'Home', href: '/dashboardowner' },
  { name: 'Product', href: '/dashboardowner/product' },
  { name: 'Penjualan', href: '/dashboardowner/penjualan' },
  { name: 'Pelanggan', href: '/dashboardowner/pelanggan' },
];

export default function NavLinksOwner() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLinkClick = (href: string) => {
    if (!isLoggedIn) {
      toast.error('Silakan login untuk mengakses navigasi', {
        theme: 'dark',
        position: 'top-right',
      });
      router.push('/auth/login');
      return;
    }
    router.push(href);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/auth/login');
  };

  return (
    <div className={`flex space-x-24 ${irishGrover.className}`}>
      {links.map((link) => (
        <button
          key={link.name}
          onClick={() => handleLinkClick(link.href)}
          className={clsx(
            'px-3 py-2 text-xl md:text-2xl lg:text-3xl font-medium transition-all duration-200 whitespace-nowrap',
            {
              'text-gray-300 hover:text-black': pathname !== link.href,
              'text-black border-b-4 border-black': pathname === link.href,
              'cursor-not-allowed opacity-50': !isLoggedIn,
            }
          )}
          disabled={!isLoggedIn}
        >
          {link.name}
        </button>
      ))}
      
    </div>
  );
}