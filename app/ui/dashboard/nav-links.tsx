'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { irishGrover } from '@/app/ui/fonts';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const links = [
  { name: 'Home', href: '/dashboard' },
  { name: 'About', href: '/dashboard/about' },
  { name: 'Shop', href: '/dashboard/shop' },
  { name: 'Product' },
  { name: 'Review', href: '/dashboard/review' },
  { name: 'Blog', href: '/dashboard/blog' },
  { name: 'Contact', href: '/dashboard/contact' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status only on the client side
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []); // Empty dependency array ensures this runs once on mount

  const handleProductClick = () => {
    if (!isLoggedIn) {
      toast.error('Silakan login untuk mengakses navigasi', {
        theme: 'dark',
        position: 'top-right',
      });
      router.push('/auth/login');
      return;
    }

    const productPages = [
      '/dashboard/product',
      '/dashboard/product/product2',
      '/dashboard/product/product3',
    ];
    const randomPage = productPages[Math.floor(Math.random() * productPages.length)];
    router.push(randomPage);
  };

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

  return (
    <div className={`flex space-x-12 ${irishGrover.className}`}>
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
                'cursor-not-allowed opacity-50': !isLoggedIn,
              }
            )}
            disabled={!isLoggedIn}
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
                'cursor-not-allowed opacity-50': !isLoggedIn,
              }
            )}
            disabled={!isLoggedIn}
          >
            {link.name}
          </button>
        )
      )}
    </div>
  );
}