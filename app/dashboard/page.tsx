'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { creepster, irishGrover } from '@/app/ui/fonts';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen font-creepster">
      <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-4 py-12">
        <div className="text-center md:text-left space-y-4 md:space-y-6 max-w-2xl mx-auto md:mx-0">
          <h1 className={`${creepster.className} text-6xl md:text-8xl text-[#E92020] font-bold`}>
            KEMILAU <br /> TOPENG
          </h1>
          <p className={`${creepster.className} text-lg md:text-xl text-[#A64D79] font-semibold`}>
            Explore cultural wealth through every detail of your mask!
          </p>
          <p className={`${creepster.className} text-lg md:text-xl text-[#A64D79] font-semibold`}>
            NEW ARRIVALS
          </p>
          <button
            className={`${creepster.className} mt-4 md:mt-8 px-6 py-2 md:px-8 md:py-3 text-xl sm:text-2xl md:text-3xl lg:text-[30px] bg-white text-red-600 rounded-full border border-red-600 hover:bg-red-600 hover:text-white transition-colors`}
            onClick={() => router.push('/dashboard/shop')}
          >
            SHOP NOW
          </button>
        </div>

        <div className="mt-4 p-4 mx-auto max-w-screen-2xl">
          <div className="flex flex-col md:flex-row gap-8 mb-2 items-center md:items-start">
            <Image
              src="/topeng cicilia.png"
              width={1000}
              height={1000}
              className="w-full h-auto object-contain"
              alt="Topeng Cicilia"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#f2e6f4] to-[#d9a3c3] py-12">
        <div className="container mx-auto text-center">
          <h2 className={`${irishGrover.className} text-3xl text-[#000000] font-bold mb-10`}>
            OUR BEST PRODUCT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            <div className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{ border: '5px solid #A64D79' }}>
              <Image
                src="/topeng dwiki.png"
                width={190}
                height={150}
                className="mx-auto"
                alt="Topeng Dwiki"
              />
              <h3 className={`${irishGrover.className} text-[#6A1E55] text-xl font-semibold mb-3`}>
                TOPENG DWIKI
              </h3>
              <button
                onClick={() => router.push('/dashboard/product')}
                className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}
              >
                SEE MORE
              </button>
            </div>

            <div className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{ border: '5px solid #A64D79' }}>
              <Image
                src="/topeng jesica.png"
                width={150}
                height={150}
                className="mx-auto"
                alt="Topeng Jesica"
              />
              <h3 className={`${irishGrover.className} text-[#6A1E55] text-xl font-semibold mb-3`}>
                TOPENG JESICA
              </h3>
              <button
                onClick={() => router.push('/dashboard/product/product2')}
                className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}
              >
                SEE MORE
              </button>
            </div>

            <div className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{ border: '5px solid #A64D79' }}>
              <Image
                src="/topeng cicilia.png"
                width={167}
                height={150}
                className="mx-auto"
                alt="topeng Cicilia"
              />
              <h3 className={`${irishGrover.className} text-[#6A1E55] text-xl font-semibold mb-3`}>
                TOPENG CICILIA
              </h3>
              <button
                onClick={() => router.push('/dashboard/product/product3')}
                className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}
              >
                SEE MORE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
