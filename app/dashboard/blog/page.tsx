'use client';

import Image from 'next/image';
import { irishGrover } from '@/app/ui/fonts';


export default function AboutPage() {
  return (
    <div className="mt-4 p-4 mx-auto max-w-screen-2xl">
      <div className="flex flex-col md:flex-row gap-8 mb-2 items-center md:items-start">
        <div className="w-full md:w-1/2 h-[300px] relative">
          <Image
            src="/logo.png"
            height={200}
            width={450}
            className="object-contain"
            alt="Kemilau Topeng Logo"
          />
        </div>

        <div className="w-full mx-auto text-center mt-8 ">
          <h1 className={`${irishGrover.className} text-7xl font-bold mb-4 text-white`}>EXPLORE YOU MASK</h1>
          <p className={`${irishGrover.className} text-3xl text-white flex items-center justify-center`}>
            Explore our unique collection of masks and <br />
            uncover the perfect one for any occasion
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="product-card flex p-6 bg-white rounded-lg hover:shadow-xl transition-shadow items-stretch" style={{ border: '5px solid #A64D79' }}>
          <div className="flex items-center mr-6">
            <Image
              src="/topeng jesica.png"
              alt="Topeng Jesica"
              width={200}
              height={200}
              className="object-cover rounded"
            />
          </div>
          <div className="w-1 bg-gray-300 mx-4"></div>
          <div className="flex flex-col justify-center text-left ml-6">
            <div className={`${irishGrover.className} text-black  text-lg mb-4`}>
              Posted on 05 Jan, 2023
            </div>
            <h3 className={`${irishGrover.className} text-black text-3xl font-semibold mb-3`}>Topeng Jesica</h3>
            <div className={`${irishGrover.className} text-black text-xl mb-4`}>
              Used in the hudoq dance,<br />
              a traditional art of the Dayak tribe.
            </div>
            <div className="text-black hover:text-purple-300 cursor-pointer text-lg font-medium">
              read more
            </div>
          </div>
        </div>

        <div className="product-card flex p-6 bg-white rounded-lg hover:shadow-xl transition-shadow items-stretch" style={{ border: '5px solid #A64D79' }}>
          <div className="flex items-center mr-6">
            <Image
              src="/topeng cicilia.png"
              width={200}
              height={200}
              className="object-cover rounded"
              alt="Topeng Cicilia"
            />
          </div>

          <div className="w-1 bg-gray-300 mx-4"></div>
          <div className="flex flex-col justify-center text-left ml-6">
            <div className={`${irishGrover.className} text-black  text-lg mb-4`}>
              Posted on 05 Jan, 2023
            </div>
            <h3 className={`${irishGrover.className} text-black text-3xl font-semibold mb-3`}>Topeng Cicilia</h3>
            <div className={`${irishGrover.className} text-black text-xl mb-4`}>
              Used in the hudoq dance,<br />
              a traditional art of the Dayak tribe.
            </div>
            <div className="text-black hover:text-purple-300 cursor-pointer text-lg font-medium">
              read more
            </div>
          </div>
        </div>

        <div className="product-card flex p-6 bg-white rounded-lg hover:shadow-xl transition-shadow items-stretch" style={{ border: '5px solid #A64D79' }}>
          <div className="flex items-center mr-6">
            <Image
              src="/topeng cicilia.png"
              width={200}
              height={200}
              className="object-cover rounded"
              alt="Topeng Cicilia"
            />
          </div>

          <div className="w-1 bg-gray-300 mx-4"></div>
          <div className="flex flex-col justify-center text-left ml-6">
            <div className={`${irishGrover.className} text-black  text-lg mb-4`}>
              Posted on 05 Jan, 2023
            </div>
            <h3 className={`${irishGrover.className} text-black text-3xl font-semibold mb-3`}>Topeng Cicilia</h3>
            <div className={`${irishGrover.className} text-black text-xl mb-4`}>
              Used in the hudoq dance,<br />
              a traditional art of the Dayak tribe.
            </div>
            <div className="text-black hover:text-purple-300 cursor-pointer text-lg font-medium">
              read more
            </div>
          </div>
        </div>

        <div className="product-card flex p-6 bg-white rounded-lg hover:shadow-xl transition-shadow items-stretch" style={{ border: '5px solid #A64D79' }}>
          <div className="flex items-center mr-6">
            <Image
              src="/topeng jesica.png"
              width={200}
              height={200}
              className="object-cover rounded"
              alt="Topeng Jesica"
            />
          </div>

          <div className="w-1 bg-gray-300 mx-4"></div>
          <div className="flex flex-col justify-center text-left ml-6">
            <div className={`${irishGrover.className} text-black  text-lg mb-4`}>
              Posted on 05 Jan, 2023
            </div>
            <h3 className={`${irishGrover.className} text-black text-3xl font-semibold mb-3`}>Topeng Jesica</h3>
            <div className={`${irishGrover.className} text-black text-xl mb-4`}>
              Used in the hudoq dance,<br />
              a traditional art of the Dayak tribe.
            </div>
            <div className="text-black hover:text-purple-300 cursor-pointer text-lg font-medium">
              read more
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
