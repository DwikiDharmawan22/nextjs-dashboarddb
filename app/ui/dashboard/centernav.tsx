import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Image from 'next/image';


export default function CenterNav() {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 ">
      {/* Logo - Pojok Kiri */}
      <div className="flex-shrink-0 z-50">
        <Link href="/dashboard" className="flex items-center h-16">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={120}
            height={50}
            className="object-contain h-full w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigasi - Tengah */}
      <div className="hidden md:flex flex-1 justify-end mx-4">
        <NavLinks />
      </div>

    </div>
  );
}