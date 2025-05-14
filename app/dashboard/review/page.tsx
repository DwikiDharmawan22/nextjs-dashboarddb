'use client';

import Image from 'next/image';
import { montserrat, dmSans } from '@/app/ui/fonts';
import StaticRating from '@/components/StaticRating';
import { reviewProduct } from '@/app/lib/definitions2';
import { reviewproducts } from '@/app/lib/data2';

export default function AboutPage() {
  return (
    <div className="mt-4 p-4 mx-auto max-w-screen-2xl">
      {/* Logo and Description Side by Side */}
      <div className="flex flex-col md:flex-row gap-8 mb-2 items-center md:items-start">
        {/* Logo - Adjust width as needed */}
        <div className="w-full md:w-1/2 h-[300px] relative">
          <Image
            src="/topeng jesica.png"
            alt="Kemilau Topeng Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Description */}
        <div className="w-full mx-auto text-center mt-8">
          <h1 className={`${montserrat.className} text-7xl font-bold mb-4 text-white`}>EXPLORE YOU MASK</h1>
          <p className={`${dmSans.className} text-3xl text-white flex items-center justify-center`}>
            Explore our unique collection of masks and <br />
            uncover the perfect one for any occasion
          </p>
        </div>
      </div>
      <div className="flex-1 p-4 rounded-lg shadow-lg">
        <div className="product-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewproducts.map((product, index) => (
            <div
              key={index}
              className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow"
              style={{ border: '5px solid #A64D79' }}
            >
              <div className="relative h-64 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={product.width}
                  height={product.height}
                  className="object-cover rounded"
                />
              </div>
              <div className="text-3xl flex items-center justify-center">
                <StaticRating rating={product.rating} maxStars={5} />
              </div>
              <h3 className={`${montserrat.className} text-white text-3xl font-semibold mt-2 mb-2`}>{product.name}</h3>
              <div className={`${dmSans.className} text-white text-2xl`}>
                {product.description.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}