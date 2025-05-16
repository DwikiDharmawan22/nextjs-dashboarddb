'use client';

import { creepster, cormorantGaramond } from '@/app/ui/fonts';
import Image from 'next/image';
import React from 'react';
import StaticRating from '@/components/StaticRating';
import { Product1 } from '@/app/lib/definitions2';
import { product3 } from '@/app/lib/data2';

export default function Page() {
  return (
    <div className="mt-8 p-4 flex flex-col md:flex-row items-center md:items-start gap-8 relative min-h-screen">
      <div className="w-full md:w-1/2 flex justify-center p-0">
        <div className="w-[620] h-[700px] relative">
          <Image
            src={product3.image}
            alt={product3.name}
            height={500}
            width={500}
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 py-24">
        <h1 className={`${creepster.className} text-red-700 text-6xl px-32 md:text-8xl mb-4 text-center md:text-left`}>
          {product3.name}
        </h1>
        <div className={`${creepster.className} text-white text-2xl md:text-4xl mb-6 text-left`}>
          <p className="mb-2">{product3.description}</p>
        </div>

        <div
          className={`${cormorantGaramond.className} text-white mb-6 flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start space-y-4 md:space-y-0 md:space-x-6`}
        >
          {product3.materials.map((material, index) => {
            const Icon = material.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full border-2 border-white flex items-center justify-center mb-2">
                  <Icon className="h-16 w-16" />
                </div>
                <p className="font-bold text-xl md:text-2xl text-center">{material.name}</p>
              </div>
            );
          })}
        </div>

        <div className={`${cormorantGaramond.className} text-white flex flex-col items-center px-32 md:items-start mb-8`}>
          <p className="text-3xl md:text-4xl font-bold mb-2 mt-2 px-12 py-3 tracking-wider border border-white rounded-xl">
            SHOP NOW - {product3.price}
          </p>
        </div>
        <div className="px-32">
          <StaticRating rating={product3.rating} maxStars={5} />
        </div>
      </div>

      <div className={`${creepster.className} fixed bottom-4 left-0 right-0 px-4 py-8 flex justify-between max-w-[1900px] mx-auto`}>
        <a href={product3.navigation.back} className="bg-white text-2xl text-red-700 px-4 py-2 border border-black rounded-xl inline-block">Back</a>
        <a href={product3.navigation.next} className="bg-white text-2xl text-[#6A1E55] px-4 py-2 border border-black rounded-xl inline-block">Next</a>
      </div>
    </div>
  );
}
