'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { irishGrover } from '@/app/ui/fonts';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/lib/auth-context';
import { useEffect, useState } from 'react';

const links = [
  { name: 'Home', href: '/dashboard' },
  { name: 'About', href: '/dashboard/about' },
  { name: 'Shop', href: '/dashboard/shop' },
  { name: 'Product' },
  { name: 'Review', href: '/dashboard/review' },
  { name: 'Blog', href: '/dashboard/blog' },
  { name: 'Contact', href: '/dashboard/contact' },
  { name: 'Profile', href: '/dashboard/profile' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // Nonaktifkan navigasi di halaman autentikasi
  const isAuthPage = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);

  // Ambil jumlah total produk dari API
  useEffect(() => {
    async function fetchTotalProducts() {
      try {
        const response = await fetch('/api/product-count');
        if (response.ok) {
          const data = await response.json();
          setTotalProducts(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching total products:', err);
      }
    }
    fetchTotalProducts();
  }, []);

  const handleProductClick = () => {
    if (isAuthPage || !isLoggedIn) {
      toast.error('Silakan login untuk mengakses navigasi', {
        theme: 'dark',
        position: 'top-right',
      });
      if (!isAuthPage) router.push('/auth/login');
      return;
    }

    if (totalProducts > 0) {
      const randomId = Math.floor(Math.random() * totalProducts) + 1; // ID mulai dari 1
      router.push(`/dashboard/product/${randomId}`);
    } else {
      toast.error('Tidak ada produk yang tersedia', {
        theme: 'dark',
        position: 'top-right',
      });
    }
  };

  const handleLinkClick = (href: string) => {
    if (isAuthPage || !isLoggedIn) {
      toast.error('Silakan login untuk mengakses navigasi', {
        theme: 'dark',
        position: 'top-right',
      });
      if (!isAuthPage) router.push('/auth/login');
      return;
    }
    router.push(href);
  };

  const handleLogout = () => {
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu', {
        theme: 'dark',
        position: 'top-right',
      });
      router.push('/auth/login');
      return;
    }
    logout();
    toast.success('Logout Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/auth/login');
  };

  return (
    <div className={`flex justify-center space-x-12 py-4 ${irishGrover.className}`}>
      {links.map((link) =>
        link.name === 'Product' ? (
          <button
            key={link.name}
            onClick={handleProductClick}
            className={clsx(
              'px-3 py-2 text-xl md:text-2xl lg:text-3xl font-medium transition-all duration-200 whitespace-nowrap',
              {
                'text-gray-300 hover:text-black': !pathname.startsWith('/dashboard/product'),
                'text-black border-b-4 border-black': pathname.startsWith('/dashboard/product'),
                'cursor-not-allowed opacity-50': !isLoggedIn || isAuthPage,
              }
            )}
            disabled={!isLoggedIn || isAuthPage}
          >
            {link.name}
          </button>
        ) : (
          <button
            key={link.name}
            onClick={() => handleLinkClick(link.href!)}
            className={clsx(
              'px-3 py-2 text-xl md:text-2xl lg:text-3xl font-medium transition-all duration-200 whitespace-nowrap',
              {
                'text-gray-300 hover:text-black': pathname !== link.href,
                'text-black border-b-4 border-black': pathname === link.href,
                'cursor-not-allowed opacity-50': !isLoggedIn || isAuthPage,
              }
            )}
            disabled={!isLoggedIn || isAuthPage}
          >
            {link.name}
          </button>
        )
      )}
      {isLoggedIn && !isAuthPage && (
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-xl md:text-2xl lg:text-3xl font-medium text-gray-300 hover:text-black"
        >
          Logout
        </button>
      )}
    </div>
  );
}