'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { cousine, creepster } from '@/app/ui/fonts';

// Definisi tipe untuk produk
interface Product {
  id: string;
  image: string;
  name: string;
  price: string;
}

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([
    { id: '#J729', image: '/topeng cicilia.png', name: 'Topeng Cicilia', price: '500.000 IDR' },
    { id: '#K729', image: '/topeng jesica.png', name: 'Topeng Jesica', price: '370.000 IDR' },
    { id: '#L729', image: '/topeng dwiki.png', name: 'Topeng Dwiki', price: '300.000 IDR' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });
  const [isClient, setIsClient] = useState(false); // Tambahkan state untuk menandai sisi klien

  // Pastikan render hanya di sisi klien untuk menghindari hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );
  }, [filteredProducts, currentPage, entriesPerPage]);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setEditForm({ name: productToEdit.name, price: productToEdit.price });
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedProduct) {
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, name: editForm.name, price: editForm.price }
            : product
        )
      );
      setIsModalOpen(false);
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

  // Jika bukan di sisi klien, tampilkan placeholder
  if (!isClient) {
    return <div className="min-h-screen bg-[#6A1E55] text-white p-4">Loading...</div>;
  }

  return (
    <div className={`min-h-screen text-white p-4 ${cousine.className}`}>
      {/* Header */}
      <div>
        <h1 className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}>
          PRODUCT
        </h1>
      </div>

      {/* Top Controls */}
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

      {/* Table */}
      <div className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFE1F9]">
              <th className="p-4 text-left text-3xl text-[#6A1E55]">ID</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">Product</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">Price</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-[#6A1E55]">
                  Tidak ada produk
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="border-t text-[#6A1E55]">
                  <td className="p-2">{product.id}</td>
                  <td className="p-4 flex items-center gap-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                    <span>{product.name}</span>
                  </td>
                  <td className="p-2">{product.price}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      className={`bg-[#D29BC7] text-white font-bold px-3 py-1 rounded ${cousine.className}`}
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`bg-red-500 text-white font-bold px-3 py-1 rounded ${cousine.className}`}
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedProduct && (
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
      )}

      {/* Pagination */}
      <div className={`flex flex-col items-center mt-16 ${cousine.className}`}>
        <div className="flex gap-2 mb-2">
          <button
            className={`bg-white text-black px-2 py-1 rounded ${cousine.className} ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
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
            &gt;
          </button>
        </div>
        <span>
          SHOWING {(currentPage - 1) * entriesPerPage + 1} TO{' '}
          {Math.min(currentPage * entriesPerPage, filteredProducts.length)} OF{' '}
          {filteredProducts.length} RESULTS
        </span>
      </div>

      <button
        className={`mt-4 bg-white text-red-700 font-bold px-4 py-2 rounded ${cousine.className}`}
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  );
}