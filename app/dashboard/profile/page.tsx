'use client';

import Image from 'next/image';
import { cousine } from '@/app/ui/fonts';
import { useRouter } from 'next/navigation';
import { Profile } from '@/app/lib/definitions2';
import { useState, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
    getProfile();
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex flex-col items-center min-h-screen ${cousine.className}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative mt-40">
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="Profile"
            width={64}
            height={64}
            className="w-40 h-40 rounded-full border-4 border-white shadow-md"
          />
        </div>
        <div className="bg-pink-200 p-4 pt-20 rounded-t-lg flex flex-col items-center">
          <h1 className="text-4xl font-bold text-purple-900">{profileData.name}</h1>
          <p className="text-2xl text-purple-900">{profileData.role}</p>
        </div>
        <div className="p-8 space-y-8">
          <div className="border-b border-gray-300 pb-2">
            <p className="text-2xl font-semibold text-gray-700">EMAIL</p>
            <p className="text-xl text-gray-600">{profileData.email}</p>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <p className="text-2xl font-semibold text-gray-700">NOMOR TELEPON</p>
            <p className="text-xl text-gray-600">{profileData.phone}</p>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <p className="text-2xl font-semibold text-gray-700">FACEBOOK</p>
            <p className="text-xl text-gray-600">{profileData.facebook}</p>
          </div>
        </div>
      </div>
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