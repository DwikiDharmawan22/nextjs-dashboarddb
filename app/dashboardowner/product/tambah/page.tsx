'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine } from '@/app/ui/fonts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { generateProductId } from '@/app/lib/generateProductId';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface FormError {
  field: string;
  message: string;
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
  const [errors, setErrors] = useState<FormError[]>([]);
  const [displayPrice, setDisplayPrice] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: generateProductId(),
    }));

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const formatToRupiah = (value: string): string => {
    if (!value) return '';
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) return '';
    const number = parseInt(cleanValue);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const parseRupiah = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
      style: {
        fontSize: '1.25rem',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({ field: 'name', message: 'Nama produk harus diisi' });
    } else if (formData.name.length > 100) {
      newErrors.push({ field: 'name', message: 'Nama produk maksimal 100 karakter' });
    }

    if (!formData.price) {
      newErrors.push({ field: 'price', message: 'Harga produk harus diisi' });
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.push({ field: 'price', message: 'Harga harus berupa angka positif' });
      } else if (priceNum > 1000000000) {
        newErrors.push({ field: 'price', message: 'Harga maksimal Rp 1.000.000.000' });
      }
    }

    if (!formData.image) {
      newErrors.push({ field: 'image', message: 'Gambar produk harus diunggah' });
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      newErrors.forEach((error) => showErrorToast(error.message));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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

      const imageBase64 = await toBase64(formData.image!);

      const productData = {
        id: formData.id,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        image: imageBase64,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([productData]),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan produk');
      }

      toast.success('Produk berhasil ditambahkan!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          fontSize: '1.25rem',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: '#34D399',
          color: '#000000',
        },
      });

      setTimeout(() => {
        router.push('/dashboardowner/product');
      }, 1500);
    } catch (error) {
      console.error('Error adding product:', error);
      showErrorToast(error instanceof Error ? error.message : 'Gagal menambahkan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      const rawValue = parseRupiah(value);
      setFormData((prev) => ({
        ...prev,
        price: rawValue,
      }));
      setDisplayPrice(formatToRupiah(rawValue));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      showErrorToast('Gambar produk harus diunggah');
      setErrors([{ field: 'image', message: 'Gambar produk harus diunggah' }]);
      setImagePreview(null);
      setFileMetadata(null);
      return;
    }

    const validTypes = ['image/png', 'image/jpeg'];
    const maxSize = 7 * 1024 * 1024; // 7MB

    if (!validTypes.includes(file.type)) {
      showErrorToast('Hanya file PNG atau JPG yang diperbolehkan');
      setErrors([{ field: 'image', message: 'Hanya file PNG atau JPG yang diperbolehkan' }]);
      setImagePreview(null);
      setFileMetadata(null);
      return;
    }

    if (file.size > maxSize) {
      showErrorToast('Ukuran file maksimal 7MB');
      setErrors([{ field: 'image', message: 'Ukuran file maksimal 7MB' }]);
      setImagePreview(null);
      setFileMetadata(null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + 'MB';
    const lastModified = new Date(file.lastModified).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    setFileMetadata({
      name: file.name,
      size: sizeInMB,
      type: file.type.split('/')[1].toUpperCase(),
      lastModified: lastModified,
    });

    setErrors((prev) => prev.filter((error) => error.field !== 'image'));
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
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className} ${errors.some((e) => e.field === 'name') ? 'border-red-600' : ''}`}
                placeholder="Masukkan nama produk"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-2xl text-white mb-3">ID Produk</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                readOnly
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className}`}
              />
            </div>
            <div>
              <label className="block text-2xl text-white mb-3">Harga Produk</label>
              <input
                type="text"
                name="price"
                value={displayPrice}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white placeholder-opacity-50 text-xl ${cousine.className} ${errors.some((e) => e.field === 'price') ? 'border-red-600' : ''}`}
                placeholder="Masukkan harga (Rp)"
                required
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-2xl text-white mb-3">Gambar Produk</label>
            <div className={`border border-white rounded-lg p-8 text-center ${errors.some((e) => e.field === 'image') ? 'border-red-600' : ''}`}>
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
                            <th className="pr-4">Nama</th>
                            <th className="pr-4">Terakhir Diubah</th>
                            <th className="pr-4">Ukuran</th>
                            <th>Tipe</th>
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
            <p className="text-white text-lg mt-3">PNG, JPG, maksimal 7MB</p>
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
      <ToastContainer />
    </div>
  );
}