'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cousine } from '@/app/ui/fonts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New product:', formData);
    alert('Product added successfully!');
    router.push('/products');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  return (
    <div className={`min-h-screen bg-[#6A1E55] p-8 ${cousine.className}`}>
      {/* Header */}
      <h1
        className={`text-4xl text-white font-bold flex justify-start items-center mb-12 ${cousine.className}`}
      >
        Tambah Produk
      </h1>

      {/* Form Container */}
      <div className="bg-[#A64D79] p-12 rounded-lg max-w-8xl mx-auto">
        <h2 className="text-4xl text-white mb-8">Detail Produk</h2>

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Nama Produk */}
            <div>
              <label className="block text-2xl text-white mb-3">Nama Produk</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className}`}
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            {/* ID Produk */}
            <div>
              <label className="block text-2xl text-white mb-3">ID Produk</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className}`}
                placeholder="Masukkan id produk"
                required
              />
            </div>

            {/* Harga Produk */}
            <div>
              <label className="block text-2xl text-white mb-3">Harga Produk</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className}`}
                placeholder="Masukkan harga"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-2xl text-white mb-3">Image</label>
            <div className="border border-white rounded-lg p-8 text-center">
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                accept="image/*"
                required
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <ClipboardDocumentIcon className="w-8 h-8 text-[#A64D79]" />
                  </div>
                </div>
                <p className="text-white text-xl">
                  Unggah file atau seret dan letakkan di sini
                </p>
              </label>
            </div>
            <p className="text-white text-lg mt-3">
              PNG, JPG, batas 7MB
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-6 justify-between">
            <button
              type="button"
              onClick={() => router.push('/dashboardowner/product')}
              className={`bg-red-600 text-white px-8 py-3 rounded-2xl text-xl ${cousine.className}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`bg-black text-white px-8 py-3 rounded-2xl text-xl ${cousine.className}`}
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}