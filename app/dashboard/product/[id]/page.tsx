import { Product1 } from '@/app/lib/definitions2';
import Image from 'next/image';
import { creepster } from '@/app/ui/fonts';
import StaticRating from '@/components/StaticRating';
import { CubeIcon, StarIcon, PaintBrushIcon } from '@heroicons/react/24/solid';

// Map nama material ke ikon di sisi server
const iconMap: { [key: string]: React.ComponentType<any> } = {
  'selected mahogany wood': CubeIcon,
  'dumling paper': StarIcon,
  'highly pigmented natural paint': PaintBrushIcon,
};

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/api/product?id=${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal memuat produk');
  const data = await res.json();
  data.materials = data.materials.map((material: { name: string }) => ({
    ...material,
    icon: iconMap[material.name.toLowerCase()],
  }));
  return data as Product1;
}

async function getTotalProducts() {
  const res = await fetch('http://localhost:3000/api/product-count', { cache: 'no-store' });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.total || 0;
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const totalProducts = await getTotalProducts();

  const currentId = parseInt(params.id);
  const prevId = currentId > 1 ? currentId - 1 : totalProducts;
  const nextId = currentId < totalProducts ? currentId + 1 : 1;

  return (
    <div className="mt-8 p-4 flex flex-col md:flex-row items-center md:items-start gap-8 relative min-h-screen">
      <div className="w-full md:w-1/2 flex justify-center p-0">
        <div className="w-[450px] h-[650px] relative">
          <Image
            src={product.image}
            alt={product.name}
            width={450}
            height={650}
            className="object-cover rounded-lg"
            onError={(e) => { e.currentTarget.src = '/images/default.png'; }}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 py-24">
        <h1 className={`${creepster.className} text-red-700 text-6xl px-32 md:text-8xl mb-4 text-center md:text-left`}>
          {product.name}
        </h1>
        <div className={`${creepster.className} text-white text-2xl md:text-4xl mb-6 max-w-md md:max-w-full md:text-left`}>
          <p className="mb-2">{product.description}</p>
        </div>
        <div className={`${creepster.className} text-white mb-6 flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start space-y-4 md:space-y-0 md:space-x-6`}>
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
        <div className={`${creepster.className} text-white px-32 flex flex-col items-center md:items-start mb-8`}>
          <p className="text-3xl md:text-4xl font-bold mb-2 mt-2 px-12 py-3 tracking-wider border border-white rounded-xl">
            BELI SEKARANG - Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="px-32">
          <StaticRating rating={product.rating} maxStars={5} />
        </div>
      </div>
      <div className={`${creepster.className} fixed bottom-4 left-0 right-0 px-4 py-8 flex justify-between max-w-[1900px] mx-auto`}>
        <a href={`/dashboard/product/${prevId}`} className="bg-white text-2xl text-red-700 px-4 py-2 border border-black rounded-xl inline-block hover:bg-red-200 hover:text-red-900 transition duration-300">
          Kembali
        </a>
        <a href={`/dashboard/product/${nextId}`} className="bg-white text-2xl text-[#6A1E55] px-4 py-2 border border-black rounded-xl inline-block hover:bg-purple-200 hover:text-[#6A1E55] transition duration-300">
          Selanjutnya
        </a>
      </div>
    </div>
  );
}