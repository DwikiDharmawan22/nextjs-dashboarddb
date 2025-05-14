'use client';

import Image from 'next/image';
import { creepster } from '@/app/ui/fonts';
import { ShopProduct } from '@/app/lib/definitions2';
import { shopproducts } from '@/app/lib/data2';

export default function AboutPage() {
  return (
    <div className="p-4 mx-auto max-w-screen-2xl">
      {/* Product grid - Container pertama dengan margin bottom */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="product-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          {shopproducts.map((product, index) => (
            <div
              key={index}
              className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow"
              style={{ border: '5px solid #A64D79' }}
            >
              <div className="relative h-64 mb-4 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={product.width}
                  height={product.height}
                  className="object-cover rounded"
                />
              </div>
              <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>{product.name}</h3>
              <a
                href={product.link}
                className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}
              >
                SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Product grid - Container kedua */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
        <div className="product-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          {shopproducts.map((product, index) => (
            <div
              key={index}
              className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow"
              style={{ border: '5px solid #A64D79' }}
            >
              <div className="relative h-64 mb-4 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={product.width}
                  height={product.height}
                  className="object-cover rounded"
                />
              </div>
              <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>{product.name}</h3>
              <a
                href={product.link}
                className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}
              >
                SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}