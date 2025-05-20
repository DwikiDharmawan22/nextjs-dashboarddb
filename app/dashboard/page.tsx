import Image from "next/image";
import { creepster, irishGrover } from "@/app/ui/fonts";
import { fetchProducts } from "@/app/lib/data2";
import { ProductPelanggan } from "@/app/lib/definitions2";
import { ProductCard, ShopNowButton } from "@/app/ui/dashboard/productcards"; // Import the new components

export default async function HomePage() {
  const fetchedProducts = await fetchProducts();

  const products: ProductPelanggan[] = fetchedProducts.map((product) => ({
    name: product.name,
    imageSrc: product.image,
    width: 200,
    height: 200,
    altText: `Image of ${product.name}`,
    link: `/dashboard/product/${product.id}`,
  }));

  return (
    <div className="min-h-screen font-creepster">
      <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-4 py-12">
        <div className="text-center md:text-left space-y-4 md:space-y-6 max-w-2xl mx-auto md:mx-0">
          <h1
            className={`${creepster.className} text-6xl md:text-8xl text-[#E92020] font-bold`}
          >
            KEMILAU <br /> TOPENG
          </h1>
          <p
            className={`${creepster.className} text-lg md:text-xl text-[#FFFF] font-semibold`}
          >
            Explore cultural wealth through every detail of your mask!
          </p>
          
          <p className={`${creepster.className} text-lg md:text-xl text-[#FFFF] font-semibold`}>

            NEW ARRIVALS
          </p>
          <ShopNowButton /> {/* Use the Client Component */}
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
          <h2
            className={`${irishGrover.className} text-3xl text-[#000000] font-bold mb-10`}
          >
            OUR BEST PRODUCT
          </h2>
          {products.length === 0 ? (
            <p className="text-[#A64D79]">No products available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}