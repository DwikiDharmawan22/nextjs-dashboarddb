import Image from 'next/image';
import { redirect } from 'next/navigation';
import { creepster } from '@/app/ui/fonts';
import { ShopProduct } from '@/app/lib/definitions2';
import { fetchShopProducts } from '@/app/lib/data2';

// Remove 'use client' to make this a Server Component
export default async function AboutPage() {
  // Fetch data on the server
  let shopProducts: ShopProduct[] = [];
  try {
    shopProducts = await fetchShopProducts();
  } catch (error) {
    console.error('Failed to fetch shop products:', error);
    // Optionally render an error message
    return <div>Error loading products. Please try again later.</div>;
  }

  // Server-side navigation helper (since useRouter is not available in Server Components)
  const handleNavigation = (url: string) => {
    redirect(url);
  };

  return (
    <div className="p-4 mx-auto max-w-screen-2xl">
      {/* Product grid - Container pertama dengan margin bottom */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="product-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          {shopProducts.map((product: ShopProduct, index: number) => (
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
                SEE MORE <span className="ml-2">>>></span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Product grid - Container kedua */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
        <div className="product-grid grid grid-cols-1 md:grid-cols-4 gap-8">
          {shopProducts.map((product: ShopProduct, index: number) => (
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
                SEE MORE <span className="ml-2">>>></span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}