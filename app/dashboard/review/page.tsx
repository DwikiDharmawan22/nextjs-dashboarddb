import Image from 'next/image';
import { montserrat, dmSans } from '@/app/ui/fonts';
import StaticRating from '@/components/StaticRating';

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
        <div className="w-full mx-auto text-center mt-8 ">
          <h1 className={`${montserrat.className} text-7xl font-bold mb-4 text-white`}>EXPLORE YOU MASK</h1>
          <p className={`${dmSans.className} text-3xl text-white flex items-center justify-center`}>
          Explore our unique collection of masks and <br/>
          uncover the perfect one for any occasion
          </p>
        </div>
      </div>
      <div className="flex-1  p-4 rounded-lg shadow-lg"> {/* Tambahkan mb-8 di sini */}
        <div className="product-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Card 1 - TOPENG DWIKI */}
          <div className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 flex items-center justify-center">
              <Image
                src="/topeng dwiki.png"
                alt="TOPENG DWIKI"
                width={130}  
                height={130} 
                className="object-cover rounded"
              />
            </div>
            <div className= "text-3xl flex items-center justify-center">
              <StaticRating rating={4.5} maxStars={5} />
            </div>
            <h3 className={`${montserrat.className} text-white text-3xl font-semibold  mt-2 mb-2`}>TOPENG DWIKI</h3>
            <div className={`${dmSans.className} text-white text-2xl`}>
              Amazing mask shop with <br/>
              high-quality designs! <br/>
              Comfortable, durable, and <br/>
              perfect for any occasion.
            </div>
          </div>
                  
          {/* Product Card 2 - TOPENG JESICA */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 flex items-center justify-center">
              <Image
                src="/topeng jesica.png"
                alt="TOPENG JESICA"
                width={200}
                height={220}
                className="object-cover rounded"
              />
            </div>
            <div className= "text-3xl flex items-center justify-center">
              <StaticRating rating={4.5} maxStars={5} />
            </div>
            <h3 className={`${montserrat.className} text-white text-3xl font-semibold mt-2 mb-2`}>TOPENG JESICA</h3>
            <div className={`${dmSans.className} text-white text-2xl`}>
              Amazing mask shop with <br/>
              high-quality designs! <br/>
              Comfortable, durable, and <br/>
              perfect for any occasion.
            </div>
          </div>
                  
          {/* Product Card 3 - TOPENG CICILIA */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 flex items-center justify-center">
              <Image
                src="/topeng cicilia.png"
                alt="TOPENG CICILIA"
                width={200}
                height={220}
                className="object-cover rounded"
              />
            </div>
            <div className= "text-3xl flex items-center justify-center">
              <StaticRating rating={4.5} maxStars={5} />
            </div>
            <h3 className={`${montserrat.className} text-white text-3xl font-semibold mt-2 mb-2`}>TOPENG CICILIA</h3>
            <div className={`${dmSans.className} text-white text-2xl`}>
              Amazing mask shop with <br/>
              high-quality designs! <br/>
              Comfortable, durable, and <br/>
              perfect for any occasion.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};