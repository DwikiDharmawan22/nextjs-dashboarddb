"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { creepster, irishGrover } from "@/app/ui/fonts";
import { ProductPelanggan } from "@/app/lib/definitions2";

export function ProductCard({ product }: { product: ProductPelanggan }) {
  const router = useRouter(); // Correctly initialize router

  return (
    <div
      className="product-card p-4 rounded-lg text-center hover:shadow-xl transition-shadow"
      style={{ border: "5px solid #A64D79" }}
    >
      <Image
        src={product.imageSrc}
        width={product.width}
        height={product.height}
        className="mx-auto"
        alt={product.altText}
      />
      <h3
        className={`${irishGrover.className} text-[#6A1E55] text-xl font-semibold mb-3`}
      >
        {product.name}
      </h3>
      <button
        onClick={() => router.push(product.link)}
        className={`${creepster.className} rounded-2xl bg-[#6A1E55] text-white w-32 hover:underline flex items-center justify-center text-lg mx-auto`}
      >
        SEE MORE
      </button>
    </div>
  );
}

export function ShopNowButton() {
  const router = useRouter(); // Correctly initialize router

  return (
    <button
      onClick={() => router.push("/dashboard/shop")}
      className={`${creepster.className} mt-4 md:mt-8 px-6 py-2 md:px-8 md:py-3 text-xl sm:text-2xl md:text-3xl lg:text-[30px] bg-white text-red-600 rounded-full border border-red-600 hover:bg-red-600 hover:text-white transition-colors`}
    >
      SHOP NOW
    </button>
  );
}