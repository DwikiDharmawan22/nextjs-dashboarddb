'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine, creepster } from '@/app/ui/fonts';
import { Customer, FormData } from '@/app/lib/definitions2';
import { Suspense } from 'react';
import Skeleton from '@/app/ui/skeletons2';

export default function Page() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<string>('4');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Gagal memuat pelanggan');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Gagal memuat data pelanggan');
      }
    };
    loadCustomers();
  }, []);

  const handleSaveCustomers = async (updatedCustomers: Customer[]) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomers),
      });
      if (!response.ok) throw new Error('Gagal menyimpan pelanggan');
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan data pelanggan');
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.transactions.some((transaction) =>
        transaction.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredCustomers.length / Number(entriesPerPage));
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * Number(entriesPerPage),
    currentPage * Number(entriesPerPage)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (username: string) => {
    const updatedCustomers = customers.filter((customer) => customer.username !== username);
    handleSaveCustomers(updatedCustomers);
    if (paginatedCustomers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (mode: 'add' | 'edit', customer: Customer | null = null) => {
    setModalMode(mode);
    setCurrentCustomer(customer);
    if (mode === 'edit' && customer) {
      setFormData({
        username: customer.username,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        phone: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
    setFormData({
      username: '',
      email: '',
      phone: '',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      transactions: modalMode === 'edit' && currentCustomer ? currentCustomer.transactions : [],
    };

    if (
      modalMode === 'add' ||
      (modalMode === 'edit' && formData.username !== currentCustomer?.username)
    ) {
      const usernameExists = customers.some(
        (customer) => customer.username.toLowerCase() === formData.username.toLowerCase()
      );
      if (usernameExists) {
        alert('Username sudah digunakan, silakan pilih username lain.');
        return;
      }
    }

    let updatedCustomers: Customer[];
    if (modalMode === 'edit' && currentCustomer) {
      updatedCustomers = customers.map((customer) =>
        customer.username === currentCustomer.username ? newCustomer : customer
      );
    } else {
      updatedCustomers = [...customers, newCustomer];
    }

    handleSaveCustomers(updatedCustomers);
    closeModal();
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen text-white p-4" style={{ backgroundColor: '#6A1E55' }}>
        <h1 className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}>
          DATA PELANGGAN
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center gap-2 text-xl ${cousine.className}`}>
            <span>SHOW:</span>
            <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-40 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}>
          <table className="w-full">
            <Skeleton type="table-header" />
            <Skeleton type="transaction-row" />
          </table>
        </div>
        <Skeleton type="pagination" />
      </div>
    }>
      <div className="min-h-screen text-white p-4" style={{ backgroundColor: '#6A1E55' }}>
        <h1
          className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}
        >
          DATA PELANGGAN
        </h1>

        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center gap-2 text-xl ${cousine.className}`}>
            <span>SHOW:</span>
            <select
              className={`bg-white text-[#6A1E55] px-3 py-1 rounded pr-8 ${cousine.className}`}
              onChange={handleEntriesChange}
              value={entriesPerPage}
            >
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
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
              type="button"
              className={`bg-[#A64D79] text-xl text-white px-4 py-1 rounded ${cousine.className}`}
              onClick={() => openModal('add')}
            >
              TAMBAHKAN DATA
            </button>
          </div>
        </div>

        <div
          className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-[#FFE1F9]">
                <th className="p-4 text-center text-3xl text-[#6A1E55]">USERNAME</th>
                <th className="p-4 text-center text-3xl text-[#6A1E55]">EMAIL</th>
                <th className="p-4 text-center text-3xl text-[#6A1E55]">NOMOR TELEPON</th>
                <th className="p-4 text-center text-3xl text-[#6A1E55]">DAFTAR TRANSAKSI</th>
                <th className="p-4 text-center text-3xl text-[#6A1E55]">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#6A1E55]">
                    Tidak ada data pelanggan
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr key={customer.username} className="border-t text-[#6A1E55]">
                    <td className="p-2 text-[#D29BC7] text-center">{customer.username}</td>
                    <td className="p-2 text-[#D29BC7] text-center">{customer.email}</td>
                    <td className="p-2 text-[#D29BC7] text-center">{customer.phone}</td>
                    <td className="p-2 text-[#D29BC7] text-center">
                      <ul className="list-disc pl-5 text-center">
                        {customer.transactions.length > 0 ? (
                          customer.transactions.map((transaction, index) => (
                            <li key={index}>{transaction}</li>
                          ))
                        ) : (
                          <li>Tidak ada transaksi</li>
                        )}
                      </ul>
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        type="button"
                        className="bg-[#D29BC7] text-white px-4 py-1 rounded"
                        onClick={() => openModal('edit', customer)}
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() => handleDelete(customer.username)}
                      >
                        HAPUS
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={`flex flex-col items-center mt-16 ${cousine.className}`}>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              className={`bg-white text-black px-2 py-1 rounded ${cousine.className}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`${
                  currentPage === page ? 'bg-[#A64D79] text-white' : 'bg-white text-black'
                } px-2 py-1 rounded ${cousine.className}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className={`bg-white text-black px-2 py-1 rounded ${cousine.className}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </div>
          <span>
            SHOWING {(currentPage - 1) * Number(entriesPerPage) + 1} TO{' '}
            {Math.min(currentPage * Number(entriesPerPage), filteredCustomers.length)} OF{' '}
            {filteredCustomers.length} RESULTS
          </span>
        </div>

        <button
          type="button"
          className={`mt-4 bg-white text-red-700 font-bold px-4 py-2 rounded ${cousine.className}`}
          onClick={() => router.back()}
        >
          Back
        </button>

        {isModalOpen && (
          <Suspense fallback={<Skeleton type="modal" />}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className={`bg-[#FFE1F9] p-6 rounded-lg w-1/3 ${cousine.className}`}>
                <h2
                  className={`text-4xl text-[#6A1E55] mb-6 text-center ${cousine.className}`}
                >
                  {modalMode === 'add' ? 'Tambah Data Pelanggan' : 'Edit Data Pelanggan'}
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#A64D79] text-lg mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleFormChange}
                      className="w-full px-2 py-2 border rounded text-[#FFE1F9] placeholder-[#FFE1F9]"
                      style={{ backgroundColor: '#D29BC7' }}
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#A64D79] text-lg mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-2 py-2 border rounded text-[#6A1E55] placeholder-[#A64D79]"
                      style={{ backgroundColor: '#FFE1F9' }}
                      placeholder="Masukkan email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#A64D79] text-lg mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-2 py-2 border rounded text-[#FFE1F9] placeholder-[#FFE1F9]"
                      style={{ backgroundColor: '#D29BC7' }}
                      placeholder="Masukkan nomor telepon"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-between mt-6">
                    <button
                      type="button"
                      className="bg-red-500 text-white px-6 py-2 rounded text-lg"
                      onClick={closeModal}
                    >
                      BATAL
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded text-lg"
                    >
                      SIMPAN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Suspense>
        )}
      </div>
    </Suspense>
  );
}