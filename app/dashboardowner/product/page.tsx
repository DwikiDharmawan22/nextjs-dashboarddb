'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { cousine, creepster } from '@/app/ui/fonts';
import { SaleProduct, EditForm } from '@/app/lib/definitions2';
import Cards from '@/app/ui/dashboard/cards2';
import Skeleton from '@/app/ui/skeletons2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SaleProduct | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: '', price: '' });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error('Gagal memuat produk. Silakan coba lagi.', {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );
  }, [filteredProducts, currentPage, entriesPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to delete product from the server');
        }

        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        toast.success('Produk berhasil dihapus!', {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Gagal menghapus produk. Silakan coba lagi.', {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      }
    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setEditForm({
        name: productToEdit.name,
        price: productToEdit.price.toString(),
      });
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) {
      toast.error('Tidak ada produk yang dipilih.', {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return;
    }

    // Validate inputs
    if (!editForm.name.trim()) {
      toast.error('Nama produk tidak boleh kosong.', {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return;
    }

    const cleanedPrice = editForm.price.replace(/[^0-9]/g, '');
    if (!cleanedPrice || isNaN(Number(cleanedPrice)) || Number(cleanedPrice) <= 0) {
      toast.error('Harga harus berupa angka positif.', {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return;
    }

    // Check if there are any changes
    if (
      editForm.name.trim() === selectedProduct.name &&
      Number(cleanedPrice) === selectedProduct.price
    ) {
      toast.warn(
        <div className="flex items-center gap-2">
          <span>Tidak ada perubahan yang dilakukan!</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
          style: {
            fontSize: '1.25rem',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#FBBF24', // Yellow for warning
            color: '#000000',
          },
        }
      );
      return;
    }

    // Proceed with saving changes
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? { ...product, name: editForm.name.trim(), price: Number(cleanedPrice) }
        : product
    );
    setProducts(updatedProducts);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(updatedProducts),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to save product to the server');
      }

      toast.success(
        <div className="flex items-center gap-2">
          <span>Produk berhasil diedit!</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 4000,
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
        }
      );

      setIsModalOpen(false);
      setSelectedProduct(null);
      setEditForm({ name: '', price: '' });
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Gagal menyimpan produk. Silakan coba lagi.', {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setEditForm({ name: '', price: '' });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#6A1E55] text-white p-4">Loading...</div>;
  }

  return (
    <div className={`min-h-screen text-white p-4 ${cousine.className}`} style={{ backgroundColor: '#6A1E55' }}>
      <div>
        <h1 className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}>
          PRODUCT
        </h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className={`flex items-center gap-2 text-xl ${cousine.className}`}>
          <span>SHOW:</span>
          <select
            className={`bg-white text-[#6A1E55] px-3 py-1 rounded pr-8 ${cousine.className}`}
            onChange={handleEntriesChange}
            value={entriesPerPage}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span>ENTRIES</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari..."
            className={`px-2 py-1 rounded text-xl text-black ${cousine.className}`}
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            className={`bg-[#A64D79] text-xl text-white px-4 py-1 rounded ${cousine.className}`}
            onClick={() => router.push('/dashboardowner/product/tambah')}
          >
            TAMBAHKAN PRODUK
          </button>
        </div>
      </div>

      <div className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFE1F9]">
              <th className="p-4 text-left text-3xl text-[#6A1E55]">ID</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">Sale Product</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">Price</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">Aksi</th>
            </tr>
          </thead>
          <Cards
            type="product"
            products={paginatedProducts}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </table>
      </div>

      {isLoading ? (
        <Skeleton type="modal" />
      ) : (
        isModalOpen && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#FFE1F9] p-6 rounded-lg w-96">
              <h2 className={`text-2xl text-[#6A1E55] text-center mb-4 ${cousine.className}`}>
                EDIT PRODUK
              </h2>
              <div className="mb-4">
                <label className={`block text-[#6A1E55] mb-1 ${cousine.className}`}>ID</label>
                <input
                  type="text"
                  value={selectedProduct.id}
                  disabled
                  className={`w-full p-2 rounded font-bold bg-[#D29BC7] text-[#FFE1F9] ${cousine.className}`}
                />
              </div>
              <div className="mb-4">
                <label className={`block text-[#6A1E55] mb-1 ${cousine.className}`}>PRODUCT</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full p-2 rounded font-bold bg-[#FFE1F9] text-[#6A1E55] ${cousine.className}`}
                />
              </div>
              <div className="mb-4">
                <label className={`block text-[#6A1E55] mb-1 ${cousine.className}`}>PRICE</label>
                <input
                  type="text"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className={`w-full p-2 rounded font-bold bg-[#D29BC7] text-[#FFE1F9] ${cousine.className}`}
                  placeholder="Rp 0"
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  className={`bg-red-500 text-white px-4 py-2 rounded ${cousine.className}`}
                  onClick={handleCancelEdit}
                >
                  BATAL
                </button>
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded ${cousine.className}`}
                  onClick={handleSaveEdit}
                >
                  SIMPAN
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {isLoading ? (
        <Skeleton type="pagination" />
      ) : (
        <div className={`flex flex-col items-center mt-16 ${cousine.className}`}>
          <div className="flex gap-2 mb-2">
            <button
              className={`bg-white text-black px-2 py-1 rounded ${cousine.className} ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${
                  currentPage === page ? 'bg-[#A64D79] text-white' : 'bg-white text-black'
                } px-2 py-1 rounded ${cousine.className}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={`bg-white text-black px-2 py-1 rounded ${cousine.className} ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </div>
          <span>
            SHOWING {(currentPage - 1) * entriesPerPage + 1} TO{' '}
            {Math.min(currentPage * entriesPerPage, filteredProducts.length)} OF{' '}
            {filteredProducts.length} RESULTS
          </span>
        </div>
      )}

      <button
        className={`mt-4 bg-white text-red-700 font-bold px-4 py-2 rounded ${cousine.className}`}
        onClick={() => router.back()}
      >
        Back
      </button>
      <ToastContainer />
    </div>
  );
}