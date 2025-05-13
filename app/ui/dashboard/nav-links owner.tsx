'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { irishGrover } from '@/app/ui/fonts';

const links = [
  { name: 'Home', href: '/dashboardowner' },
  { name: 'Product', href: '/dashboardowner/product' },
  { name: 'Penjualan', href: '/dashboardowner/penjualan' },
  { name: 'Pelanggan', href: '/dashboardowner/pelanggan' }
];

export default function NavLinksOwner() {
  const pathname = usePathname();

  return (
    <div className={`flex space-x-24 ${irishGrover.className} `}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className={clsx(
            'px-3 py-2 text-xl md:text-2xl lg:text-3xl font-medium transition-all duration-200 whitespace-nowrap',
            {
              'text-gray-300 hover:text-black': pathname !== link.href,
              'text-black border-b-4 border-black': pathname === link.href,
            }
          )}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}