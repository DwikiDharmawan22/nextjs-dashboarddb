'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine } from '@/app/ui/fonts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface FileMetadata {
  name: string;
  size: string;
  type: string;
  lastModified: string;
}

interface ProductFormData {
  id: string;
  name: string;
  price: string;
  image: File | null;
}

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    price: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);

  useEffect(() => {
    // Initialize state on client side to avoid hydration mismatch
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Silakan unggah gambar!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      const imageBase64 = await toBase64(formData.image);

      const productData = {
        id: formData.id,
        name: formData.name,
        price: parseFloat(formData.price),
        image: imageBase64,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([productData]),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      alert('Product added successfully!');
      router.push('/dashboardowner/product');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      const maxSize = 7 * 1024 * 1024; // 7MB
      if (!validTypes.includes(file.type)) {
        alert('Hanya file PNG atau JPG yang diperbolehkan!');
        return;
      }
      if (file.size > maxSize) {
        alert('Ukuran file melebihi batas 7MB!');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + 'MB';
      const lastModified = new Date(file.lastModified).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
      setFileMetadata({
        name: file.name,
        size: sizeInMB,
        type: file.type.split('/')[1].toUpperCase(),
        lastModified: lastModified,
      });
    } else {
      setImagePreview(null);
      setFileMetadata(null);
    }
  };

  return (
    <div className={`min-h-screen bg-[#6A1E55] p-8 ${cousine.className}`}>
      <h1 className={`text-4xl text-white font-bold flex justify-start items-center mb-12 ${cousine.className}`}>
        Tambah Produk
      </h1>
      <div className="bg-[#A64D79] p-12 rounded-lg max-w-8xl mx-auto">
        <h2 className="text-4xl text-white mb-8">Detail Produk</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6 mb-8">
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
            <div>
              <label className="block text-2xl text-white mb-3">Harga Produk</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className}`}
                placeholder="Masukkan harga"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-2xl text-white mb-3">Image</label>
            <div className="border border-white rounded-lg p-8 text-center">
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                accept="image/png,image/jpeg"
                required
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="flex flex-row items-center justify-start gap-4">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="max-w-48 max-h-48 object-contain"
                    />
                    {fileMetadata && (
                      <table className="text-white text-sm border-collapse">
                        <thead>
                          <tr>
                            <th className="pr-4">Name</th>
                            <th className="pr-4">Last modified</th>
                            <th className="pr-4">Size</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="pr-4">{fileMetadata.name}</td>
                            <td className="pr-4">{fileMetadata.lastModified}</td>
                            <td className="pr-4">{fileMetadata.size}</td>
                            <td>Image ({fileMetadata.type})</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <ClipboardDocumentIcon className="w-8 h-8 text-[#A64D79]" />
                      </div>
                    </div>
                    <p className="text-white text-xl">Unggah file atau seret dan letakkan di sini</p>
                  </>
                )}
              </label>
            </div>
            <p className="text-white text-lg mt-3">PNG, JPG, batas 7MB</p>
          </div>
          <div className="flex gap-6 justify-between">
            <button
              type="button"
              onClick={() => router.push('/dashboardowner/product')}
              className={`bg-red-600 text-white px-8 py-3 rounded-2xl text-xl ${cousine.className}`}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`bg-black text-white px-8 py-3 rounded-2xl text-xl ${cousine.className} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}