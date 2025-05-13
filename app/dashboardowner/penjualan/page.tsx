'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine, creepster } from '@/app/ui/fonts';

// Definisi tipe untuk transaksi
interface Transaction {
  id: string;
  date: string;
  totalPrice: string;
  username: string;
  product: string;
}

export default function Page() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<string>('4');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false); // Tambahkan state untuk menandai sisi klien

  // Data default untuk transaksi
  const defaultTransactions: Transaction[] = [
    { id: '#J729', date: '2025-10-08 10:40:45', totalPrice: 'Rp1.000.000,00', username: 'Paijo', product: 'Topeng Cicilia - 2 pcs' },
    { id: '#K729', date: '2025-10-08 10:40:45', totalPrice: 'Rp1.118.000,00', username: 'Tuyul', product: 'Topeng Jesica - 3 pcs' },
    { id: '#L729', date: '2025-10-08 10:40:45', totalPrice: 'Rp600.000,00', username: 'Kucing', product: 'Topeng Dwiki - 2 pcs' },
    { id: '#M729', date: '2025-10-08 10:40:45', totalPrice: 'Rp500.000,00', username: 'Hujan', product: 'Topeng Hudoo - 1 pcs' },
  ];

  // Fungsi untuk memuat transaksi dari localStorage
  const loadTransactions = () => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      if (storedTransactions.length === 0) {
        localStorage.setItem('transactions', JSON.stringify(defaultTransactions));
        setTransactions(defaultTransactions);
      } else {
        const sanitizedTransactions: Transaction[] = storedTransactions.map((transaction: Transaction) => ({
          id: transaction.id || '',
          date: transaction.date || '',
          totalPrice: transaction.totalPrice || '',
          username: transaction.username || '',
          product: transaction.product || '',
        }));
        setTransactions(sanitizedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions from localStorage:', error);
      setTransactions(defaultTransactions); // Fallback ke default jika error
    }
  };

  // Load transactions hanya di sisi klien
  useEffect(() => {
    setIsClient(true); // Tandai bahwa kita berada di sisi klien
    loadTransactions();
  }, []);

  // Perbarui transactions saat rute berubah (setelah navigasi)
  useEffect(() => {
    const handleRouteChange = () => {
      loadTransactions();
    };
    window.addEventListener('focus', handleRouteChange);
    return () => {
      window.removeEventListener('focus', handleRouteChange);
    };
  }, []);

  // Filter transactions berdasarkan search query
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hitung pagination
  const totalPages = Math.ceil(filteredTransactions.length / Number(entriesPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * Number(entriesPerPage),
    currentPage * Number(entriesPerPage)
  );

  // Debugging: Log jumlah transaksi
  useEffect(() => {
    console.log('Entries per page:', entriesPerPage);
    console.log('Filtered transactions:', filteredTransactions.length);
    console.log('Paginated transactions:', paginatedTransactions.length);
  }, [entriesPerPage, filteredTransactions, paginatedTransactions]);

  // Handlers
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

  // Jika bukan di sisi klien, tampilkan placeholder atau kosongkan render
  if (!isClient) {
    return <div className="min-h-screen bg-[#6A1E55] text-white p-4">Loading...</div>;
  }

  return (
    <div className={`min-h-screen text-white p-4`} style={{ backgroundColor: '#6A1E55' }}>
      {/* Header */}
      <div>
        <h1 className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}>
          TRANSAKSI PENJUALAN
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
            onClick={() => router.push('/dashboardowner/penjualan/tambah')}
          >
            TAMBAHKAN PENJUALAN
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFE1F9]">
              <th className="p-4 text-left text-3xl text-[#6A1E55]">ID TRANSAKSI</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">TGL TRANSAKSI</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">TOTAL HARGA</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">USERNAME</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">NAMA PRODUK</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-[#6A1E55]">
                  Tidak ada transaksi
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t text-[#6A1E55]">
                  <td className="p-2">{transaction.id}</td>
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">{transaction.totalPrice}</td>
                  <td className="p-2">{transaction.username}</td>
                  <td className="p-2">{transaction.product}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
          {Math.min(currentPage * Number(entriesPerPage), filteredTransactions.length)} OF{' '}
          {filteredTransactions.length} RESULTS
        </span>
      </div>

      <button
        type="button"
        className={`mt-4 bg-white text-red-700 font-bold px-4 py-2 rounded ${cousine.className}`}
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  );
}