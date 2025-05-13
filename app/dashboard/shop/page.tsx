import Image from 'next/image';
import { creepster} from '@/app/ui/fonts';

export default function AboutPage() {
  return (
    <div className=" p-4 mx-auto max-w-screen-2xl">
      {/* Product grid - Container pertama dengan margin bottom */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg mb-8"> {/* Tambahkan mb-8 di sini */}
        <div className="product-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Product Card 1 - TOPENG DWIKI */}
          <div className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng dwiki.png"
                alt="TOPENG DWIKI"
                width={150}  
                height={150} 
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG DWIKI</h3>
            <a href="/dashboard/product" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
            
          {/* Product Card 2 - TOPENG JESICA */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng jesica.png"
                alt="TOPENG JESICA"
                width={220}
                height={240}
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG JESICA</h3>
            <a href="/dashboard/product/product2" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
            
          {/* Product Card 3 - TOPENG CICILIA */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng cicilia.png"
                alt="TOPENG CICILIA"
                width={220}
                height={240}
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG CICILIA</h3>
            <a 
              href="/dashboard/product/product3" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
          {/* Product Card 4 - TOPENG CICILIA 2 */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng jesica.png"
                alt="TOPENG JESICA"
                width={220}
                height={240}
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG CICILIA</h3>
            <a href="/dashboard/product" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Product grid - Container kedua */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
        <div className="product-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Product Card 1 - TOPENG DWIKI */}
          <div className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng dwiki.png"
                alt="TOPENG DWIKI"
                width={150}  
                height={150} 
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG DWIKI</h3>
            <a href="/dashboard/product" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
            
          {/* Product Card 2 - TOPENG JESICA */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng jesica.png"
                alt="TOPENG JESICA"
                width={220}
                height={240}
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG JESICA</h3>
            <a href="/dashboard/product/product2" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
            
          {/* Product Card 3 - TOPENG CICILIA */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng cicilia.png"
                alt="TOPENG CICILIA"
                width={220}
                height={240}
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG CICILIA</h3>
            <a 
              href="/dashboard/product/product3" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
          {/* Product Card 4 - TOPENG CICILIA 2 */}
          <div className="product-card border p-4 rounded-lg text-center hover:shadow-xl transition-shadow" style={{border: '5px solid #A64D79'}}>
            <div className="relative h-64 mb-4 flex items-center justify-center">
              <Image
                src="/topeng jesica.png"
                alt="TOPENG JESICA"
                width={220}
                height={240}
                className="object-cover rounded"
              />
            </div>
            <h3 className={`${creepster.className} text-[#6A1E55] text-xl font-semibold mb-3`}>TOPENG CICILIA</h3>
            <a href="/dashboard/product" 
              className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}>
              SEE MORE <span className="ml-2">&gt;&gt;&gt;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}