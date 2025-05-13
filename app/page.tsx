import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { irishGrover } from '@/app/ui/fonts';
import Image from 'next/image';
import CenterNav from '@/app/ui/dashboard/centernav';

export default function Page() {
  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Background Layers */}
      {/* Layer 1: Solid Color Base */}
      <div className="absolute inset-0 z-40 bg-[#6A1E55] opacity-40"/>
      
      {/* Layer 2: Background Image with Reduced Opacity */}
      <div className="absolute inset-0 z-30">
        <Image
          src="/bg tampilan pelanggan.jpeg"
          fill
          className="object-cover opacity-10"
          alt="Background pattern"
        />
      </div>
      
      {/* Layer 3: Split Background (Left Image + Right Color) */}
      <div className="absolute inset-0 z-20 flex">
        {/* Left Section with Image */}
        <div className="w-2/3 relative">
          <Image
            src="/bg profile klpok.jpeg"
            fill
            className="object-cover"
            alt="Traditional masks"
          />
        </div>
        {/* Right Solid Color Section */}
        <div className="w-1/3 bg-[#6A1E55]" />
      </div>
      
      {/* Navigation (Top Layer) */}
      <header className="relative z-50 w-full mx-auto bg-transparent">
        <CenterNav />
      </header>
      
      {/* Main Content (Top Layer) */}
      <div className="relative z-50 flex flex-col items-center justify-center flex-1 text-center text-white">
        <h1 className={`${irishGrover.className} text-[7rem] font-bold`}>
          WELCOME TO <br /> KEMILAU TOPENG
        </h1>
        <p className={`${irishGrover.className} text-xl mb-6`}>
          Please log in before viewing the following page
        </p>
        <Link
          href="/auth/login"
          className={`${irishGrover.className} flex items-center gap-3 rounded-full bg-red-600 px-32 py-3 text-xl font-medium text-white transition-colors hover:bg-red-500`}
        >
          <span>Login</span>
          <ArrowRightIcon className="w-5" />
        </Link>
      </div>
    </main>
  );
}