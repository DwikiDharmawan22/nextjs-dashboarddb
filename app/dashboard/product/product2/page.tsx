'use client';

import { useEffect, useState } from 'react';
import { Product1 } from '@/app/lib/definitions2';
import Image from 'next/image';
import { creepster, cormorantGaramond } from '@/app/ui/fonts';
import StaticRating from '@/components/StaticRating';
import { CubeIcon, StarIcon, PaintBrushIcon } from '@heroicons/react/24/solid';

// Map nama material ke ikon di sisi klien
const iconMap: { [key: string]: React.ComponentType<any> } = {
  'selected mahogany wood': CubeIcon,
  'dumling paper': StarIcon, // Asumsi: "Dumling Paper" adalah "Dumpling Paper"
  'highly pigmented natural paint': PaintBrushIcon,
};

export default function Page() {
  const [product, setProduct] = useState<Product1 | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch('/api/product?id=2'); // Hardcode ID 2
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        // Map ikon ke materials di sisi klien
        data.materials = data.materials.map((material: { name: string }) => ({
          ...material,
          icon: iconMap[material.name.toLowerCase()],
        }));
        setProduct(data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Gagal memuat produk. Silakan coba lagi.');
      }
    }
    fetchProduct();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!product) {
    return <div className="text-white text-center">Memuat...</div>;
  }

  return (
    <div className="mt-8 p-4 flex flex-col md:flex-row items-center md:items-start gap-8 relative min-h-screen">
      <div className="w-full md:w-1/2 flex justify-center p-0">
        <div className="w-[450px] h-[650px] relative">
          <Image
            src={product.image}
            alt={product.name}
            height={500}
            width={500}
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 py-24">
        <h1
          className={`${creepster.className} text-red-700 text-6xl px-32 md:text-8xl mb-4 text-center md:text-left`}
        >
          {product.name}
        </h1>
        <div
          className={`${creepster.className} text-white text-2xl md:text-4xl mb-6 max-w-md md:max-w-full md:text-left`}
        >
          <p className="mb-2">{product.description}</p>
        </div>

        <div
          className={`${cormorantGaramond.className} text-white mb-6 flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start space-y-4 md:space-y-0 md:space-x-6`}
        >
          {product.materials.map((material, index) => {
            const Icon = material.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full border-2 border-white flex items-center justify-center mb-2">
                  {Icon ? <Icon className="h-16 w-16" /> : <span>Tanpa Ikon</span>}
                </div>
                <p className="font-bold text-xl md:text-2xl text-center">{material.name}</p>
              </div>
            );
          })}
        </div>

        <div
          className={`${cormorantGaramond.className} text-white px-32 flex flex-col items-center md:items-start mb-8`}
        >
          <p className="text-3xl md:text-4xl font-bold mb-2 mt-2 px-12 py-3 tracking-wider border border-white rounded-xl">
            SHOP NOW - Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="px-32">
          <StaticRating rating={product.rating} maxStars={5} />
        </div>
      </div>

      <div
        className={`${creepster.className} fixed bottom-4 left-0 right-0 px-4 py-8 flex justify-between max-w-[1900px] mx-auto`}
      >
        <a
          href={product.navigation.back}
          className="bg-white text-2xl text-red-700 px-4 py-2 border border-black rounded-xl inline-block"
        >
          Back
        </a>
        <a
          href={product.navigation.next}
          className="bg-white text-2xl text-[#6A1E55] px-4 py-2 border border-black rounded-xl inline-block"
        >
          Next
        </a>
      </div>
    </div>
  );
}