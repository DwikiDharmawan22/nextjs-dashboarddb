'use client';
import Image from 'next/image';
import { cousine } from '@/app/ui/fonts';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // This will navigate to the previous page in history
  };

  return (
    <div className={`flex flex-col items-center min-h-screen ${cousine.className}`}>
      {/* Card container with relative positioning for the avatar */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative mt-40">
        {/* Avatar positioned to protrude from the top */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <Image
            src="/dwiki.png"
            alt="Profile"
            width={64}
            height={64}
            className="w-40 h-40 rounded-full border-4 border-white shadow-md"
          />
        </div>

        {/* Header section with name and role */}
        <div className="bg-pink-200 p-4 pt-20 rounded-t-lg flex flex-col items-center">
          <h1 className="text-4xl font-bold text-purple-900">Dwiki Dharmawan</h1>
          <p className="text-2xl text-purple-900">Pegawai</p>
        </div>

        {/* Content section */}
        <div className="p-8 space-y-8">
          {/* Email */}
          <div className="border-b border-gray-300 pb-2">
            <p className="text-2xl font-semibold text-gray-700">EMAIL</p>
            <p className="text-xl text-gray-600">cicilia175@gmail.com</p>
          </div>

          {/* Nomor Telepon */}
          <div className="border-b border-gray-300 pb-2">
            <p className="text-2xl font-semibold text-gray-700">NOMOR TELEPON</p>
            <p className="text-xl text-gray-600">083418461937</p>
          </div>

          {/* Facebook */}
          <div className="border-b border-gray-300 pb-2">
            <p className="text-2xl font-semibold text-gray-700">FACEBOOK</p>
            <p className="text-xl text-gray-600">@Ciciliaaa</p>
          </div>
        </div>
      </div>

      {/* Back button positioned below the card and aligned left */}
      <div className="w-full max-w-4xl mt-6 flex justify-start">
        <button 
          onClick={handleBack}
          className="bg-white text-xl text-red-700 font-bold py-2 px-8 rounded-full shadow hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}